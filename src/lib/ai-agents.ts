import type { AgentId, ChatMessage, RecommendedAction } from '../types';
import { uid } from './utils';
import { TRANSLATIONS } from './mock-data';

const PROMPT_INJECTION_PATTERNS = [
  /ignore .*(instructions|rules|prompts)/i,
  /disregard (the )?above/i,
  /you are now (a |an )?/i,
  /system prompt/i,
  /reveal (your )?instructions/i,
  /act as (a |an )?/i,
  /forget (your )?(rules|instructions)/i,
  /override (your )?/i,
  /\bDAN\b/i,
  /jailbreak/i,
];

export function detectPromptInjection(input: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((p) => p.test(input));
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, 1000);
}

interface FanQuery {
  intent: string;
  response: string;
  actions?: RecommendedAction[];
  confidence: number;
}

const FAN_RESPONSES: Record<string, FanQuery> = {
  restroom: {
    intent: 'wayfinding',
    response: 'The nearest restroom is on Concourse Level 1, Section 104 — just 40 meters to your left. Accessible facilities are available with baby-changing stations. Current wait time: under 2 minutes.',
    confidence: 0.97,
  },
  food: {
    intent: 'wayfinding',
    response: 'I found 3 food options near you. Food Plaza Central (5 min walk, 18 min queue) has international cuisine. Food Court North (3 min walk, 8 min queue) has burgers and fries. I recommend pre-ordering via the app to skip the queue — pickup at Lane 3.',
    confidence: 0.95,
  },
  water: {
    intent: 'wayfinding',
    response: 'Free hydration stations are available at all concourse levels. The nearest is 20 meters ahead on your right. Please stay hydrated — current temperature is 24°C.',
    confidence: 0.98,
  },
  medical: {
    intent: 'emergency',
    response: 'I\'ve alerted Medical Station 1. A medical team is being dispatched to your location. Stay where you are if safe. Nearest medical station: Concourse L1, Section 104. Emergency: call 911 or alert any volunteer in yellow vest.',
    confidence: 0.99,
  },
  seat: {
    intent: 'wayfinding',
    response: 'Your seat is in Section 222, Row J, Seat 14 (South Stand). From your current location, head south through Concourse L1, take the escalator up, then follow signs to Section 222. Estimated walk: 6 minutes. I\'ve sent turn-by-turn directions to your phone.',
    confidence: 0.96,
  },
  exit: {
    intent: 'wayfinding',
    response: 'The fastest exit from your seat is via Gate B (South). Current exit flow is moderate — estimated 8 minutes to reach the Metro. Gate D (West) is less congested if you\'re heading to Parking South. I\'ve added the route to your app.',
    confidence: 0.94,
  },
  metro: {
    intent: 'transport',
    response: 'Metro Line 4 arrives in 3 minutes (Platform 1, currently 86% full). For a less crowded option, Metro Line 7 Express arrives in 6 minutes (Platform 2, 64% full). I recommend Line 7 for comfort. Walking directions to Platform 2 sent to your app.',
    confidence: 0.93,
  },
  parking: {
    intent: 'transport',
    response: 'Parking North is 91% full — not recommended. Parking South has 1,980 spots available (67% full). Overflow lot P7 has 2,340 spots and a free shuttle to the stadium (4 min ride). I\'ve reserved a spot at P7 for you.',
    confidence: 0.92,
  },
  wifi: {
    intent: 'info',
    response: 'Free stadium WiFi: network "FIFA2026-Free", no password required. Bandwidth: 1 Gbps shared. For streaming, premium WiFi is available at $4.99 — tap the upgrade banner in your app.',
    confidence: 0.97,
  },
  merchandise: {
    intent: 'wayfinding',
    response: 'Official FIFA merchandise stores are at: (1) Concourse L1 North — 3 min walk, (2) Concourse L2 East — 6 min walk, (3) Main Plaza outside Gate A. The North store has the largest selection. Show your digital ticket for 10% off.',
    confidence: 0.95,
  },
  accessibility: {
    intent: 'accessibility',
    response: 'Accessible routes are marked in blue on your map. Elevator E3 (South Stand) is wheelchair-accessible. Accessible seating is available in all stands. Sign language interpreters are at the main stage. For assistance, press the accessibility button in your app or approach any volunteer.',
    confidence: 0.98,
  },
  lost: {
    intent: 'emergency',
    response: 'I\'m sorry to hear that. Lost children should be escorted to Information Desk ID-1 (Concourse L1, center). Lost items are brought to the same desk. I\'ve alerted the nearest volunteer (Maria, 2 min away) to assist you. Stay calm — we\'ll help you right away.',
    confidence: 0.96,
  },
  default: {
    intent: 'general',
    response: 'I\'m your FIFA World Cup 2026 Fan Copilot. I can help with navigation, food, transport, accessibility, medical emergencies, and match info. What do you need help with? You can ask in English, Spanish, French, Arabic, Hindi, Portuguese, German, or Japanese.',
    confidence: 0.88,
  },
};

function matchIntent(input: string): keyof typeof FAN_RESPONSES {
  const lower = input.toLowerCase();
  if (/(restroom|toilet|bathroom|washroom|baño|toilettes|トイレ)/.test(lower)) return 'restroom';
  if (/(food|\beat\b|\beats\b|hungry|restaurant|comida|manger|食べ物)/.test(lower)) return 'food';
  if (/(water|drink|hydrate|agua|eau|水)/.test(lower)) return 'water';
  if (/(medical|help|emergency|doctor|ayuda|secours|医療)/.test(lower)) return 'medical';
  if (/(seat|section|row|asiento|siège|座席)/.test(lower)) return 'seat';
  if (/(exit|leave|salida|sortir|出口)/.test(lower)) return 'exit';
  if (/(metro|train|subway|tren|地下鉄)/.test(lower)) return 'metro';
  if (/(parking|car|estacionamiento|駐車)/.test(lower)) return 'parking';
  if (/(wifi|internet|red)/.test(lower)) return 'wifi';
  if (/(merch|shirt|souvenir|tienda|boutique)/.test(lower)) return 'merchandise';
  if (/(accessib|wheelchair|disability|silla|アクセシビ)/.test(lower)) return 'accessibility';
  if (/(lost|missing|perdido|失くし)/.test(lower)) return 'lost';
  return 'default';
}

export function generateFanResponse(input: string, language = 'en'): ChatMessage {
  if (detectPromptInjection(input)) {
    return {
      id: uid('msg'),
      role: 'assistant',
      content: 'I detected a potentially unsafe request. For your safety and per our AI guardrails, I cannot process this. I\'m here to help with stadium-related queries only.',
      timestamp: new Date().toISOString(),
      language,
      agent: 'fan-experience',
      confidence: 1.0,
    };
  }
  const sanitized = sanitizeInput(input);
  const intent = matchIntent(sanitized);
  const base = FAN_RESPONSES[intent];
  const content = base.response;
  let translated: string | undefined;
  if (language !== 'en') {
    const key = intent === 'restroom' ? 'where_restroom'
      : intent === 'food' ? 'where_food'
      : intent === 'medical' ? 'help_medical'
      : null;
    if (key && TRANSLATIONS[key]?.[language]) {
      translated = TRANSLATIONS[key][language];
    }
  }
  return {
    id: uid('msg'),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    language,
    agent: 'fan-experience',
    translated,
    confidence: base.confidence,
  };
}

export function generateOpsResponse(input: string): ChatMessage {
  if (detectPromptInjection(input)) {
    return {
      id: uid('msg'),
      role: 'assistant',
      content: 'Security guardrail triggered: prompt injection detected. This query has been logged to the audit trail. Access to operational commands requires validated, policy-compliant input.',
      timestamp: new Date().toISOString(),
      language: 'en',
      agent: 'operations-commander',
      confidence: 1.0,
    };
  }
  const lower = input.toLowerCase();
  let content = '';
  if (/(summary|summarize|brief|status)/.test(lower) && !/sustainab/.test(lower)) {
    content = `**Operations Summary — ${new Date().toLocaleTimeString()}

**Attendance:** 78,432 / 88,000 (89%)
**Active Incidents:** 7 (2 critical, 3 high, 2 medium)
**Crowd Density:** 64% average — North Stand critical at 88%
**AI Accuracy:** 96.8% prediction confidence

**Top 3 Priorities:**
1. North Stand congestion — mitigation plan active, 12 volunteers deployed
2. Metro Station at 86% — 6 additional trains requested
3. Unattended item at Concourse L1 — security team dispatched (ETA 90s)

**Recommended Actions:**
- Approve Gate B overflow (impact: -18% North Stand density)
- Activate mobile F&B cart CP-7 (impact: -40% Food Plaza queue)
- Pre-cool East Stand for post-match surge (impact: -12% energy peak)

All systems nominal. AI agents operating at 96.8% accuracy.`;
  } else if (/(crowd|density|congestion)/.test(lower)) {
    content = `**Crowd Intelligence Report**

**Current State:**
- North Stand: 88% (CRITICAL) — rising 2.1%/min
- South Stand: 82% (CONGESTED)
- East Stand: 74% (CONGESTED)
- West Stand: 79% (CONGESTED)
- Concourse L1: 62% (BUSY)

**30-Minute Forecast:**
- North Stand will reach 95% in 12 min without intervention
- Gate A inflow will exceed capacity in 8 min
- Food Plaza queue will grow to 24 min

**AI-Generated Mitigation Plan:**
1. Open overflow gates B2, B3 (immediate)
2. Deploy 8 stewards to North Stand (5 min)
3. Activate queue management at F&B (3 min)
4. Broadcast soft diversion via app (immediate)
5. Pre-position medical team (10 min)

**Confidence:** 94.2% | **Model:** Nexus-Crowd-v3.1`;
  } else if (/(incident|alert|emergency)/.test(lower)) {
    content = `**Active Incidents — Prioritized**

**CRITICAL (2):**
1. North Stand congestion — 88% density, rising. Mitigation active.
2. Unattended bag, Concourse L1 — security dispatched, ETA 90s.

**HIGH (3):**
3. Metro congestion forecast — 86% load, surge in 35 min.
4. Parking North full — inbound backup on access road.
5. F&B queue anomaly — 18 min wait, water inventory low.

**MEDIUM (2):**
6. Medical assistance, Section 222 — team dispatched.
7. HVAC load spike, West Stand — 18% above forecast.

**Response Performance:**
- Average response time: 3.2 min (target: 6 min) — 47% better
- Resolution rate: 94% within SLA
- AI prediction accuracy: 96.8%`;
  } else if (/(transport|metro|bus|parking)/.test(lower)) {
    content = `**Transport Intelligence**

**Metro:**
- Line 4: 86% load, next train 3 min — CONGESTED
- Line 7 Express: 64% load, next train 6 min — BUSY
- 6 additional trains requested for post-match surge

**Bus:**
- Route 88: 72% load, 5 min — BUSY
- Route 92: 45% load, 9 min — NORMAL
- Shuttle S1: 38% load, 4 min — NORMAL

**Parking:**
- North: 91% — FULL, redirect to South
- South: 67% — 1,980 spots available
- Overflow P7: 22% — 2,340 spots, free shuttle

**Exit Flow Prediction:**
- Post-match surge in 15 min
- Gate B will handle 42% of exit flow
- Estimated clearance: 38 min (vs. 62 min baseline) — 39% faster`;
  } else if (/(sustain|energy|carbon|waste|water)/.test(lower)) {
    content = `**Sustainability Report**

**Energy:** 4.2 MW (16% below target)
- HVAC: 2.1 MW (optimized)
- Lighting: 0.8 MW (LED, 40% reduction)
- AI optimization saving: 0.8 MW

**Water:** 28 kL/h (20% below target)
- Restrooms: 14 kL/h
- F&B: 8 kL/h
- Pitch: 6 kL/h

**Waste:** 3.4 t total
- Recyclable: 1.8 t (53%)
- Compostable: 1.2 t (35%)
- Landfill: 0.4 t (12%) — target 10%

**Carbon:** 142 tCO2 (21% below target)
- Scope 1: 42 tCO2
- Scope 2: 68 tCO2
- Scope 3: 32 tCO2

**AI Recommendation:** Pre-cool East Stand during low occupancy to reduce peak HVAC by 12%. Estimated savings: 0.3 MW, 8 tCO2.`;
  } else {
    content = `I'm the Operations Commander AI. I can provide real-time intelligence on:

- **Operations summary** — "give me a status brief"
- **Crowd intelligence** — "what's the crowd situation?"
- **Incident analysis** — "show me active incidents"
- **Transport status** — "transport report"
- **Sustainability metrics** — "sustainability brief"

All responses include AI confidence scores and recommended actions. What would you like to know?`;
  }
  return {
    id: uid('msg'),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    language: 'en',
    agent: 'operations-commander',
    confidence: 0.94,
  };
}

export function generateVolunteerResponse(input: string): ChatMessage {
  if (detectPromptInjection(input)) {
    return {
      id: uid('msg'),
      role: 'assistant',
      content: 'Safety guardrail: this request was flagged. Volunteer Copilot only processes task-related queries. Incident has been logged.',
      timestamp: new Date().toISOString(),
      language: 'en',
      agent: 'volunteer',
      confidence: 1.0,
    };
  }
  const lower = input.toLowerCase();
  let content = '';
  if (/(task|assignment|what should i do)/.test(lower)) {
    content = `**Your Active Task**

**Task:** Crowd flow management at Gate A
**Zone:** Gate A — North
**Priority:** HIGH
**Due:** 25 minutes

**AI-Generated Instructions:**
1. Position at Gate A entry point (Section 101 side)
2. Hold flow for 30 seconds when density exceeds 80%
3. Direct families to Gate C (28% density, faster entry)
4. Report any medical issues to Medical-1 on channel 3
5. Log crowd counts every 15 min in the app

**Context:** Gate A is at 72% density with 420 fans/min inflow. Gate C has spare capacity. Your intervention will reduce Gate A density by an estimated 18%.

**Need help?** Ask me anything — I can translate instructions into 8 languages.`;
  } else if (/(translate|language|japanese|spanish|french|arabic|hindi|portuguese|german)/.test(lower)) {
    content = `**Multilingual Support**

I can translate your instructions into 8 languages:

- **English:** "Please follow the signs to your section"
- **Spanish:** "Por favor, siga las señales a su sección"
- **French:** "Veuillez suivre les panneaux vers votre section"
- **Arabic:** "يرجى اتباع اللافتات إلى مقعدك"
- **Hindi:** "कृपया अपने अनुभाग के संकेतों का पालन करें"
- **Portuguese:** "Por favor, siga as placas para sua seção"
- **German:** "Bitte folgen Sie den Schildern zu Ihrem Abschnitt"
- **Japanese:** "案内に従ってご案内ください"

Tap any phrase to hear it spoken aloud.`;
  } else if (/(report|incident|log)/.test(lower)) {
    content = `**Incident Report — Quick Log**

I can help you file an incident report. Please provide:

1. **Type:** (medical/security/lost person/facility/other)
2. **Location:** (zone or section)
3. **Description:** (what happened)
4. **People involved:** (if any)

Or use voice: tap the microphone and describe what you see. I'll structure the report for you and route it to the right team.

**Recent reports you filed:**
- 18:42 — Water spill, Concourse L1 (resolved)
- 17:15 — Lost child, Section 104 (reunited)`;
  } else if (/(shift|summary|end of day)/.test(lower)) {
    content = `**Your Shift Summary**

**Shift:** 4:00 PM – 11:00 PM (Gate A — North)
**Hours logged:** 6h 12m

**Tasks completed:** 14
**Fans assisted:** 87
**Incidents reported:** 2 (both resolved)
**Languages used:** English, Spanish, Portuguese

**Impact:**
- Reduced Gate A queue by 22%
- Assisted 3 accessibility needs
- Reunited 1 lost child

**Performance:** Excellent — 98% positive feedback from fans.

Thank you, Maria! Your next shift is tomorrow 3:00 PM. Rest well.`;
  } else {
    content = `I'm your Volunteer Copilot. I can help with:

- **Current task** — "what should I do now?"
- **Translation** — "translate to Japanese"
- **Incident reporting** — "I need to report something"
- **Shift summary** — "end of shift summary"
- **Wayfinding** — "where is Medical Station 1?"

Stay safe, and don't hesitate to ask. I'm here 24/7.`;
  }
  return {
    id: uid('msg'),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    language: 'en',
    agent: 'volunteer',
    confidence: 0.95,
  };
}

export function generateAgentResponse(input: string, agent: AgentId, language = 'en'): ChatMessage {
  switch (agent) {
    case 'fan-experience':
      return generateFanResponse(input, language);
    case 'operations-commander':
      return generateOpsResponse(input);
    case 'volunteer':
      return generateVolunteerResponse(input);
    default:
      return generateFanResponse(input, language);
  }
}

export const QUICK_PROMPTS: Record<AgentId, string[]> = {
  'fan-experience': [
    'Where is the nearest restroom?',
    'Where can I get food?',
    'How do I get to my seat?',
    'Where is the metro station?',
    'I need medical help',
    'Where is accessible seating?',
  ],
  'operations-commander': [
    'Give me an operations summary',
    'What\'s the crowd situation?',
    'Show me active incidents',
    'Transport report',
    'Sustainability brief',
  ],
  'volunteer': [
    'What\'s my current task?',
    'Translate to Japanese',
    'I need to report an incident',
    'End of shift summary',
  ],
  'crowd-management': [],
  'security': [],
  'transport': [],
  'sustainability': [],
};
