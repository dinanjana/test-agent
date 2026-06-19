import mongoose, { Schema, Document } from 'mongoose';

export interface IDomain extends Document {
    app_id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const DomainSchema: Schema = new Schema({
    app_id: { type: Schema.Types.ObjectId, ref: 'App', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound index for unique slug per app
DomainSchema.index({ app_id: 1, slug: 1 }, { unique: true });

export const Domain = mongoose.model<IDomain>('Domain', DomainSchema);
