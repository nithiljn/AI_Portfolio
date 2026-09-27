// api/tts.js - Studio Text-to-Speech Engine with ElevenLabs and Graceful Fallback Detection

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

  const apiKey = process.env.ELEVENLABS_API_KEY;

  // If no ElevenLabs key configured, trigger seamless frontend fallback
  if (!apiKey) {
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

    // Clean and cap length to preserve quota (max 450 characters per speech turn)
    const textToSpeak = rawText.trim().slice(0, 450);

    // Default Soft Male Voice: Eric (Smooth, Trustworthy, Conversational)
    // Optional override via ELEVENLABS_VOICE_ID env variable
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'cjVigY5qzO86Huf0OWal';

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
          model_id: 'eleven_flash_v2_5', // Ultra-low latency, 0.5x credit cost, natural soft prosody
          voice_settings: {
            stability: 0.58,
            similarity_boost: 0.85,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );

    // If quota exceeded (402 / 429) or unauthorized (401), trigger silent fallback
    if (response.status === 401 || response.status === 402 || response.status === 429) {
      console.warn(`ElevenLabs status ${response.status}, triggering fallback`);
      return res.status(200).json({
        fallback: true,
        reason: 'quota_or_rate_limit',
        status: response.status
      });
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`ElevenLabs API error ${response.status}: ${errText}`);
      return res.status(200).json({
        fallback: true,
        reason: 'api_error',
        status: response.status
      });
    }

    // Convert audio buffer and stream back to client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.status(200).send(buffer);

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
