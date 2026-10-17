import { Journey, JourneyStage, CustomerPersona, ActionPlanMilestone, StrategicInsights } from '../types/journey';

export interface SynthesizerOptions {
  productName?: string;
  industry?: string;
  customerType?: string;
  businessModel?: 'B2B' | 'B2C' | 'D2C';
  customerGoals?: string;
  businessObjectives?: string;
  customerFeedback?: string;
  businessChallenges?: string;
}

export function synthesizeJourney(
  rawQuery: string,
  options?: SynthesizerOptions
): Journey {
  const query = (rawQuery || options?.productName || 'Customer Journey').trim();
  const qLower = query.toLowerCase();

  // Detect industry and business model
  let industry = options?.industry || 'Consumer Products & E-Commerce';
  let businessModel: 'B2B' | 'B2C' | 'D2C' = options?.businessModel || 'B2C';
  let customerType = options?.customerType || 'Digital-Savvy Consumer';
  let inferredProduct = options?.productName || query;

  if (
    qLower.includes('sneaker') ||
    qLower.includes('shoe') ||
    qLower.includes('apparel') ||
    qLower.includes('cloth') ||
    qLower.includes('fashion') ||
    qLower.includes('nike') ||
    qLower.includes('zara') ||
    qLower.includes('adidas') ||
    qLower.includes('dyson') ||
    qLower.includes('watch')
  ) {
    industry = options?.industry || 'Retail & Fashion';
    businessModel = options?.businessModel || 'D2C';
    customerType = options?.customerType || 'Style-Conscious Trendsetter';
  } else if (
    qLower.includes('tesla') ||
    qLower.includes('ev') ||
    qLower.includes('car') ||
    qLower.includes('vehicle') ||
    qLower.includes('auto') ||
    qLower.includes('rivian') ||
    qLower.includes('drive')
  ) {
    industry = options?.industry || 'Automotive & CleanTech';
    businessModel = options?.businessModel || 'B2C';
    customerType = options?.customerType || 'Eco-Forward Tech Adopter';
  } else if (
    qLower.includes('saas') ||
    qLower.includes('crm') ||
    qLower.includes('slack') ||
    qLower.includes('notion') ||
    qLower.includes('figma') ||
    qLower.includes('software') ||
    qLower.includes('b2b') ||
    qLower.includes('cloud') ||
    qLower.includes('platform') ||
    qLower.includes('api')
  ) {
    industry = options?.industry || 'SaaS & Enterprise Cloud';
    businessModel = options?.businessModel || 'B2B';
    customerType = options?.customerType || 'Product Team Lead & Tech Decision Maker';
  } else if (
    qLower.includes('coffee') ||
    qLower.includes('starbucks') ||
    qLower.includes('food') ||
    qLower.includes('restaurant') ||
    qLower.includes('cafe') ||
    qLower.includes('dining') ||
    qLower.includes('meal') ||
    qLower.includes('snack') ||
    qLower.includes('beverage')
  ) {
    industry = options?.industry || 'Food, Dining & Beverage';
    businessModel = options?.businessModel || 'B2C';
    customerType = options?.customerType || 'Urban Convenience & Taste Enthusiast';
  } else if (
    qLower.includes('bank') ||
    qLower.includes('fintech') ||
    qLower.includes('revolut') ||
    qLower.includes('crypto') ||
    qLower.includes('card') ||
    qLower.includes('invest') ||
    qLower.includes('wallet') ||
    qLower.includes('payment')
  ) {
    industry = options?.industry || 'FinTech & Digital Banking';
    businessModel = options?.businessModel || 'B2C';
    customerType = options?.customerType || 'Modern Wealth Builder & Solo Pro';
  } else if (
    qLower.includes('travel') ||
    qLower.includes('airbnb') ||
    qLower.includes('hotel') ||
    qLower.includes('flight') ||
    qLower.includes('stay') ||
    qLower.includes('vacation')
  ) {
    industry = options?.industry || 'Travel & Hospitality';
    businessModel = options?.businessModel || 'B2C';
    customerType = options?.customerType || 'Experiential Remote Explorer';
  } else if (
    qLower.includes('learn') ||
    qLower.includes('course') ||
    qLower.includes('bootcamp') ||
    qLower.includes('edu') ||
    qLower.includes('study')
  ) {
    industry = options?.industry || 'EdTech & Career Accelerator';
    businessModel = options?.businessModel || 'B2C';
    customerType = options?.customerType || 'Ambitious Upskiller & Career Switcher';
  }

  // Capitalize title
  const formattedProduct = inferredProduct
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const title = `${formattedProduct}: End-to-End Customer Journey Map`;
  const customerGoals =
    options?.customerGoals ||
    `Effortlessly discover, evaluate, and adopt ${formattedProduct} with zero friction and guaranteed satisfaction.`;
  const businessObjectives =
    options?.businessObjectives ||
    `Maximize funnel conversion through checkout (>4.2%), reduce drop-off, and establish high 90-day retention and viral advocacy.`;
  const customerFeedback =
    options?.customerFeedback ||
    `High initial interest driven by brand reputation; minor friction reported around transparency of delivery times and onboarding step guidance.`;
  const businessChallenges =
    options?.businessChallenges ||
    `Conversion leak between consideration and final commitment; ensuring post-purchase engagement transforms into repeat loyalty.`;

  // Synthetic Persona
  const persona: CustomerPersona = {
    name: 'Jordan Taylor',
    tagline: `High-Intent ${industry} Adopter`,
    archetype: 'Pragmatic Innovator',
    avatarSeed: formattedProduct.toLowerCase().replace(/[^a-z0-9]/g, ''),
    quote: `“I expect ${formattedProduct} to deliver on its promise instantly, with total transparency and zero hidden surprises.”`,
    demographics: {
      ageGroup: '26 - 42',
      roleOrOccupation:
        businessModel === 'B2B' ? 'Operations Director / Team Lead' : 'Senior Specialist / Professional',
      budgetOrIncome: businessModel === 'B2B' ? '$150k - $250k Dept Budget' : '$90k - $140k Annual Income',
      techSavviness: 'Advanced',
      preferredChannels: ['Mobile App', 'Social Feeds', 'Email Digests', 'Verified Reviews'],
    },
    motivations: [
      `Frictionless adoption of ${formattedProduct} without unnecessary setup delays`,
      'Transparent pricing, clear guarantees, and authentic community reviews',
      'Effortless customer service via self-serve chat and proactive status updates',
    ],
    keyGoals: [
      `Resolve immediate daily needs using ${formattedProduct}`,
      'Save time through intelligent automation and intuitive interface design',
      'Confidently recommend the brand to peers and colleagues',
    ],
    frustrations: [
      'Cluttered checkout steps with sudden shipping or processing fees',
      'Slow response times when seeking product clarification or fit advice',
      'Disjointed handoffs between mobile marketing and in-app execution',
    ],
    buyingTriggers: [
      'Positive verified reviews and video demonstrations from real users',
      'Friction-free trial, flexible returns, or instant onboarding gratification',
      'Personalized recommendation aligned with immediate priorities',
    ],
  };

  // 6 Comprehensive Stages: Awareness -> Consideration -> Purchase -> Onboarding -> Core Usage -> Retention
  const stages: JourneyStage[] = [
    {
      id: 'stage-1',
      name: '1. Discovery & Awareness',
      description: `Potential customers encounter ${formattedProduct} via curated organic mentions, peer recommendations, and targeted digital channels.`,
      customerActions: [
        `Discovers ${formattedProduct} via creator showcase and digital ads`,
        'Browses community discussion threads and reads initial user impressions',
        'Taps through to official landing page to inspect key specs and value proposition',
      ],
      touchpoints: [
        {
          id: 'tp-1-1',
          channel: 'Targeted Social & Search Hook',
          customerAction: `Views interactive hook showcasing ${formattedProduct}`,
          expectation: 'Compelling demonstration without clickbait exaggeration',
          friction: 'Low',
          recommendedKPI: 'Ad Click-Through Rate (CTR)',
        },
        {
          id: 'tp-1-2',
          channel: 'Mobile Landing Page Hero',
          customerAction: 'Scans headline, social proof badges, and value proposition',
          expectation: 'Sub-second load time and crystal-clear differentiation',
          friction: 'Low',
          recommendedKPI: 'Homepage Bounce Rate',
        },
      ],
      customerThoughts: [
        `“Does ${formattedProduct} actually live up to the buzz?”`,
        '“Let me see what real customers have to say before I commit.”',
      ],
      customerExpectations: [
        'Immediate clarity on what problem this solves',
        'Transparent starting prices and trustworthy social proof',
      ],
      emotionalScore: 7,
      emotionalState: 'Curious & Receptive',
      painPoints: [
        {
          id: 'pp-1-1',
          title: 'Information Overload & Spec Ambiguity',
          stageId: 'stage-1',
          stageName: '1. Discovery & Awareness',
          description: `Landing page presents too much dense copy before answering how ${formattedProduct} compares to alternatives.`,
          cause: 'Marketing copy written for internal engineers rather than end-users.',
          impact: 'Medium',
          effort: 'Low',
          solution: 'Implement an interactive 3-point visual feature matrix and simplified summary chips.',
          status: 'Identified',
        },
      ],
      opportunities: [
        {
          id: 'opp-1-1',
          title: 'Interactive 30-Second Fit Quiz',
          stageId: 'stage-1',
          stageName: '1. Discovery & Awareness',
          description: 'Provide an instant quiz guiding the visitor to their ideal configuration.',
          expectedImpact: '+28% progression into consideration stage',
          actionableSteps: ['Deploy lightweight modal quiz', 'Map answers to recommended variant'],
        },
      ],
      kpis: [
        {
          id: 'kpi-1-1',
          name: 'Awareness Click-Through Rate (CTR)',
          stageName: '1. Discovery & Awareness',
          category: 'Acquisition',
          formula: '(Total Clicks / Total Impressions) * 100',
          definition: 'Proportion of exposed audience who engage with top-of-funnel messaging.',
          target: '> 3.8%',
          actual: null,
          trackingFrequency: 'Weekly',
          unit: '%',
        },
      ],
    },
    {
      id: 'stage-2',
      name: '2. Consideration & Deep Evaluation',
      description: `Prospects dive deep into feature comparisons, pricing tiers, customer reviews, and security/warranty commitments.`,
      customerActions: [
        `Compares ${formattedProduct} against two top market alternatives`,
        'Reads third-party expert reviews, return policies, and warranty details',
        'Tests interactive pricing calculator or configures product options',
      ],
      touchpoints: [
        {
          id: 'tp-2-1',
          channel: 'Product Configurator / Comparison Grid',
          customerAction: 'Toggles product variations, colors, and feature bundles',
          expectation: 'Real-time price updating without unexpected hidden surcharges',
          friction: 'Medium',
          recommendedKPI: 'Time on Comparison Page',
        },
        {
          id: 'tp-2-2',
          channel: 'Verified Reviews & FAQ Accordion',
          customerAction: 'Filters reviews by critical feedback and long-term durability',
          expectation: 'Unfiltered authentic commentary from verified owners',
          friction: 'Low',
          recommendedKPI: 'Review Filter Interaction Rate',
        },
      ],
      customerThoughts: [
        `“Is the premium tier worth the extra investment?”`,
        '“What happens if I receive it and it doesn’t meet my workflow standards?”',
      ],
      customerExpectations: [
        'Honest comparison vs alternatives with no deceptive exclusions',
        'Transparent return policy and straightforward guarantee terms',
      ],
      emotionalScore: 5,
      emotionalState: 'Analytical & Hesitant',
      painPoints: [
        {
          id: 'pp-2-1',
          title: 'Hidden Surcharges & Delivery Estimate Uncertainty',
          stageId: 'stage-2',
          stageName: '2. Consideration & Deep Evaluation',
          description: 'Users cannot determine exact tax, shipping speed, or arrival date without entering full contact details.',
          cause: 'Checkout calculator deferred to final payment step.',
          impact: 'High',
          effort: 'Low',
          solution: 'Embed a zip-code based arrival date and tax calculator directly on product detail page.',
          status: 'Identified',
        },
      ],
      opportunities: [
        {
          id: 'opp-2-1',
          title: 'Live Chat Advisor & Risk-Free Guarantee Badge',
          stageId: 'stage-2',
          stageName: '2. Consideration & Deep Evaluation',
          description: 'Display a floating 1-click expert consultation prompt with instant answers.',
          expectedImpact: '+18% lift in add-to-cart velocity',
          actionableSteps: ['Integrate AI consultation bot', 'Highlight 30-day money-back guarantee'],
        },
      ],
      kpis: [
        {
          id: 'kpi-2-1',
          name: 'Add-to-Cart / Intent Rate',
          stageName: '2. Consideration & Deep Evaluation',
          category: 'Consideration',
          formula: '(Sessions with Add to Cart / Total Product Detail Sessions) * 100',
          definition: 'Percentage of engaged evaluators who proceed to order initiation.',
          target: '> 14.5%',
          actual: null,
          trackingFrequency: 'Weekly',
          unit: '%',
        },
      ],
    },
    {
      id: 'stage-3',
      name: '3. Purchase & Checkout Conversion',
      description: `Customer enters the conversion funnel, submits payment, verifies order specifications, and receives confirmation.`,
      customerActions: [
        'Reviews cart summary, applies promotional codes, and selects delivery speed',
        'Completes identity verification, address autocomplete, and payment authorization',
        'Views order confirmation receipt and saves tracking bookmark',
      ],
      touchpoints: [
        {
          id: 'tp-3-1',
          channel: 'One-Click Fast Checkout Gateway',
          customerAction: 'Authenticates with Apple Pay / Google Pay / 1-Click Card',
          expectation: 'Immediate payment success without form redundancy or CAPTCHA loops',
          friction: 'Low',
          recommendedKPI: 'Checkout Completion Rate',
        },
        {
          id: 'tp-3-2',
          channel: 'Instant Confirmation & Order Dashboard',
          customerAction: 'Receives instant email and SMS notification with live tracker',
          expectation: 'Accurate estimated delivery date and order reference number',
          friction: 'Low',
          recommendedKPI: 'Confirmation Notification Open Rate',
        },
      ],
      customerThoughts: [
        '“Glad that checkout took less than 30 seconds.”',
        '“Now let’s see if it actually arrives on the promised date.”',
      ],
      customerExpectations: [
        'Clear confirmation receipt with transparent invoice breakdown',
        'Immediate tracking link with milestone alerts',
      ],
      emotionalScore: 8,
      emotionalState: 'Relieved & Eager',
      painPoints: [
        {
          id: 'pp-3-1',
          title: 'Form Field Fatigue on Mobile Keyboards',
          stageId: 'stage-3',
          stageName: '3. Purchase & Checkout Conversion',
          description: 'Users on mobile devices encounter repetitive address and billing field inputs.',
          cause: 'Billing and shipping address toggle defaulted to separate inputs.',
          impact: 'Medium',
          effort: 'Low',
          solution: 'Enable Google Autocomplete and default billing address to same as shipping.',
          status: 'In Progress',
        },
      ],
      opportunities: [
        {
          id: 'opp-3-1',
          title: 'Post-Purchase Milestone Tracker & Welcome Video',
          stageId: 'stage-3',
          stageName: '3. Purchase & Checkout Conversion',
          description: 'Display an animated preparation tracker with an inspiring founder welcome message.',
          expectedImpact: 'Reduces post-purchase buyer remorse by 40%',
          actionableSteps: ['Add real-time order status page', 'Embed 20-second setup teaser video'],
        },
      ],
      kpis: [
        {
          id: 'kpi-3-1',
          name: 'Cart-to-Order Conversion Rate',
          stageName: '3. Purchase & Checkout Conversion',
          category: 'Conversion',
          formula: '(Completed Orders / Carts Created) * 100',
          definition: 'Proportion of cart sessions that successfully clear payment.',
          target: '> 68.0%',
          actual: null,
          trackingFrequency: 'Daily',
          unit: '%',
        },
      ],
    },
    {
      id: 'stage-4',
      name: '4. Delivery, Unboxing & Onboarding',
      description: `Product arrives in customer’s hands; they open the packaging, follow first-run setup, and experience initial gratification.`,
      customerActions: [
        'Receives dispatch notifications and delivery confirmation at doorstep',
        `Unboxes ${formattedProduct} and scans QR code for digital setup guide`,
        'Completes initial device pairing / profile personalization in under 3 minutes',
      ],
      touchpoints: [
        {
          id: 'tp-4-1',
          channel: 'Physical Packaging & Welcome QR Card',
          customerAction: 'Unboxes product and scans guided onboarding QR',
          expectation: 'Premium, sustainable unboxing with zero packaging clutter',
          friction: 'Low',
          recommendedKPI: 'Onboarding QR Scan Rate',
        },
        {
          id: 'tp-4-2',
          channel: 'Interactive 3-Step Setup Wizard',
          customerAction: 'Walks through interactive setup screens and syncs preferences',
          expectation: 'Zero configuration errors and instant positive affirmation',
          friction: 'Low',
          recommendedKPI: 'First-Run Setup Completion Rate',
        },
      ],
      customerThoughts: [
        '“The build quality and tactile packaging feel truly premium.”',
        '“That was significantly easier to set up than my previous solution.”',
      ],
      customerExpectations: [
        'Pristine condition upon arrival with all parts accounted for',
        'Instant “Aha!” moment within 5 minutes of opening the package',
      ],
      emotionalScore: 9,
      emotionalState: 'Delighted & Excited',
      painPoints: [
        {
          id: 'pp-4-1',
          title: 'Dense Paper Manual Leading to Misconfiguration',
          stageId: 'stage-4',
          stageName: '4. Delivery, Unboxing & Onboarding',
          description: 'A minority of customers skip the QR code and get confused by microscopic paper diagrams.',
          cause: 'Over-reliance on printed compliance foldouts.',
          impact: 'Medium',
          effort: 'Low',
          solution: 'Print bold 3-step graphic directly onto inner box lid pointing to interactive web guide.',
          status: 'Identified',
        },
      ],
      opportunities: [
        {
          id: 'opp-4-1',
          title: 'Gamified "First Success" Badge & Instant Reward',
          stageId: 'stage-4',
          stageName: '4. Delivery, Unboxing & Onboarding',
          description: 'Celebrate the customer’s first successful run with a micro-confetti animation and bonus credit.',
          expectedImpact: '+35% day-1 activation milestone adherence',
          actionableSteps: ['Design celebration modal', 'Send tailored day-2 tip email'],
        },
      ],
      kpis: [
        {
          id: 'kpi-4-1',
          name: 'Day-1 Activation Completion Rate',
          stageName: '4. Delivery, Unboxing & Onboarding',
          category: 'Experience',
          formula: '(Activated Users on Day 1 / Total Delivered Units) * 100',
          definition: 'Percentage of recipients who successfully complete initial setup on delivery date.',
          target: '> 89.0%',
          actual: null,
          trackingFrequency: 'Weekly',
          unit: '%',
        },
      ],
    },
    {
      id: 'stage-5',
      name: '5. Core Daily Experience & Habit Formation',
      description: `Customer incorporates ${formattedProduct} into their daily routine, uncovering power features and realizing sustained value.`,
      customerActions: [
        `Uses ${formattedProduct} consistently for core daily tasks`,
        'Explores advanced shortcuts, automations, and custom configurations',
        'Interacts with monthly product digest or performance summary dashboard',
      ],
      touchpoints: [
        {
          id: 'tp-5-1',
          channel: 'Main Product Interface / Companion App',
          customerAction: 'Interacts with core features and monitors telemetry',
          expectation: 'Responsive performance, reliable uptime, and intuitive navigation',
          friction: 'Low',
          recommendedKPI: 'Weekly Active Users (WAU) / Daily Usage',
        },
        {
          id: 'tp-5-2',
          channel: 'Proactive Tip Notifications & Support Chat',
          customerAction: 'Receives context-aware suggestions during active usage',
          expectation: 'Helpful tips without intrusive marketing spam',
          friction: 'Low',
          recommendedKPI: 'In-App Help Resolution CSAT',
        },
      ],
      customerThoughts: [
        `“I can’t imagine going back to my old way of doing this before ${formattedProduct}.”`,
        '“I should show this to my colleagues at our next meeting.”',
      ],
      customerExpectations: [
        'Flawless reliability and consistent performance over time',
        'Helpful proactive customer care when an edge case arises',
      ],
      emotionalScore: 8,
      emotionalState: 'Satisfied & Empowered',
      painPoints: [
        {
          id: 'pp-5-1',
          title: 'Undiscovered Advanced Capabilities',
          stageId: 'stage-5',
          stageName: '5. Core Daily Experience & Habit Formation',
          description: 'Users stick to basic features and never discover the highest-value capabilities.',
          cause: 'Lack of progressive disclosure and personalized workflow hints.',
          impact: 'Medium',
          effort: 'Medium',
          solution: 'Implement intelligent contextual nudges triggered when users reach milestone 10.',
          status: 'In Progress',
        },
      ],
      opportunities: [
        {
          id: 'opp-5-1',
          title: 'Monthly Value & Impact Digest',
          stageId: 'stage-5',
          stageName: '5. Core Daily Experience & Habit Formation',
          description: 'Deliver an automated monthly infographic quantifying time and money saved.',
          expectedImpact: 'Reduces 90-day churn by 22%',
          actionableSteps: ['Aggregate user telemetry', 'Generate dynamic monthly recap card'],
        },
      ],
      kpis: [
        {
          id: 'kpi-5-1',
          name: 'Customer Satisfaction Score (CSAT)',
          stageName: '5. Core Daily Experience & Habit Formation',
          category: 'Experience',
          formula: '(Satisfied Responses / Total Responses) * 100',
          definition: 'Customer sentiment rating on core performance and product quality.',
          target: '> 92.5%',
          actual: null,
          trackingFrequency: 'Monthly',
          unit: '%',
        },
      ],
    },
    {
      id: 'stage-6',
      name: '6. Retention, Loyalty & Brand Advocacy',
      description: `Satisfied customer renews subscriptions, explores accessories or upgrades, and becomes an organic brand ambassador.`,
      customerActions: [
        'Recommends the product to friends, colleagues, or social followers via referral link',
        'Leaves a 5-star verified review with photos detailing real-world longevity',
        'Opts into VIP loyalty rewards, early access betas, or recurring supply replenishments',
      ],
      touchpoints: [
        {
          id: 'tp-6-1',
          channel: 'VIP Community & Referral Hub',
          customerAction: 'Shares personal referral code with peer network',
          expectation: 'Mutual dual-sided rewards that provide genuine value to both parties',
          friction: 'Low',
          recommendedKPI: 'Referral Share Rate',
        },
        {
          id: 'tp-6-2',
          channel: 'Loyalty Upgrade & Replenishment Portal',
          customerAction: 'Orders complementary accessories or upgrades to premier tier',
          expectation: 'Loyalty pricing and frictionless 1-click renewal',
          friction: 'Low',
          recommendedKPI: 'Repeat Purchase Rate / LTV',
        },
      ],
      customerThoughts: [
        `“Any time someone asks for a recommendation, I tell them ${formattedProduct} without hesitation.”`,
        '“The loyalty perks actually reward my ongoing support.”',
      ],
      customerExpectations: [
        'Recognition of customer loyalty with exclusive perks',
        'Continuous software and service upgrades without forced obsolescence',
      ],
      emotionalScore: 9,
      emotionalState: 'Evangelistic & Loyal',
      painPoints: [
        {
          id: 'pp-6-1',
          title: 'Cumbersome Referral Redemption for New Invitees',
          stageId: 'stage-6',
          stageName: '6. Retention, Loyalty & Brand Advocacy',
          description: 'Referred friends find the promo code field tricky to locate on mobile web checkout.',
          cause: 'Referral link does not automatically apply discount token to cart state.',
          impact: 'Medium',
          effort: 'Low',
          solution: 'Auto-apply referral token via URL parameters on first landing page hit.',
          status: 'Identified',
        },
      ],
      opportunities: [
        {
          id: 'opp-6-1',
          title: 'Ambassador Spotlight & Customer Advisory Council',
          stageId: 'stage-6',
          stageName: '6. Retention, Loyalty & Brand Advocacy',
          description: 'Invite top 5% most engaged customers to private quarterly product feedback sessions.',
          expectedImpact: '+40% organic word-of-mouth referral volume',
          actionableSteps: ['Launch ambassador tier', 'Send private roadmap invitations'],
        },
      ],
      kpis: [
        {
          id: 'kpi-6-1',
          name: 'Net Promoter Score (NPS)',
          stageName: '6. Retention, Loyalty & Brand Advocacy',
          category: 'Retention',
          formula: '% Promoters (Score 9-10) minus % Detractors (Score 0-6)',
          definition: 'Willingness of customers to recommend the product to friends and colleagues.',
          target: '> +62',
          actual: null,
          trackingFrequency: 'Quarterly',
          unit: 'pts',
        },
      ],
    },
  ];

  const strategicInsights: StrategicInsights = {
    executiveSummary: `The customer journey for ${formattedProduct} exhibits strong top-of-funnel momentum and exceptional delivery unboxing delight, but faces critical evaluation drop-off during Stage 2 (pricing clarity and shipping timelines). Addressing price transparency and mobile checkout auto-complete will unlock an estimated +22% lift in conversion velocity while expanding lifetime advocacy.`,
    retentionSuggestions: [
      `Introduce an automated Day-2 onboarding companion check-in to confirm flawless first-run gratification for ${formattedProduct}.`,
      'Deploy dynamic monthly usage and value summary cards demonstrating clear ROI to prevent 90-day engagement decay.',
      'Establish a dual-sided referral incentive rewarding both the advocate and the new invitee with instant credits.',
    ],
    conversionSuggestions: [
      'Eliminate checkout price surprises by providing zip-code based tax and delivery speed calculation directly on product page.',
      'Implement Apple Pay and Google Pay one-touch express checkout to compress checkout friction under 45 seconds.',
      'Surface authentic verified customer testimonials answering specific objections (fit, durability, learning curve).',
    ],
    aiAssumptions: [
      `Assumption: Target users prioritize speed of delivery and ease of setup over exhaustive technical configuration for ${formattedProduct}.`,
      'Assumption: Majority of initial brand awareness is driven by mobile social discovery and creator reviews.',
      'Fact Check Requirement: Audit internal analytics to verify cart abandonment drop-off percentages at the shipping step.',
    ],
  };

  const actionPlan: ActionPlanMilestone[] = [
    {
      phase: 'Phase 1: Quick Wins (Weeks 1-2)',
      title: 'Checkout Friction Elimination & Price Transparency',
      priority: 'Immediate',
      actionItems: [
        'Add zip-code delivery estimate and total price calculator on product detail page',
        'Enable mobile 1-click payment gateways (Apple Pay, Google Pay)',
        'Auto-apply referral tokens directly from promotional URLs',
      ],
      expectedOutcome: 'Immediate 12-16% reduction in mobile cart abandonment',
      kpiToWatch: 'Cart-to-Order Conversion Rate',
    },
    {
      phase: 'Phase 2: Experience Optimization (Weeks 3-6)',
      title: 'Delightful Onboarding & First-Run Acceleration',
      priority: 'Medium-term',
      actionItems: [
        'Upgrade inner unboxing packaging with bold 3-step visual setup guide',
        'Launch interactive 2-minute digital setup wizard with completion celebration',
        'Trigger Day-2 pro-tip email based on customer activation status',
      ],
      expectedOutcome: '+25% increase in Day-1 activation rate and lower initial support tickets',
      kpiToWatch: 'Day-1 Activation Completion Rate',
    },
    {
      phase: 'Phase 3: Long-term Moats & Advocacy (Weeks 7-12)',
      title: 'VIP Community & Automated Value Infographics',
      priority: 'Long-term',
      actionItems: [
        'Deploy monthly value recap infographics demonstrating time and value saved',
        'Establish Ambassador VIP tier for top 5% advocates with exclusive roadmap access',
        'Implement automated replenishment / accessory recommendation engine',
      ],
      expectedOutcome: '+18 point increase in Net Promoter Score and +30% repeat customer LTV',
      kpiToWatch: 'Net Promoter Score (NPS)',
    },
  ];

  const now = new Date().toISOString();

  return {
    id: `journey-${Date.now()}`,
    title,
    productName: formattedProduct,
    industry,
    customerType,
    businessModel,
    customerGoals,
    businessObjectives,
    customerFeedback,
    businessChallenges,
    createdAt: now,
    updatedAt: now,
    persona,
    stages,
    strategicInsights,
    actionPlan,
    isSample: false,
  };
}
