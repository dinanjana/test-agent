import mongoose, { Schema, Document } from 'mongoose';

export interface ITurn {
    role: 'user' | 'agent';
    message?: string;
}

export interface IScenario extends Document {
    name: string;
    description?: string;
    turns: ITurn[];
    judge_ids: string[];
    created_at: Date;
    updated_at: Date;
}

const TurnSchema = new Schema({
    role: { type: String, enum: ['user', 'agent'], required: true },
    message: { type: String }
}, { _id: false });

const ScenarioSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    turns: { type: [TurnSchema], required: true },
    judge_ids: [{ type: String }], // References Judge IDs, but kept as strings for flexibility in prototype
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Scenario = mongoose.model<IScenario>('Scenario', ScenarioSchema);
