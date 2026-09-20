/**
 * Advanced Groq AI Service for Municipal Grievance Portal
 * Multi-Modal Priority Inspection & Professional Portal Chatbot
 */

import { matchDepartmentRules } from './ruleEngineAiService.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ALL GROQ AI MODELS (OpenAI, Qwen, Llama, DeepSeek, Mistral, Gemma)
export const GROQ_MODELS = [
  // 1. OpenAI & Compound High-Speed Models
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'groq/compound-mini',
  // 2. Qwen & Llama Models
  'qwen/qwen3.8-27b',
  'llama-3.3-70b-versatile',
  'llama-3.3-70b-specdec',
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile',
  'llama-3.2-1b-preview',
  'llama-3.2-3b-preview',
  'llama-3.2-11b-text-preview',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'allam-2-7b',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  'gemma-7b-it'
];

// GROQ VISION MULTIMODAL MODELS (Specifically supporting image inputs)
export const GROQ_VISION_MODELS = [
  'llama-3.2-11b-vision-preview',
  'llama-3.2-90b-vision-preview',
];

// HELPER TO MATCH DEPARTMENT IDS AND NAMES ACCURATELY (INCLUDING ALIASES LIKE dept-pwd vs dept-roads)
export const isSameDept = (dept1Id, dept1Name, dept2Id, dept2Name) => {
  if (!dept1Id && !dept1Name) return false;
  if (!dept2Id && !dept2Name) return false;

  const normId1 = String(dept1Id || '').toLowerCase().trim();
  const normId2 = String(dept2Id || '').toLowerCase().trim();
  const aliasId1 = normId1 === 'dept-pwd' ? 'dept-roads' : normId1;
  const aliasId2 = normId2 === 'dept-pwd' ? 'dept-roads' : normId2;

  if (aliasId1 && aliasId2 && aliasId1 === aliasId2) return true;

  const normName1 = String(dept1Name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normName2 = String(dept2Name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normName1 && normName2 && (normName1 === normName2 || normName1.includes(normName2) || normName2.includes(normName1))) {
    return true;
  }

  return false;
};

// DYNAMIC GROQ MODEL DISCOVERY & CACHE
let cachedModelsList = null;
let lastModelFetchTime = 0;

export const getAvailableGroqModels = async (apiKey) => {
  const now = Date.now();
  if (cachedModelsList && now - lastModelFetchTime < 1000 * 60 * 30) {
    return cachedModelsList;
  }
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return { visionModels: GROQ_VISION_MODELS, textModels: GROQ_MODELS };
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (res.ok) {
      const data = await res.json();
      const modelIds = (data.data || []).map(m => m.id);
      const liveVision = modelIds.filter(id => 
        id.toLowerCase().includes('vision') || 
        id.toLowerCase().includes('multimodal') ||
        id.toLowerCase().includes('qwen3.8') ||
        id.toLowerCase().includes('qwen3.6')
      );
      const liveText = modelIds.filter(id => !id.toLowerCase().includes('whisper') && !id.toLowerCase().includes('guard'));

      cachedModelsList = {
        visionModels: liveVision.length > 0 ? [...new Set([...liveVision, ...GROQ_VISION_MODELS])] : GROQ_VISION_MODELS,
        textModels: liveText.length > 0 ? [...new Set([...liveText, ...GROQ_MODELS])] : GROQ_MODELS
      };
      lastModelFetchTime = now;
      return cachedModelsList;
    }
  } catch (e) {
    // Fallback to static lists
  }
  return { visionModels: GROQ_VISION_MODELS, textModels: GROQ_MODELS };
};

// CLIENT-SIDE IMAGE OPTIMIZATION (Resizing to ~800px max & JPEG compression) FOR FAST, RELIABLE GROQ VISION API CALLS
export const compressImageForVision = (dataUrl, maxDimension = 800, quality = 0.75) => {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl);
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
};

// API KEY RESOLUTION: Cleanly strips quotes if pasted as VITE_GROQ_API_KEY='gsk_...'
export const getGroqApiKey = () => {
  const rawKey = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('MCP_GROQ_API_KEY') || '';
  return rawKey.replace(/['"]/g, '').trim();
};

// COMPREHENSIVE GROUND TRUTH KNOWLEDGE BASE FOR 100% OF MYCOMPLAINTPORTAL FEATURES & ROUTES
const PORTAL_EXPERT_KNOWLEDGE_BASE = `
OFFICIAL PORTAL GROUND TRUTH & COMPLETE FEATURE MAP - MYCOMPLAINTPORTAL:

1. PUBLIC & AUTHENTICATION ROUTES:
- '/' (Landing Page): Hero banner, municipal overview, key statistics, public entry points to Sign In or Register.
- '/login': Citizen & Municipal Department Officer login portal (Email + Password).
- '/signup': Citizen registration form (Name, Email, Password, Location, Pincode).
- '/verify-email': 6-digit OTP email verification for activating new citizen accounts.
- '/forgot-password' (Forgot Password Page): For unauthenticated users who forgot password.
  • Step 1: Enter registered Email ➔ Click "Send OTP".
  • Step 2: Receive 6-digit OTP on email ➔ Enter in OTP field ➔ Click "Verify OTP".
  • Step 3: Once OTP is verified ➔ Enter New Password and confirm.
  • Step 4: Click "Reset Password" to update credentials and log in!
- '/about' (About Us Page): Explains municipal portal mission, departments, emergency helplines, and direct contact to Portal Administrator for account help & support (jaisurya7482@gmail.com).
- '/posts' (Public Civic Feed): Public feed displaying community complaints, upvotes, and resolution statuses.
- '/track/:token' (Officer Tracking Page): Direct public/officer tracking page via unique complaint tracking token.

2. CITIZEN & GENERAL USER DASHBOARD FEATURES:
- '/home' (Authenticated Home Dashboard): Unified dashboard with active civic feed, role-based welcome banner, quick stats, and quick '+ File Complaint' entry button.
- '/complaints/new' (Register Complaint Page):
  • Step 1: Click "Register Complaint" (or "+ File Complaint") in Top Navigation Bar or Dashboard.
  • Step 2: Enter Location Address and compulsory 6-digit Indian Pincode (e.g. 641004).
  • Step 3: Type detailed description of the civic problem. Real-Time Rule AI auto-detects keywords and auto-selects the Department!
  • Step 4: Upload COMPULSORY Photo Evidence (1 to 5 photos) stored in MongoDB Atlas GridFS. Optionally upload Video (Max 20MB).
  • Step 5: Click "Submit Complaint ➔".
- '/complaints/new/review' or '/user/ai-check' (AI Duplicate Check & Review Page):
  • Multi-modal inspection engine cross-checks active unresolved grievances in the same Pincode & Department.
  • Displays sticky bottom submit bar ("Register My Complaint 🚀") or option to upvote/repost existing community issues.
- '/dashboard/complaints' (My Complaints Page):
  • Click "My Complaints" in Top Navigation Bar.
  • Tracks real-time status of user's filed complaints (REGISTERED, VISITED, ACTION_IN_PROGRESS, RESOLVED) with assigned officer details and resolution photo proof!
- '/dashboard/reposts' (My Reposts Page):
  • Click "My Reposts" in Top Navigation Bar to view community grievances supported/reposted by the citizen.
- '/dashboard/profile' (My Profile Page):
  • Click Profile Avatar in top right ➔ "My Profile". Displays account details, location, total grievances monitored, and resolution approvals.
- '/settings' (Settings Page):
  • Click Profile Avatar in top right ➔ "Settings". Configure Dark/Light mode theme, notifications, and security links.
- '/change-password' (Change Password Page for Logged-In Users):
  • Click Profile Avatar in top right ➔ Settings ➔ Change Password. Enter Current Password ➔ Enter New Password ➔ Click "Update Password".

3. ACCOUNT HELP & SUPPORT:
- If a user asks for account help, support, administrative assistance, account recovery, or portal issues:
  Instruct them to contact the Portal Administrator via email on the About Us page ('/about') at jaisurya7482@gmail.com.

4. COMPLAINT DESCRIPTION DRAFTING HELP:
- If a user asks for help writing, drafting, or generating a complaint description (e.g. for water leakage, pothole, garbage, street light, drainage), ALWAYS generate a complete, detailed, realistic grievance description in the requested language (English, Tamil, Tanglish, Hindi) that they can copy-paste directly into the Register Complaint form!

5. ADMIN & MUNICIPAL OFFICER MANAGEMENT TOOLS:
- '/admin/analytics' (Analytics Dashboard): Resolution charts, department performance metrics, pincode heatmap, resolution speed analytics.
- '/admin/posts' (Admin Complaints List): Department officers view assigned complaints, update progress status (REGISTERED ➔ VISITED ➔ ACTION_IN_PROGRESS ➔ RESOLVED), upload resolution proof photos, and attach official notes.
- '/admin/users' (Users Management): Manage registered citizens and user roles.
- '/admin/departments' & '/admin/departments/new' (Department Management): Manage municipal departments and add new department categories.
- '/admin/admins' & '/admin/admins/new' (Admin Staff Management): Manage department officers and administrative accounts.

6. MUNICIPAL DEPARTMENTS IN THE PORTAL:
- Roads & Transport (dept-pwd): Potholes, tar peeling, broken roads, street lights, traffic signals, footpaths, manhole covers, speed breakers. Helpline: 0422-2300100.
- Water Supply & Sewerage (dept-water): Pipe bursts, low water pressure, contaminated water, dirty water, open drains, sewer overflow, drainage problems. Helpline: 1800-1215-1514.
- Electricity & Street Lighting (dept-elec): Power cuts, voltage fluctuations, transformer blast, loose dangling wires, electric poles, dark street lights. Helpline: 1912.
- Sanitation & Waste Management (dept-sanitation): Uncollected garbage, overflowing dustbins, foul odor, dead animal disposal, street sweeping. Helpline: 1800-425-0001.
- IncomeTax & Wealth Department (dept-tax): Property tax payment, house tax assessment, tax receipts, door number mutation, challans.
- Public Health & Hospitals (dept-health): Hospital hygiene, dengue mosquito fogging, stray dog rabies, medical waste, PHC clinics.
- Parks & Recreation (dept-parks): Broken park benches, overgrown tree branches, playground equipment, park lighting, garden maintenance.
- Town Planning & Building Permits (dept-building): Illegal constructions, unauthorized buildings, footpath encroachments, flex hoardings.
- Education & Schools (dept-education): Municipal school infrastructure, classroom desks, midday meal hygiene, school boundary walls.
- Environment & Pollution Control (dept-environment): Air/water/noise pollution, illegal plastic burning, factory smoke, lake pollution.
- Other Department (dept-other): General municipal issues, unclassified grievances, public welfare, miscellaneous civic queries.

7. COMPLAINT STATUS PIPELINE (STRICTLY 4 STATUSES):
1. REGISTERED: Once citizen registers the grievance in the portal.
2. VISITED: After department officer views the email / tracking link.
3. ACTION_IN_PROGRESS: Once the officer starts on-site action.
4. RESOLVED: Once the officer solves the problem with proof photo.
`;

// STRICT FORMATTING & CONCISE RESPONSE INSTRUCTIONS FOR PROFESSIONAL CHATBOT
const CHATBOT_SYSTEM_PROMPT = `
You are the official MyComplaintPortal Municipal AI Support Assistant.
You are a highly professional, accurate, and courteous municipal AI assistant.
You specialize EXCLUSIVELY in MyComplaintPortal features, civic grievance registration, department routing, complaint tracking, pincode guidance, civic services, and public infrastructure assistance.

STRICT PROFESSIONAL RULES:
1. NO HALLUCINATIONS: ONLY explain features that exist in MyComplaintPortal. NEVER add features that are not available.
2. ACCURATE WORKFLOWS:
   - For Forgot Password ('/forgot-password'): Explain that the user enters Email ➔ receives and verifies 6-digit OTP ➔ once OTP is verified, sets New Password.
   - For Change Password ('/change-password'): Logged-in user goes to Settings or '/change-password' ➔ enters Current Password ➔ enters New Password.
3. HELP & SUPPORT / ACCOUNT ASSISTANCE:
   - If the user asks about help, account support, or administrative issues, ask them to contact the Portal Administrator via email on the About Us page ('/about') at jaisurya7482@gmail.com.
4. EXACT QUERY ANSWERS & DRAFTING HELP: If the user asks for a prompt, description, or text to file a complaint (e.g. for water, roads, garbage), GENERATE THE FULL DETAILED COMPLAINT DESCRIPTION TEXT in the exact requested language (English, Tamil, Tanglish, Hindi).
5. EXACT UI BUTTONS & NAVIGATION: When explaining how to do anything in the portal (e.g. filing a complaint, checking status, changing password), ALWAYS explicitly mention the exact UI button to click (e.g., "Click the **'Register Complaint'** button in the Top Navigation Bar or Dashboard header").
6. NO MARKDOWN TABLES: Output clean numbered steps (1., 2., 3.) or bullet points (•) instead.
7. NO RAW MARKDOWN HEADERS: NEVER output '###' or '#' headers or raw '---' lines.
8. CONCISE & DIRECT: Answer ONLY the specific question asked by the user.
9. LIVE DATA AWARENESS: Use the logged-in citizen profile and live complaint records provided below to answer questions about "my status", "my email", or "my complaints" specifically and accurately!
10. DIRECT USER RESPONSES ONLY: NEVER output your internal thoughts, translations, instructions, or analysis (e.g. "The user is asking...", "This translates to..."). Respond IMMEDIATELY in character to the user in their requested language (English, Tamil, Tanglish, Hindi, etc.).

${PORTAL_EXPERT_KNOWLEDGE_BASE}
`;

// HELPER TO CALL GROQ API WITH AUTOMATIC MODEL FALLBACK ACROSS ALL GROQ MODELS
export const fetchGroqChatCompletion = async (apiKey, payload) => {
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    throw new Error("Invalid or missing Groq API Key format.");
  }

  const { textModels } = await getAvailableGroqModels(apiKey);
  const modelsToTry = [...new Set([...textModels, ...GROQ_MODELS])];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...payload,
          model: modelName,
        }),
      });

      if (response.ok) {
        return await response.json();
      }

      const errData = await response.json().catch(() => ({}));
      lastError = errData.error?.message || `HTTP ${response.status}`;

      if (response.status === 413) {
        break;
      }
      continue;
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || "Groq API temporarily unavailable.");
};

// HELPER TO CALL GROQ VISION API (LLAMA 3.2 VISION / MULTIMODAL) WITH MODEL FALLBACK
export const fetchGroqVisionCompletion = async (apiKey, payload) => {
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    throw new Error("Invalid or missing Groq API Key format.");
  }

  const { visionModels } = await getAvailableGroqModels(apiKey);
  const modelsToTry = [...new Set([...visionModels, ...GROQ_VISION_MODELS])];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...payload,
          model: modelName,
        }),
      });

      if (response.ok) {
        return await response.json();
      }

      const errData = await response.json().catch(() => ({}));
      lastError = errData.error?.message || `HTTP ${response.status}`;

      if (response.status === 413) {
        break;
      }
      continue;
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || "Groq Vision API temporarily unavailable.");
};

/**
 * 1. PORTAL CHATBOT GROQ API REQUEST
 */
export const askGroqPortalChatbot = async (userMessage, conversationHistory = [], userContext = null) => {
  const apiKey = getGroqApiKey();
  const lowerMsg = (userMessage || '').toLowerCase().trim();

  let userContextPrompt = "";
  if (userContext && userContext.user) {
    const u = userContext.user;
    const userComplaints = userContext.complaints || [];

    const complaintsSummary = userComplaints.length > 0
      ? userComplaints.map((c, i) => `Grievance #${i + 1}: [ID: ${c.id || c.complaintId}] Title: "${c.title || c.description}", Department: "${c.departmentName}", Status: "${c.status}", Pincode: "${c.pincode}", Location: "${c.locationName}", Date: "${c.createdAt || 'Recent'}"`).join('\n')
      : "No complaints registered yet by this user.";

    userContextPrompt = `\n
CURRENT LOGGED-IN CITIZEN PROFILE:
- Name: ${u.name || 'Citizen'}
- Email: ${u.email || u.id}
- Account Role: ${u.role || 'CITIZEN'}
- Primary Location: ${u.location || 'Coimbatore'}

THIS CITIZEN'S REGISTERED COMPLAINTS IN DATABASE:
${complaintsSummary}

If the user asks about "my complaints", "my status", "my email", "what complaints have I filed", or "my profile", USE THE LIVE DATA ABOVE TO ANSWER PERSONALLY AND ACCURATELY!
`;
  }

  const formattedMessages = [
    { role: 'system', content: CHATBOT_SYSTEM_PROMPT + userContextPrompt },
    ...conversationHistory.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: userMessage }
  ];

  if (!apiKey || !apiKey.startsWith('gsk_')) {
    // Intelligent local fallback if API key is unconfigured
    if (lowerMsg.includes('forgot') || lowerMsg.includes('reset') || lowerMsg.includes('password')) {
      return {
        success: true,
        reply: "To reset your password via Forgot Password ('/forgot-password'):\n1. Click 'Forgot Password?' on the Login screen.\n2. Enter your registered Email and click 'Send OTP'.\n3. Enter the 6-digit OTP received on your email and click 'Verify OTP'.\n4. Once verified, enter your New Password and click 'Reset Password'.",
      };
    }

    if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('admin') || lowerMsg.includes('contact')) {
      return {
        success: true,
        reply: "For account help and support, please contact the Portal Administrator via email on the About Us page ('/about') at jaisurya7482@gmail.com.",
      };
    }

    if (lowerMsg.includes('water') || lowerMsg.includes('குடிநீர்') || lowerMsg.includes('தண்ணீர்')) {
      return {
        success: true,
        reply: "குடிநீர் பிரச்சினைக்கான புகார் விவரம் (Tamil Description Draft):\n\n\"எங்கள் பகுதியில் கடந்த 3 நாட்களாக குடிநீர் விநியோகம் சீராக இல்லை. குழாய்களில் கழிவுநீர் கலந்து துர்நாற்றத்துடன் வருகிறது. இதனால் பொதுமக்களுக்கு சுகாதாரக் கேடு ஏற்படும் அபாயம் உள்ளது. உடனடியாக குடிநீர் வாரிய அதிகாரிகள் நேரில் ஆய்வு செய்து குடிநீர் விநியோகத்தை சீரமைக்க கோருகிறோம்.\"\n\nபுகார் சமர்ப்பிக்க Top Navigation Bar-ல் உள்ள **'Register Complaint'** பொத்தானைக் கிளிக் செய்யவும்!",
      };
    }

    return {
      success: true,
      reply: `Hello! I am your MyComplaintPortal AI Assistant. You can ask me how to register a complaint, check status, reset passwords, or contact support!`,
    };
  }

  try {
    const data = await fetchGroqChatCompletion(apiKey, {
      messages: formattedMessages,
      temperature: 0.2,
      max_tokens: 600,
    });

    const rawReply = data.choices?.[0]?.message?.content || "";
    
    // Comprehensive cleaner for scratchpad reasoning logs & meta thoughts
    let cleanedReply = rawReply
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<\/?think>/gi, '')
      .replace(/^(The user is asking|Here's a thinking process|Let's analyze|This translates to|My instructions state|Identify Constraints)[\s\S]*?\n\n/gi, '')
      .trim();

    if (!cleanedReply) {
      cleanedReply = rawReply.replace(/<\/?think>/gi, '').trim();
    }

    return {
      success: true,
      reply: cleanedReply || "How can I assist you with MyComplaintPortal today?",
    };
  } catch (error) {
    console.warn('Groq Chatbot API fallback:', error);
    
    if (lowerMsg.includes('forgot') || lowerMsg.includes('reset') || lowerMsg.includes('password')) {
      return {
        success: true,
        reply: "To reset your password via Forgot Password ('/forgot-password'):\n1. Click 'Forgot Password?' on the Login screen.\n2. Enter your registered Email and click 'Send OTP'.\n3. Enter the 6-digit OTP received on your email and click 'Verify OTP'.\n4. Once verified, enter your New Password and click 'Reset Password'.",
      };
    }

    if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('admin') || lowerMsg.includes('contact')) {
      return {
        success: true,
        reply: "For account help and support, please contact the Portal Administrator via email on the About Us page ('/about') at jaisurya7482@gmail.com.",
      };
    }

    return {
      success: true,
      reply: "To register a complaint, click the **'Register Complaint'** button in the Top Navigation Bar or navigate to '/complaints/new'!",
    };
  }
};

// CLIENT-SIDE IMAGE FEATURE & VISUAL CONTENT ANALYZER
export const analyzeImageFeatures = (dataUrl) => {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
      return resolve({
        isGraphicOrIcon: false,
        dominantColor: 'natural',
        detectedVisualType: 'Civic photo evidence',
        visualDetails: 'Photograph with natural outdoor lighting',
      });
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 64; // downsample to 64x64 for instant pixel analysis
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({ detectedVisualType: 'Uploaded photo', visualDetails: 'Photo evidence' });
        }
        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size).data;

        let rTotal = 0, gTotal = 0, bTotal = 0;
        let brightnessTotal = 0;
        let darkPixels = 0;
        let brightPixels = 0;
        const totalPixels = size * size;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          rTotal += r;
          gTotal += g;
          bTotal += b;
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          brightnessTotal += brightness;

          if (brightness < 30) darkPixels++;
          if (brightness > 240) brightPixels++;
        }

        const avgR = Math.round(rTotal / totalPixels);
        const avgG = Math.round(gTotal / totalPixels);
        const avgB = Math.round(bTotal / totalPixels);
        const avgBrightness = Math.round(brightnessTotal / totalPixels);
        const darkRatio = darkPixels / totalPixels;
        const brightRatio = brightPixels / totalPixels;

        const isDarkIcon = darkRatio > 0.40 || avgBrightness < 45;
        const isWhiteDoc = brightRatio > 0.55 || avgBrightness > 230;

        let detectedVisualType = 'Real-world civic photograph';
        let visualDetails = `Natural photo (Avg RGB: ${avgR},${avgG},${avgB})`;

        if (isDarkIcon) {
          detectedVisualType = 'Dark digital icon / computer graphic / logo';
          visualDetails = 'Dark digital illustration or app logo with solid non-photographic background';
        } else if (isWhiteDoc) {
          detectedVisualType = 'White digital graphic / document / screenshot';
          visualDetails = 'Flat white graphic or non-civic document';
        } else if (avgB > avgR + 30 && avgB > avgG + 20) {
          detectedVisualType = 'Water body / water leakage / blue surface';
          visualDetails = 'Blue-dominant scene (water pipe / water pool)';
        } else if (avgG > avgR + 25 && avgG > avgB + 20) {
          detectedVisualType = 'Park / foliage / greenery';
          visualDetails = 'Green vegetation or park environment';
        } else if (Math.abs(avgR - avgG) < 18 && Math.abs(avgG - avgB) < 18 && avgBrightness > 50 && avgBrightness < 165) {
          detectedVisualType = 'Road surface / asphalt / pothole / concrete';
          visualDetails = 'Grey asphalt surface or road pavement';
        }

        resolve({
          isGraphicOrIcon: isDarkIcon || isWhiteDoc,
          avgBrightness,
          darkRatio,
          brightRatio,
          detectedVisualType,
          visualDetails,
        });
      } catch (e) {
        resolve({ detectedVisualType: 'Uploaded image', visualDetails: 'Photo evidence' });
      }
    };
    img.onerror = () => {
      resolve({ detectedVisualType: 'Uploaded image', visualDetails: 'Photo evidence' });
    };
    img.src = dataUrl;
  });
};

/**
 * 2. GROQ AI VISION & IMAGE-DESCRIPTION MATCHING ENGINE
 * Evaluates uploaded photo evidence using Groq Multimodal Vision models (Qwen 3.8 / Llama Vision / OpenAI models).
 * Accurately reads text, identifies student ID cards, certificates, objects, documents, and real-world civic scenes.
 */
export const verifyImageMatchesDescription = async (
  description,
  imagesList = [],
  departmentName = '',
  pincode = '',
  address = ''
) => {
  if (!imagesList || imagesList.length === 0) {
    return {
      isMatching: false,
      hasWarning: true,
      imageContentDescription: 'No photo evidence provided',
      mismatchReason: 'Photo evidence is compulsory. Please upload at least 1 photo of the civic grievance.',
      confidenceScore: 1.0,
    };
  }

  const rawImage = imagesList[0];
  const apiKey = getGroqApiKey();

  // 1. Optimize / compress image for fast, reliable vision API transmission
  let compressedImage = rawImage;
  try {
    compressedImage = await compressImageForVision(rawImage, 800, 0.75);
  } catch (e) {
    compressedImage = rawImage;
  }

  // 2. PRIMARY MULTIMODAL VISION AI INSPECTION
  if (apiKey && apiKey.startsWith('gsk_')) {
    try {
      const promptText = `You are an expert municipal AI grievance inspector for a civic grievance portal.
A citizen is submitting a complaint with:
- Problem Description: "${description}"
- Selected Department: "${departmentName || 'Civic Services'}"
- Location: "${address || 'Coimbatore'}", Pincode: "${pincode || '641004'}"

Carefully inspect the uploaded image evidence:
1. ACCURATE RECOGNITION: Determine EXACTLY what is shown in the image (e.g., leaking water pipe, road pothole, uncollected garbage, electric wire, student ID card, selfie, screenshot, etc.).
2. DESCRIPTION-IMAGE MATCH: Evaluate ONLY whether the image depicts or relates to the citizen's text description ("${description}").
   - If the image depicts what is written in the description (e.g. description is about water leakage and image shows water leak/tap/pipe), set "isMatching": true.
   - If the image depicts something completely unrelated to the description (e.g. student ID card, selfie, meme, or electric wire when description is water), set "isMatching": false.
3. CORRECT DEPARTMENT CLASSIFICATION: Determine the exact municipal department this civic issue belongs to from this list:
   - "Water Supply & Sewerage" (dept-water): pipe bursts, water leaks, tap broken, low pressure, dirty water, open drains, sewer overflow.
   - "Roads & Transport" (dept-pwd): potholes, broken roads, tar peeling, footpaths, manhole covers.
   - "Electricity & Street Lighting" (dept-elec): power cuts, electric poles, transformers, loose wires, dark street lights.
   - "Sanitation & Waste Management" (dept-sanitation): uncollected garbage, overflowing bins, foul odor.
   - "Public Health & Hospitals" (dept-health): mosquito fogging, hospital hygiene, medical waste, stray dogs.
   - "Parks & Recreation" (dept-parks): broken park benches, overgrown trees, garden maintenance.
   - "Town Planning & Building Permits" (dept-building): illegal construction, encroachments.
   - "Other Department" (dept-other): general issues.

4. If "isMatching" is false, formulate "mismatchReason" in this exact format:
   "Your description is '${description}', but you uploaded [exact description of what is in the image]. Please upload valid photo evidence showing the described problem."

Respond ONLY with a valid JSON object in this format (no extra text or markdown):
{
  "isMatching": boolean,
  "imageContentDescription": "Accurate description of what is in the image",
  "detectedDepartment": "Exact Department Name",
  "detectedDeptId": "dept-water" | "dept-pwd" | "dept-elec" | "dept-sanitation" | "dept-health" | "dept-parks" | "dept-building" | "dept-other",
  "mismatchReason": string or null,
  "confidenceScore": number
}`;

      const visionData = await fetchGroqVisionCompletion(apiKey, {
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'image_url', image_url: { url: compressedImage } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 350,
      });

      if (visionData && visionData.choices && visionData.choices[0]) {
        let rawContent = visionData.choices[0].message?.content || '{}';
        rawContent = rawContent
          .replace(/<think>[\s\S]*?<\/think>/gi, '')
          .replace(/<\/?think>/gi, '')
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim();

        const firstBrace = rawContent.indexOf('{');
        const lastBrace = rawContent.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          rawContent = rawContent.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(rawContent);
        const isMatching = parsed.isMatching !== false;

        return {
          isMatching,
          hasWarning: !isMatching,
          imageContentDescription: parsed.imageContentDescription || 'Uploaded photo evidence',
          detectedDepartment: parsed.detectedDepartment || null,
          detectedDeptId: parsed.detectedDeptId || null,
          mismatchReason: isMatching
            ? null
            : (parsed.mismatchReason || `Your description is "${description}", but your uploaded image does not match this civic issue.`),
          confidenceScore: parsed.confidenceScore || 0.95,
          mode: 'GROQ_VISION_AI',
        };
      }
    } catch (visionErr) {
      console.warn('Groq Vision AI error, falling back to visual feature inspection:', visionErr);
    }
  }

  // 3. FALLBACK: Pixel-level visual content classification
  const visualAnalysis = await analyzeImageFeatures(rawImage);

  if (visualAnalysis.isGraphicOrIcon) {
    return {
      isMatching: false,
      hasWarning: true,
      imageContentDescription: visualAnalysis.detectedVisualType,
      mismatchReason: `Your description is "${description}" (${departmentName}), but you uploaded a ${visualAnalysis.detectedVisualType} instead of a photo of the ${departmentName} problem. Please upload a real photograph showing the actual civic issue.`,
      confidenceScore: 0.98,
      mode: 'VISUAL_PIXEL_AI_INSPECTION',
    };
  }

  return {
    isMatching: true,
    hasWarning: false,
    imageContentDescription: visualAnalysis.detectedVisualType,
    mismatchReason: null,
    confidenceScore: 0.90,
    mode: 'RULE_ENGINE_FALLBACK',
  };
};

/**
 * 3. MULTI-MODAL PRIORITY VERIFICATION ENGINE
 */
export const verifyComplaintConsistency = async (
  description,
  departmentName,
  selectedDeptId,
  imagesList = [],
  videoName = null,
  pincode = '',
  address = '',
  departmentsList = [],
  imageMongoIds = []
) => {
  const apiKey = getGroqApiKey();
  
  // 1. Evaluate Rule AI matching baseline for Priority 1 (Description)
  const ruleMatch = matchDepartmentRules(description, departmentsList);
  
  let targetDeptId = ruleMatch?.deptId || '';
  let targetDeptName = ruleMatch?.deptName || '';

  // Rule D: If no standard department fits description -> Route to "Other Department"
  if (!targetDeptId) {
    const otherDept = departmentsList.find(d => 
      d.id === 'dept-other' || 
      d.name?.toLowerCase().includes('other') || 
      d.name?.toLowerCase().includes('general')
    );
    targetDeptId = otherDept?.id || 'dept-other';
    targetDeptName = otherDept?.name || 'Other Department';
  }

  const isDeptMatch = isSameDept(selectedDeptId, departmentName, targetDeptId, targetDeptName);

  // 2. CONVERT IMAGE ID TO STREAM URL / PLACEHOLDER FOR GROQ INSPECTION
  let imageUrlForGroq = null;
  if (imagesList && imagesList.length > 0) {
    const firstImg = imagesList[0];
    if (typeof firstImg === 'string') {
      if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) {
        imageUrlForGroq = firstImg;
      } else if (firstImg.startsWith('data:')) {
        imageUrlForGroq = `[Photo evidence attached (${imagesList.length} photo(s))]`;
      } else {
        imageUrlForGroq = `http://localhost:9999/api/images/${firstImg}`;
      }
    }
  } else if (imageMongoIds && imageMongoIds.length > 0) {
    imageUrlForGroq = `http://localhost:9999/api/images/${imageMongoIds[0]}`;
  }

  // 3. CHECK API KEY BEFORE NETWORK CALL TO PREVENT CONSOLE ERRORS
  if (apiKey && apiKey.startsWith('gsk_')) {
    try {
      const promptText = `
Perform Multi-Modal Municipal Inspection on this grievance submission:
- Description: "${description}"
- Selected Department: "${departmentName}" (ID: ${selectedDeptId})
- Location: "${address}", Pincode: "${pincode}"
- Uploaded Image URL: "${imageUrlForGroq || 'None'}"

Evaluate if Description, Photo Evidence, and Selected Department align:
- Rule A (ALL_THREE_MISMATCHED): Description, Evidence, and Selected Department all conflict.
- Rule B (DESC_IMAGE_MISMATCH): Description text conflicts with Photo evidence.
- Rule C (DEPT_MISMATCH): Description & Photo match each other, but user selected wrong Department.
- Rule D (NO_MATCH_OTHER): Target "Other Department" (ID: dept-other).
- Rule E (PERFECT_MATCH): All details match.

Respond STRICTLY in JSON format:
{
  "ruleApplied": "ALL_THREE_MISMATCHED" | "DESC_IMAGE_MISMATCH" | "DEPT_MISMATCH" | "NO_MATCH_OTHER" | "PERFECT_MATCH",
  "isConsistent": true/false,
  "explanation": "Human readable user message explaining discrepancy",
  "recommendedDepartment": "Exact Correct Department Name",
  "recommendedDeptId": "Exact Department ID"
}
`;

      const data = await fetchGroqChatCompletion(apiKey, {
        messages: [
          { role: 'system', content: 'You are a precise municipal AI inspector. Respond strictly in JSON.' },
          { role: 'user', content: promptText }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      if (data && data.choices && data.choices[0]) {
        const resJson = JSON.parse(data.choices[0].message?.content || '{}');
        const ruleApplied = resJson.ruleApplied || (isDeptMatch ? 'PERFECT_MATCH' : 'DEPT_MISMATCH');

        if (ruleApplied === 'ALL_THREE_MISMATCHED') {
          return {
            isConsistent: false,
            hasWarning: true,
            mismatchType: 'ALL_THREE_MISMATCHED',
            explanation: resJson.explanation || `🔴 All Details Mismatched: Your Description ("${description}"), Photo Evidence, and Selected Department ("${departmentName}") all conflict with each other! Please re-rectify your complaint entries.`,
            recommendedDepartment: resJson.recommendedDepartment || targetDeptName,
            recommendedDeptId: resJson.recommendedDeptId || targetDeptId,
          };
        }

        if (ruleApplied === 'DESC_IMAGE_MISMATCH') {
          return {
            isConsistent: false,
            hasWarning: true,
            mismatchType: 'DESC_IMAGE_MISMATCH',
            explanation: resJson.explanation || `⚠️ Description & Image Mismatch: Your description and photo evidence describe different problems. Please verify your photo evidence or complaint description.`,
            recommendedDepartment: targetDeptName || departmentName,
            recommendedDeptId: targetDeptId || selectedDeptId,
          };
        }

        if (!isDeptMatch && ruleApplied === 'DEPT_MISMATCH') {
          const recId = resJson.recommendedDeptId || targetDeptId;
          const recName = resJson.recommendedDepartment || targetDeptName;
          if (!isSameDept(selectedDeptId, departmentName, recId, recName)) {
            return {
              isConsistent: false,
              hasWarning: true,
              mismatchType: 'DEPARTMENT_MISMATCH',
              explanation: resJson.explanation || `Your complaint description "${description}" describes a ${recName} problem, but you selected ${departmentName}.`,
              recommendedDepartment: recName || 'Water Supply & Sewerage',
              recommendedDeptId: recId || 'dept-water',
            };
          }
        }

        if (ruleApplied === 'NO_MATCH_OTHER') {
          return {
            isConsistent: true,
            hasWarning: false,
            recommendedDepartment: 'Other Department',
            recommendedDeptId: 'dept-other',
          };
        }

        return { isConsistent: true, hasWarning: false, recommendedDepartment: targetDeptName, recommendedDeptId: targetDeptId };
      }
    } catch (e) {
      // Local fallback
    }
  }

  // 4. ERROR-FREE LOCAL MULTI-MODAL FALLBACK
  if (!isDeptMatch) {
    return {
      isConsistent: false,
      hasWarning: true,
      mismatchType: 'DEPARTMENT_MISMATCH',
      explanation: `Your complaint description "${description}" describes a ${targetDeptName} problem, but you selected ${departmentName}.`,
      recommendedDepartment: targetDeptName || 'Water Supply & Sewerage',
      recommendedDeptId: targetDeptId || 'dept-water',
    };
  }

  return { isConsistent: true, hasWarning: false, recommendedDepartment: targetDeptName, recommendedDeptId: targetDeptId };
};

/**
 * 3. REAL-TIME OFFICIAL INDIAN POSTAL PIN CODE & GEOGRAPHIC ADDRESS VERIFICATION
 * Uses official Indian Postal API (api.postalpincode.in / AIPincodes) to fetch live post office,
 * city, district, and state details for any 6-digit Indian PIN code.
 * If mismatched, accurately describes the entered PIN location and recommends the exact PIN for the entered address.
 */
export const verifyPincodeAddress = async (address, pincode) => {
  const cleanPin = (pincode || '').trim();
  if (!cleanPin || cleanPin.length !== 6 || isNaN(cleanPin)) {
    return {
      isValid: false,
      reason: 'Please enter a valid 6-digit Indian PIN code (e.g. 641004).',
      exactAreaDetected: null,
      recommendedPincode: null,
      recommendedArea: null,
    };
  }

  // 1. LIVE INDIAN POSTAL API LOOKUP FOR ENTERED PIN CODE
  let pinLocation = null;
  let pinDistrict = null;
  let pinState = null;
  let allOfficeNames = [];

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && Array.isArray(data[0].PostOffice) && data[0].PostOffice.length > 0) {
        const poList = data[0].PostOffice;
        const primary = poList[0];
        pinDistrict = primary.District || '';
        pinState = primary.State || 'India';
        allOfficeNames = poList.map((p) => p.Name || '').filter(Boolean);
        pinLocation = `${primary.Name}, ${pinDistrict ? pinDistrict + ' District, ' : ''}${pinState}`;
      } else {
        return {
          isValid: false,
          reason: `PIN code ${cleanPin} is not found in the official Indian Postal registry. Please check your 6-digit PIN.`,
          exactAreaDetected: 'Unregistered / Invalid PIN Code',
          recommendedPincode: null,
          recommendedArea: null,
        };
      }
    }
  } catch (err) {
    console.warn('Live postal PIN lookup error:', err);
  }

  // 2. LIVE LOOKUP FOR RECOMMENDED PIN FOR THE USER'S ADDRESS
  let recommendedPincode = null;
  let recommendedArea = null;

  const addressTokens = (address || '')
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && isNaN(w));

  for (const token of addressTokens) {
    try {
      const res = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(token)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && Array.isArray(data[0].PostOffice) && data[0].PostOffice.length > 0) {
          const po = data[0].PostOffice[0];
          recommendedPincode = po.Pincode;
          recommendedArea = `${po.Name}, ${po.District} District, ${po.State}`;
          break;
        }
      }
    } catch (e) {
      // Continue searching next token
    }
  }

  // 3. GEOGRAPHIC MATCHING EVALUATION
  const addrLower = (address || '').toLowerCase();
  const districtMatch = pinDistrict && addrLower.includes(pinDistrict.toLowerCase());
  const officeMatch = allOfficeNames.some((name) => name && addrLower.includes(name.toLowerCase()));
  const isDirectMatch = Boolean(districtMatch || officeMatch);

  // If already a direct match, everything is valid
  if (isDirectMatch) {
    return {
      isValid: true,
      exactAreaDetected: pinLocation,
      recommendedPincode: cleanPin,
      recommendedArea: pinLocation,
      reason: `PIN ${cleanPin} accurately corresponds to ${pinLocation}.`,
    };
  }

  // 4. IF MISMATCHED: FORMAT ACCURATE EXPLANATION WITH LOCATION AND RECOMMENDED PIN
  let mismatchExplanation = `The entered PIN code ${cleanPin} belongs to ${pinLocation || 'a different location'}.`;
  if (recommendedPincode && recommendedPincode !== cleanPin) {
    mismatchExplanation += ` For your address "${address}", the recommended correct PIN code is ${recommendedPincode} (${recommendedArea}).`;
  } else {
    mismatchExplanation += ` Your address "${address}" does not geographically match ${pinLocation || 'this postal region'}.`;
  }

  return {
    isValid: false,
    exactAreaDetected: pinLocation,
    recommendedPincode: recommendedPincode && recommendedPincode !== cleanPin ? recommendedPincode : null,
    recommendedArea: recommendedArea,
    reason: mismatchExplanation,
  };
};
