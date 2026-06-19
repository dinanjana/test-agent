import mongoose, { Schema, Document } from 'mongoose';

export interface IJudge extends Document {
    app_id: mongoose.Types.ObjectId;
    domain_id?: mongoose.Types.ObjectId;
    scope: 'app' | 'domain';
    name: string;
    criteria: string;
    evaluation_type: 'llm' | 'deterministic' | 'hybrid';
    severity: 'fail' | 'warn';
    llm_provider?: 'openai' | 'anthropic' | 'google';
    llm_model?: string;
    active: boolean;
    evaluation_count: number;
    pass_count: number;
    last_triggered_at?: Date;
    created_at: Date;
    updated_at: Date;
}

const JudgeSchema: Schema = new Schema({
    app_id: { type: Schema.Types.ObjectId, ref: 'App', index: true },
    domain_id: { type: Schema.Types.ObjectId, ref: 'Domain', index: true },
    scope: {
        type: String,
        enum: ['app', 'domain'],
        default: 'app'
    },
    name: { type: String, required: true },
    criteria: { type: String, required: true },
    evaluation_type: {
        type: String,
        enum: ['llm', 'deterministic', 'hybrid'],
        default: 'llm'
    },
    severity: {
        type: String,
        enum: ['fail', 'warn'],
        default: 'fail'
    },
    llm_provider: {
        type: String,
        enum: ['openai', 'anthropic', 'google'],
        default: 'openai'
    },
    llm_model: {
        type: String,
        default: 'gpt-4o-mini'
    },
    active: { type: Boolean, default: true },
    evaluation_count: { type: Number, default: 0 },
    pass_count: { type: Number, default: 0 },
    last_triggered_at: { type: Date }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Judge = mongoose.model<IJudge>('Judge', JudgeSchema);
