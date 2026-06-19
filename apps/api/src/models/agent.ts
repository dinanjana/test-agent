import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
    name: string;
    description?: string;
    endpoint_url: string;
    auth_type: 'none' | 'bearer' | 'api_key';
    auth_token?: string;
    api_key_header?: string;
    response_path?: string; // JSON path to extract response (e.g., "data.response")
    last_tested_at?: Date;
    last_test_status?: 'success' | 'failed';
    last_test_latency_ms?: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

const AgentSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    endpoint_url: { type: String, required: true },
    auth_type: {
        type: String,
        enum: ['none', 'bearer', 'api_key'],
        default: 'none'
    },
    auth_token: { type: String },
    api_key_header: { type: String, default: 'X-API-Key' },
    response_path: { type: String, default: 'response' },
    last_tested_at: { type: Date },
    last_test_status: {
        type: String,
        enum: ['success', 'failed']
    },
    last_test_latency_ms: { type: Number },
    active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Agent = mongoose.model<IAgent>('Agent', AgentSchema);
