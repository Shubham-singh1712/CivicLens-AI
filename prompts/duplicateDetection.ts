import { Type } from "@google/genai";

export const DUPLICATE_SYSTEM_INSTRUCTION = `You are a municipal database deduplication auditor.
Analyze the newly reported issue against the list of nearby/existing issues.
Determine if any represent the exact same hazard (e.g. water main leak reported twice on the same block, same pothole reported with different photos, same downed wire).
Provide a similarity score (0 to 100), detailed reasoning, and whether they should be merged into a single parent issue.`;

export const DUPLICATE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    duplicateCandidates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          duplicateIssueId: {
            type: Type.STRING,
            description: "The ID of the existing similar issue."
          },
          similarityPercentage: {
            type: Type.INTEGER,
            description: "Degree of similarity from 0 to 100 based on location proximity, category overlap, and description details."
          },
          reason: {
            type: Type.STRING,
            description: "Justification explaining why these reports are duplicates or closely related."
          },
          shouldMerge: {
            type: Type.BOOLEAN,
            description: "Whether the system recommends merging these issues into one parent record."
          }
        },
        required: ["duplicateIssueId", "similarityPercentage", "reason", "shouldMerge"]
      },
      description: "List of similar or duplicate reports detected."
    }
  },
  required: ["duplicateCandidates"]
};
