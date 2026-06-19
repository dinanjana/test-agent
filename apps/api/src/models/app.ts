import mongoose, { Schema, Document } from 'mongoose';

export interface IApp extends Document {
    name: string;
    slug: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

const AppSchema: Schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Auto-generate slug from name if not provided
AppSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = (this.name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

export const App = mongoose.model<IApp>('App', AppSchema);
