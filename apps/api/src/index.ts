import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load env vars

import { TestController } from './controllers/test.controller';
import { JudgeController } from './controllers/judge.controller';
import { ScenarioController } from './controllers/scenario.controller';
import { AgentController } from './controllers/agent.controller';
import { AppController } from './controllers/app.controller';
import { TestDataController } from './controllers/testData.controller';
import { SettingsController } from './controllers/settings.controller';
import { GenerateController } from './controllers/generate.controller';
import { RunsController } from './controllers/runs.controller';
import { AnnotationController } from './controllers/annotation.controller';
import { IntegrationsController } from './controllers/integrations.controller';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'test-agent-api' });
});

// Routes
app.post('/api/run', TestController.runTest);
app.post('/api/scenarios/:id/run', TestController.runScenario);
app.get('/api/runs', TestController.getRuns);

// Mock Agent for Testing
app.post('/api/mock-agent', (req, res) => {
    const { message } = req.body;
    res.json({
        response: `Mock Agent received: ${message}. I am a friendly bot.`,
        metadata: { model: 'mock-gpt' }
    });
});

// Judge Routes
app.post('/api/judges', JudgeController.create);
app.get('/api/judges', JudgeController.list);
app.get('/api/judges/:id', JudgeController.get);
app.put('/api/judges/:id', JudgeController.update);
app.delete('/api/judges/:id', JudgeController.delete);

// Scenario Routes
app.post('/api/scenarios', ScenarioController.create);
app.get('/api/scenarios', ScenarioController.list);
app.get('/api/scenarios/:id', ScenarioController.get);
app.put('/api/scenarios/:id', ScenarioController.update);
app.delete('/api/scenarios/:id', ScenarioController.delete);

// Agent Routes (Legacy - will be deprecated)
app.post('/api/agents', AgentController.create);
app.get('/api/agents', AgentController.list);
app.get('/api/agents/:id', AgentController.get);
app.put('/api/agents/:id', AgentController.update);
app.delete('/api/agents/:id', AgentController.delete);
app.post('/api/agents/:id/test', AgentController.testConnection);

// ===========================================
// NEW: App-Centric Routes (per PRD hierarchy)
// ===========================================

// Apps
app.post('/api/apps', AppController.createApp);
app.get('/api/apps', AppController.listApps);
app.get('/api/apps/:appId', AppController.getApp);
app.put('/api/apps/:appId', AppController.updateApp);
app.delete('/api/apps/:appId', AppController.deleteApp);

// Environments (per app)
app.get('/api/apps/:appId/environments', AppController.listEnvironments);
app.post('/api/apps/:appId/environments', AppController.createEnvironment);
app.put('/api/apps/:appId/environments/:envId', AppController.updateEnvironment);
app.delete('/api/apps/:appId/environments/:envId', AppController.deleteEnvironment);
app.post('/api/apps/:appId/environments/:envId/test', AppController.testEnvironment);

// Domains (per app, optional)
app.get('/api/apps/:appId/domains', AppController.listDomains);
app.post('/api/apps/:appId/domains', AppController.createDomain);
app.put('/api/apps/:appId/domains/:domainId', AppController.updateDomain);
app.delete('/api/apps/:appId/domains/:domainId', AppController.deleteDomain);

// Test Data Sets (per app, optionally scoped to domain)
app.get('/api/apps/:appId/test-data', TestDataController.list);
app.post('/api/apps/:appId/test-data', TestDataController.create);
app.get('/api/apps/:appId/test-data/:id', TestDataController.get);
app.put('/api/apps/:appId/test-data/:id', TestDataController.update);
app.delete('/api/apps/:appId/test-data/:id', TestDataController.delete);
app.post('/api/apps/:appId/test-data/:id/run', TestDataController.run);
app.post('/api/apps/:appId/test-data/:id/run-suite', TestDataController.runSuite);

// App Settings (LLM configuration)
app.get('/api/apps/:appId/settings', SettingsController.get);
app.put('/api/apps/:appId/settings', SettingsController.update);

// Synthetic Data Generation
app.post('/api/apps/:appId/generate-conversations', GenerateController.generateConversations);
app.post('/api/apps/:appId/parse-csv', GenerateController.parseCSV);

// Test Runs (history, stats, feedback)
app.get('/api/apps/:appId/runs', RunsController.list);
app.get('/api/apps/:appId/runs/stats', RunsController.stats);
app.get('/api/apps/:appId/runs/:runId', RunsController.get);
app.post('/api/apps/:appId/runs/:runId/feedback', RunsController.addFeedback);

// Annotations for judge generation
app.post('/api/apps/:appId/runs/:runId/annotations', AnnotationController.saveAnnotations);
app.get('/api/apps/:appId/runs/:runId/annotations', AnnotationController.getAnnotations);
app.post('/api/apps/:appId/generate-judges-from-annotations', AnnotationController.generateJudges);
app.post('/api/apps/:appId/create-judges-from-suggestions', AnnotationController.createJudges);
app.post('/api/apps/:appId/refine-judges', AnnotationController.refineJudges);

// Integrations (Jira/Linear)
app.get('/api/apps/:appId/integrations/status', IntegrationsController.getStatus);
app.post('/api/apps/:appId/integrations/jira/connect', IntegrationsController.connectJira);
app.post('/api/apps/:appId/integrations/linear/connect', IntegrationsController.connectLinear);
app.post('/api/apps/:appId/integrations/disconnect', IntegrationsController.disconnect);
app.post('/api/apps/:appId/tickets', IntegrationsController.createTicket);

// Central error handler — must be last
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testagent';

const start = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`API Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

start();
