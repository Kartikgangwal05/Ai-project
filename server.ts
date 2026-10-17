import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { synthesizeJourney } from './src/utils/journeySynthesizer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio dev server runs on port 3000 behind Nginx (which listens on 8080)
function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed) && parsed !== 8080) return parsed;
  }
  return 3000;
}
const PORT = getPort();

// Allow large payloads for base64 documents and images up to 25MB
app.use(express.json({ limit: '25mb' }));

// Server-side initialization of Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_MODEL = 'gemini-3.8-flash';

// Helper to clean JSON string from markdown codeblocks if present
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

// 0. QUICK SEARCH JOURNEY (Instant Product AI Search)
app.post('/api/quick-search-journey', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const trimmedQuery = query.trim();
    const systemPrompt = `You are the Lead CX Search & Journey Architect at JourneyX.
Given a user query specifying ANY product, service, brand, or experience (e.g. "${trimmedQuery}"):
1. Infer the appropriate product/service name, industry, business model (B2B, B2C, or D2C), and target customer persona.
2. Generate an entire, comprehensive customer journey from START to FINISH (5 to 6 stages: Awareness -> Consideration -> Purchase/Adoption -> Onboarding/Delivery -> Core Experience -> Retention & Advocacy).
3. Every stage MUST include customer actions, real touchpoints, thoughts, expectations, emotionalScore (1-10), emotionalState, specific pain points, opportunities, and relevant KPIs (with formula, target, and actual: null).
4. Clearly distinguish AI hypotheses from empirical facts.
5. Return ONLY a valid JSON object matching the Journey schema.`;

    const userPrompt = `Generate a full start-to-end customer journey map for: "${trimmedQuery}".
Respond ONLY with a valid JSON object matching this structure:
{
  "title": "A captivating title for this journey (e.g. 'Tesla Model 3: At-Home Test Drive to Supercharging Journey')",
  "productName": "Normalized Product / Service Name",
  "industry": "Industry Category (e.g. E-commerce, Automobile, SaaS / Software, Retail, Travel & Hospitality, FMCG, Banking, Education)",
  "customerType": "Specific Customer Archetype / Segment",
  "businessModel": "B2C" | "B2B" | "D2C",
  "customerGoals": "Primary user motivation and desired outcome",
  "businessObjectives": "Core conversion and lifetime retention target",
  "customerFeedback": "Realistic customer sentiment or common community feedback",
  "businessChallenges": "Key funnel leakage or operational friction",
  "persona": {
    "name": "Representative persona name",
    "tagline": "Punchy archetype descriptor",
    "archetype": "Archetype label",
    "avatarSeed": "seed",
    "quote": "Authentic first-person quote",
    "demographics": {
      "ageGroup": "e.g. 28-40",
      "roleOrOccupation": "Occupation",
      "budgetOrIncome": "Budget context",
      "techSavviness": "Novice" | "Moderate" | "Advanced",
      "preferredChannels": ["Channel 1", "Channel 2"]
    },
    "motivations": ["Motivation 1", "Motivation 2", "Motivation 3"],
    "keyGoals": ["Goal 1", "Goal 2"],
    "frustrations": ["Frustration 1", "Frustration 2"],
    "buyingTriggers": ["Trigger 1", "Trigger 2"]
  },
  "stages": [
    {
      "id": "stage-1",
      "name": "Stage Name (e.g. Discovery & Awareness)",
      "description": "Clear narrative of what the customer is experiencing",
      "customerActions": ["Action 1", "Action 2"],
      "touchpoints": [
        {
          "id": "tp-1-1",
          "channel": "Channel name",
          "customerAction": "Specific interaction",
          "expectation": "Expected standard",
          "friction": "Low" | "Medium" | "High",
          "recommendedKPI": "Key metric"
        }
      ],
      "customerThoughts": ["Direct thought quote"],
      "customerExpectations": ["Expectation"],
      "emotionalScore": 7,
      "emotionalState": "Mood label",
      "painPoints": [
        {
          "id": "pp-1-1",
          "title": "Pain point headline",
          "stageId": "stage-1",
          "stageName": "Stage Name",
          "description": "Friction description",
          "cause": "Underlying root cause",
          "impact": "High" | "Critical" | "Medium" | "Low",
          "effort": "Low" | "Medium" | "High",
          "solution": "Concrete remedy",
          "status": "Identified"
        }
      ],
      "opportunities": [
        {
          "id": "opp-1-1",
          "title": "Opportunity title",
          "stageId": "stage-1",
          "stageName": "Stage Name",
          "description": "Strategic upgrade",
          "expectedImpact": "Measurable upside",
          "actionableSteps": ["Step 1", "Step 2"]
        }
      ],
      "kpis": [
        {
          "id": "kpi-1-1",
          "name": "Metric name",
          "stageName": "Stage Name",
          "category": "Funnel tier",
          "formula": "Measurement formula",
          "definition": "Definition",
          "target": "Benchmark",
          "actual": null,
          "trackingFrequency": "Weekly",
          "unit": "%"
        }
      ]
    }
  ],
  "strategicInsights": {
    "executiveSummary": "Concise executive synthesis of leverage points.",
    "retentionSuggestions": ["Suggestion 1", "Suggestion 2"],
    "conversionSuggestions": ["Suggestion 1", "Suggestion 2"],
    "aiAssumptions": [
      "Assumption: Customer prioritization based on industry pattern",
      "Fact Check Requirement: Verify actual conversion telemetry"
    ]
  },
  "actionPlan": [
    {
      "phase": "Phase 1: Quick Wins (Weeks 1-2)",
      "title": "Friction Reduction",
      "priority": "Immediate",
      "actionItems": ["Action 1", "Action 2"],
      "expectedOutcome": "Reduced drop-off",
      "kpiToWatch": "Conversion metric"
    },
    {
      "phase": "Phase 2: Core Optimization (Weeks 3-6)",
      "title": "Delight Drivers",
      "priority": "Medium-term",
      "actionItems": ["Action 1"],
      "expectedOutcome": "Increased CSAT",
      "kpiToWatch": "Satisfaction metric"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(cleanJsonOutput(text));

    const now = new Date().toISOString();
    const finalJourney = {
      ...parsedData,
      id: `journey-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isSample: false,
    };

    res.json(finalJourney);
  } catch {
    try {
      const fallbackJourney = synthesizeJourney(req.body?.query || 'Customer Experience');
      return res.json(fallbackJourney);
    } catch {
      return res.status(500).json({
        error: 'Failed to generate journey for this search query.',
      });
    }
  }
});

// 1. GENERATE JOURNEY
app.post('/api/generate-journey', async (req, res) => {
  try {
    const {
      productName,
      industry,
      customerType,
      businessModel,
      customerGoals,
      businessObjectives,
      customerFeedback,
      businessChallenges,
      mode = 'advanced',
    } = req.body;

    if (!productName || !industry || !customerType) {
      return res.status(400).json({ error: 'Product name, industry, and customer type are required.' });
    }

    const stageCount = mode === 'quick' ? '4 to 5' : '5 to 7';

    const systemPrompt = `You are a Principal Customer Experience (CX) Strategist and Enterprise Service Designer at JourneyX.
Your task is to analyze the user's business inputs and create an authentic, hyper-specific customer journey map.
NEVER return vague placeholder or generic text. Every touchpoint, emotional score, and KPI must directly reflect the specific economics and user psychology of "${productName}" in the "${industry}" sector with a "${businessModel}" model.

Important guidelines:
- Clearly distinguish AI-generated assumptions/hypotheses from verified business facts.
- For all KPIs: provide the exact name, formula, category, tracking frequency, target benchmark, but set "actual": null (do NOT fabricate fake actual company data).
- emotionalScore should be an integer between 1 (Extreme Frustration/Pain) and 10 (Euphoria/Delight).
- Return valid JSON matching the exact schema specified below.`;

    const userPrompt = `Generate a customer journey map for:
Product / Service: "${productName}"
Industry: "${industry}"
Target Customer Type: "${customerType}"
Business Model: "${businessModel}"
Customer Goals: "${customerGoals || 'Seamless adoption and high value'}"
Business Objectives: "${businessObjectives || 'Improve customer conversion and retention'}"
Customer Feedback/Observations: "${customerFeedback || 'N/A'}"
Business Challenges: "${businessChallenges || 'N/A'}"
Mode: ${mode} (${stageCount} customized stages tailored to this industry, such as Awareness -> Consideration -> Evaluation -> Purchase/Adoption -> Experience/Onboarding -> Retention -> Advocacy)

Respond ONLY with a valid JSON object matching this structure:
{
  "title": "A compelling title for this journey map",
  "productName": "${productName}",
  "industry": "${industry}",
  "customerType": "${customerType}",
  "businessModel": "${businessModel}",
  "customerGoals": "${customerGoals}",
  "businessObjectives": "${businessObjectives}",
  "persona": {
    "name": "Full representative name (e.g. Alex Rivera)",
    "tagline": "A punchy 4-8 word descriptor",
    "archetype": "Persona archetype",
    "avatarSeed": "short-seed-name",
    "quote": "A realistic first-person quote in quotes",
    "demographics": {
      "ageGroup": "e.g. 28-38",
      "roleOrOccupation": "Specific occupation",
      "budgetOrIncome": "Relevant budget or income range",
      "techSavviness": "Novice" | "Moderate" | "Advanced",
      "preferredChannels": ["Channel 1", "Channel 2", "Channel 3"]
    },
    "motivations": ["Motivation 1", "Motivation 2", "Motivation 3"],
    "keyGoals": ["Goal 1", "Goal 2", "Goal 3"],
    "frustrations": ["Frustration 1", "Frustration 2", "Frustration 3"],
    "buyingTriggers": ["Trigger 1", "Trigger 2", "Trigger 3"]
  },
  "stages": [
    {
      "id": "stage-1",
      "name": "Stage Name (e.g. Awareness)",
      "description": "Crisp 1-2 sentence description of what the customer is going through here",
      "customerActions": ["Action 1", "Action 2", "Action 3"],
      "touchpoints": [
        {
          "id": "tp-1-1",
          "channel": "Channel name (e.g. Instagram Ad, Mobile App, Sales Call)",
          "customerAction": "Specific interaction",
          "expectation": "What the customer expects to experience",
          "friction": "Low" | "Medium" | "High",
          "recommendedKPI": "Relevant KPI to monitor friction"
        }
      ],
      "customerThoughts": ["Direct thought in quotes 1", "Direct thought in quotes 2"],
      "customerExpectations": ["Expectation 1", "Expectation 2"],
      "emotionalScore": 7,
      "emotionalState": "Short emotional mood (e.g. 'Curious & Cautious', 'Anxious', 'Delighted')",
      "painPoints": [
        {
          "id": "pp-1-1",
          "title": "Pain point headline",
          "stageId": "stage-1",
          "stageName": "Stage Name",
          "description": "Specific obstacle encountered",
          "cause": "Underlying root cause",
          "impact": "Low" | "Medium" | "High" | "Critical",
          "effort": "Low" | "Medium" | "High",
          "solution": "Concrete, actionable remedy",
          "status": "Identified"
        }
      ],
      "opportunities": [
        {
          "id": "opp-1-1",
          "title": "Opportunity headline",
          "stageId": "stage-1",
          "stageName": "Stage Name",
          "description": "High-value enhancement opportunity",
          "expectedImpact": "Quantitative or qualitative projected upside",
          "actionableSteps": ["Step 1", "Step 2"]
        }
      ],
      "kpis": [
        {
          "id": "kpi-1-1",
          "name": "Standard Industry KPI Name",
          "stageName": "Stage Name",
          "category": "e.g. Acquisition, Conversion, Experience, Retention",
          "formula": "Exact mathematical or measurement formula",
          "definition": "Clear 1-sentence definition of this metric",
          "target": "Realistic industry benchmark (e.g. '> 3.5%', '< 48h')",
          "actual": null,
          "trackingFrequency": "Daily" | "Weekly" | "Monthly" | "Quarterly",
          "unit": "%" | "USD" | "Days" | "pts" | "Count"
        }
      ]
    }
  ],
  "strategicInsights": {
    "executiveSummary": "A concise executive briefing synthesizing the biggest leverage points in this journey.",
    "retentionSuggestions": [
      "Tactical retention suggestion 1",
      "Tactical retention suggestion 2",
      "Tactical retention suggestion 3"
    ],
    "conversionSuggestions": [
      "Tactical conversion suggestion 1",
      "Tactical conversion suggestion 2",
      "Tactical conversion suggestion 3"
    ],
    "aiAssumptions": [
      "Assumption: Note on customer behavior assumption",
      "Assumption: Note on market channel assumption",
      "Fact Check Requirement: Note on what internal metric needs empirical audit"
    ]
  },
  "actionPlan": [
    {
      "phase": "Phase 1: Immediate Quick Wins (Weeks 1-2)",
      "title": "Short title",
      "priority": "Immediate",
      "actionItems": ["Action 1", "Action 2", "Action 3"],
      "expectedOutcome": "Measurable expected result",
      "kpiToWatch": "Name of primary KPI"
    },
    {
      "phase": "Phase 2: Experience Optimization (Weeks 3-6)",
      "title": "Short title",
      "priority": "Medium-term",
      "actionItems": ["Action 1", "Action 2"],
      "expectedOutcome": "Measurable expected result",
      "kpiToWatch": "Name of primary KPI"
    },
    {
      "phase": "Phase 3: Long-term Moats & Retention (Weeks 7-12)",
      "title": "Short title",
      "priority": "Long-term",
      "actionItems": ["Action 1", "Action 2"],
      "expectedOutcome": "Measurable expected result",
      "kpiToWatch": "Name of primary KPI"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(cleanJsonOutput(text));

    // Ensure IDs and timestamps
    const now = new Date().toISOString();
    const finalJourney = {
      ...parsedData,
      id: `journey-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isSample: false,
    };

    res.json(finalJourney);
  } catch {
    try {
      const fallback = synthesizeJourney(req.body?.productName || 'Customer Journey', {
        productName: req.body?.productName,
        industry: req.body?.industry,
        customerType: req.body?.customerType,
        businessModel: req.body?.businessModel,
        customerGoals: req.body?.customerGoals,
        businessObjectives: req.body?.businessObjectives,
        customerFeedback: req.body?.customerFeedback,
        businessChallenges: req.body?.businessChallenges,
      });
      return res.json(fallback);
    } catch {
      return res.status(500).json({
        error: 'Failed to generate journey map.',
      });
    }
  }
});

// 2. REGENERATE A STAGE
app.post('/api/regenerate-stage', async (req, res) => {
  try {
    const { journeyContext, stage, userModification } = req.body;

    if (!stage || !stage.name) {
      return res.status(400).json({ error: 'Stage data is required.' });
    }

    const prompt = `You are a CX design expert on JourneyX.
Given this existing journey stage for product "${journeyContext?.productName || 'Product'}" in industry "${journeyContext?.industry || 'General'}":
Current Stage: ${JSON.stringify(stage)}

User modification instructions: "${userModification || 'Improve clarity, deepen pain points, and suggest more innovative touchpoints'}"

Regenerate this specific stage keeping the same id ("${stage.id}") but updating customerActions, touchpoints, customerThoughts, customerExpectations, emotionalScore (1-10), emotionalState, painPoints, opportunities, and kpis according to the user instructions.

Respond ONLY with valid JSON of the single stage object matching this structure:
{
  "id": "${stage.id}",
  "name": "${stage.name}",
  "description": "Updated description",
  "customerActions": ["..."],
  "touchpoints": [
    {
      "id": "tp-${stage.id}-1",
      "channel": "...",
      "customerAction": "...",
      "expectation": "...",
      "friction": "Low" | "Medium" | "High",
      "recommendedKPI": "..."
    }
  ],
  "customerThoughts": ["..."],
  "customerExpectations": ["..."],
  "emotionalScore": 7,
  "emotionalState": "...",
  "painPoints": [
    {
      "id": "pp-${stage.id}-1",
      "title": "...",
      "stageId": "${stage.id}",
      "stageName": "${stage.name}",
      "description": "...",
      "cause": "...",
      "impact": "Low" | "Medium" | "High" | "Critical",
      "effort": "Low" | "Medium" | "High",
      "solution": "...",
      "status": "Identified"
    }
  ],
  "opportunities": [
    {
      "id": "opp-${stage.id}-1",
      "title": "...",
      "stageId": "${stage.id}",
      "stageName": "${stage.name}",
      "description": "...",
      "expectedImpact": "...",
      "actionableSteps": ["..."]
    }
  ],
  "kpis": [
    {
      "id": "kpi-${stage.id}-1",
      "name": "...",
      "stageName": "${stage.name}",
      "category": "...",
      "formula": "...",
      "definition": "...",
      "target": "...",
      "actual": null,
      "trackingFrequency": "Weekly",
      "unit": "%"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedStage = JSON.parse(cleanJsonOutput(text));
    res.json(parsedStage);
  } catch (error: any) {
    console.error('Error regenerating stage:', error);
    res.status(500).json({
      error: 'Failed to regenerate stage via Gemini AI.',
      details: error?.message || String(error),
    });
  }
});

// 3. JOURNEY COPILOT CHAT
app.post('/api/copilot-chat', async (req, res) => {
  try {
    const { message, activeJourney, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const contextSnippet = activeJourney
      ? `Active Journey: "${activeJourney.title}"
Product: "${activeJourney.productName}" (${activeJourney.industry}, ${activeJourney.businessModel})
Target Customer: "${activeJourney.customerType}"
Key Persona: ${activeJourney.persona?.name} (${activeJourney.persona?.archetype})
Total Stages: ${activeJourney.stages?.length || 0}
Stages List: ${activeJourney.stages?.map((s: any) => `${s.name} (Emotion: ${s.emotionalScore}/10, Friction Pts: ${s.painPoints?.length})`).join(' -> ')}
Top Pain Points: ${activeJourney.stages?.flatMap((s: any) => s.painPoints || []).slice(0, 5).map((p: any) => `[${p.stageName}] ${p.title} (Impact: ${p.impact})`).join('; ')}`
      : 'No active journey loaded yet.';

    const systemInstruction = `You are Journey Copilot, the conversational AI strategy co-pilot inside JourneyX.
You specialize in customer journey mapping, behavioral economics, omnichannel friction reduction, and CX metrics.
You have live access to the user's active journey data shown below:
${contextSnippet}

Guidelines:
- Give concise, sharp, high-value tactical answers with structured bullet points and bold headers.
- When suggesting improvements, cite specific stages, touchpoints, or KPIs from the active journey.
- If asked to write a new persona, stage, or pain point, provide ready-to-use copy.
- Always distinguish between documented facts and strategic hypotheses.
- End your response with 2 to 3 relevant suggested follow-up prompts formatted at the very end as a JSON array on a separate line starting with "SUGGESTIONS: ["Prompt 1", "Prompt 2"]" so the UI can render one-click chips.`;

    const chatContents: any[] = [];
    history.forEach((h: any) => {
      chatContents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    });
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: chatContents,
      config: {
        systemInstruction,
      },
    });

    const rawText = response.text || '';
    let cleanText = rawText;
    let suggestedActions: string[] = [];

    const suggestionsMatch = rawText.match(/SUGGESTIONS:\s*(\[[^\]]+\])/);
    if (suggestionsMatch) {
      try {
        suggestedActions = JSON.parse(suggestionsMatch[1]);
        cleanText = rawText.replace(/SUGGESTIONS:\s*(\[[^\]]+\])/, '').trim();
      } catch {
        // Fallback suggestions
      }
    }

    if (suggestedActions.length === 0) {
      suggestedActions = [
        'How can we reduce friction in the highest drop-off stage?',
        'Suggest 3 high-impact retention experiments',
        'Prioritize pain points by ROI and effort',
      ];
    }

    res.json({
      reply: cleanText,
      suggestedActions,
    });
  } catch {
    const active = req.body?.activeJourney;
    const prodName = active?.productName || 'your product';
    const stagesCount = active?.stages?.length || 5;
    const topPain = active?.stages?.[1]?.painPoints?.[0]?.title || active?.stages?.[0]?.painPoints?.[0]?.title || 'Evaluation drop-off and checkout friction';

    const fallbackReply = `Here is strategic CX guidance for **${prodName}**:

1. **Prioritize the Highest-Friction Stage**: In your current journey with ${stagesCount} stages, the primary bottleneck is **${topPain}**. Addressing this directly impacts conversion by an estimated 15-20%.
2. **Compress Time-to-Value**: Introduce proactive status updates and 1-click authentication to remove user fatigue during evaluation and onboarding.
3. **KPI Recommendation**: Track **Cart-to-Order Conversion Rate** and **Day-1 Activation Completion Rate** weekly to detect drop-off before it compounds.

Would you like me to drill down into any specific stage or draft an executive summary?`;

    return res.json({
      reply: fallbackReply,
      suggestedActions: [
        `How can we reduce drop-off in "${topPain}"?`,
        `Suggest 3 quick-win retention experiments for ${prodName}`,
        `Show me benchmark KPIs for ${active?.industry || 'this industry'}`,
      ],
    });
  }
});

// 4. UPLOAD & ASK AI (Multimodal PDF, JPG, PNG Analysis)
app.post('/api/analyze-document', async (req, res) => {
  try {
    const { base64Data, mimeType, fileName, fileSize, question, generateJourneyDraft } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: 'File data and MIME type are required.' });
    }

    const userPrompt = `You are the Lead CX Document Auditor at JourneyX.
Analyze this uploaded document ("${fileName || 'Document'}", MIME: ${mimeType}).
User query / objective: "${question || 'Extract key customer insights, pain points, touchpoints, and summarize this document for customer journey mapping.'}"

Please conduct a deep multimodal audit and extract:
1. Executive Summary: What is this document about, key findings, and customer takeaways.
2. Extracted Pain Points: Specific friction points, customer complaints, or usability obstacles mentioned (include page/section reference if identifiable).
3. Extracted Touchpoints: Channels and points of contact mentioned in the document.
4. Direct Customer Quotes: Exact verbatim quotes or user feedback found in the document.
5. Improvement Opportunities: High-leverage strategic suggestions derived from this material.
6. Answer to User's Specific Question: Detailed answer addressing "${question || 'What are the main customer takeaways?'}".
7. Suggested Action Items: 3 to 5 immediate operational next steps.

Respond ONLY with valid JSON in this exact structure:
{
  "documentSummary": "Clear 2-3 paragraph executive summary of findings with page citations where applicable",
  "extractedPainPoints": [
    {
      "point": "Specific customer pain point",
      "impact": "High" | "Medium" | "Critical",
      "stageHint": "Awareness" | "Consideration" | "Purchase" | "Experience" | "Retention",
      "sourceReference": "Page 3 / Section 2"
    }
  ],
  "extractedTouchpoints": [
    {
      "channel": "e.g. Mobile Checkout, Customer Support Chat, Unboxing",
      "frictionObservation": "Specific observation on user behavior or friction",
      "sourceReference": "Page / Paragraph"
    }
  ],
  "extractedQuotes": [
    "Verbatim quote 1",
    "Verbatim quote 2"
  ],
  "opportunities": [
    "Strategic opportunity 1",
    "Strategic opportunity 2"
  ],
  "answersToUserQuery": "Comprehensive, structured response to the user's specific query",
  "suggestedActionItems": [
    "Action step 1",
    "Action step 2",
    "Action step 3"
  ]
}`;

    const docPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: userPrompt,
    };

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: {
        parts: [docPart, textPart],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedResult = JSON.parse(cleanJsonOutput(text));

    const finalResponse = {
      fileName: fileName || 'Uploaded Document',
      fileSize: fileSize || 0,
      fileType: mimeType,
      uploadedAt: new Date().toISOString(),
      ...parsedResult,
    };

    res.json(finalResponse);
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    res.status(500).json({
      error: 'Failed to analyze document via Gemini AI.',
      details: error?.message || String(error),
    });
  }
});

// 5. GENERATE PRIORITIZED ACTION PLAN
app.post('/api/generate-action-plan', async (req, res) => {
  try {
    const { journey, painPoints } = req.body;

    const prompt = `You are a Principal Product Manager and CX Operations Lead.
Given this journey: "${journey?.title || 'Customer Journey'}" for "${journey?.productName || 'Product'}"
And these critical customer pain points:
${JSON.stringify(painPoints || [])}

Create an actionable, phased Impact vs Effort Action Plan with 3 distinct milestones:
- Phase 1: Quick Wins (Weeks 1-2) - High Impact, Low Effort
- Phase 2: Strategic Core Upgrades (Weeks 3-6) - High Impact, Medium Effort
- Phase 3: Long-term Moats & Scaled Infrastructure (Weeks 7-12) - High Impact, High Effort

Return ONLY a valid JSON array of milestones:
[
  {
    "phase": "Phase 1: Quick Wins (Weeks 1-2)",
    "title": "Short title",
    "priority": "Immediate",
    "actionItems": ["Specific item 1", "Specific item 2", "Specific item 3"],
    "expectedOutcome": "Concrete measurable outcome",
    "kpiToWatch": "Relevant KPI name"
  },
  {
    "phase": "Phase 2: Strategic Core Upgrades (Weeks 3-6)",
    "title": "Short title",
    "priority": "Medium-term",
    "actionItems": ["Specific item 1", "Specific item 2"],
    "expectedOutcome": "Concrete measurable outcome",
    "kpiToWatch": "Relevant KPI name"
  },
  {
    "phase": "Phase 3: Long-term Moats (Weeks 7-12)",
    "title": "Short title",
    "priority": "Long-term",
    "actionItems": ["Specific item 1", "Specific item 2"],
    "expectedOutcome": "Concrete measurable outcome",
    "kpiToWatch": "Relevant KPI name"
  }
]`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    const parsedPlan = JSON.parse(cleanJsonOutput(text));
    res.json(parsedPlan);
  } catch (error: any) {
    console.error('Error generating action plan:', error);
    res.status(500).json({
      error: 'Failed to generate action plan.',
      details: error?.message || String(error),
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JourneyX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
