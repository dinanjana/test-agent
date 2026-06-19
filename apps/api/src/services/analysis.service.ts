import { LLMService, createLLMService } from './llm.service';

export class AnalysisService {

    /**
     * Analyzes a conversation turn to detect failures.
     * Uses Vercel AI SDK + OpenAI for intelligent reasoning.
     */
    async analyzeFailure(userMessage: string, agentResponse: string, apiKey?: string): Promise<any> {
        // If we want to skip LLM for simple cases or if no key, we could keep heuristics as fallback.
        // But for Phase 2, we rely on the LLM.

        if (!apiKey && !process.env.OPENAI_API_KEY) {
            console.warn("No API Key available for analysis. Returning null.");
            return null;
        }

        const llm = createLLMService(apiKey);

        try {
            console.log(`[AnalysisService] Analyzing with LLM...`);
            const analysis = await llm.analyzeFailure(userMessage, agentResponse);
            console.log(`[AnalysisService] Result:`, analysis);
            return analysis;
        } catch (error) {
            console.error("Analysis Failed", error);
            return null;
        }
    }
}
