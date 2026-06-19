import { Request, Response } from 'express';
import { TestRun } from '../models/testRun';

export class RunsController {
    /**
     * List test runs for an app
     * GET /api/apps/:appId/runs
     * Query params: limit, offset, test_data_id
     */
    static async list(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
            const offset = parseInt(req.query.offset as string) || 0;
            const testDataId = req.query.test_data_id as string | undefined;
            const groupBySuite = req.query.group_by_suite === 'true';

            const query: any = { app_id: appId };
            if (testDataId) {
                query.test_data_id = testDataId;
            }

            // If grouping, fetch more individual runs to ensure complete suite groups
            const fetchLimit = groupBySuite ? Math.max(limit * 10, 200) : limit;
            const [runs, total] = await Promise.all([
                TestRun.find(query)
                    .sort({ completed_at: -1 })
                    .skip(groupBySuite ? 0 : offset)
                    .limit(fetchLimit)
                    .lean(),
                TestRun.countDocuments(query)
            ]);

            if (!groupBySuite) {
                return res.status(200).json({
                    runs,
                    total,
                    limit,
                    offset
                });
            }

            // Group runs into logical suites
            const suiteRuns: any[] = [];

            // Helper to find a matching existing suite in our result list
            // Matches if test_data_id is same and started_at is within 1 minute
            const findMatchingSuite = (run: any) => {
                const runDate = new Date(run.started_at);
                return suiteRuns.find(s => {
                    if (s.test_data_id.toString() !== run.test_data_id.toString()) return false;
                    const suiteDate = new Date(s.started_at);
                    const diff = Math.abs(runDate.getTime() - suiteDate.getTime());
                    return diff < 60000; // 60 seconds window
                });
            };

            for (const run of runs) {
                const existingSuite = findMatchingSuite(run);
                if (existingSuite) {
                    existingSuite.runs.push(run);
                    // Update suite stats
                    existingSuite.conversations_total++;
                    if (run.overall_passed) existingSuite.conversations_passed++;
                    existingSuite.total_latency_ms += (run.total_latency_ms || 0);
                    // Keep the earliest start time for the suite? Or latest completed?
                    // Let's keep the timestamp of the first run we encountered (which is latest due to sort)
                } else {
                    suiteRuns.push({
                        _id: run._id, // Use the ID of the first run as the suite ID proxy
                        test_data_id: run.test_data_id,
                        test_data_name: run.test_data_name,
                        started_at: run.started_at,
                        completed_at: run.completed_at,
                        conversations_passed: run.overall_passed ? 1 : 0,
                        conversations_total: 1,
                        total_latency_ms: run.total_latency_ms || 0,
                        runs: [run]
                    });
                }
            }

            // Calculate overall status for each suite
            suiteRuns.forEach(suite => {
                suite.overall_passed = suite.conversations_passed === suite.conversations_total;
            });

            res.status(200).json({
                runs: suiteRuns, // The frontend expects "runs" array, but now these are suite objects
                total, // This is total *individual* runs, which might be confusing but acceptable for pagination proxy
                limit,
                offset
            });

        } catch (error: any) {
            console.error('Failed to list runs:', error);
            res.status(500).json({ error: error.message || 'Failed to list runs' });
        }
    }

    /**
     * Get a single test run
     * GET /api/apps/:appId/runs/:runId
     */
    static async get(req: Request, res: Response) {
        try {
            const { runId } = req.params;
            const run = await TestRun.findById(runId).lean();

            if (!run) {
                return res.status(404).json({ error: 'Test run not found' });
            }

            res.status(200).json(run);
        } catch (error: any) {
            console.error('Failed to get run:', error);
            res.status(500).json({ error: error.message || 'Failed to get run' });
        }
    }

    /**
     * Submit feedback for a judge evaluation
     * POST /api/apps/:appId/runs/:runId/feedback
     * Body: { judge_id, correct, comment? }
     */
    static async addFeedback(req: Request, res: Response) {
        try {
            const { runId } = req.params;
            const { judge_id, correct, comment } = req.body;

            if (!judge_id || typeof correct !== 'boolean') {
                return res.status(400).json({ error: 'judge_id and correct (boolean) are required' });
            }

            const run = await TestRun.findByIdAndUpdate(
                runId,
                {
                    $push: {
                        feedback: {
                            judge_id,
                            correct,
                            comment,
                            created_at: new Date()
                        }
                    }
                },
                { new: true }
            );

            if (!run) {
                return res.status(404).json({ error: 'Test run not found' });
            }

            res.status(200).json({ success: true, feedback: run.feedback });
        } catch (error: any) {
            console.error('Failed to add feedback:', error);
            res.status(500).json({ error: error.message || 'Failed to add feedback' });
        }
    }

    /**
     * Get aggregate stats for an app (for dashboard)
     * GET /api/apps/:appId/runs/stats
     */
    static async stats(req: Request, res: Response) {
        try {
            const { appId } = req.params;
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const [totalRuns, passedRuns, recentRuns] = await Promise.all([
                TestRun.countDocuments({ app_id: appId }),
                TestRun.countDocuments({ app_id: appId, overall_passed: true }),
                TestRun.countDocuments({ app_id: appId, completed_at: { $gte: sevenDaysAgo } })
            ]);

            const passRate = totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 0;

            // Get daily trend
            const dailyTrend = await TestRun.aggregate([
                {
                    $match: {
                        app_id: appId,
                        completed_at: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completed_at' } },
                        total: { $sum: 1 },
                        passed: { $sum: { $cond: ['$overall_passed', 1, 0] } }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Get domain breakdown
            const domainStats = await TestRun.aggregate([
                {
                    $match: { app_id: appId, domain_id: { $exists: true, $ne: null } }
                },
                {
                    $lookup: {
                        from: 'domains',
                        localField: 'domain_id',
                        foreignField: '_id',
                        as: 'domain'
                    }
                },
                { $unwind: '$domain' },
                {
                    $group: {
                        _id: '$domain_id',
                        domain_name: { $first: '$domain.name' },
                        total_runs: { $sum: 1 },
                        passed_runs: { $sum: { $cond: ['$overall_passed', 1, 0] } }
                    }
                },
                { $sort: { total_runs: -1 } }
            ]);

            res.status(200).json({
                passRate,
                totalRuns,
                recentRuns,
                dailyTrend: dailyTrend.map(d => ({
                    date: d._id,
                    passRate: d.total > 0 ? Math.round((d.passed / d.total) * 100) : 0,
                    total: d.total
                })),
                domainStats: domainStats.map(d => ({
                    domain_id: d._id,
                    domain_name: d.domain_name,
                    total_runs: d.total_runs,
                    passed_runs: d.passed_runs,
                    pass_rate: d.total_runs > 0 ? Math.round((d.passed_runs / d.total_runs) * 100) : 0
                }))
            });
        } catch (error: any) {
            console.error('Failed to get stats:', error);
            res.status(500).json({ error: error.message || 'Failed to get stats' });
        }
    }
}
