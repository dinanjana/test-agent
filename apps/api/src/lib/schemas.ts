import { z } from 'zod';

export const AnalysisResultSchema = z.object({
    root_cause: z.enum(['SAFETY_BREACH', 'HALLUCINATION', 'TONE_VIOLATION', 'MISSING_INSTRUCTION', 'UNKNOWN']),
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
    reasoning: z.string().describe("A detailed explanation of why this conversation failed based on the criteria."),
    violation_quote: z.string().describe("The exact quote from the agent that violated the rule."),
    recommendation: z.string().describe("Actionable advice for the engineer to fix the prompt.")
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
