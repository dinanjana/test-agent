import { Agent, IAgent } from '../models/agent';

export class AgentService {
    static async createAgent(data: Partial<IAgent>): Promise<IAgent> {
        const agent = new Agent(data);
        return agent.save();
    }

    static async getAllAgents(): Promise<IAgent[]> {
        return Agent.find({ active: true }).sort({ created_at: -1 });
    }

    static async getAgentById(id: string): Promise<IAgent | null> {
        return Agent.findById(id);
    }

    static async updateAgent(id: string, data: Partial<IAgent>): Promise<IAgent | null> {
        return Agent.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteAgent(id: string): Promise<boolean> {
        const result = await Agent.findByIdAndDelete(id);
        return !!result;
    }

    static async testConnection(id: string): Promise<{ success: boolean; latency_ms: number; response?: any; error?: string }> {
        const agent = await Agent.findById(id);
        if (!agent) {
            return { success: false, latency_ms: 0, error: 'Agent not found' };
        }

        const startTime = Date.now();

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            // Add auth headers
            if (agent.auth_type === 'bearer' && agent.auth_token) {
                headers['Authorization'] = `Bearer ${agent.auth_token}`;
            } else if (agent.auth_type === 'api_key' && agent.auth_token) {
                headers[agent.api_key_header || 'X-API-Key'] = agent.auth_token;
            }

            const response = await fetch(agent.endpoint_url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ message: 'Hello, this is a test message from TestAgent.' })
            });

            const latency_ms = Date.now() - startTime;
            const data = await response.json();

            // Update agent with test results
            await Agent.findByIdAndUpdate(id, {
                last_tested_at: new Date(),
                last_test_status: response.ok ? 'success' : 'failed',
                last_test_latency_ms: latency_ms
            });

            if (!response.ok) {
                return { success: false, latency_ms, error: `HTTP ${response.status}: ${response.statusText}` };
            }

            return { success: true, latency_ms, response: data };
        } catch (error: any) {
            const latency_ms = Date.now() - startTime;

            await Agent.findByIdAndUpdate(id, {
                last_tested_at: new Date(),
                last_test_status: 'failed',
                last_test_latency_ms: latency_ms
            });

            return { success: false, latency_ms, error: error.message || 'Connection failed' };
        }
    }
}
