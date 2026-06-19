import mongoose, { Schema, Document } from 'mongoose';

export interface ILLMProviderConfig {
    api_key?: string;
    default_model?: string;
}

export interface IJiraConfig {
    cloud_id?: string;
    access_token?: string;
    refresh_token?: string;
    project_key?: string;
    issue_type?: string;
    connected?: boolean;
}

export interface ILinearConfig {
    api_key?: string;
    team_id?: string;
    connected?: boolean;
}

export interface IAppSettings extends Document {
    app_id: mongoose.Types.ObjectId;
    llm_providers: {
        openai?: ILLMProviderConfig;
        anthropic?: ILLMProviderConfig;
        google?: ILLMProviderConfig;
    };
    jira?: IJiraConfig;
    linear?: ILinearConfig;
    created_at: Date;
    updated_at: Date;
}

// SECURITY TODO: api_key values are stored as plaintext in MongoDB.
// Before production use, encrypt secrets at rest using a KMS or AES-256 key.
// Recommended: use node-forge or AWS KMS to encrypt before save, decrypt on read.
// Minimum: ensure MongoDB credentials and connection string are protected via secrets manager.
const LLMProviderConfigSchema = new Schema({
    api_key: { type: String },
    default_model: { type: String }
}, { _id: false });

const JiraConfigSchema = new Schema({
    cloud_id: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    project_key: { type: String },
    issue_type: { type: String, default: 'Bug' },
    connected: { type: Boolean, default: false }
}, { _id: false });

const LinearConfigSchema = new Schema({
    api_key: { type: String },
    team_id: { type: String },
    connected: { type: Boolean, default: false }
}, { _id: false });

const AppSettingsSchema = new Schema({
    app_id: { type: Schema.Types.ObjectId, ref: 'App', required: true, unique: true },
    llm_providers: {
        openai: LLMProviderConfigSchema,
        anthropic: LLMProviderConfigSchema,
        google: LLMProviderConfigSchema
    },
    jira: JiraConfigSchema,
    linear: LinearConfigSchema
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const AppSettings = mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema);

