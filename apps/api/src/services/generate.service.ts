import { LLMService, LLMConfig, LLMProvider } from './llm.service';
import { SettingsService } from './settings.service';
import { parseLLMJson } from '../lib/parseLLMJson';

interface Turn {
    role: 'user' | 'agent';
    message: string;
}

interface GeneratedConversation {
    name: string;
    turns: Turn[];
}

interface GenerateRequest {
    suiteName: string;
    suiteDescription?: string;
    singleTurnCount: number;
    multiTurnCount: number;
    turnsPerMulti?: number;
    existingQuestions?: string[];  // Questions to avoid duplicating
}

interface GenerateResult {
    conversations: GeneratedConversation[];
    error?: string;
}

export class GenerateService {
    /**
     * Generate test conversations using LLM based on suite context.
     */
    static async generateConversations(
        appId: string,
        request: GenerateRequest
    ): Promise<GenerateResult> {
        // Get API key from app settings (default to OpenAI)
        const provider: LLMProvider = 'openai';
        const model = 'gpt-4o-mini';

        const apiKey = await SettingsService.getApiKey(appId, provider);
        if (!apiKey) {
            return {
                conversations: [],
                error: `No API key configured for ${provider}. Configure it in Settings.`
            };
        }

        const llmConfig: LLMConfig = {
            provider,
            apiKey,
            model
        };

        const llmService = new LLMService(llmConfig);

        const prompt = buildGenerationPrompt(request);

        try {
            console.log(`[GenerateService] Generating ${request.singleTurnCount} single + ${request.multiTurnCount} multi-turn conversations`);
            const response = await llmService.generateResponse(prompt);

            // Parse JSON response — strips markdown fences, throws on invalid JSON
            const conversations = parseLLMJson<GeneratedConversation[]>(response);
            return { conversations };
        } catch (error: any) {
            console.error('[GenerateService] Generation failed:', error);
            return {
                conversations: [],
                error: `Generation failed: ${error.message}`
            };
        }
    }

    /**
     * Parse CSV content into conversations (single-turn).
     * Expects a column named "query" or first column as user message.
     */
    static parseCSV(csvContent: string): GeneratedConversation[] {
        const lines = csvContent.trim().split('\n');
        if (lines.length < 2) return [];

        // Parse header
        const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
        const queryIndex = header.indexOf('query');
        const messageIndex = queryIndex >= 0 ? queryIndex : 0;

        const conversations: GeneratedConversation[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const message = values[messageIndex]?.trim();

            if (message) {
                conversations.push({
                    name: `Query ${i}`,
                    turns: [{ role: 'user', message }]
                });
            }
        }

        return conversations;
    }
}

function buildGenerationPrompt(request: GenerateRequest): string {
    const turnsPerMulti = request.turnsPerMulti || 3;
    const existingSection = request.existingQuestions?.length
        ? `
## Existing Questions (AVOID DUPLICATING THESE)
${request.existingQuestions.map(q => `- "${q}"`).join('\n')}

Do NOT generate questions similar to the ones above. Create NEW, DIFFERENT questions.`
        : '';

    return `You are generating realistic test conversations for an AI agent testing tool.

## Test Suite Context
Name: ${request.suiteName}
${request.suiteDescription ? `Description: ${request.suiteDescription}` : ''}
${existingSection}

## Generation Requirements
- Generate ${request.singleTurnCount} single-turn questions (just one user message)
- Generate ${request.multiTurnCount} multi-turn conversations (${turnsPerMulti} user messages each)

## Guidelines
- Make questions realistic and varied
- Cover different phrasings, tones, and edge cases
- For multi-turn: include follow-ups, clarifications, or related questions
- Focus on common user scenarios for this type of agent
- Include some edge cases and tricky questions
- AVOID creating duplicate or similar questions to existing ones

## Output Format
Return a JSON array of conversations. Each conversation has:
- "name": A short descriptive name
- "turns": Array of {"role": "user", "message": "..."} objects

Example:
[
  {"name": "Simple refund", "turns": [{"role": "user", "message": "How do I get a refund?"}]},
  {"name": "Shipping follow-up", "turns": [
    {"role": "user", "message": "Where is my order?"},
    {"role": "user", "message": "It's been 5 days, can you expedite it?"}
  ]}
]

Generate the conversations now:`;
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());

    return result;
}
