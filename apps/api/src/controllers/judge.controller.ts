import { Request, Response } from 'express';
import { JudgeService } from '../services/judge.service';

export class JudgeController {
    static async create(req: Request, res: Response) {
        try {
            const judge = await JudgeService.createJudge(req.body);
            res.status(201).json(judge);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create judge' });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const judges = await JudgeService.getAllJudges();
            res.status(200).json(judges);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list judges' });
        }
    }

    static async get(req: Request, res: Response) {
        try {
            const judge = await JudgeService.getJudgeById(req.params.id);
            if (!judge) {
                return res.status(404).json({ error: 'Judge not found' });
            }
            res.status(200).json(judge);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get judge' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const judge = await JudgeService.updateJudge(req.params.id, req.body);
            if (!judge) {
                return res.status(404).json({ error: 'Judge not found' });
            }
            res.status(200).json(judge);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update judge' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const success = await JudgeService.deleteJudge(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Judge not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete judge' });
        }
    }
}
