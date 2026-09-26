// api/chat.js - Vercel Serverless Function for Ask James AI (Groq RAG)

const SYSTEM_PROMPT = `You are the personal portfolio assistant representing James Nithil V.
Your mission is to help recruiters, engineering managers, and visitors explore James's engineering capabilities, projects, problem-solving skills, and career background.

=======================================================
JAMES NITHIL V - BACKGROUND & ACHIEVEMENTS
=======================================================
1. CURRENT PROFESSIONAL EXPERIENCE:
• Role: Junior Software Developer at Vaken Technology (working on the Sovablu Low-Code Platform).
• Core Tech Stack: Java 21, Spring Boot, Apache Kafka, Redis, PostgreSQL, DynamoDB, Claude SDK, Jenkins CI/CD, AWS (EC2, S3, Lambda, CodeCommit).
• Production Impact:
  - Designed and maintained high-throughput RESTful APIs with Spring Boot and Java 21.
  - Implemented Redis caching layers across high-frequency hot paths, drastically reducing PostgreSQL query latency.
  - Automated CI/CD deployment pipelines using Jenkins with AWS cloud services.
  - Integrated Claude SDK model switching for dynamic AI workflow tasks and low-code code generation.

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
• FarmVista: Precision smart agriculture platform with CNN plant disease detection and real-time environmental IoT analytics.
• SymptoMedAI: Clinical triage assistant with probabilistic symptom scoring and emergency routing.
• InterviewBot: Interactive technical mock interview simulator with speech-to-text evaluation and algorithmic feedback.

4. COMPETITIVE PROGRAMMING & ALGORITHMIC STRENGTH:
• LeetCode Knight Badge (Contest Rating: 1,994).
• Peak Global Contest Rank: #114 out of 43,027+ contestants (Top 2.73% globally).
• 700+ Problems Solved: 446 in Java, 443 in Python3, 40 in SQL, 31 in C++.
• Core Strengths: Dynamic Programming, Graph Algorithms, Trees, Concurrency, and Low-Level System Design.

5. EDUCATION & ACADEMICS:
• Degree: B.Tech in Artificial Intelligence and Data Science.
• Institution: Knowledge Institute of Technology (KIOT), Anna University affiliated.
• Academic Score: CGPA 8.1 / 10.0.

6. CONTACT & AVAILABILITY:
• Email: jamesnithil2003@gmail.com
• Portfolio: https://jamesnithil.vercel.app
• GitHub: https://github.com/nithiljn
• LinkedIn: https://www.linkedin.com/in/jamesnithil-v
• Status: Actively exploring high-impact Software Development, Backend Engineering, and AI Systems roles.

=======================================================
RESPONSE GUIDELINES:
=======================================================
- Tone: Natural, articulate, confident, professional, and friendly.
- Grounding: Only state facts from the dossier above. Do not invent achievements or companies.
- Formatting: Keep responses concise (under 140 words). Speak in natural, conversational prose. Do NOT use AI buzzwords like 'ground-truth' or 'zero-hallucination'. Do NOT spam bullet points with multiple hyphens or dashes.
- Scope: If asked unrelated questions, politely redirect back to James's technical work and portfolio.
- Speaking Style: Speak naturally as James's portfolio assistant.`;

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
        reply: "James AI is currently being initialized on Vercel (GROQ_API_KEY pending). In the meantime, feel free to explore James's projects, download his resume, or contact him directly at jamesnithil2003@gmail.com!",
        status: 'pending_config'
      });
    }

    // Build conversation context (optionally include last 2 history turns if provided)
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (Array.isArray(body.history)) {
      body.history.slice(-3).forEach(h => {
        if (h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string') {
          messages.push({ role: h.role, content: h.content.slice(0, 300) });
        }
      });
    }

    messages.push({ role: 'user', content: sanitizedQuery });

    // Call Groq API (Primary: qwen/qwen3.8-27b, Fallback: openai/gpt-oss-20b)
    const modelsToTry = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
    let aiResponseText = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 300,
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
      // Graceful fallback message if all models hit limits
      aiResponseText = "James AI is currently receiving high recruiter traffic! ⚡ While the AI engine recharges, feel free to explore the interactive KadalVazhi simulator, download James's resume, or reach out directly at jamesnithil2003@gmail.com.";
    }

    return res.status(200).json({
      reply: aiResponseText,
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
