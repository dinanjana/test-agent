# PRD-15: Response Template Variable System

## 1. Problem Statement

Agent APIs often return structured JSON (e.g. `{ message, confidence_score, sources, intent }`).
TestAgent judges currently evaluate only plain text, making it impossible to target a specific
response attribute for evaluation, or to build field-specific judge criteria (e.g. "Fail if
confidence is below 0.7").

Without template variables, all judges vaguely evaluate free text, diluting accuracy and
making it impossible for PMs to write precise, field-targeted evaluation criteria.

---

## 2. Syntax Reference

```
{{response.fieldName}}         — top-level field, resolved to JSON array across all turns
{{response.nested.subField}}   — dot-notation for nested JSON fields
```

**Resolution rule:** Collects the field value from every agent turn in the conversation and
returns a JSON array. E.g. two turns with `confidence_score` 0.9 and 0.3 → `[0.9, 0.3]`

---

## 3. Usage Examples

```
"Fail if any value in {{response.confidence_score}} is below 0.7"
"Fail if {{response.sources}} contains an empty array"
"Fail if {{response.intent}} is not one of: order_status, refund_request, product_query"
"Warn if {{response.escalate}} is true in any turn"
"Fail if {{response.message}} in any turn mentions a competitor"
```

---

## 4. Field Discovery Workflow

1. Navigate to **Connect** page
2. Click **Test** on any environment
3. On success, a **Response Fields** panel appears below the success banner
4. Each discovered field is shown as a chip (e.g. `[confidence_score]`)
5. Click any chip to copy `{{response.fieldName}}` to clipboard
6. Paste into judge criteria

---

## 5. Judge Builder Workflow

1. Navigate to **Define** page
2. Open the judge editor (create or edit)
3. Below the criteria textarea, an **Insert Response Field** panel is visible
4. Select an environment from the dropdown to preview its response fields
5. Click a field chip — `{{response.fieldName}}` is inserted at the cursor position
6. Fields are sourced from `last_test_response` on each environment

---

## 6. Auto-Generation Integration

When generating judges from annotations (Fix page), if the test run has agent turns with
raw JSON responses, the generation LLM receives:

- The annotated failure examples (as before)
- The agent's response JSON structure with example values (truncated for token efficiency)
- Instruction to use `{{response.fieldName}}` syntax where field-specific criteria make the judge more precise

Example prompt addition:
```
## Agent Response Structure
The agent returns JSON responses with the following structure (example from a real response):
{
  "confidence_score": 0.28,
  "sources": [],
  "intent": "order_status"
}

In your judge criteria, you MAY reference specific response fields using {{response.fieldName}} syntax.
Only use this syntax if the criteria is meaningfully tied to a specific field.
```

---

## 7. Backward Compatibility

All existing judges (plain text criteria, no `{{...}}`) continue to work identically.
Template resolution is a no-op when no variables are present — the criteria string is passed
to the LLM unchanged.

---

## 8. Data Model Changes

| Model | Field | Type | Description |
|-------|-------|------|-------------|
| `Environment` | `last_test_response` | `Mixed` | Full JSON from last successful connection test |
| `TurnResult` | `raw_response` | `Mixed` | Full parsed JSON from each agent turn during test execution |

Both fields are optional. Existing documents without these fields are unaffected.

---

## 9. Implementation Layers

| Layer | Description |
|-------|-------------|
| **Layer 1** | Backend: store `last_test_response` on Environment; store `raw_response` on TurnResult; `resolveTemplateVariables` utility in `apps/api/src/utils/templateVariables.ts` |
| **Layer 2** | Connect page: field discovery panel with chips after successful test |
| **Layer 3** | Judge builder: "Insert Response Field" panel with environment selector and click-to-insert |
| **Layer 4** | Auto-generation: pass response schema to LLM prompt when generating judges from annotations |
| **Layer 5** | Mock agent: `/structured-chat` endpoint with named scenarios for manual testing |
| **Layer 6** | Unit tests: 6 vitest cases for `resolveTemplateVariables` |

---

## 10. Out of Scope (Future)

- Cursor-following autocomplete dropdown in the criteria textarea (requires mirror-div pixel math)
- Per-turn selector syntax: `{{turn[N].response.field}}`
- Template variables in test suite descriptions or conversation names
