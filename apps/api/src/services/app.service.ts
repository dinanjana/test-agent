import { App, IApp } from '../models/app';
import { Environment } from '../models/environment';

export class AppService {
    static async createApp(data: Partial<IApp>): Promise<IApp> {
        // Generate slug from name if not provided
        if (!data.slug && data.name) {
            data.slug = data.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const app = new App(data);
        const savedApp = await app.save();

        // Create default environments
        await Environment.create([
            {
                app_id: savedApp._id,
                name: 'Development',
                slug: 'dev',
                endpoint_url: '',
                color: '#3B82F6', // Blue
                is_default: false
            },
            {
                app_id: savedApp._id,
                name: 'Staging',
                slug: 'staging',
                endpoint_url: '',
                color: '#F59E0B', // Amber
                is_default: true
            },
            {
                app_id: savedApp._id,
                name: 'Production',
                slug: 'prod',
                endpoint_url: '',
                color: '#10B981', // Green
                is_default: false
            }
        ]);

        return savedApp;
    }

    static async getAllApps(): Promise<IApp[]> {
        return App.find().sort({ created_at: -1 });
    }

    static async getAppById(id: string): Promise<IApp | null> {
        return App.findById(id);
    }

    static async getAppBySlug(slug: string): Promise<IApp | null> {
        return App.findOne({ slug });
    }

    static async updateApp(id: string, data: Partial<IApp>): Promise<IApp | null> {
        return App.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteApp(id: string): Promise<boolean> {
        // Also delete related environments, judges, test data
        await Environment.deleteMany({ app_id: id });
        const result = await App.findByIdAndDelete(id);
        return !!result;
    }
}
