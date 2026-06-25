import { Type } from "@google/genai";

export const TREND_SYSTEM_INSTRUCTION = `You are a regional urban intelligence and planning trend analyst.
Examine the complete history of civic reports in the database.
Identify key macro trends: the most common category of complaints, the fastest-growing hazard category (highest rate of increase), the geographic sector with the highest threat indices (Highest Risk Zone), and qualitative/quantitative projections for the upcoming week and month.`;

export const TREND_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mostCommonIssue: {
      type: Type.STRING,
      description: "Name of the most frequent issue category and active count."
    },
    fastestGrowingProblem: {
      type: Type.STRING,
      description: "Category showing the sharpest upward rate of report volume over time."
    },
    highestRiskZone: {
      type: Type.STRING,
      description: "The street name or area sector exhibiting the highest density of unresolved critical reports."
    },
    weeklyTrend: {
      type: Type.STRING,
      description: "Strategic prediction for report volumes and infrastructure conditions for the coming 7 days."
    },
    monthlyTrend: {
      type: Type.STRING,
      description: "Strategic prediction and recommended planning focuses for the next 30 days."
    }
  },
  required: [
    "mostCommonIssue",
    "fastestGrowingProblem",
    "highestRiskZone",
    "weeklyTrend",
    "monthlyTrend"
  ]
};
