import mongoose, { Schema, Document } from 'mongoose';

export interface IEnvironment extends Document {
    app_id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    endpoint_url: string;
    auth_type: 'none' | 'bearer' | 'api_key';
    auth_token?: string;
    api_key_header?: string;
    response_path?: string;
    is_default: boolean;
    color: string;
    last_tested_at?: Date;
    last_test_status?: 'success' | 'failed';
    last_test_latency_ms?: number;
    last_test_response?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}

const EnvironmentSchema: Schema = new Schema({
    app_id: { type: Schema.Types.ObjectId, ref: 'App', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    endpoint_url: { type: String, default: '' },
    auth_type: {
        type: String,
        enum: ['none', 'bearer', 'api_key'],
        default: 'none'
    },
    auth_token: { type: String },
    api_key_header: { type: String, default: 'X-API-Key' },
    response_path: { type: String, default: 'response' },
    is_default: { type: Boolean, default: false },
    color: { type: String, default: '#3B82F6' }, // Blue default
    last_tested_at: { type: Date },
    last_test_status: { type: String, enum: ['success', 'failed'] },
    last_test_latency_ms: { type: Number },
    last_test_response: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound index for unique slug per app
EnvironmentSchema.index({ app_id: 1, slug: 1 }, { unique: true });

export const Environment = mongoose.model<IEnvironment>('Environment', EnvironmentSchema);
