import mongoose, { Document } from 'mongoose';

// Judge evaluation result within a test run
const JudgeResultSchema = new mongoose.Schema({
    judge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Judge', required: true },
    judge_name: { type: String, required: true },
    passed: { type: Boolean, required: true },
    reasoning: { type: String },
    citation: { type: String }, // Exact text span that caused failure
    severity: { type: String, enum: ['fail', 'warn'], required: true },
    model: { type: String }, // Which LLM model was used
    criteria: { type: String } // Denormalized judge criteria at evaluation time
}, { _id: false });

// Individual turn in a multi-turn conversation
const TurnResultSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'agent'], required: true },
    input: { type: String },      // User message
    expected: { type: String },    // Expected agent response (from test data)
    actual: { type: String },      // Actual agent response
    latency_ms: { type: Number },
    tokens_in: { type: Number },   // Input tokens for this turn
    tokens_out: { type: Number },  // Output tokens for this turn
    error: { type: String },
    raw_response: { type: mongoose.Schema.Types.Mixed }  // Full parsed JSON from agent turn
}, { _id: false });

// Feedback on individual judge evaluations
const FeedbackSchema = new mongoose.Schema({
    judge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Judge', required: true },
    correct: { type: Boolean, required: true },
    comment: { type: String },
    created_at: { type: Date, default: Date.now }
}, { _id: false });

// User annotation for judge generation
const AnnotationSchema = new mongoose.Schema({
    conversation_index: { type: Number, required: true },
    response_index: { type: Number },  // Optional: specific turn
    passed: { type: Boolean, required: true },
    explanation: { type: String },
    highlighted_text: { type: String },  // Problematic text section
    created_at: { type: Date, default: Date.now }
}, { _id: false });


const TestRunSchema = new mongoose.Schema({
    // App-centric references
    app_id: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
    test_data_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TestDataSet', required: true },
    test_data_name: { type: String, required: true },
    conversation_id: { type: mongoose.Schema.Types.ObjectId }, // For suite runs
    conversation_name: { type: String }, // For suite runs
    environment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Environment', required: true },
    environment_name: { type: String, required: true },
    domain_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' }, // Optional

    // Execution results
    turns: [TurnResultSchema],
    judge_results: [JudgeResultSchema],

    // Summary
    overall_passed: { type: Boolean, required: true },
    total_latency_ms: { type: Number, required: true },

    // Performance metrics
    metrics: {
        total_tokens_in: { type: Number },
        total_tokens_out: { type: Number },
        estimated_cost: { type: Number },  // In USD
        avg_latency_ms: { type: Number }
    },

    // Timestamps
    started_at: { type: Date, required: true },
    completed_at: { type: Date, required: true },

    // User feedback on judge evaluations
    feedback: [FeedbackSchema],

    // User annotations for judge generation
    annotations: [AnnotationSchema],
});

// Index for efficient queries
TestRunSchema.index({ app_id: 1, completed_at: -1 });
TestRunSchema.index({ test_data_id: 1, completed_at: -1 });

export interface ITestRun extends Document {
    app_id: mongoose.Types.ObjectId;
    test_data_id: mongoose.Types.ObjectId;
    test_data_name: string;
    conversation_id?: mongoose.Types.ObjectId;
    conversation_name?: string;
    environment_id: mongoose.Types.ObjectId;
    environment_name: string;
    domain_id?: mongoose.Types.ObjectId;
    turns: {
        role: 'user' | 'agent';
        input?: string;
        expected?: string;
        actual?: string;
        latency_ms?: number;
        tokens_in?: number;
        tokens_out?: number;
        error?: string;
        raw_response?: Record<string, any>;
    }[];
    metrics?: {
        total_tokens_in?: number;
        total_tokens_out?: number;
        estimated_cost?: number;
        avg_latency_ms?: number;
    };
    judge_results: {
        judge_id: mongoose.Types.ObjectId;
        judge_name: string;
        passed: boolean;
        reasoning?: string;
        citation?: string;
        severity: 'fail' | 'warn';
        model?: string;
        criteria?: string;
    }[];
    overall_passed: boolean;
    total_latency_ms: number;
    started_at: Date;
    completed_at: Date;
    feedback?: {
        judge_id: mongoose.Types.ObjectId;
        correct: boolean;
        comment?: string;
        created_at: Date;
    }[];
    annotations?: {
        conversation_index: number;
        response_index?: number;
        passed: boolean;
        explanation?: string;
        highlighted_text?: string;
        created_at: Date;
    }[];
}

export const TestRun = mongoose.model<ITestRun>('TestRun', TestRunSchema);
