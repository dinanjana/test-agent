import { Request, Response } from 'express';
import { z } from 'zod';
import { GenerateService } from '../services/generate.service';

const GenerateConversationsSchema = z.object({
    suiteName: z.string().min(1, 'suiteName is required'),
    suiteDescription: z.string().optional(),
    singleTurnCount: z.number().int().min(0).max(50).default(5),
    multiTurnCount: z.number().int().min(0).max(20).default(0),
    turnsPerMulti: z.number().int().min(2).max(10).optional(),
    existingQuestions: z.array(z.string()).optional(),
});

const ParseCSVSchema = z.object({
    csvContent: z.string().min(1, 'csvContent is required').max(500_000, 'CSV content exceeds 500KB limit'),
});

export class GenerateController {
    /**
     * Generate conversations using LLM
     * POST /api/apps/:appId/generate-conversations
     */
    static async generateConversations(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const parsed = GenerateConversationsSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(422).json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.errors });
            }
            const { suiteName, suiteDescription, singleTurnCount, multiTurnCount, turnsPerMulti } = parsed.data;

            const result = await GenerateService.generateConversations(appId, {
                suiteName,
                suiteDescription,
                singleTurnCount,
                multiTurnCount,
                turnsPerMulti: turnsPerMulti || 3
            });

            if (result.error) {
                return res.status(500).json({ error: result.error, conversations: [] });
            }

            res.json({ conversations: result.conversations });
        } catch (error: any) {
            console.error('[GenerateController] Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Parse CSV file into conversations
     * POST /api/apps/:appId/parse-csv
     */
    static async parseCSV(req: Request, res: Response) {
        try {
            const parsed = ParseCSVSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(422).json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.errors });
            }

            const conversations = GenerateService.parseCSV(parsed.data.csvContent);
            res.json({ conversations });
        } catch (error: any) {
            console.error('[GenerateController] CSV parse error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
