import { Environment, IEnvironment } from '../models/environment';

export class EnvironmentService {
    static async createEnvironment(appId: string, data: Partial<IEnvironment>): Promise<IEnvironment> {
        const environment = new Environment({
            ...data,
            app_id: appId,
            slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
        return environment.save();
    }

    static async getEnvironmentsByApp(appId: string): Promise<IEnvironment[]> {
        return Environment.find({ app_id: appId }).sort({ is_default: -1, name: 1 });
    }

    static async getEnvironmentById(id: string): Promise<IEnvironment | null> {
        return Environment.findById(id);
    }

    static async getDefaultEnvironment(appId: string): Promise<IEnvironment | null> {
        return Environment.findOne({ app_id: appId, is_default: true });
    }

    static async updateEnvironment(id: string, data: Partial<IEnvironment>): Promise<IEnvironment | null> {
        return Environment.findByIdAndUpdate(id, data, { new: true });
    }

    static async setAsDefault(id: string, appId: string): Promise<IEnvironment | null> {
        // Unset current default
        await Environment.updateMany({ app_id: appId }, { is_default: false });
        // Set new default
        return Environment.findByIdAndUpdate(id, { is_default: true }, { new: true });
    }

    static async deleteEnvironment(id: string): Promise<boolean> {
        const result = await Environment.findByIdAndDelete(id);
        return !!result;
    }

    static async testConnection(id: string): Promise<{ success: boolean; latency_ms: number; response?: any; error?: string }> {
        const env = await Environment.findById(id);
        if (!env || !env.endpoint_url) {
            return { success: false, latency_ms: 0, error: 'Environment not configured' };
        }

        const startTime = Date.now();

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (env.auth_type === 'bearer' && env.auth_token) {
                headers['Authorization'] = `Bearer ${env.auth_token}`;
            } else if (env.auth_type === 'api_key' && env.auth_token) {
                headers[env.api_key_header || 'X-API-Key'] = env.auth_token;
            }

            const response = await fetch(env.endpoint_url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ message: 'Hello, this is a test from TestAgent.' })
            });

            const latency_ms = Date.now() - startTime;
            const data = await response.json();

            await Environment.findByIdAndUpdate(id, {
                last_tested_at: new Date(),
                last_test_status: response.ok ? 'success' : 'failed',
                last_test_latency_ms: latency_ms,
                ...(response.ok && data && typeof data === 'object' ? { last_test_response: data } : {})
            });

            if (!response.ok) {
                return { success: false, latency_ms, error: `HTTP ${response.status}` };
            }

            return { success: true, latency_ms, response: data };
        } catch (error: any) {
            const latency_ms = Date.now() - startTime;
            await Environment.findByIdAndUpdate(id, {
                last_tested_at: new Date(),
                last_test_status: 'failed',
                last_test_latency_ms: latency_ms
            });
            return { success: false, latency_ms, error: error.message };
        }
    }
}
