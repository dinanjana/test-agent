import { Request, Response } from 'express';
import { ScenarioService } from '../services/scenario.service';

export class ScenarioController {
    static async create(req: Request, res: Response) {
        try {
            const scenario = await ScenarioService.createScenario(req.body);
            res.status(201).json(scenario);
        } catch (error) {
            console.error('Create scenario error:', error);
            res.status(500).json({ error: 'Failed to create scenario' });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const scenarios = await ScenarioService.getAllScenarios();
            res.status(200).json(scenarios);
        } catch (error) {
            console.error('List scenarios error:', error);
            res.status(500).json({ error: 'Failed to list scenarios' });
        }
    }

    static async get(req: Request, res: Response) {
        try {
            const scenario = await ScenarioService.getScenarioById(req.params.id);
            if (!scenario) {
                return res.status(404).json({ error: 'Scenario not found' });
            }
            res.status(200).json(scenario);
        } catch (error) {
            console.error('Get scenario error:', error);
            res.status(500).json({ error: 'Failed to get scenario' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const scenario = await ScenarioService.updateScenario(req.params.id, req.body);
            if (!scenario) {
                return res.status(404).json({ error: 'Scenario not found' });
            }
            res.status(200).json(scenario);
        } catch (error) {
            console.error('Update scenario error:', error);
            res.status(500).json({ error: 'Failed to update scenario' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const success = await ScenarioService.deleteScenario(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Scenario not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Delete scenario error:', error);
            res.status(500).json({ error: 'Failed to delete scenario' });
        }
    }
}
