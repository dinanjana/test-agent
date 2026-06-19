import { describe, it, expect } from 'vitest';
import { resolveTemplateVariables } from '../../utils/templateVariables';

describe('resolveTemplateVariables', () => {

    it('replaces a field reference with a JSON array of values across turns', () => {
        const criteria = 'Fail if {{response.confidence_score}} is below 0.5';
        const raw = [{ confidence_score: 0.9 }, { confidence_score: 0.3 }];
        expect(resolveTemplateVariables(criteria, raw))
            .toBe('Fail if [0.9,0.3] is below 0.5');
    });

    it('handles nested field paths with dot notation', () => {
        const criteria = 'Check {{response.metadata.model}}';
        const raw = [{ metadata: { model: 'gpt-4o' } }, { metadata: { model: 'gpt-4o' } }];
        expect(resolveTemplateVariables(criteria, raw))
            .toBe('Check ["gpt-4o","gpt-4o"]');
    });

    it('outputs null for turns where the field is missing', () => {
        const criteria = 'Check {{response.confidence_score}}';
        const raw = [{ confidence_score: 0.8 }, { message: 'no score here' }];
        expect(resolveTemplateVariables(criteria, raw))
            .toBe('Check [0.8,null]');
    });

    it('returns criteria unchanged when no template variables are present', () => {
        const criteria = 'Fail if the agent is rude';
        const raw = [{ message: 'hello' }];
        expect(resolveTemplateVariables(criteria, raw)).toBe(criteria);
    });

    it('returns criteria unchanged when rawResponses is empty', () => {
        const criteria = 'Fail if {{response.confidence_score}} is low';
        expect(resolveTemplateVariables(criteria, [])).toBe(criteria);
    });

    it('replaces multiple different template variables in one criteria string', () => {
        const criteria = 'Fail if {{response.confidence_score}} < 0.5 or {{response.sources}} is empty';
        const raw = [{ confidence_score: 0.9, sources: ['db'] }];
        expect(resolveTemplateVariables(criteria, raw))
            .toBe('Fail if [0.9] < 0.5 or [["db"]] is empty');
    });

});
