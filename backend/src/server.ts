import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { OpenAI } from 'openai';
import http from 'http';
import { config } from './config/config.js';

const app = express();
const port = config.PORT;

// ============================================================
// PHASE 1: SECURITY & HARDENING
// ============================================================

// 1. HTTP Headers
app.use(helmet());

// 1.5. Debug Incoming Requests (Before CORS)
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS' || req.path !== '/health') {
    console.log(`[Request] ${req.method} ${req.originalUrl} | Origin: ${req.headers.origin}`);
  }
  next();
});

// 2. CORS Allowlist
const allowedOrigins = config.CORS_ORIGIN.split(',').map((s: string) => s.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Mismatch] Environment expects one of: [${allowedOrigins.join(', ')}] | But received request from: "${origin}". Allowing request dynamically.`);
      // Reflect the origin dynamically to prevent browser CORS blocks
      callback(null, origin); 
    }
  },
  credentials: true
}));

// 3. Request Size Limits & Malformed JSON Protection
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res: express.Response, buf, encoding) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON payload' });
      throw new Error('Invalid JSON');
    }
  }
}));

// 4. Rate Limiting
// Trust the first proxy (Render, Vercel, Heroku, etc.) to correctly parse X-Forwarded-For
app.set('trust proxy', 1);

const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // limit each IP to 200 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 AI requests per hour
  message: { error: 'AI Quota Exhausted. Please wait before analyzing more images.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', aiLimiter);

// 5. Request ID & Structured Logging Middleware
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/') || req.path === '/health') {
      const logEntry = {
        timestamp: new Date().toISOString(),
        requestId: req.id,
        method: req.method,
        endpoint: req.originalUrl,
        latencyMs: duration,
        status: res.statusCode,
        // AI specific fields injected by routes later if available
        model: res.locals.modelUsed || undefined,
        retryCount: res.locals.retryCount || 0
      };
      // Production Structured JSON log
      console.log(JSON.stringify(logEntry));
    }
  });
  next();
});

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

// 6. Health & Readiness Endpoints
app.get('/health', (req, res) => res.status(200).json({ 
  status: 'ok', 
  environment: config.NODE_ENV,
  version: '1.0.0',
  uptime: process.uptime() 
}));
app.get('/ready', (req, res) => res.status(200).json({ status: 'ready' }));
app.get('/version', (req, res) => res.status(200).json({ version: '1.0.0' }));


const API_KEY = config.GEMINI_API_KEY;

// We configure OpenAI client to use the Google AI Studio (Gemini) OpenAI-compatible endpoint
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// ============================================================
// INTELLIGENT MODEL FAILOVER ENGINE
// ============================================================

// Configurable model priority list — dynamically populated on startup
let MODEL_PRIORITY: string[] = [];

async function discoverModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}&pageSize=100`);
    if (!response.ok) {
      console.warn('Failed to fetch models dynamically, falling back to static list.');
      throw new Error('API request failed');
    }
    const data = await response.json();

    // Extract available models, strip 'models/' prefix
    const available = data.models
      .map((m: any) => m.name.replace('models/', ''))
      .filter((name: string) => name.includes('gemini'));

    // Ideal priority order
    const idealOrder = [
      'gemini-3.5-flash',
      'gemini-3.5-pro',
      'gemini-3.1-flash',
      'gemini-3.1-pro',
      'gemini-3.0-flash',
      'gemini-3.0-pro',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    // Only keep models that we actually have access to
    MODEL_PRIORITY = idealOrder.filter(m => available.includes(m));

    // Fallback if none matched perfectly
    if (MODEL_PRIORITY.length === 0) {
      MODEL_PRIORITY = available.slice(0, 5);
    }

    console.log(`[Discovery] Dynamically loaded ${MODEL_PRIORITY.length} models.`);
  } catch (e) {
    MODEL_PRIORITY = [
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite'
    ];
  }
}

const COOLDOWN_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Track cooldown state per model
const modelCooldowns: Map<string, number> = new Map();

// Track the last model that succeeded — prefer it on the next call
let lastSuccessfulModel: string | null = null;

// Request counter for development logging
let requestCounter = 0;

// Request lock to prevent concurrent API calls
let activeRequest: string | null = null;

function isModelAvailable(model: string): boolean {
  const cooldownUntil = modelCooldowns.get(model);
  if (!cooldownUntil) return true;
  if (Date.now() >= cooldownUntil) {
    modelCooldowns.delete(model);
    console.log(`[${new Date().toISOString()}] ✓ Cooldown expired for ${model} — model is available again.`);
    return true;
  }
  return false;
}

function placeOnCooldown(model: string, reason: string) {
  const until = Date.now() + COOLDOWN_DURATION_MS;
  modelCooldowns.set(model, until);
  console.log(`[${new Date().toISOString()}] ⏸ ${model} placed on cooldown for ${COOLDOWN_DURATION_MS / 1000}s (Reason: ${reason})`);
}

function isRecoverableError(error: any): boolean {
  const status = error?.status || error?.statusCode;
  if (status === 404) return true; // Model not found — remove it and try next
  if (status === 429) return true; // Rate limited
  if (status >= 500 && status < 600) return true; // Server errors (503, 500, etc.)
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('resource_exhausted')) return true;
  if (msg.includes('quota_exceeded')) return true;
  if (msg.includes('model_unavailable') || msg.includes('not found')) return true;
  if (msg.includes('timeout') || msg.includes('deadline')) return true;
  return false;
}

function shouldCooldown(error: any, model: string): boolean {
  const status = error?.status || error?.statusCode;
  if (status === 404) {
    // Model doesn't exist — remove it permanently
    MODEL_PRIORITY = MODEL_PRIORITY.filter(m => m !== model);
    console.log(`[${new Date().toISOString()}] 🗑 ${model} permanently removed from priority list (404 Not Found).`);
    return false;
  }
  if (status === 429) return true;
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('resource_exhausted')) return true;
  if (msg.includes('quota_exceeded')) return true;
  return false;
}

/**
 * Build the ordered list of models to try.
 * 1. If a higher-priority model has recovered from cooldown, prefer it.
 * 2. Otherwise start with lastSuccessfulModel (sticky), then fall through the priority list.
 */
function getModelOrder(): string[] {
  // Check if any higher-priority model has recovered
  for (const model of MODEL_PRIORITY) {
    if (isModelAvailable(model)) {
      if (lastSuccessfulModel && MODEL_PRIORITY.indexOf(model) < MODEL_PRIORITY.indexOf(lastSuccessfulModel)) {
        console.log(`[${new Date().toISOString()}] ⬆ Higher-priority model ${model} has recovered — promoting.`);
        lastSuccessfulModel = null; // Reset sticky so we try the higher-priority one
        break;
      }
      break; // The best available model is already >= lastSuccessfulModel priority
    }
  }

  // If we have a sticky model, put it first, then the rest in priority order (deduplicated)
  if (lastSuccessfulModel) {
    return [lastSuccessfulModel, ...MODEL_PRIORITY.filter(m => m !== lastSuccessfulModel)];
  }
  return [...MODEL_PRIORITY];
}

/**
 * Calls Gemini with automatic model failover.
 * Sticks with the last successful model. Only switches on recoverable errors.
 * Returns { response, modelUsed } on success.
 */
async function callGeminiWithFailover(
  buildOptions: (model: string) => any,
  requestLabel: string
): Promise<{ response: any; modelUsed: string }> {
  const reqNum = ++requestCounter;
  const errors: { model: string; error: string }[] = [];
  const modelOrder = getModelOrder();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Request #${reqNum} — ${requestLabel}`);
  console.log(`${'='.repeat(60)}`);

  for (const model of modelOrder) {
    // Skip models currently on cooldown
    if (!isModelAvailable(model)) {
      const cooldownUntil = modelCooldowns.get(model);
      const remaining = cooldownUntil ? Math.ceil((cooldownUntil - Date.now()) / 1000) : 0;
      console.log(`  ⏭ Skipping ${model} (cooldown: ${remaining}s remaining)`);
      continue;
    }

    const options = buildOptions(model);
    const start = Date.now();

    try {
      console.log(`  🔄 Trying ${model}...`);
      const response = await openai.chat.completions.create(options);
      const elapsed = ((Date.now() - start) / 1000).toFixed(2);

      // SUCCESS — stick with this model for future requests
      lastSuccessfulModel = model;
      console.log(`  ✅ Request #${reqNum} — Model: ${model} — Status: Success (${elapsed}s)`);
      return { response, modelUsed: model };

    } catch (error: any) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(2);
      const status = error?.status || 'unknown';
      const reason = error?.message || `HTTP ${status}`;
      console.log(`  ❌ Request #${reqNum} — Model: ${model} — Status: ${status} ${reason} (${elapsed}s)`);

      errors.push({ model, error: `${status} — ${reason}` });

      if (shouldCooldown(error, model)) {
        placeOnCooldown(model, reason);
      }

      if (isRecoverableError(error)) {
        const nextIdx = modelOrder.indexOf(model) + 1;
        const nextModel = modelOrder.slice(nextIdx).find(m => isModelAvailable(m));
        if (nextModel) {
          console.log(`  ↓ Switching to ${nextModel}...`);
        }
        continue;
      }

      // Non-recoverable error — stop immediately
      throw error;
    }
  }

  // All models exhausted
  const summary = errors.map(e => `  ${e.model}: ${e.error}`).join('\n');
  console.log(`  💀 Request #${reqNum} — ALL MODELS EXHAUSTED`);
  throw new Error(
    `All Gemini models are currently unavailable.\n${summary}\nPlease wait a few minutes and try again.`
  );
}

/**
 * Robustly parses JSON from Gemini output.
 */
function parseGeminiJSON(output: string): any {
  let clean = output.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  if (!clean.startsWith('{')) clean = '{' + clean;
  if (!clean.endsWith('}')) clean = clean + '}';
  return JSON.parse(clean);
}


// ============================================================
// API ENDPOINTS
// ============================================================

// Request lock middleware to prevent duplicate concurrent API calls
function withRequestLock(endpoint: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (activeRequest) {
      console.log(`[${new Date().toISOString()}] 🚫 BLOCKED duplicate ${endpoint} request (active: ${activeRequest})`);
      return res.status(429).json({
        error: 'A request is already in progress. Please wait for it to complete.',
        duplicate: true
      });
    }
    activeRequest = endpoint;
    // Release lock when response finishes
    res.on('finish', () => { activeRequest = null; });
    res.on('close', () => { activeRequest = null; });
    next();
  };
}

app.post('/api/analyze', withRequestLock('analyze'), async (req, res) => {
  try {
    const { text, targetLanguage, transliterationFormat, displayMode = 'target' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'No text provided for analysis.' });
    }

    let modeInstruction = '';
    let expectedLanguage = targetLanguage || 'English';

    if (displayMode === 'target') {
      modeInstruction = `
- You must generate ALL analytical content (translation, historical_analysis, historical_context, archaeological_notes, alternative_interpretations) strictly in ${expectedLanguage}.
- Do NOT mix English and ${expectedLanguage}.
- Only preserve original inscriptions, transliteration, proper nouns, dynasty names, and script names in their natural formats.`;
    } else if (displayMode === 'bilingual') {
      modeInstruction = `
- For all analytical content (translation, historical_analysis, historical_context, archaeological_notes, alternative_interpretations), you must provide a bilingual response.
- Format each field with the ${expectedLanguage} translation first, followed by the English translation on a new line.`;
    } else if (displayMode === 'english') {
      modeInstruction = `
- You must generate ALL analytical content strictly in English, regardless of the target language.`;
      expectedLanguage = 'English'; // Overwrite expected for validation
    } else if (displayMode === 'research') {
      modeInstruction = `
- You are in Research Mode.
- Provide a highly technical analysis suitable for an epigraphist.
- Provide a literal_translation (word-for-word).
- Generate ALL analytical content (literal_translation, translation, historical_analysis, historical_context, archaeological_notes, alternative_interpretations) strictly in ${expectedLanguage} (unless English is explicitly selected).`;
    }

    const systemPrompt = `You are an expert computational epigraphist, archaeologist, and linguist specializing in Ancient Indian inscriptions.
You are analyzing an ancient inscription.
The user's text may contain '[missing]' or '[unclear]' to denote damaged sections.

Your tasks:
1. Detect the inscription script automatically.
2. Identify the ancient language with a confidence score.
3. Estimate the historical period (Dynasty, Century, Geographic Region).
4. Transliterate the inscription into the user's requested format: ${transliterationFormat || 'IAST'}. 
5. Provide translations, historical analysis, archaeological notes, and alternative interpretations.
6. NEVER invent missing text. Preserve poetic and metrical formatting.

IMPORTANT TRANSLATION RULES:
- Return only analytical content.
- Do not generate UI labels.
- Do not generate button text.
- Do not generate menu names.
- The application UI handles localization separately.
${modeInstruction}

Please return your analysis strictly as a JSON object with this exact structure:
{
  "language": "${expectedLanguage}",
  "display_mode": "${displayMode}",
  "script_detected": "Primary Script Name (confidence %)",
  "ancient_language": "Language Name (confidence %)",
  "estimated_period": "e.g., 3rd Century BCE",
  "dynasty": "e.g., Maurya, Gupta, Chola",
  "region": "e.g., Magadha, Southern India",
  "original": "The original text provided",
  "transliteration": "The transliterated text in the requested format",
  "literal_translation": "Only if Research Mode: word-for-word literal translation",
  "translation": "The final natural translated text",
  "historical_analysis": "Detailed historical analysis",
  "historical_context": "Detailed historical context",
  "archaeological_notes": "Notes on religious context, royal titles, or physical condition",
  "alternative_interpretations": "Alternative readings of uncertain passages",
  "confidence": 0.95
}

CRITICAL JSON RULES:
1. Only return valid JSON, no markdown formatting blocks, no extra text.
2. DO NOT use unescaped double quotes (") or literal newlines inside your JSON string values. Use single quotes instead or escape them properly.`;

    const getAnalysis = async (isRetry = false) => {
      let retryPrompt = systemPrompt;
      if (isRetry && (displayMode === 'target' || displayMode === 'research')) {
         retryPrompt += `\n\nCRITICAL FIX REQUIRED: In your previous attempt, you failed to output the analytical fields entirely in ${expectedLanguage}. You MUST output 'translation', 'historical_analysis', 'archaeological_notes', etc., EXCLUSIVELY in ${expectedLanguage}.`;
      }
      return await callGeminiWithFailover((model) => ({
        model,
        messages: [
          { role: 'system', content: retryPrompt },
          { role: 'user', content: `Analyze this inscription:\n\n${text}` }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        response_format: { type: 'json_object' },
      }), isRetry ? 'Analyze Inscription (Retry Stricter)' : 'Analyze Inscription');
    };

    let { response, modelUsed } = await getAnalysis();
    let output = response.choices[0]?.message?.content || '{}';
    let parsedData: any = {};
    
    try {
      parsedData = parseGeminiJSON(output);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", output);
      return res.status(500).json({ error: "Failed to parse model output as JSON." });
    }

    // Validation (only validate non-English targets for Target/Research modes)
    const containsMostlyLatinCharacters = (str: string) => {
      if (!str) return false;
      const latinCount = (str.match(/[a-zA-Z]/g) || []).length;
      const totalChars = str.replace(/\s+/g, '').length;
      return totalChars > 0 && (latinCount / totalChars) > 0.5;
    };

    const targetLangLower = expectedLanguage.toLowerCase();
    const indicLanguages = ["tamil", "hindi", "kannada", "telugu", "malayalam", "marathi", "bengali", "gujarati", "odia", "punjabi", "sanskrit"];
    
    let validationFailed = false;

    if ((displayMode === 'target' || displayMode === 'research') && indicLanguages.includes(targetLangLower)) {
       const fieldsToCheck = [
         parsedData.translation, 
         parsedData.historical_analysis, 
         parsedData.archaeological_notes,
         parsedData.historical_context
       ];
       
       for (const field of fieldsToCheck) {
          if (containsMostlyLatinCharacters(field || "")) {
             validationFailed = true;
             break;
          }
       }
    }

    if (validationFailed) {
      console.warn(`[Validation Failed] Expected fields in ${expectedLanguage}, but got excessive Latin characters. Retrying...`);
      const retryResult = await getAnalysis(true);
      output = retryResult.response.choices[0]?.message?.content || '{}';
      try {
        parsedData = parseGeminiJSON(output);
        modelUsed = retryResult.modelUsed;
      } catch (e) {
         console.error("Failed to parse JSON from Gemini on retry:", output);
         return res.status(500).json({ error: "Failed to parse model output as JSON on retry." });
      }
      
      // Check again
      let finalValidationFailed = false;
      if (indicLanguages.includes(targetLangLower)) {
         const fieldsToCheck = [
           parsedData.translation, 
           parsedData.historical_analysis, 
           parsedData.archaeological_notes,
           parsedData.historical_context
         ];
         for (const field of fieldsToCheck) {
            if (containsMostlyLatinCharacters(field || "")) {
               finalValidationFailed = true;
               break;
            }
         }
      }
      
      if (finalValidationFailed) {
         return res.status(400).json({ 
             error: `Language mismatch error. The model failed to generate all analytical fields exclusively in ${expectedLanguage}. Please try again.` 
         });
      }
    }

    parsedData._model = modelUsed;
    parsedData._request = requestCounter;
    res.locals.modelUsed = modelUsed;
    res.json(parsedData);

  } catch (error: any) {
    console.error('Error calling Google AI Studio:', error.message);
    res.status(500).json({ 
      error: config.NODE_ENV === 'production' ? 'Internal server error' : (error.message || 'Internal server error') 
    });
  }
});

app.post('/api/transcribe-image', withRequestLock('transcribe'), async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const systemPrompt = `You are an expert computational epigrapher and linguist.
Your task is to transcribe the text visible in this ancient inscription image.
1. Detect the ancient script/language automatically.
2. Ignore background noise and irrelevant markings.
3. Preserve damaged or missing characters exactly using these markers:
   - "[missing]" for gaps where text is entirely lost.
   - "[unclear]" for characters that are visible but illegible.
4. Never hallucinate or invent missing text.

You MUST return your transcription as a strict JSON object with this exact structure:
{
  "detected_language": "Name of the detected language/script",
  "confidence": 0.95,
  "text": "The raw transcribed text here, with [missing] and [unclear] where appropriate",
  "warnings": "Optional array of strings for any warnings (e.g., 'Image is very blurry', 'Script is partially cut off'). If no warnings, return an empty array []"
}
Output ONLY valid JSON. Do not include markdown formatting or conversational filler.`;

    const { response, modelUsed } = await callGeminiWithFailover((model) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Transcribe this inscription into JSON:' },
            { type: 'image_url', image_url: { url: image } }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }), 'Transcribe Image (OCR)');

    const output = response.choices[0]?.message?.content || '{}';
    let transcriptionData: any = {};
    try {
      transcriptionData = parseGeminiJSON(output);
    } catch (e) {
      console.error("Failed to parse OCR JSON from Gemini:", output);
      transcriptionData = {
        text: output.trim(),
        warnings: ["Failed to parse structured JSON from AI"],
        confidence: 0
      };
    }

    transcriptionData._model = modelUsed;
    transcriptionData._request = requestCounter;
    res.locals.modelUsed = modelUsed;
    res.json(transcriptionData);

  } catch (error: any) {
    console.error('Error transcribing image:', error.message);
    res.status(500).json({ 
      error: config.NODE_ENV === 'production' ? 'Internal server error during transcription' : (error.message || 'Internal server error during transcription') 
    });
  }
});

// Status endpoint — model health + request stats
app.get('/api/model-status', (_req, res) => {
  const status = MODEL_PRIORITY.map(model => ({
    model,
    available: isModelAvailable(model),
    cooldownUntil: modelCooldowns.has(model)
      ? new Date(modelCooldowns.get(model)!).toISOString()
      : null,
  }));
  res.json({
    models: status,
    totalRequests: requestCounter,
    lastSuccessfulModel,
    activeRequest,
  });
});

discoverModels().then(() => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(JSON.stringify({ 
      timestamp: new Date().toISOString(), 
      event: 'server_started', 
      port, 
      host: '0.0.0.0',
      models: MODEL_PRIORITY.length 
    }));
  });

  const shutdown = (signal: string) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), event: 'shutdown_initiated', signal }));
    server.close(() => {
      console.log(JSON.stringify({ timestamp: new Date().toISOString(), event: 'server_closed' }));
      process.exit(0);
    });
    // Force close after 10s
    setTimeout(() => {
      console.error(JSON.stringify({ timestamp: new Date().toISOString(), event: 'shutdown_forced' }));
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}).catch(e => {
  console.error(JSON.stringify({ timestamp: new Date().toISOString(), event: 'fatal_startup_error', error: e.message }));
  process.exit(1);
});
