import { Request, Response } from 'express';
import { AppSettings } from '../models/appSettings';
import { TestRun } from '../models/testRun';

/**
 * Integrations Controller
 * Handles Jira and Linear ticket creation from failed test runs
 */
export class IntegrationsController {

    /**
     * Connect Linear with API key
     */
    static async connectLinear(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { api_key, team_id } = req.body;

            // Verify API key by fetching teams
            const response = await fetch('https://api.linear.app/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': api_key
                },
                body: JSON.stringify({
                    query: `query { teams { nodes { id name } } }`
                })
            });

            const data = await response.json();
            if (data.errors) {
                return res.status(400).json({ error: 'Invalid Linear API key' });
            }

            // Save config
            await AppSettings.findOneAndUpdate(
                { app_id: appId },
                {
                    $set: {
                        linear: {
                            api_key,
                            team_id: team_id || data.data?.teams?.nodes?.[0]?.id,
                            connected: true
                        }
                    }
                },
                { upsert: true }
            );

            res.json({
                success: true,
                teams: data.data?.teams?.nodes || []
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Connect Jira (simplified - API token based)
     */
    static async connectJira(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { email, api_token, domain, project_key } = req.body;

            // Verify credentials by fetching projects
            const auth = Buffer.from(`${email}:${api_token}`).toString('base64');
            const response = await fetch(`https://${domain}.atlassian.net/rest/api/3/project`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                return res.status(400).json({ error: 'Invalid Jira credentials' });
            }

            const projects = await response.json();

            // Save config
            await AppSettings.findOneAndUpdate(
                { app_id: appId },
                {
                    $set: {
                        jira: {
                            cloud_id: domain,
                            access_token: `${email}:${api_token}`,
                            project_key: project_key || projects[0]?.key,
                            issue_type: 'Bug',
                            connected: true
                        }
                    }
                },
                { upsert: true }
            );

            res.json({
                success: true,
                projects: projects.map((p: any) => ({ key: p.key, name: p.name }))
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Disconnect integration
     */
    static async disconnect(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { provider } = req.body; // 'jira' or 'linear'

            const update = provider === 'jira'
                ? { $unset: { jira: 1 } }
                : { $unset: { linear: 1 } };

            await AppSettings.findOneAndUpdate({ app_id: appId }, update);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Get integration status
     */
    static async getStatus(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const settings = await AppSettings.findOne({ app_id: appId });

            res.json({
                jira: { connected: !!settings?.jira?.connected },
                linear: { connected: !!settings?.linear?.connected }
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Create ticket from failed run
     */
    static async createTicket(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const { runId, provider, title, description } = req.body;

            const settings = await AppSettings.findOne({ app_id: appId });
            const run = await TestRun.findById(runId);

            if (!run) {
                return res.status(404).json({ error: 'Run not found' });
            }

            // Build ticket content
            const ticketTitle = title || `[TestAgent] Test failed: ${run.test_data_name}`;
            const ticketBody = description || IntegrationsController.buildTicketDescription(run);

            if (provider === 'linear' && settings?.linear?.connected) {
                const result = await IntegrationsController.createLinearIssue(
                    settings.linear,
                    ticketTitle,
                    ticketBody
                );
                return res.json(result);
            }

            if (provider === 'jira' && settings?.jira?.connected) {
                const result = await IntegrationsController.createJiraIssue(
                    settings.jira,
                    ticketTitle,
                    ticketBody
                );
                return res.json(result);
            }

            res.status(400).json({ error: 'Integration not connected' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Build ticket description from run
     */
    private static buildTicketDescription(run: any): string {
        const lines = [
            '## Test Details',
            `- **Test Suite:** ${run.test_data_name}`,
            `- **Run Time:** ${new Date(run.completed_at).toLocaleString()}`,
            `- **Status:** ${run.overall_passed ? 'PASSED' : 'FAILED'}`,
            '',
            '## Conversation Transcript'
        ];

        // Add turns
        run.turns?.forEach((turn: any, i: number) => {
            if (turn.role === 'user') {
                lines.push(`\n**User:** ${turn.input}`);
                if (turn.actual) {
                    lines.push(`**Agent:** ${turn.actual}`);
                }
            }
        });

        // Add judge results
        if (run.judge_results?.length > 0) {
            lines.push('', '## Judge Results');
            run.judge_results.forEach((j: any) => {
                const status = j.passed ? '✅' : '❌';
                lines.push(`${status} **${j.judge_name}**: ${j.reason || 'No details'}`);
            });
        }

        return lines.join('\n');
    }

    /**
     * Create Linear issue
     */
    private static async createLinearIssue(config: any, title: string, description: string) {
        const response = await fetch('https://api.linear.app/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.api_key
            },
            body: JSON.stringify({
                query: `
                    mutation CreateIssue($title: String!, $description: String, $teamId: String!) {
                        issueCreate(input: { title: $title, description: $description, teamId: $teamId }) {
                            success
                            issue { id identifier url }
                        }
                    }
                `,
                variables: { title, description, teamId: config.team_id }
            })
        });

        const data = await response.json();
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        return {
            success: true,
            provider: 'linear',
            issue: data.data.issueCreate.issue
        };
    }

    /**
     * Create Jira issue
     */
    private static async createJiraIssue(config: any, title: string, description: string) {
        const auth = Buffer.from(config.access_token).toString('base64');

        const response = await fetch(`https://${config.cloud_id}.atlassian.net/rest/api/3/issue`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    project: { key: config.project_key },
                    summary: title,
                    description: {
                        type: 'doc',
                        version: 1,
                        content: [{
                            type: 'paragraph',
                            content: [{ type: 'text', text: description }]
                        }]
                    },
                    issuetype: { name: config.issue_type || 'Bug' }
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errorMessages?.join(', ') || 'Failed to create Jira issue');
        }

        const data = await response.json();
        return {
            success: true,
            provider: 'jira',
            issue: {
                id: data.id,
                key: data.key,
                url: `https://${config.cloud_id}.atlassian.net/browse/${data.key}`
            }
        };
    }
}
