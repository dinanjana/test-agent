import { IScenario } from '../models/scenario';
import { RunnerService } from './runner.service';
import { JudgeService } from './judge.service';

export class ScenarioRunner {
    private runner: RunnerService;

    constructor() {
        this.runner = new RunnerService();
    }

    async runScenario(scenario: IScenario, agentUrl: string, apiKey?: string) {
        const results = [];

        for (const turn of scenario.turns) {
            if (turn.role === 'user') {
                const turnStartTime = Date.now();

                // 1. Execute Turn
                const agentResult = await this.runner.runTurn(agentUrl, turn.message || "", scenario.id);

                // 2. Evaluate with each judge via JudgeService (single source of truth)
                const conversation = `User: ${turn.message || ""}\nAgent: ${agentResult.response}`;
                const evaluations = await Promise.all(
                    scenario.judge_ids.map(async (judgeId) => {
                        try {
                            return await JudgeService.evaluateWithJudge(
                                judgeId,
                                conversation,
                                /* appId — scenarios are not app-scoped yet; pass empty string
                                   and let apiKeyOverride take precedence */
                                '',
                                apiKey
                            );
                        } catch (err) {
                            console.error(`[ScenarioRunner] Error running judge ${judgeId}:`, err);
                            return {
                                judge_id: judgeId,
                                judge_name: judgeId,
                                passed: false,
                                severity: 'fail' as const,
                                reasoning: `System Error: Failed to execute judge. ${err}`
                            };
                        }
                    })
                );

                results.push({
                    turn_number: results.length + 1,
                    role: 'agent',
                    message: agentResult.response,
                    timestamp_ms: Date.now() - turnStartTime,
                    evaluations
                });
            }
        }

        return results;
    }
}
