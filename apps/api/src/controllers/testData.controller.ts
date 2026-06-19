import { Request, Response } from 'express';
import { z } from 'zod';
import { TestDataService } from '../services/testData.service';
import { RunnerService } from '../services/runner.service';

const RunSuiteSchema = z.object({
    environmentId: z.string().min(1, 'environmentId is required'),
    stream: z.boolean().optional().default(false),
});

export class TestDataController {
    static async create(req: Request, res: Response) {
        try {
            const testData = await TestDataService.createTestData(req.params.appId, {
                ...req.body,
                domain_id: req.body.domain_id || undefined
            });
            res.status(201).json(testData);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to create test data' });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const domainId = req.query.domain_id as string | undefined;
            const testData = await TestDataService.getTestDataByApp(req.params.appId, domainId);
            res.status(200).json(testData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list test data' });
        }
    }

    static async get(req: Request, res: Response) {
        try {
            const testData = await TestDataService.getTestDataById(req.params.id);
            if (!testData) return res.status(404).json({ error: 'Test data not found' });
            res.status(200).json(testData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get test data' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const testData = await TestDataService.updateTestData(req.params.id, req.body);
            if (!testData) return res.status(404).json({ error: 'Test data not found' });
            res.status(200).json(testData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update test data' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const success = await TestDataService.deleteTestData(req.params.id);
            if (!success) return res.status(404).json({ error: 'Test data not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete test data' });
        }
    }

    static async run(req: Request, res: Response) {
        try {
            const { environmentId } = req.body;

            if (!environmentId) {
                return res.status(400).json({ error: 'environmentId is required' });
            }

            const runner = new RunnerService();
            const result = await runner.runTestData(req.params.id, environmentId);

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Run failed:', error);
            res.status(500).json({ error: error.message || 'Failed to run test' });
        }
    }

    /**
     * Run entire test suite and return aggregate results for all conversations
     */
    static async runSuite(req: Request, res: Response) {
        try {
            const parsed = RunSuiteSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(422).json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.errors });
            }
            const { environmentId, stream } = parsed.data;

            const runner = new RunnerService();

            if (stream) {
                // Set SSE headers
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.flushHeaders();

                const abortController = new AbortController();
                res.on('close', () => {
                    if (!res.writableEnded) {
                        console.log("[API] Client disconnected — aborting suite run");
                        abortController.abort();
                    }
                });

                let tokenSeq = 0;
                const result = await runner.runTestSuite(
                    req.params.id,
                    environmentId,
                    (convId, convIndex, turnIndex, token) => {
                        res.write(`data: ${JSON.stringify({ conversationId: convId, conversationIndex: convIndex, turnIndex, token, seq: tokenSeq++ })}\n\n`);
                    },
                    abortController.signal
                );

                // Send final result
                console.log("[API] Stream finished, sending results");
                res.write(`data: ${JSON.stringify({ done: true, result })}\n\n`);
                res.end();
            } else {
                const result = await runner.runTestSuite(req.params.id, environmentId);
                res.status(200).json(result);
            }
        } catch (error: any) {
            console.error('Suite run failed:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: error.message || 'Failed to run test suite' });
            } else {
                res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                res.end();
            }
        }
    }
}



