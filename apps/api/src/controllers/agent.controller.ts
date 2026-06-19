import { Request, Response } from 'express';
import { AgentService } from '../services/agent.service';

export class AgentController {
    static async create(req: Request, res: Response) {
        try {
            const agent = await AgentService.createAgent(req.body);
            res.status(201).json(agent);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create agent' });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const agents = await AgentService.getAllAgents();
            res.status(200).json(agents);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list agents' });
        }
    }

    static async get(req: Request, res: Response) {
        try {
            const agent = await AgentService.getAgentById(req.params.id);
            if (!agent) {
                return res.status(404).json({ error: 'Agent not found' });
            }
            res.status(200).json(agent);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get agent' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const agent = await AgentService.updateAgent(req.params.id, req.body);
            if (!agent) {
                return res.status(404).json({ error: 'Agent not found' });
            }
            res.status(200).json(agent);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update agent' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const success = await AgentService.deleteAgent(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Agent not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete agent' });
        }
    }

    static async testConnection(req: Request, res: Response) {
        try {
            const result = await AgentService.testConnection(req.params.id);
            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to test connection' });
        }
    }
}
