import { Request, Response } from 'express';
import { TestRun } from '../models/testRun';
import { Judge } from '../models/judge';
import { LLMService, LLMConfig, LLMProvider } from '../services/llm.service';
import { SettingsService } from '../services/settings.service';
import { parseLLMJson } from '../lib/parseLLMJson';

interface Annotation {
    conversation_index: number;
    response_index?: number;
    passed: boolean;
    explanation?: string;
    highlighted_text?: string;
}

export class AnnotationController {
    /**
     * Save annotations for a test run
     * POST /api/apps/:appId/runs/:runId/annotations
     */
    static async saveAnnotations(req: Request, res: Response) {
        try {
            const { runId } = req.params;
            const { annotations } = req.body;

            if (!Array.isArray(annotations)) {
                return res.status(400).json({ error: 'annotations must be an array' });
            }

            // Add created_at to each annotation
            const annotationsWithTime = annotations.map((a: Annotation) => ({
                ...a,
                created_at: new Date()
            }));

            const run = await TestRun.findByIdAndUpdate(
                runId,
                { annotations: annotationsWithTime },
                { new: true }
            );

            if (!run) {
                return res.status(404).json({ error: 'Run not found' });
            }

            res.json({ success: true, annotations: run.annotations });
        } catch (error: any) {
            console.error('[AnnotationController] Save error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Get annotations for a test run
     * GET /api/apps/:appId/runs/:runId/annotations
     */
    static async getAnnotations(req: Request, res: Response) {
        try {
            const { runId } = req.params;
            const run = await TestRun.findById(runId);

            if (!run) {
                return res.status(404).json({ error: 'Run not found' });
            }

            res.json({ annotations: run.annotations || [] });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Generate judges from annotations using LLM
     * POST /api/apps/:appId/generate-judges-from-annotations
     */
    static async generateJudges(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { runId, annotations } = req.body;

            // Get the test run for context
            const run = await TestRun.findById(runId);
            if (!run) {
                return res.status(404).json({ error: 'Run not found' });
            }

            // Filter to only failed annotations with explanations
            const failedAnnotations = annotations.filter(
                (a: Annotation) => !a.passed && (a.explanation || a.highlighted_text)
            );

            if (failedAnnotations.length === 0) {
                return res.status(400).json({
                    error: 'No failed annotations with explanations found'
                });
            }

            // Get API key
            const provider: LLMProvider = 'openai';
            const model = 'gpt-4o-mini';
            const apiKey = await SettingsService.getApiKey(appId, provider);

            if (!apiKey) {
                return res.status(400).json({
                    error: 'No API key configured. Configure it in Settings.'
                });
            }

            const llmConfig: LLMConfig = { provider, apiKey, model };
            const llmService = new LLMService(llmConfig);

            // Get a representative sample of the agent's response structure
            const agentTurns = (run.turns ?? []).filter((t: any) => t.role === 'user' && t.raw_response);
            const sampleResponse = agentTurns.length > 0 ? agentTurns[0].raw_response : null;

            // Build prompt from annotations
            const prompt = buildJudgeGenerationPrompt(failedAnnotations, run, sampleResponse);
            const response = await llmService.generateResponse(prompt);

            // Parse JSON response — strips markdown fences, throws on invalid JSON
            const suggestedJudges = parseLLMJson<Array<{ name: string; criteria: string; severity: string }>>(response);
            res.json({ judges: suggestedJudges });
        } catch (error: any) {
            console.error('[AnnotationController] Generate judges error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Create judges from suggestions
     * POST /api/apps/:appId/create-judges-from-suggestions
     */
    static async createJudges(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { judges } = req.body;

            if (!Array.isArray(judges) || judges.length === 0) {
                return res.status(400).json({ error: 'judges array is required' });
            }

            const createdJudges = [];
            for (const judge of judges) {
                const newJudge = await Judge.create({
                    app_id: appId, // Link to the app
                    name: judge.name,
                    criteria: judge.criteria,
                    severity: judge.severity || 'fail',
                    llm_provider: 'openai',
                    llm_model: 'gpt-4o-mini'
                });
                createdJudges.push(newJudge);
            }

            res.json({ success: true, judges: createdJudges });
        } catch (error: any) {
            console.error('[AnnotationController] Create judges error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Refine judges based on false positives
     * POST /api/apps/:appId/refine-judges
     */
    static async refineJudges(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { falsePositives } = req.body; // Array of { judgeId, judgeName, reasoning, citation, conversationExcerpt }

            if (!Array.isArray(falsePositives) || falsePositives.length === 0) {
                return res.status(400).json({ error: 'falsePositives array is required' });
            }

            // Group by judge
            const grouped = falsePositives.reduce((acc: any, fp: any) => {
                if (!acc[fp.judgeId]) acc[fp.judgeId] = [];
                acc[fp.judgeId].push(fp);
                return acc;
            }, {});

            const provider: LLMProvider = 'openai';
            const model = 'gpt-4o-mini';
            const apiKey = await SettingsService.getApiKey(appId, provider);
            if (!apiKey) {
                return res.status(400).json({ error: 'No API key configured.' });
            }
            const llmService = new LLMService({ provider, apiKey, model });

            const suggestions = [];

            // Process each judge
            for (const judgeId of Object.keys(grouped)) {
                const examples = grouped[judgeId];
                const judge = await Judge.findById(judgeId);
                if (!judge) continue;

                // Build prompt
                const prompt = buildRefinementPrompt(judge, examples);
                const response = await llmService.generateResponse(prompt);

                // Parse response — throws on invalid JSON
                const result = parseLLMJson<{ suggested_criteria: string; explanation: string }>(response);
                suggestions.push({
                    judge_id: judgeId,
                    judge_name: judge.name,
                    current_criteria: judge.criteria,
                    suggested_criteria: result.suggested_criteria,
                    explanation: result.explanation
                });
            }

            res.json({ suggestions });
        } catch (error: any) {
            console.error('[AnnotationController] Refine judges error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

function buildRefinementPrompt(judge: any, examples: any[]): string {
    const exampleText = examples.map((ex, i) => `
Example ${i + 1}:
- Conversation Excerpt: "${ex.conversationExcerpt}"
- Original Failure Reasoning: "${ex.reasoning}"
- Why this is a False Positive (User Feedback): These cases should have PASSED.
`).join('\n');

    return `You are refining an AI judge to reduce false positives.

## Current Judge
Name: ${judge.name}
Criteria:
${judge.criteria}

## False Positive Examples
The current judge incorrectly FAILED the following examples, but the user says they should have PASSED.
${exampleText}

## Task
Rewrite the judge criteria to handle these edge cases correctly while maintaining the original intent. The new criteria should allow these specific examples to pass.

## Output JSON
{
  "suggested_criteria": "The rewritten criteria text...",
  "explanation": "Brief explanation of what changed and why"
}`;
}
function truncateValues(obj: Record<string, any>, maxLen = 80): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            k,
            typeof v === 'string' && v.length > maxLen ? v.slice(0, maxLen) + '…' : v
        ])
    );
}

function buildJudgeGenerationPrompt(annotations: Annotation[], run: any, sampleResponse?: Record<string, any> | null): string {
    const examples = annotations.map((a, i) => {
        let example = `Example ${i + 1}:\n`;
        example += `- Passed: ${a.passed}\n`;
        if (a.explanation) example += `- Reason: ${a.explanation}\n`;
        if (a.highlighted_text) example += `- Problematic text: "${a.highlighted_text}"\n`;
        return example;
    }).join('\n');

    const schemaSection = sampleResponse
        ? `\n## Agent Response Structure
The agent returns JSON responses with the following structure (example from a real response):
${JSON.stringify(truncateValues(sampleResponse), null, 2)}

In your judge criteria, you MAY reference specific response fields using {{response.fieldName}} syntax.
Example: "Fail if {{response.confidence_score}} is below 0.5"
Example: "Fail if {{response.sources}} contains fewer than 2 items"
Only use this syntax if the criteria is meaningfully tied to a specific field — plain text criteria are also valid.\n`
        : '';

    return `You are analyzing annotated test run failures to suggest judge criteria.

## Test Context
Test: ${run.test_data_name}
${schemaSection}
## Annotated Failures
${examples}

## Task
Based on these failure patterns, suggest 1-3 judges that would catch similar issues.
Each judge should have:
- name: Short descriptive name (e.g., "No External Referrals", "Polite Tone Required")
- criteria: Clear, specific criteria the LLM judge should check for
- severity: "fail" or "warn"

Criteria may optionally reference specific response fields using {{response.fieldName}} syntax
when that makes the judge more precise. Example:
  {"name": "High Confidence Required", "criteria": "Fail if any {{response.confidence_score}} is below 0.7", "severity": "fail"}

## Output Format
Return a JSON array of judge objects:
[
  {"name": "...", "criteria": "...", "severity": "fail"},
  ...
]

Generate the judges now:`;
}
