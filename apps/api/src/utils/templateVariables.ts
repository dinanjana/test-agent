/**
 * Resolves {{response.fieldName}} template variables in judge criteria strings.
 *
 * Each variable is replaced with a JSON array of that field's value from every
 * agent turn in the conversation. Dot-notation paths are supported for nested fields.
 *
 * Example:
 *   criteria: "Fail if {{response.confidence_score}} is below 0.5"
 *   rawResponses: [{ confidence_score: 0.9 }, { confidence_score: 0.3 }]
 *   result: "Fail if [0.9,0.3] is below 0.5"
 *
 * Backward compatibility: criteria without {{...}} are returned unchanged.
 * If rawResponses is empty, criteria are returned unchanged.
 */
export function resolveTemplateVariables(
    criteria: string,
    rawResponses: Record<string, any>[]
): string {
    if (!rawResponses.length) return criteria;
    if (!criteria.includes('{{')) return criteria;

    return criteria.replace(/\{\{response\.([\w.]+)\}\}/g, (_match, path) => {
        const keys = path.split('.');
        const values = rawResponses.map(r => {
            const val = keys.reduce(
                (obj: any, k: string) => (obj && typeof obj === 'object' ? obj[k] : undefined),
                r
            );
            return val === undefined ? null : val;
        });
        return JSON.stringify(values);
    });
}
