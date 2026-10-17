export type BusinessModel = 'B2B' | 'B2C' | 'D2C';

export type FrictionLevel = 'Low' | 'Medium' | 'High';
export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type EffortLevel = 'Low' | 'Medium' | 'High';

export interface TouchpointItem {
  id: string;
  channel: string;
  customerAction: string;
  expectation: string;
  friction: FrictionLevel;
  recommendedKPI: string;
  notes?: string;
}

export interface PainPointItem {
  id: string;
  title: string;
  stageId: string;
  stageName: string;
  description: string;
  cause: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  solution: string;
  status: 'Identified' | 'In Progress' | 'Resolved';
}

export interface OpportunityItem {
  id: string;
  title: string;
  stageId: string;
  stageName: string;
  description: string;
  expectedImpact: string;
  actionableSteps: string[];
}

export interface KPIItem {
  id: string;
  name: string;
  stageName: string;
  category: string;
  formula: string;
  definition: string;
  target: string;
  actual: string | null; // null if unmeasured, no fake numbers!
  trackingFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  unit: string;
}

export interface PersonaDemographics {
  ageGroup?: string;
  roleOrOccupation?: string;
  budgetOrIncome?: string;
  techSavviness?: 'Novice' | 'Moderate' | 'Advanced';
  preferredChannels?: string[];
}

export interface CustomerPersona {
  name: string;
  tagline: string;
  archetype: string;
  avatarSeed: string;
  quote: string;
  demographics: PersonaDemographics;
  motivations: string[];
  keyGoals: string[];
  frustrations: string[];
  buyingTriggers: string[];
}

export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  customerActions: string[];
  touchpoints: TouchpointItem[];
  customerThoughts: string[];
  customerExpectations: string[];
  emotionalScore: number; // Scale: 1 (Very Negative) to 10 (Delighted)
  emotionalState: string; // e.g. "Curious & Cautious", "Frustrated", "Delighted"
  painPoints: PainPointItem[];
  opportunities: OpportunityItem[];
  kpis: KPIItem[];
}

export interface StrategicInsights {
  executiveSummary: string;
  retentionSuggestions: string[];
  conversionSuggestions: string[];
  aiAssumptions: string[]; // Clearly distinguished AI-generated assumptions vs verified facts
}

export interface ActionPlanMilestone {
  phase: string;
  title: string;
  priority: 'Immediate' | 'Medium-term' | 'Long-term';
  actionItems: string[];
  expectedOutcome: string;
  kpiToWatch: string;
}

export interface Journey {
  id: string;
  title: string;
  productName: string;
  industry: string;
  customerType: string;
  businessModel: BusinessModel;
  customerGoals: string;
  businessObjectives: string;
  customerFeedback?: string;
  businessChallenges?: string;
  createdAt: string;
  updatedAt: string;
  persona: CustomerPersona;
  stages: JourneyStage[];
  strategicInsights: StrategicInsights;
  actionPlan?: ActionPlanMilestone[];
  isSample?: boolean;
}

export interface DocumentAnalysisResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  documentSummary: string;
  extractedPainPoints: Array<{
    point: string;
    impact: string;
    stageHint: string;
    sourceReference?: string;
  }>;
  extractedTouchpoints: Array<{
    channel: string;
    frictionObservation: string;
    sourceReference?: string;
  }>;
  extractedQuotes: string[];
  opportunities: string[];
  answersToUserQuery?: string;
  suggestedActionItems: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
