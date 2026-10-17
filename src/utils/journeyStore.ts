import { Journey } from '../types/journey';
import { SAMPLE_ECOMMERCE_JOURNEY } from '../data/sampleJourneys';
import { ADDITIONAL_SAMPLES } from '../data/otherSampleJourneys';
import { MORE_SAMPLES } from '../data/moreSamples';

const STORAGE_KEY = 'journeyx_saved_journeys';
const ACTIVE_ID_KEY = 'journeyx_active_journey_id';

export const ALL_SAMPLE_JOURNEYS: Record<string, Journey> = {
  [SAMPLE_ECOMMERCE_JOURNEY.id]: SAMPLE_ECOMMERCE_JOURNEY,
  ...ADDITIONAL_SAMPLES,
  ...MORE_SAMPLES,
};

export function getStoredJourneys(): Journey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with default sample journeys
      const initial = Object.values(ALL_SAMPLE_JOURNEYS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return Object.values(ALL_SAMPLE_JOURNEYS);
  } catch (e) {
    console.error('Failed to load journeys from localStorage', e);
    return Object.values(ALL_SAMPLE_JOURNEYS);
  }
}

export function saveJourneysToStorage(journeys: Journey[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys));
  } catch (e) {
    console.error('Failed to save journeys to localStorage', e);
  }
}

export function getActiveJourneyId(): string {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY) || SAMPLE_ECOMMERCE_JOURNEY.id;
  } catch {
    return SAMPLE_ECOMMERCE_JOURNEY.id;
  }
}

export function setActiveJourneyId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch (e) {
    console.error('Failed to set active journey id', e);
  }
}

export function exportJourneyToJSON(journey: Journey): void {
  const blob = new Blob([JSON.stringify(journey, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${journey.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_journeyx.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTouchpointsToCSV(journey: Journey): void {
  const rows: string[][] = [
    ['Stage', 'Channel', 'Customer Action', 'Customer Expectation', 'Friction Level', 'Recommended KPI'],
  ];

  journey.stages.forEach((stage) => {
    stage.touchpoints.forEach((tp) => {
      rows.push([
        `"${stage.name.replace(/"/g, '""')}"`,
        `"${tp.channel.replace(/"/g, '""')}"`,
        `"${tp.customerAction.replace(/"/g, '""')}"`,
        `"${tp.expectation.replace(/"/g, '""')}"`,
        `"${tp.friction}"`,
        `"${tp.recommendedKPI.replace(/"/g, '""')}"`,
      ]);
    });
  });

  downloadCSV(rows, `${journey.productName}_touchpoints.csv`);
}

export function exportPainPointsToCSV(journey: Journey): void {
  const rows: string[][] = [
    ['Stage', 'Pain Point Title', 'Description', 'Possible Cause', 'Impact Level', 'Implementation Effort', 'Proposed Solution', 'Status'],
  ];

  journey.stages.forEach((stage) => {
    stage.painPoints.forEach((pp) => {
      rows.push([
        `"${stage.name.replace(/"/g, '""')}"`,
        `"${pp.title.replace(/"/g, '""')}"`,
        `"${pp.description.replace(/"/g, '""')}"`,
        `"${pp.cause.replace(/"/g, '""')}"`,
        `"${pp.impact}"`,
        `"${pp.effort}"`,
        `"${pp.solution.replace(/"/g, '""')}"`,
        `"${pp.status}"`,
      ]);
    });
  });

  downloadCSV(rows, `${journey.productName}_pain_points.csv`);
}

export function exportKPIsToCSV(journey: Journey): void {
  const rows: string[][] = [
    ['Stage', 'KPI Name', 'Category', 'Target', 'Actual', 'Unit', 'Frequency', 'Formula', 'Definition'],
  ];

  journey.stages.forEach((stage) => {
    stage.kpis.forEach((kpi) => {
      rows.push([
        `"${stage.name.replace(/"/g, '""')}"`,
        `"${kpi.name.replace(/"/g, '""')}"`,
        `"${kpi.category.replace(/"/g, '""')}"`,
        `"${kpi.target.replace(/"/g, '""')}"`,
        `"${kpi.actual ? kpi.actual.replace(/"/g, '""') : 'No data available'}"`,
        `"${kpi.unit}"`,
        `"${kpi.trackingFrequency}"`,
        `"${kpi.formula.replace(/"/g, '""')}"`,
        `"${kpi.definition.replace(/"/g, '""')}"`,
      ]);
    });
  });

  downloadCSV(rows, `${journey.productName}_kpis.csv`);
}

function downloadCSV(rows: string[][], filename: string): void {
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const a = document.createElement('a');
  a.href = encodedUri;
  a.download = filename;
  a.click();
}
