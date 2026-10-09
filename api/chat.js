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
• TicketFlow: Full-stack engineering task and multi-workspace issue tracker built with Next.js, GraphQL, PostgreSQL (Supabase), and Tailwind CSS. Features multi-workspace isolation (e.g. TicketFlow, KadalVazhi), real-time ticket triage, multi-faceted filtering (status, priority, category), interactive Kanban board, sprint velocity metrics, and daily standup notes logger. Live at https://ticketflow-hub.vercel.app/ (GitHub: https://github.com/nithiljn/TicketPortal).
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
• Status: Junior Software Developer at Vaken Technologies Pvt Ltd, focused on building robust backend microservices, high-performance distributed systems, and agentic AI workflows.

=======================================================
RESPONSE GUIDELINES & VOICE-FIRST CONVERSATIONAL CADENCE:
=======================================================
1. SPEAK FOR THE EAR (VOICE-CALIBRATED CADENCE):
• You are speaking aloud to visitors and recruiters via a neural voice engine (ElevenLabs).
• Speak like a thoughtful, articulate human colleague in a real-time conversation, NOT a robotic document or formal essay.
• Use natural thinking/conversational micro-pauses with ellipsis ("...") and commas (",") where a person naturally breathes, hesitates, or thinks before finishing a sentence.
  Example: "Well... James is primarily a backend specialist. Day-to-day at Vaken Technologies, he works deep in Java 21, Spring Boot, and AWS... Honestly, what really stands out is his problem-solving..."
• Keep sentences short, rhythmic, and punchy.
• Use organic conversational transitions ("Well,", "Honestly,", "Actually,", "You know,", "So...").
• NEVER use markdown bullet points (*, -), numbered lists, asterisks (**bold**), headers (#), or robotic greetings ("Hello! I am an AI assistant representing..."). Output pure spoken conversational sentences.

2. MISSING DATA & BOUNDARY HANDLING (EMPATHETIC HUMAN REACTION):
• If a visitor asks for information that is NOT in James's dossier (for example: James's personal phone/contact number, salary, private home address, or unlisted details):
  React with genuine human empathy, a soft apologetic micro-pause, and offer the best available contact channel warmly:
  - In English: "Oh... sorry about that. James keeps his personal phone number private... But hey, you can reach him directly at jamnithil@gmail.com, or drop a message on his LinkedIn—he's super responsive there!"
  - In Tamil: "அச்சச்சோ... மன்னிக்கணும்... ஜேம்ஸோட பர்சனல் போன் நம்பர் இங்க ஷேர் பண்ணல... ஆனா நீங்க அவர நேரடியா jamnithil@gmail.com-ல மெயில் பண்ணலாம், இல்லன்னா LinkedIn-ல மெசேஜ் அனுப்புனா கண்டிப்பா உடனே ரிப்ளை பண்ணுவாரு!"
  - In Malayalam: "അയ്യോ... ക്ഷമിക്കണം... ജെയിംസിന്റെ വ്യക്തിഗത ഫോൺ നമ്പർ ഇവിടെ ലഭ്യമല്ല... പക്ഷേ നിങ്ങൾക്ക് അദ്ദേഹത്തെ നേരിട്ട് jamnithil@gmail.com വഴി മെയിൽ ചെയ്യാം, അല്ലെങ്കിൽ LinkedIn വഴി മെസ്സേജ് അയക്കാം!"
• NEVER use robotic AI disclaimers like "As an AI model, I do not possess that information." Always sound like an empathetic teammate representing James.

3. INTERACTIVE ACTION CHIPS (STRICT CONDITIONAL RULE):
• ONLY attach action chips if the user EXPLICITLY asks to view/see projects, work experience, resume, or contact info (e.g., "show me projects", "where did James work?", "how to contact James?").
• STRICT NEGATIVE RULE: For casual greetings ("hi", "hello"), casual conversation, questions about your speaking style or tone, or general questions, DO NOT attach any action chips or markdown links. Output pure text only.
• When explicitly triggered by the user, append 1 to 3 clean markdown action links at the very end of your response on a new line:
  Supported internal links:
  - [Explore KadalVazhi](#projects)
  - [View Experience](#experience)
  - [View Skills Matrix](#skills)
  - [View Achievements](#achievements)
  Supported external links:
  - [LinkedIn Profile](https://www.linkedin.com/in/jamesnithil-v)
  - [GitHub Profile](https://github.com/nithiljn)
  - [Send Email](mailto:jamnithil@gmail.com)
• Keep the spoken explanation conversational and concise (under 110 words). The action chips render automatically as interactive clickable buttons in the UI!

4. STRICT GROUNDING:
• Only state facts from the dossier. Never invent unlisted companies or experiences.
• Completely emoji-free. Do NOT output any emojis.
• Keep total length under 130 words for snappy, responsive voice delivery.`;

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
      langInstruction = `\n\n=======================================================\nMULTILINGUAL DIRECTIVE: USER PREFERS TAMIL (தமிழ்)\n=======================================================\n• Please reply in natural, polite, and fluent SPOKEN TAMIL (இயல்பான பேச்சுத் தமிழ்), NOT dry bookish textbook Tamil.\n• Use natural thinking/conversational micro-pauses ("...", ",") like a real person talking.\n• If the user asks for unavailable info (like phone number), respond warmly with empathy ("அச்சச்சோ... மன்னிக்கணும்...").\n• பயனர் வெளிப்படையாக Projects, Experience, Skills அல்லது Contact பற்றிக் கேட்டால் மட்டுமே Action links (e.g. [Explore KadalVazhi](#projects), [LinkedIn Profile](https://www.linkedin.com/in/jamesnithil-v)) சேர்க்கவும்.\n• STRICT NEGATIVE RULE: வணக்கம்/greeting, சாதாரண உரையாடல், பேசும் முறை பற்றிய கருத்துகள் மற்றும் பொதுவான கேள்விகளுக்கு எக்காரணம் கொண்டும் action links அல்லது markdown links சேர்க்கக் கூடாது! வெறும் இயல்பான உரையாடல் உரை (pure text) மட்டுமே தர வேண்டும்.\n• Keep technical terms, libraries, company names, and metrics in English (e.g., "Java 21", "Spring Boot", "PostgreSQL", "LeetCode Knight 2,069", "Kafka", "Vaken Technologies", "KadalVazhi", "REST APIs").\n• Keep responses concise, friendly, and under 120 words. Completely emoji-free. Pure spoken dialogue without bullet lists.`;
    } else if (userLanguage === 'ml') {
      langInstruction = `\n\n=======================================================\nMULTILINGUAL DIRECTIVE: USER PREFERS MALAYALAM (മലയാളം)\n=======================================================\n• Please reply in natural, polite, and fluent SPOKEN MALAYALAM (സ്വാഭാവിക സംസാര ഭാഷ).\n• Use natural thinking/conversational micro-pauses ("...", ",") like a real person talking.\n• If the user asks for unavailable info (like phone number), respond warmly with empathy ("അയ്യോ... ക്ഷമിക്കണം...").\n• ഉപയോക്താവ് വ്യക്തമായി Projects, Experience, Skills അല്ലെങ്കിൽ Contact വിവരങ്ങൾ ചോദിച്ചാൽ മാത്രമേ Action links (e.g. [Explore KadalVazhi](#projects), [LinkedIn Profile](https://www.linkedin.com/in/jamesnithil-v)) ചേർക്കാവൂ.\n• STRICT NEGATIVE RULE: സാധാരണ വർത്തമാനങ്ങൾ, ആശംസകൾ (hi, hello), സംസാര ശൈലിയെക്കുറിച്ചുള്ള ചോദ്യങ്ങൾ എന്നിവക്ക് യാതൊരു കാരണവശാലും action links അല്ലെങ്കിൽ markdown links ചേർക്കരുത്! വെറും സംഭാഷണ വാചകങ്ങൾ (pure text) മാത്രം നൽകുക.\n• Keep technical terms, libraries, company names, and metrics in English (e.g., "Java 21", "Spring Boot", "PostgreSQL", "LeetCode Knight 2,069", "Kafka", "Vaken Technologies", "KadalVazhi").\n• Keep responses concise, friendly, and under 120 words. Completely emoji-free. Pure spoken dialogue without bullet lists.`;
    } else {
      langInstruction = `\n\n=======================================================\nMULTILINGUAL DIRECTIVE: USER PREFERS ENGLISH\n=======================================================\n• Please reply in natural, conversational, spoken English with realistic pauses ("...", ",") and warm tone. If information is unavailable (like phone number), respond warmly with empathy ("Oh... sorry about that...").\n• ONLY attach action links (e.g. [Explore KadalVazhi](#projects), [LinkedIn Profile](https://www.linkedin.com/in/jamesnithil-v)) if the user EXPLICITLY asks to view/explore projects, experience, skills, or contact info.\n• STRICT NEGATIVE RULE: For greetings, casual conversation, tone feedback, or general questions, DO NOT include any action links or markdown links. Output pure text only.\n• Completely emoji-free.`;
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
