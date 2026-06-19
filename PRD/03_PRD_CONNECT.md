# TestAgent PRD - Part 3: Connect Component

## 1. Component Overview

### Purpose
Enable users to connect their AI agents to TestAgent by providing an HTTP endpoint URL, without requiring SDK integration or code changes.

### Key Principle
> "5 minutes to connect, no engineering required"

### User Story
> As a PM, I want to connect my AI agent by pasting an HTTP endpoint URL, so that I can start testing without engineering help.

---

## 2. Functional Requirements

### FR-C1: Agent Configuration

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-C1.1 | Accept HTTP/HTTPS endpoint URL | P0 | Valid URL validation; auto-upgrade HTTP to HTTPS |
| FR-C1.2 | Require agent name | P0 | Non-empty string; max 100 characters |
| FR-C1.3 | Support optional description | P1 | Free text; max 500 characters |
| FR-C1.4 | Store agent configuration | P0 | Persist to database; retrievable |
| FR-C1.5 | Support multiple agents per account | P1 | No limit on agent count |

### FR-C2: Authentication

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-C2.1 | Support "No Authentication" | P0 | Default option; no credentials required |
| FR-C2.2 | Support API Key authentication | P0 | Header name: X-API-Key; value encrypted at rest |
| FR-C2.3 | Support Bearer Token authentication | P0 | Header: Authorization: Bearer {token}; encrypted |
| FR-C2.4 | Encrypt credentials at rest | P0 | AES-256 or equivalent |
| FR-C2.5 | Never display full credentials after save | P0 | Show masked value (e.g., ****abc) |

### FR-C3: Request Configuration

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-C3.1 | Default request method: POST | P0 | Non-configurable for v1 |
| FR-C3.2 | Default content type: application/json | P0 | Non-configurable for v1 |
| FR-C3.3 | Configurable message field name | P1 | Default: "message"; allow override |
| FR-C3.4 | Configurable response field name | P1 | Default: "response"; allow override |
| FR-C3.5 | Configurable timeout | P1 | Default: 30s; range: 5-120s |

### FR-C4: Connection Testing

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-C4.1 | Test connection button | P0 | Visible on setup screen |
| FR-C4.2 | Send test message to endpoint | P0 | Message: "Hello, can you help me?" |
| FR-C4.3 | Display success indicator | P0 | Green checkmark + "Connected" |
| FR-C4.4 | Display failure with error | P0 | Red X + error message (timeout, 4xx, 5xx, network) |
| FR-C4.5 | Display response latency | P1 | Show milliseconds (e.g., "247ms") |
| FR-C4.6 | Display agent response preview | P1 | Show first 200 chars of response |

### FR-C5: Agent Management

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-C5.1 | List all agents | P0 | Name, status, last test time |
| FR-C5.2 | Edit agent configuration | P0 | All fields editable |
| FR-C5.3 | Delete agent | P0 | Confirmation required; cascades to test data |
| FR-C5.4 | Show agent health status | P1 | Healthy (>90% pass) / Warning (<90%) / Error (not reachable) |

---

## 3. User Interface Specifications

### Screen: Agent Setup Wizard

#### Step 1: Basic Info
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🤖  Let's name your agent                             │ │
│  │                                                        │ │
│  │  Agent Name *                                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Customer Support Agent                           │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  This name will appear in your dashboard               │ │
│  │                                                        │ │
│  │                              [Continue →]              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Endpoint Configuration
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🔌  Connect your agent endpoint                       │ │
│  │                                                        │ │
│  │  Endpoint URL *                                        │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ https://api.company.com/agent/chat               │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  Your agent should accept POST requests with JSON      │ │
│  │                                                        │ │
│  │  Authentication                                        │ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐         │ │
│  │  │   None     │ │  API Key   │ │   Bearer   │         │ │
│  │  │  (active)  │ │            │ │            │         │ │
│  │  └────────────┘ └────────────┘ └────────────┘         │ │
│  │                                                        │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │ ℹ️ Expected Request Format                       │   │ │
│  │  │                                                 │   │ │
│  │  │ POST /your-endpoint                             │   │ │
│  │  │ Content-Type: application/json                  │   │ │
│  │  │                                                 │   │ │
│  │  │ { "message": "User's message here" }            │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │                                                        │ │
│  │  [← Back]                      [Test Connection →]     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Step 3: Connection Test
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ✅  Connection Successful!                            │ │
│  │                                                        │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │  Status: 200 OK                                 │   │ │
│  │  │  Latency: 247ms                                 │   │ │
│  │  │  Response: Valid JSON ✓                         │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │                                                        │ │
│  │  Test Conversation:                                    │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │ 👤 Hello, can you help me?                      │   │ │
│  │  │                                                 │   │ │
│  │  │ 🤖 Hi! I'd be happy to help. What can I        │   │ │
│  │  │    assist you with today?                       │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │                                                        │ │
│  │  [Test Again]              [Save Agent & Continue →]   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Screen: Agent List (Dashboard)

```
┌─────────────────────────────────────────────────────────────┐
│  Your Agents                              [+ New Agent]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🟢 Customer Support Agent                           │    │
│  │    https://api.company.com/support                  │    │
│  │    Last test: 2 min ago  •  Pass rate: 94%          │    │
│  │                                      [Edit] [Test]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🟡 Sales Assistant Bot                              │    │
│  │    https://api.company.com/sales                    │    │
│  │    Last test: 15 min ago  •  Pass rate: 78%         │    │
│  │                                      [Edit] [Test]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. API Specifications

### POST /api/agents
Create a new agent connection.

**Request:**
```json
{
  "name": "Customer Support Agent",
  "description": "Main support agent for customer inquiries",
  "endpoint_url": "https://api.company.com/agent/chat",
  "auth_type": "api_key",
  "auth_credentials": "sk-xxxxx",
  "request_config": {
    "message_field": "message",
    "response_field": "response",
    "timeout_seconds": 30
  }
}
```

**Response (201 Created):**
```json
{
  "id": "agent_abc123",
  "name": "Customer Support Agent",
  "description": "Main support agent for customer inquiries",
  "endpoint_url": "https://api.company.com/agent/chat",
  "auth_type": "api_key",
  "auth_credentials_masked": "sk-***xxx",
  "request_config": {
    "message_field": "message",
    "response_field": "response",
    "timeout_seconds": 30
  },
  "status": "connected",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### GET /api/agents
List all agents for the account.

**Response (200 OK):**
```json
{
  "agents": [
    {
      "id": "agent_abc123",
      "name": "Customer Support Agent",
      "endpoint_url": "https://api.company.com/agent/chat",
      "status": "healthy",
      "pass_rate": 0.94,
      "last_test_at": "2025-01-15T10:28:00Z",
      "test_count": 1247
    }
  ]
}
```

### POST /api/agents/:id/test
Test agent connection.

**Request:**
```json
{
  "message": "Hello, can you help me?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "status_code": 200,
  "latency_ms": 247,
  "response": "Hi! I'd be happy to help. What can I assist you with today?"
}
```

### DELETE /api/agents/:id
Delete an agent (with confirmation).

**Response (200 OK):**
```json
{
  "deleted": true,
  "id": "agent_abc123"
}
```

---

## 5. Data Model

### Agent Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| account_id | UUID | FK, NOT NULL | Owner account |
| name | VARCHAR(100) | NOT NULL | Display name |
| description | VARCHAR(500) | NULL | Optional description |
| endpoint_url | VARCHAR(2048) | NOT NULL | Agent HTTP endpoint |
| auth_type | ENUM | NOT NULL | 'none', 'api_key', 'bearer' |
| auth_credentials_encrypted | BYTEA | NULL | Encrypted credentials |
| message_field | VARCHAR(100) | DEFAULT 'message' | Request field name |
| response_field | VARCHAR(100) | DEFAULT 'response' | Response field name |
| timeout_seconds | INT | DEFAULT 30 | Request timeout |
| status | ENUM | DEFAULT 'unknown' | 'healthy', 'warning', 'error', 'unknown' |
| last_test_at | TIMESTAMP | NULL | Last test timestamp |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

---

## 6. Error Handling

| Error Case | User Message | Technical Detail |
|------------|--------------|------------------|
| Invalid URL | "Please enter a valid HTTPS URL" | URL validation failed |
| Connection timeout | "Agent didn't respond in time. Check if the endpoint is accessible." | Timeout exceeded |
| 4xx response | "Agent returned an error: {status}. Check your authentication." | Client error |
| 5xx response | "Agent server error. The endpoint may be having issues." | Server error |
| Network error | "Couldn't reach the agent. Check the URL and try again." | DNS/network failure |
| Invalid JSON response | "Agent response wasn't valid JSON. Check the endpoint." | Parse error |

---

## 7. Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Credential storage | AES-256 encryption at rest |
| Credential display | Never show full credentials after save |
| HTTPS enforcement | Auto-upgrade HTTP to HTTPS; warn if fails |
| Rate limiting | Max 10 connection tests per minute per account |
| Audit logging | Log all connection tests and config changes |

---

## 8. Acceptance Criteria Summary

### Must Pass for MVP Release

- [ ] User can enter endpoint URL and save
- [ ] URL validation prevents invalid entries
- [ ] All three auth types work correctly
- [ ] Credentials are encrypted and never displayed in full
- [ ] Connection test sends request and displays result
- [ ] Success shows status code, latency, response preview
- [ ] Failure shows clear error message
- [ ] Agent appears in list after creation
- [ ] Agent can be edited and deleted
- [ ] Setup completes in <5 minutes

---

*Next: [04_PRD_DEFINE.md](./04_PRD_DEFINE.md) - Define (Judge Builder) component specifications*
