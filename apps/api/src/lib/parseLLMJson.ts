/**
 * Safely parse JSON from an LLM response, stripping markdown code fences.
 * Throws a typed Error if parsing fails — never silently swallows.
 */
export function parseLLMJson<T>(raw: string): T {
    const stripped = raw
        .replace(/^```(?:json)?\s*/im, '')
        .replace(/\s*```\s*$/im, '')
        .trim();

    // Extract first JSON array, then object, from the stripped text
    const arrayMatch = stripped.match(/\[[\s\S]*\]/);
    const objectMatch = stripped.match(/\{[\s\S]*\}/);
    const jsonStr = arrayMatch ? arrayMatch[0] : objectMatch ? objectMatch[0] : stripped;

    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        throw new Error(`Failed to parse LLM response as JSON: ${(e as Error).message}`);
    }
}
