import { Request, Response } from 'express';
import { RunnerService } from '../services/runner.service';
import { AnalysisService } from '../services/analysis.service';
import { TicketService } from '../services/ticket.service';
import { ScenarioService } from '../services/scenario.service';
import { ScenarioRunner } from '../services/scenario.runner';
import { TestRun } from '../models/testRun';
import { z } from 'zod';

const runner = new RunnerService();
const analyzer = new AnalysisService();
const scenarioRunner = new ScenarioRunner();

const RunSchema = z.object({
    agentUrl: z.string().url(),
    userMessage: z.string().min(1),
    scenarioId: z.string().optional()
});

export class TestController {

    // POST /api/run (Legacy/Single Turn)
    static async runTest(req: Request, res: Response) {
        try {
            const { agentUrl, userMessage, scenarioId } = RunSchema.parse(req.body);

            // Extract API Key from headers for BYOK
            const apiKey = req.headers['x-openai-key'] as string | undefined;

            console.log(`[TestController] Starting run against ${agentUrl}`);

            // 1. Run the turn
            const headers: Record<string, string> = {};
            if (scenarioId) {
                headers['x-test-scenario'] = scenarioId;
            }
            const agentResult = await runner.runTurn(agentUrl, userMessage, headers);

            // 2. Analyze
            const analysis = await analyzer.analyzeFailure(userMessage, agentResult.response, apiKey);

            // 3. Generate Ticket if failed
            let ticketMarkdown = undefined;
            if (analysis) {
                ticketMarkdown = TicketService.generateMarkdownTicket({ scenario: scenarioId || 'default' }, analysis);
            }

            // 4. Save Record
            const testRun = new TestRun({
                agentUrl,
                scenario: scenarioId || 'default',
                userMessage,
                agentResponse: agentResult.response,
                status: analysis ? 'fail' : 'pass',
                analysis: analysis || undefined,
                ticketMarkdown
            });
            await testRun.save();

            res.json({
                success: true,
                data: testRun
            });

        } catch (error: any) {
            console.error('TestController Error:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // POST /api/scenarios/:id/run
    static async runScenario(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { agentUrl } = req.body;
            const apiKey = req.headers['x-openai-key'] as string | undefined;

            if (!agentUrl) {
                return res.status(400).json({ error: 'agentUrl is required' });
            }

            const scenario = await ScenarioService.getScenarioById(id);
            if (!scenario) {
                return res.status(404).json({ error: 'Scenario not found' });
            }

            console.log(`[TestController] Running Scenario ${scenario.name} against ${agentUrl}`);

            const startTime = Date.now();
            const turnResults = await scenarioRunner.runScenario(scenario, agentUrl, apiKey);
            const duration_ms = Date.now() - startTime;

            // Determine generic status
            const hasFailures = turnResults.some(t =>
                t.evaluations.some(e => e.severity === 'fail' && !e.passed)
            );
            const status = hasFailures ? 'fail' : 'pass';

            // Save TestRun
            const testRun = new TestRun({
                agentUrl,
                scenarioId: scenario.id,
                scenarioName: scenario.name,
                turns: turnResults, // Mongoose schema needs to match this structure
                status,
                duration_ms
            });
            await testRun.save();

            res.json(testRun);

        } catch (error: any) {
            console.error('Run Scenario Error:', error);
            res.status(500).json({ error: 'Failed to run scenario', details: error.message });
        }
    }

    // GET /api/runs
    static async getRuns(req: Request, res: Response) {
        try {
            const runs = await TestRun.find().sort({ createdAt: -1 }).limit(10);
            res.json({ success: true, data: runs });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
