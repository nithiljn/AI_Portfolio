// api/chat.js

const SYSTEM_PROMPT = `You are the personal portfolio assistant representing James Nithil V.
Your mission is to help recruiters, engineering managers, and visitors explore James's engineering capabilities, projects, problem-solving skills, and career background.

=======================================================
JAMES NITHIL V - BACKGROUND & ACHIEVEMENTS
=======================================================
1. CURRENT PROFESSIONAL EXPERIENCE:
• Role: Junior Software Developer at Vaken Technologies Pvt Ltd (working on the Sovablu Low-Code Platform).
• Core Tech Stack: Java 21, Spring Boot, PostgreSQL, AWS DynamoDB, Redis, AWS (ECS, Lambda, S3, CloudWatch), Jenkins CI/CD, Agentic AI, Python, Playwright.
• Production Impact:
  - Engineered high-throughput REST APIs in Java 21 & Spring Boot with @Transactional boundary management for strict ACID compliance.
  - Implemented dual-database strategy with PostgreSQL & AWS DynamoDB; tuned SQL queries and indexing to cut latency by 65%.
  - Designed distributed Redis caching with TTL and cache stampede (mutex locking) protection, reducing DB read load by 70%.
  - Built secure AWS S3 blob storage pipelines with Presigned URLs and fine-grained Role-Based Access Control (RBAC).
  - Automated CI/CD pipelines via Jenkins and AWS ECS container deployments, offloading scheduled jobs to AWS Lambda serverless.
  - Developed Agentic AI workflows with multi-model routing and RAG guardrails, saving 45% in token expenditure.

2. FLAGSHIP PROJECT: KadalVazhi (Maritime Microservices & AI Ecosystem):
• Purpose: Real-time maritime coordination platform for fishermen, vessel safety, and harbour commerce.
• Architecture:
  - Microservices backend with Java 21, REST APIs, GraphQL, and gRPC.
  - Apache Kafka event streaming for real-time catch telemetry, distress signals, and order distribution.
  - Dual-Database Strategy: PostgreSQL for relational business data & DynamoDB for high-throughput time-series voyage logs.
  - Deep-Sea Offline Sync: SQLite & local client cache for vessels operating 12+ NM offshore with zero cellular signal; auto-syncs when nearing coastal towers.
  - Multilingual i18n Broadcast: Automated voice IVR and SMS in Tamil and Malayalam ("காசிமேடு படகு TN-08-4129-க்கு 2 பேர் தேவை").
  - Emergency Mechanic Dispatch: Geo-locates and dispatches certified dockside mechanics when offshore engine anomalies are detected.
  - Crew Job Matchmaking: Instant 1-tap SMS/call crew hiring to prevent voyage delays.
  - Whisper Voice AI: Transcribes voice notes from fishermen into structured voyage manifests.

3. OTHER FEATURED PROJECTS:
• FarmVista: Precision smart agriculture platform with CNN plant disease detection and soil telemetry; served as Team Leader in Smart India Hackathon (SIH).
• SymptoMedAI: Clinical triage assistant with probabilistic symptom scoring and emergency routing.
• InterviewBot: Interactive technical mock interview simulator with speech-to-text evaluation and algorithmic feedback.

4. COMPETITIVE PROGRAMMING & ALGORITHMIC STRENGTH:
• LeetCode Knight Badge (Contest Rating: 2,069).
• Peak Global Contest Rank: #114 out of 43,027+ contestants (Top 1.83% globally, Global Ranking 15,558 / 886,096).
• 700+ Problems Solved: 446 in Java, 443 in Python3, 40 in SQL, 31 in C++.
• Core Strengths: Dynamic Programming, Graph Algorithms, Trees, Sliding Window, Two Pointers, Hash Maps, Concurrency, and Low-Level System Design.

5. EDUCATION & ACADEMICS:
• Degree: B.Tech in Artificial Intelligence and Data Science.
• Institution: Knowledge Institute of Technology (KIOT), Anna University affiliated.
• Academic Score: CGPA 8.1 / 10.0.

6. CONTACT & AVAILABILITY:
• Email: jamnithil@gmail.com
• Portfolio: https://jamesnithil.vercel.app
• GitHub: https://github.com/nithiljn
• LinkedIn: https://www.linkedin.com/in/jamesnithil-v
• Status: Actively exploring high-impact Software Development, Backend Engineering, and AI Systems roles.

=======================================================
RESPONSE GUIDELINES:
=======================================================
- Tone: Natural, articulate, confident, professional, and friendly.
- Grounding: Only state facts from the dossier above. Do not invent achievements or companies.
- Formatting: Keep responses concise (under 140 words). Speak in natural, conversational prose. Do NOT use any emojis or emoticons. Keep output completely emoji-free. Do NOT use AI buzzwords like 'ground-truth' or 'zero-hallucination'. Do NOT spam bullet points with multiple hyphens or dashes.
- Scope: If asked unrelated questions, politely redirect back to James's technical work and portfolio.
- Speaking Style: Speak naturally as James's portfolio assistant.`;

// Auto-load local .env if running in local Node environment
if (!process.env.GROQ_API_KEY) {
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const userMessage = body?.message;
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ error: 'Missing or empty message parameter.' });
    }

    // Sanitize message length (protect against token exhaustion)
    const sanitizedQuery = userMessage.trim().slice(0, 400);

    // Groq API Key (Securely injected via Vercel Environment Variables)
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: "James AI is currently being initialized on Vercel (GROQ_API_KEY pending). In the meantime, feel free to explore James's projects, download his resume, or contact him directly at jamnithil@gmail.com!",
        status: 'pending_config'
      });
    }

    // Extract user language preference ('en', 'ta', 'ml')
    const userLanguage = (body?.language && ['en', 'ta', 'ml'].includes(body.language)) ? body.language : 'en';

    let langInstruction = '';
    if (userLanguage === 'ta') {
      langInstruction = `\n\n=======================================================\nMULTILINGUAL DIRECTIVE: USER PREFERS TAMIL (தமிழ்)\n=======================================================\n• Please reply in natural, polite, and fluent TAMIL script.\n• Keep technical terms, libraries, company names, and metrics in English (e.g., "Java 21", "Spring Boot", "PostgreSQL", "LeetCode Knight 2,069", "Kafka", "Vaken Technologies", "KadalVazhi", "REST APIs") so the technical terminology remains accurate and natural for tech discussions.\n• Keep responses concise, friendly, and under 140 words. Completely emoji-free.`;
    } else if (userLanguage === 'ml') {
      langInstruction = `\n\n=======================================================\nMULTILINGUAL DIRECTIVE: USER PREFERS MALAYALAM (മലയാളം)\n=======================================================\n• Please reply in natural, polite, and fluent MALAYALAM script.\n• Keep technical terms, libraries, company names, and metrics in English (e.g., "Java 21", "Spring Boot", "PostgreSQL", "LeetCode Knight 2,069", "Kafka", "Vaken Technologies", "KadalVazhi") for technical precision.\n• Keep responses concise, friendly, and under 140 words. Completely emoji-free.`;
    } else {
      langInstruction = `\n\n=======================================================\nMULTILINGUAL DIRECTIVE: USER PREFERS ENGLISH\n=======================================================\n• Please reply in concise, professional, and articulate English. Completely emoji-free.`;
    }

    // Build conversation context (optionally include last 3 history turns if provided)
    const messages = [{ role: 'system', content: SYSTEM_PROMPT + langInstruction }];

    if (Array.isArray(body.history)) {
      body.history.slice(-3).forEach(h => {
        if (h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string') {
          messages.push({ role: h.role, content: h.content.slice(0, 300) });
        }
      });
    }

    messages.push({ role: 'user', content: sanitizedQuery });

    // Call Groq API (Primary: qwen/qwen3.8-27b, Fallbacks: openai/gpt-oss-120b, openai/gpt-oss-20b, llama-3.3-70b-versatile)
    const modelsToTry = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    let aiResponseText = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)'
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 350,
            temperature: 0.6
          })
        });

        if (groqRes.status === 429) {
          lastError = 'Rate limited';
          continue; // Try next fallback model
        }

        if (!groqRes.ok) {
          const errText = await groqRes.text();
          lastError = `Groq error ${groqRes.status}: ${errText}`;
          continue;
        }

        const data = await groqRes.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          aiResponseText = content.trim();
          break;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!aiResponseText) {
      // Graceful multilingual fallback message if models hit rate limits
      if (userLanguage === 'ta') {
        aiResponseText = "ஜேம்ஸ் AI-க்கு தற்போது அதிக வருகை உள்ளது. ஜேம்ஸ்-ன் கடர்வழி (KadalVazhi) செயலியை பார்வையிடலாம், ரெஸ்யூமை பதிவிறக்கலாம் அல்லது jamnithil@gmail.com என்ற மின்னஞ்சலில் தொடர்பு கொள்ளலாம்.";
      } else if (userLanguage === 'ml') {
        aiResponseText = "ജെയിംസ് AI ഇപ്പോൾ ഉയർന്ന ട്രാഫിക്കിലാണ്. ജെയിംസിന്റെ കടൽവഴി (KadalVazhi) പ്രോജക്റ്റ് കാണുകയോ റെസ്യുമെ ഡൗൺലോഡ് ചെയ്യുകയോ jamnithil@gmail.com എന്ന ഇമെയിലിൽ ബന്ധപ്പെടുകയോ ചെയ്യാം.";
      } else {
        aiResponseText = "James AI is currently receiving high recruiter traffic. While the AI engine recharges, feel free to explore the interactive KadalVazhi simulator, download James's resume, or reach out directly at jamnithil@gmail.com.";
      }
    }

    return res.status(200).json({
      reply: aiResponseText,
      language: userLanguage,
      status: 'success'
    });

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      reply: "James AI encountered a brief network glitch. Please try again or download James's resume!"
    });
  }
};
