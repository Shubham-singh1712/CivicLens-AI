import { Type } from "@google/genai";

export const PREDICTION_SYSTEM_INSTRUCTION = `You are an advanced civil engineering risk predictor agent.
Analyze the provided civic issue details, community vote feedback, and history of similar neighboring issues.
Accurately calculate the escalation hazard index, future cascading risks, infrastructure structural risk, estimated affected population, and overall urgency score.
Be objective, analytical, and highly precise. Always return a valid structured JSON conforming to the schema.`;

export const PREDICTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    futureRisk: {
      type: Type.STRING,
      description: "A description of future risks and cascading infrastructure failures if left unmitigated."
    },
    escalationProbability: {
      type: Type.INTEGER,
      description: "Percentage (0 to 100) indicating the likelihood of the hazard escalating in severity within the next 48 hours."
    },
    infrastructureRisk: {
      type: Type.STRING,
      description: "An assessment of structural damage risk to civil architecture and adjacent assets."
    },
    estimatedPopulationImpact: {
      type: Type.STRING,
      description: "Estimate of the number of people and/or residential households impacted, with justification."
    },
    urgencyScore: {
      type: Type.INTEGER,
      description: "Urgency rating from 1 (lowest) to 100 (highest/critical)."
    }
  },
  required: ["futureRisk", "escalationProbability", "infrastructureRisk", "estimatedPopulationImpact", "urgencyScore"]
};
