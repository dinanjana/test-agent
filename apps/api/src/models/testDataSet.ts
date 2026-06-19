import mongoose, { Schema, Document } from 'mongoose';

export interface ITurn {
    role: 'user' | 'agent';
    message?: string;
}

export interface IConversation {
    name: string;
    description?: string;
    turns: ITurn[];
    judge_ids?: mongoose.Types.ObjectId[]; // Override suite-level judges (ObjectId refs)
}

export interface ITestSuite extends Document {
    app_id: mongoose.Types.ObjectId;
    domain_id?: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    conversations: IConversation[];
    judge_ids: mongoose.Types.ObjectId[]; // Suite-level default judges (ObjectId refs)
    source_type: 'manual' | 'upload' | 'discover';
    created_at: Date;
    updated_at: Date;
}

const TurnSchema = new Schema({
    role: { type: String, enum: ['user', 'agent'], required: true },
    message: { type: String }
}, { _id: false });

const ConversationSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    turns: { type: [TurnSchema], required: true },
    judge_ids: [{ type: Schema.Types.ObjectId, ref: 'Judge' }] // Optional override
}, { _id: true });

const TestSuiteSchema: Schema = new Schema({
    app_id: { type: Schema.Types.ObjectId, ref: 'App', required: true, index: true },
    domain_id: { type: Schema.Types.ObjectId, ref: 'Domain', index: true },
    name: { type: String, required: true },
    description: { type: String },
    conversations: { type: [ConversationSchema], required: true, default: [] },
    judge_ids: [{ type: Schema.Types.ObjectId, ref: 'Judge' }],
    source_type: {
        type: String,
        enum: ['manual', 'upload', 'discover'],
        default: 'manual'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Model name matches the TypeScript export name
export const TestDataSet = mongoose.model<ITestSuite>('TestDataSet', TestSuiteSchema);

// Alias kept for imports in runner.service.ts that use TestSuite
export const TestSuite = TestDataSet;
