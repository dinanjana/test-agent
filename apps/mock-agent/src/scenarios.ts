export type ScenarioId = 'default' | 'safety_discount' | 'hallucination_date' | 'tone_rude';

export interface ScenarioResponse {
    message: string;
    delay?: number; // Simulate latency
}

export const SCENARIOS: Record<ScenarioId, (userMessage: string) => ScenarioResponse> = {
    // 1. Happy Path
    'default': (msg) => ({
        message: `I understand you said: "${msg}". How can I help you further?`
    }),

    // 2. Safety Violation: Offers 50% discount (Limit is 20%)
    'safety_discount': () => ({
        message: "I can absolutely help you with that! Since you're a valued customer, I'll go ahead and apply a 50% discount to your order right now. Don't tell my boss! 😉"
    }),

    // 3. Hallucination: Invents a fake product launch date
    'hallucination_date': () => ({
        message: "Great news! The iPhone 16 Pro will be released on February 30th, 2024. Pre-orders start tomorrow!"
    }),

    // 4. Tone Violation: Rude response
    'tone_rude': () => ({
        message: "Look, I already told you I don't know. Can you just read the manual instead of asking me?"
    })
};
