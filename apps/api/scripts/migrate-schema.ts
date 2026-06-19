/**
 * One-time migration script — run once then delete.
 *
 * Removes legacy fields from TestRun documents and converts
 * judge_ids string arrays to ObjectId arrays in TestDataSet documents.
 *
 * Usage:
 *   MONGO_URI=mongodb://... npx ts-node scripts/migrate-schema.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testagent';

async function run() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db!;

    // 1. Drop legacy fields from TestRun documents
    const legacyTestRunFields = {
        agentUrl: 1,
        scenarioId: 1,
        scenarioName: 1,
        userMessage: 1,
        agentResponse: 1,
        status: 1,
        error: 1,
        analysis: 1,
        ticketMarkdown: 1,
        duration_ms: 1,
        createdAt: 1,
    };

    const testRunResult = await db.collection('testruns').updateMany(
        {},
        { $unset: legacyTestRunFields }
    );
    console.log(`TestRun migration: modified ${testRunResult.modifiedCount} documents`);

    // 2. Convert judge_ids from strings to ObjectIds in TestDataSet documents
    const testDataSets = await db.collection('testdatasets').find({}).toArray();
    let convertedSuites = 0;

    for (const suite of testDataSets) {
        let needsUpdate = false;
        const suiteJudgeIds = (suite.judge_ids || []).map((id: string | mongoose.Types.ObjectId) => {
            if (typeof id === 'string') { needsUpdate = true; return new mongoose.Types.ObjectId(id); }
            return id;
        });

        const updatedConversations = (suite.conversations || []).map((conv: any) => {
            const convJudgeIds = (conv.judge_ids || []).map((id: string | mongoose.Types.ObjectId) => {
                if (typeof id === 'string') { needsUpdate = true; return new mongoose.Types.ObjectId(id); }
                return id;
            });
            return { ...conv, judge_ids: convJudgeIds };
        });

        if (needsUpdate) {
            await db.collection('testdatasets').updateOne(
                { _id: suite._id },
                { $set: { judge_ids: suiteJudgeIds, conversations: updatedConversations } }
            );
            convertedSuites++;
        }
    }

    console.log(`TestDataSet migration: converted judge_ids in ${convertedSuites} documents`);
    console.log('Migration complete.');
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
