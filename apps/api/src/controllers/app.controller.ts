import { Request, Response } from 'express';
import { AppService } from '../services/app.service';
import { EnvironmentService } from '../services/environment.service';
import { DomainService } from '../services/domain.service';

export class AppController {
    // App CRUD
    static async createApp(req: Request, res: Response) {
        try {
            const app = await AppService.createApp(req.body);
            res.status(201).json(app);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to create app' });
        }
    }

    static async listApps(req: Request, res: Response) {
        try {
            const apps = await AppService.getAllApps();
            res.status(200).json(apps);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list apps' });
        }
    }

    static async getApp(req: Request, res: Response) {
        try {
            const app = await AppService.getAppById(req.params.appId);
            if (!app) return res.status(404).json({ error: 'App not found' });
            res.status(200).json(app);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get app' });
        }
    }

    static async updateApp(req: Request, res: Response) {
        try {
            const app = await AppService.updateApp(req.params.appId, req.body);
            if (!app) return res.status(404).json({ error: 'App not found' });
            res.status(200).json(app);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update app' });
        }
    }

    static async deleteApp(req: Request, res: Response) {
        try {
            const success = await AppService.deleteApp(req.params.appId);
            if (!success) return res.status(404).json({ error: 'App not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete app' });
        }
    }

    // Environment management
    static async listEnvironments(req: Request, res: Response) {
        try {
            const environments = await EnvironmentService.getEnvironmentsByApp(req.params.appId);
            res.status(200).json(environments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list environments' });
        }
    }

    static async createEnvironment(req: Request, res: Response) {
        try {
            const env = await EnvironmentService.createEnvironment(req.params.appId, req.body);
            res.status(201).json(env);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to create environment' });
        }
    }

    static async updateEnvironment(req: Request, res: Response) {
        try {
            const env = await EnvironmentService.updateEnvironment(req.params.envId, req.body);
            if (!env) return res.status(404).json({ error: 'Environment not found' });
            res.status(200).json(env);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update environment' });
        }
    }

    static async deleteEnvironment(req: Request, res: Response) {
        try {
            const success = await EnvironmentService.deleteEnvironment(req.params.envId);
            if (!success) return res.status(404).json({ error: 'Environment not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete environment' });
        }
    }

    static async testEnvironment(req: Request, res: Response) {
        try {
            const result = await EnvironmentService.testConnection(req.params.envId);
            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to test environment' });
        }
    }

    // Domain management
    static async listDomains(req: Request, res: Response) {
        try {
            const domains = await DomainService.getDomainsByApp(req.params.appId);
            res.status(200).json(domains);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list domains' });
        }
    }

    static async createDomain(req: Request, res: Response) {
        try {
            const domain = await DomainService.createDomain(req.params.appId, req.body);
            res.status(201).json(domain);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to create domain' });
        }
    }

    static async updateDomain(req: Request, res: Response) {
        try {
            const domain = await DomainService.updateDomain(req.params.domainId, req.body);
            if (!domain) return res.status(404).json({ error: 'Domain not found' });
            res.status(200).json(domain);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update domain' });
        }
    }

    static async deleteDomain(req: Request, res: Response) {
        try {
            const success = await DomainService.deleteDomain(req.params.domainId);
            if (!success) return res.status(404).json({ error: 'Domain not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete domain' });
        }
    }
}
