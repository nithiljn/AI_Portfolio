// api/tts.js - Studio Text-to-Speech Engine with ElevenLabs and Graceful Fallback Detection

// Auto-load local .env if running in local Node environment
if (!process.env.ELEVENLABS_API_KEY) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = (match[2] || '').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  } catch (e) {}
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const rawKeyString = process.env.ELEVENLABS_API_KEYS || process.env.ELEVENLABS_API_KEY || '';
  const apiKeys = rawKeyString.split(',').map(k => k.trim()).filter(Boolean);

  // If no ElevenLabs keys configured, trigger seamless frontend fallback to free Chrome TTS
  if (!apiKeys.length) {
    return res.status(200).json({
      fallback: true,
      reason: 'api_key_not_configured'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const rawText = body?.text;
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({ error: 'Missing or empty text parameter.' });
    }

    // Smart Character Capping & Link Stripping: Speak the clean executive summary
    // (action links and URLs are rendered as interactive visual buttons on screen, skipped in speech)
    let textToSpeak = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, '').trim();
    if (textToSpeak.length > 280) {
      const sentenceEnd = textToSpeak.slice(0, 280).lastIndexOf('.');
      if (sentenceEnd > 140) {
        textToSpeak = textToSpeak.slice(0, sentenceEnd + 1);
      } else {
        textToSpeak = textToSpeak.slice(0, 280);
      }
    }

    // Default Soft Male Voice: Eric (Smooth, Trustworthy, Conversational)
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'cjVigY5qzO86Huf0OWal';

    // Model: eleven_flash_v2_5 consumes 50% FEWER credits (0.5x character cost), 75ms latency, supports 32 languages including Tamil and English
    const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';

    let audioBuffer = null;

    // Fault-Tolerant Key Pool: Try each key in sequence if previous hits quota limit (401, 402, 429)
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json',
              'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
              text: textToSpeak,
              model_id: modelId,
              voice_settings: {
                stability: 0.55,
                similarity_boost: 0.85,
                style: 0.0,
                use_speaker_boost: true
              }
            })
          }
        );

        if (response.status === 401 || response.status === 402 || response.status === 429) {
          console.warn(`[TTS] ElevenLabs key #${i + 1} (${apiKey.slice(-4)}) reached quota/limit (${response.status}). Switching to next key in pool...`);
          continue;
        }

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = Buffer.from(arrayBuffer);
          break; // Succeeded! Stop trying further keys
        } else {
          const errText = await response.text().catch(() => '');
          console.warn(`[TTS] ElevenLabs key #${i + 1} returned status ${response.status}: ${errText}`);
          continue;
        }
      } catch (keyErr) {
        console.warn(`[TTS] ElevenLabs key #${i + 1} fetch exception:`, keyErr);
        continue;
      }
    }

    if (audioBuffer) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
      return res.status(200).send(audioBuffer);
    }

    // If ALL keys in pool failed or exhausted -> Seamless fallback to browser Web Speech TTS
    return res.status(200).json({
      fallback: true,
      reason: 'all_keys_exhausted_or_failed'
    });

  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    // Return 200 with fallback: true so frontend client immediately switches to Web Speech TTS
    return res.status(200).json({
      fallback: true,
      reason: 'internal_error',
      message: error.message
    });
  }
};
