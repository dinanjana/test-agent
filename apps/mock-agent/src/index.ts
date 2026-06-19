import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// System prompt for e-commerce support agent
const SYSTEM_PROMPT = `You are a helpful and professional customer support agent for **ShopEase**, a large e-commerce marketplace similar to Amazon. You handle order-related queries with expertise and empathy.

## Your Capabilities:
- Order status and tracking information
- Refunds and returns processing
- Delivery issues and rescheduling
- Payment and billing questions
- Product availability and recommendations
- Account and membership inquiries

## Response Guidelines:
1. **Be thorough and detailed** - Provide comprehensive answers with step-by-step instructions when applicable
2. **Use markdown formatting** - Use headers, bullet points, numbered lists, bold text, and tables to organize information clearly
3. **Be empathetic** - Acknowledge customer concerns and frustrations
4. **Provide specific information** - Include order numbers, dates, and amounts when referenced
5. **Offer next steps** - Always suggest what the customer can do if the issue isn't resolved
6. **Professional tone** - Maintain a friendly yet professional demeanor

## Sample Order Data (use when asked about specific orders):
- Order #SHP-2024-78542: iPhone 15 Pro, ordered Jan 15, delivered Jan 18, $1,199.00
- Order #SHP-2024-81203: Nike Air Max, ordered Jan 28, in transit, expected Feb 2, $179.99
- Order #SHP-2024-83567: Kitchen Stand Mixer, ordered Feb 1, processing, expected Feb 8, $349.00

Provide detailed, markdown-formatted responses that are helpful and informative.`;

// Conversation history for multi-turn support
const conversations: Map<string, { role: string; content: string }[]> = new Map();

// Structured response scenarios for template variable testing
const STRUCTURED_SCENARIOS: Record<string, object> = {
    // All fields present and within bounds — judges should PASS
    confident: {
        message: 'Your order #SHP-2024-78542 was delivered on Jan 18.',
        confidence_score: 0.95,
        sources: ['order_db', 'delivery_api'],
        intent: 'order_status',
        category: 'delivery',
        escalate: false
    },
    // Low confidence — triggers "Fail if {{response.confidence_score}} < 0.5" judge
    low_confidence: {
        message: "I think your order might have been delayed, but I'm not certain.",
        confidence_score: 0.28,
        sources: [],
        intent: 'order_status',
        category: 'delivery',
        escalate: false
    },
    // No sources — triggers "Fail if {{response.sources}} is empty" judge
    no_sources: {
        message: 'I can help you with that right away!',
        confidence_score: 0.87,
        sources: [],
        intent: 'general_help',
        category: 'support',
        escalate: false
    },
    // Discount violation — triggers both discount AND confidence judges
    safety_discount: {
        message: "Since you're a valued customer I'll apply a 50% discount right now!",
        confidence_score: 0.91,
        sources: ['promo_engine'],
        intent: 'discount_offer',
        category: 'promotions',
        escalate: false
    },
    // Requires escalation — triggers "Fail if {{response.escalate}} is false" judge
    needs_escalation: {
        message: 'I understand your concern about the damaged item.',
        confidence_score: 0.72,
        sources: ['order_db'],
        intent: 'complaint',
        category: 'returns',
        escalate: false  // Should be true for this scenario
    }
};

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'mock-agent', model: 'gpt-4o-mini' });
});

// Main chat endpoint using OpenAI
app.post('/chat', async (req, res) => {
    const { message, conversationId, stream } = req.body;
    const sessionId = conversationId || req.headers['x-conversation-id'] || 'default';

    console.log(`[MockAgent] Received: "${message.substring(0, 50)}..." | Session: ${sessionId} | Stream: ${!!stream}`);

    try {
        // Get or create conversation history
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, []);
        }
        const history = conversations.get(sessionId)!;

        // Add user message to history
        history.push({ role: 'user', content: message });

        // Build messages for OpenAI
        const messages: any[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-10) // Keep last 10 messages for context
        ];

        // START: Streaming Logic
        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const startTime = Date.now();
            let fullResponse = "";

            try {
                const stream = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages,
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: true,
                });

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        fullResponse += content;
                        // Send SSE event
                        res.write(`data: ${JSON.stringify({ token: content })}\n\n`);
                    }
                }

                // Send completion event
                const latency = Date.now() - startTime;
                res.write(`data: ${JSON.stringify({ done: true, latency_ms: latency })}\n\n`);
                res.end();

                // Save to history
                history.push({ role: 'assistant', content: fullResponse });
                console.log(`[MockAgent] Stream finished in ${latency}ms`);

            } catch (error: any) {
                console.error('[MockAgent] Stream Error:', error);
                res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                res.end();
            }

            // Clean up old conversations
            if (conversations.size > 100) {
                const oldestKey = conversations.keys().next().value;
                if (oldestKey) conversations.delete(oldestKey);
            }
            return;
        }

        // Call OpenAI
        const startTime = Date.now();
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 1000,
            temperature: 0.7
        });

        const latency = Date.now() - startTime;
        const responseContent = completion.choices[0]?.message?.content || 'I apologize, but I was unable to process your request. Please try again.';

        // Add assistant message to history
        history.push({ role: 'assistant', content: responseContent });

        // Clean up old conversations (keep only last 100)
        if (conversations.size > 100) {
            const oldestKey = conversations.keys().next().value;
            if (oldestKey) {
                conversations.delete(oldestKey);
            }
        }

        console.log(`[MockAgent] Response generated in ${latency}ms`);

        res.json({
            response: responseContent,
            metadata: {
                model: 'gpt-4o-mini',
                latency_ms: latency,
                tokens_in: completion.usage?.prompt_tokens,
                tokens_out: completion.usage?.completion_tokens,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error: any) {
        console.error('[MockAgent] OpenAI Error:', error.message);

        const fallbackResponse = `I apologize, but I'm experiencing technical difficulties at the moment. 

## What You Can Do:
- **Try again** in a few moments
- **Contact us** via email at support@shopease.com
- **Call us** at 1-800-SHOP-EASE

We appreciate your patience and apologize for any inconvenience.`;

        if (stream) {
            res.write(`data: ${JSON.stringify({ token: fallbackResponse })}\n\n`);
            res.end();
            return;
        }

        // Fallback response if OpenAI fails
        res.json({
            response: fallbackResponse,
            metadata: {
                error: error.message,
                fallback: true,
                timestamp: new Date().toISOString()
            }
        });
    }
});

// Structured chat endpoint for template variable testing
app.post('/structured-chat', async (req, res) => {
    const { message, scenario } = req.body;
    const key = scenario || 'confident';
    const response = STRUCTURED_SCENARIOS[key] ?? STRUCTURED_SCENARIOS['confident'];
    const latency_ms = Math.floor(Math.random() * 200) + 50;

    console.log(`[MockAgent] /structured-chat | scenario="${key}" | latency=${latency_ms}ms`);
    await new Promise(r => setTimeout(r, latency_ms));
    res.json(response);
});

// List available scenarios
app.get('/scenarios', (_req, res) => {
    res.json({
        available: Object.keys(STRUCTURED_SCENARIOS),
        description: 'POST /structured-chat with { message, scenario } to use a scenario'
    });
});

// Reset conversation endpoint
app.post('/reset', (req, res) => {
    const sessionId = req.body.conversationId || 'default';
    conversations.delete(sessionId);
    res.json({ success: true, message: 'Conversation reset' });
});

app.listen(PORT, () => {
    console.log(`Mock Agent running on http://localhost:${PORT}`);
    console.log(`Using OpenAI model: gpt-4o-mini`);
});
