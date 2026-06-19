import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';

export class SettingsController {
    static async get(req: Request, res: Response) {
        try {
            const settings = await SettingsService.getSettings(req.params.appId);
            res.status(200).json(settings);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to get settings' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { openai, anthropic, google } = req.body;

            const settings = await SettingsService.updateSettings(req.params.appId, {
                openai,
                anthropic,
                google
            });

            res.status(200).json(settings);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Failed to update settings' });
        }
    }
}
