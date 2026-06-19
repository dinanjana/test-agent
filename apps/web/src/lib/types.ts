// Shared TypeScript interfaces for API response shapes

export interface App {
    _id: string
    name: string
    slug: string
    description?: string
}

export interface Environment {
    _id: string
    app_id: string
    name: string
    slug: string
    endpoint_url: string
    color: string
    is_default: boolean
    last_test_status?: "success" | "failed"
    last_test_latency_ms?: number
}

export interface Judge {
    _id: string
    judge_name: string
    criteria: string
    severity?: "fail" | "warn"
    app_id?: string
}

export interface JudgeResult {
    judge_id: string
    judgeName: string
    passed: boolean
    reasoning?: string
    citation?: string
    severity?: "fail" | "warn"
}

export interface ConversationTurn {
    role: "user" | "assistant"
    content: string
    latency_ms?: number
    judgeResults?: JudgeResult[]
}

export interface Conversation {
    _id?: string
    conversationId?: string
    name?: string
    turns: ConversationTurn[]
    overall_passed?: boolean
}

export interface TestDataSet {
    _id: string
    app_id: string
    name: string
    description?: string
    domain_id?: string
    judge_ids: string[]
    conversations: Conversation[]
    created_at?: string
}

export interface Domain {
    _id: string
    app_id: string
    name: string
}

export interface TestRun {
    _id: string
    app_id: string
    test_data_id?: string
    suite_name?: string
    overall_passed: boolean
    conversations_passed: number
    conversations_total: number
    runs: ConversationRun[]
    created_at?: string
}

export interface ConversationRun {
    _id?: string
    conversationId?: string
    name?: string
    overall_passed: boolean
    turns: ConversationTurn[]
}

export interface AppSettings {
    llm_provider?: string
    llm_model?: string
    openai_api_key?: string
    anthropic_api_key?: string
    google_api_key?: string
    system_prompt?: string
    jira_url?: string
    jira_email?: string
    jira_api_token?: string
    jira_project_key?: string
    linear_api_key?: string
    linear_team_id?: string
}

export interface IntegrationStatus {
    jira?: boolean
    linear?: boolean
}

export interface RunStats {
    total_runs: number
    pass_rate: number
    avg_latency_ms?: number
}

export interface RefinementSuggestion {
    judge_id: string
    judge_name: string
    suggested_criteria: string
    reasoning: string
}

export interface AnnotationPayload {
    conversationId?: string
    conversationIndex?: number
    turnIndex: number
    text: string
    passed: boolean
    comment: string
}

export interface Scenario {
    _id: string
    name: string
    description?: string
    judge_ids: string[]
    conversations: Conversation[]
}

export interface Agent {
    _id: string
    name: string
    url: string
    description?: string
}

export interface TicketCreatePayload {
    runId: string
    title?: string
}
