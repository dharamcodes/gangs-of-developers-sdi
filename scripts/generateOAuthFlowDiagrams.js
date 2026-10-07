/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { generateSvgDiagram } = require('./microservicesSvgHelper');

const diagramsDir = path.join(__dirname, '..', 'public', 'diagrams', 'microservices');
fs.mkdirSync(diagramsDir, { recursive: true });

console.log("Generating Alex Xu Style OAuth 2.0 Flow Block Diagrams...");

// =========================================================================
// FLOW 1: Authorization Code Flow with PKCE (RFC 7636)
// =========================================================================
const pkceSvg = generateSvgDiagram(
  1040, 520,
  "OAuth 2.0 Authorization Code Flow with PKCE (RFC 7636)",
  "Cryptographic Code Verifier, SHA-256 Challenge & Token Exchange Sequence",
  "#38bdf8",
  "User Authentication (RFC 7636)",
  [
    {
      x: 50, y: 110, w: 240, h: 220,
      title: "React SPA / Mobile App",
      tag: "Public Client",
      stroke: "#0284c7",
      lines: [
        "React / iOS / Android Client",
        "Generates random code_verifier",
        "Computes S256 code_challenge:",
        "challenge=BASE64URL(S256(v))",
        "Redirects to IdP /authorize",
        "Zero client secret required"
      ]
    },
    {
      x: 50, y: 355, w: 240, h: 110,
      title: "Client Secure RAM",
      tag: "Ephemeral State",
      stroke: "#64748b",
      lines: [
        "Holds code_verifier in memory",
        "Receives Access Token & RT",
        "Clears verifier upon completion"
      ]
    },
    {
      x: 360, y: 110, w: 290, h: 220,
      title: "Authorization Server (IdP)",
      tag: "Identity Authority",
      stroke: "#f59e0b",
      lines: [
        "Keycloak / Okta / Auth0",
        "Authenticates user (MFA / Consent)",
        "Stores code_challenge in auth session",
        "Issues single-use authorization_code",
        "Validates: S256(verifier)==challenge",
        "Signs JWTs with Private RSA Key"
      ]
    },
    {
      x: 360, y: 355, w: 290, h: 110,
      title: "IdP Session & Code DB",
      tag: "Session Registry",
      stroke: "#d97706",
      lines: [
        "Maps auth_code -> code_challenge",
        "TTL: 60s (strict single-use)",
        "Revokes code on consumption"
      ]
    },
    {
      x: 720, y: 110, w: 270, h: 160,
      title: "API Gateway (PEP)",
      tag: "Gateway PEP",
      stroke: "#10b981",
      lines: [
        "Envoy / Spring Cloud Gateway",
        "Validates JWT signature via JWKS",
        "Sub-millisecond verification (<0.5ms)",
        "Enforces rate limits & user claims"
      ]
    },
    {
      x: 720, y: 300, w: 270, h: 165,
      title: "Order Microservice",
      tag: "Resource Server",
      stroke: "#8b5cf6",
      lines: [
        "Reads X-User-Id & permissions",
        "Executes domain transaction",
        "Audits authenticated actions",
        "Zero IdP network calls needed"
      ]
    }
  ],
  [
    { d: "M 290 145 L 360 145", lx: 325, ly: 145, label: "1. /authorize (S256)", stroke: "#0284c7" },
    { d: "M 360 190 L 290 190", lx: 325, ly: 190, label: "2. Auth Code Redirect", stroke: "#f59e0b" },
    { d: "M 290 235 L 360 235", lx: 325, ly: 235, label: "3. POST /token (Code+Verifier)", stroke: "#0284c7" },
    { d: "M 360 280 L 290 280", lx: 325, ly: 280, label: "4. Return JWT + RTR Token", stroke: "#10b981" },
    { d: "M 290 325 C 440 335, 600 235, 720 185", lx: 510, ly: 275, label: "5. GET /orders (Bearer JWT)", stroke: "#0284c7" },
    { d: "M 855 270 L 855 300", lx: 855, ly: 285, label: "6. Verified RPC (<1ms)", stroke: "#10b981" }
  ],
  false,
  [
    { x: 30, y: 80, w: 280, h: 410, label: "PUBLIC CLIENT DOMAIN", stroke: "#0284c7" },
    { x: 340, y: 80, w: 330, h: 410, label: "AUTHORIZATION SERVER (IDP)", stroke: "#f59e0b" },
    { x: 700, y: 80, w: 310, h: 410, label: "API GATEWAY & RESOURCE SERVERS", stroke: "#10b981" }
  ]
);
fs.writeFileSync(path.join(diagramsDir, 'oauth2-flow-pkce-block.svg'), pkceSvg, 'utf-8');
console.log("-> Generated oauth2-flow-pkce-block.svg");

// =========================================================================
// FLOW 2: Client Credentials Flow (M2M / RFC 6749 §4.4)
// =========================================================================
const clientCredsSvg = generateSvgDiagram(
  1040, 520,
  "OAuth 2.0 Client Credentials Flow (M2M / RFC 6749 §4.4)",
  "Machine-to-Machine Microservice Authentication with Token Caching & Private Key JWT",
  "#0284c7",
  "M2M / Daemon Auth (RFC 6749 §4.4)",
  [
    {
      x: 50, y: 110, w: 260, h: 210,
      title: "Calling Service (Payment)",
      tag: "M2M Client",
      stroke: "#0284c7",
      lines: [
        "Payment Background Processor",
        "Holds client_id & private key/secret",
        "Generates Private Key JWT (RFC 7523)",
        "Requests scope: ledger:write",
        "Checks local token cache first",
        "Avoids redundant IdP roundtrips"
      ]
    },
    {
      x: 50, y: 350, w: 260, h: 120,
      title: "In-Memory Token Cache",
      tag: "Local Caffeine RAM",
      stroke: "#64748b",
      lines: [
        "Caches M2M JWT (e.g. 1 hour TTL)",
        "10% safety buffer before expiry",
        "Hit rate: 99.9% for steady traffic"
      ]
    },
    {
      x: 390, y: 110, w: 260, h: 210,
      title: "Authorization Server (IdP)",
      tag: "Token Authority",
      stroke: "#f59e0b",
      lines: [
        "Token Endpoint: POST /oauth/token",
        "grant_type=client_credentials",
        "Validates service credentials/mTLS",
        "Evaluates allowed service scopes",
        "Issues signed M2M JWT (RS256)",
        "aud = accounting-service"
      ]
    },
    {
      x: 390, y: 350, w: 260, h: 120,
      title: "Service Account Registry",
      tag: "Policy DB",
      stroke: "#d97706",
      lines: [
        "Maps client_id to allowed scopes",
        "Role-Based Workload Permissions",
        "mTLS SAN verification records"
      ]
    },
    {
      x: 730, y: 110, w: 260, h: 210,
      title: "Target Service (Accounting)",
      tag: "Resource Server",
      stroke: "#10b981",
      lines: [
        "Accounting & Ledger Microservice",
        "Validates JWT signature via JWKS",
        "Verifies aud == accounting-service",
        "Enforces scope == ledger:write",
        "Executes double-entry transaction",
        "Sub-millisecond verification"
      ]
    },
    {
      x: 730, y: 350, w: 260, h: 120,
      title: "Ledger Database",
      tag: "ACID DB",
      stroke: "#059669",
      lines: [
        "Immutable Financial Ledger",
        "Commits authorized transaction",
        "Zero unauthenticated writes"
      ]
    }
  ],
  [
    { d: "M 180 320 L 180 350", lx: 180, ly: 335, label: "1. Cache Miss / Expiring", stroke: "#64748b" },
    { d: "M 310 160 L 390 160", lx: 350, ly: 160, label: "2. POST /token (M2M)", stroke: "#0284c7" },
    { d: "M 390 220 L 310 220", lx: 350, ly: 220, label: "3. Signed M2M JWT (RS256)", stroke: "#f59e0b" },
    { d: "M 240 320 L 240 350", lx: 240, ly: 335, label: "4. Store in RAM (TTL 54m)", stroke: "#10b981" },
    { d: "M 310 270 C 480 310, 600 240, 730 200", lx: 520, ly: 260, label: "5. POST /ledger (Bearer M2M JWT)", stroke: "#0284c7" },
    { d: "M 860 320 L 860 350", lx: 860, ly: 335, label: "6. JWKS Verify & Commit", stroke: "#10b981" }
  ],
  false,
  [
    { x: 30, y: 80, w: 300, h: 410, label: "CALLING MICROSERVICE DOMAIN", stroke: "#0284c7" },
    { x: 370, y: 80, w: 300, h: 410, label: "AUTHORIZATION SERVER (IDP)", stroke: "#f59e0b" },
    { x: 710, y: 80, w: 300, h: 410, label: "TARGET RESOURCE SERVICE", stroke: "#10b981" }
  ]
);
fs.writeFileSync(path.join(diagramsDir, 'oauth2-flow-client-credentials-block.svg'), clientCredsSvg, 'utf-8');
console.log("-> Generated oauth2-flow-client-credentials-block.svg");

// =========================================================================
// FLOW 3: On-Behalf-Of (OBO) & RFC 8693 Token Exchange Flow
// =========================================================================
const tokenExchangeSvg = generateSvgDiagram(
  1040, 520,
  "OAuth 2.0 On-Behalf-Of & RFC 8693 Token Exchange Flow",
  "Downstream Identity Propagation with Audience Attenuation & Delegation Audit",
  "#8b5cf6",
  "Identity Propagation (RFC 8693)",
  [
    {
      x: 50, y: 130, w: 220, h: 200,
      title: "End-User Client",
      tag: "Resource Owner",
      stroke: "#0284c7",
      lines: [
        "Authenticated User (user-42)",
        "Holds User Access Token",
        "aud = order-service",
        "Scope: orders:write",
        "Dispatches purchase request",
        "Zero knowledge of downstream"
      ]
    },
    {
      x: 340, y: 110, w: 310, h: 200,
      title: "Order Service (Caller)",
      tag: "Intermediary Service",
      stroke: "#8b5cf6",
      lines: [
        "Receives User Access Token",
        "Must invoke Fulfillment Service",
        "DO NOT forward raw user token!",
        "(Prevents token replay by downstream)",
        "Calls IdP for Token Exchange",
        "subject_token = User JWT, aud = fulfillment"
      ]
    },
    {
      x: 340, y: 340, w: 310, h: 135,
      title: "IdP Token Exchange Endpoint",
      tag: "RFC 8693 IdP",
      stroke: "#f59e0b",
      lines: [
        "Validates subject_token (user-42)",
        "Validates actor_token (order-service)",
        "Issues Attenuated Token: aud=fulfillment",
        "act = {\"sub\": \"order-service\"}"
      ]
    },
    {
      x: 720, y: 110, w: 270, h: 200,
      title: "Fulfillment Service",
      tag: "Downstream Target",
      stroke: "#10b981",
      lines: [
        "Validates Attenuated JWT via JWKS",
        "Verifies aud == fulfillment-service",
        "Reads subject: user-42",
        "Reads actor: order-service",
        "Enforces least-privilege scope",
        "Executes package fulfillment"
      ]
    },
    {
      x: 720, y: 340, w: 270, h: 135,
      title: "Audit Trail & Warehouse DB",
      tag: "Compliance Audit",
      stroke: "#059669",
      lines: [
        "Records: User-42 via Order-Service",
        "Complete cryptographic proof",
        "Zero impersonation ambiguity"
      ]
    }
  ],
  [
    { d: "M 270 180 L 340 180", lx: 305, ly: 180, label: "1. POST /orders (User JWT)", stroke: "#0284c7" },
    { d: "M 460 310 L 460 340", lx: 460, ly: 325, label: "2. Token Exchange (RFC 8693)", stroke: "#8b5cf6" },
    { d: "M 530 340 L 530 310", lx: 530, ly: 325, label: "3. Attenuated JWT (aud=fulfill)", stroke: "#f59e0b" },
    { d: "M 650 180 L 720 180", lx: 685, ly: 180, label: "4. POST /fulfill (Exchanged JWT)", stroke: "#10b981" },
    { d: "M 855 310 L 855 340", lx: 855, ly: 325, label: "5. Immutable Audit Log", stroke: "#059669" },
    { d: "M 720 230 L 650 230", lx: 685, ly: 230, label: "6. 200 OK Fulfillment Done", stroke: "#10b981" },
    { d: "M 340 230 L 270 230", lx: 305, ly: 230, label: "7. 201 Created Order Complete", stroke: "#0284c7" }
  ],
  false,
  [
    { x: 30, y: 80, w: 260, h: 410, label: "RESOURCE OWNER DOMAIN", stroke: "#0284c7" },
    { x: 320, y: 80, w: 350, h: 410, label: "FRONTEND MICROSERVICE (INTERMEDIARY)", stroke: "#8b5cf6" },
    { x: 700, y: 80, w: 310, h: 410, label: "DOWNSTREAM RESOURCE SERVICE", stroke: "#10b981" }
  ]
);
fs.writeFileSync(path.join(diagramsDir, 'oauth2-flow-token-exchange-block.svg'), tokenExchangeSvg, 'utf-8');
console.log("-> Generated oauth2-flow-token-exchange-block.svg");

// =========================================================================
// FLOW 4: Device Authorization Flow (RFC 8628)
// =========================================================================
const deviceFlowSvg = generateSvgDiagram(
  1040, 520,
  "OAuth 2.0 Device Authorization Flow (RFC 8628)",
  "Two-Device Decoupled Authentication Loop for Smart TVs, CLI Tools & Headless IoT",
  "#f59e0b",
  "Constrained Device (RFC 8628)",
  [
    {
      x: 50, y: 110, w: 260, h: 200,
      title: "Smart TV / CLI Terminal",
      tag: "Device Client",
      stroke: "#0284c7",
      lines: [
        "Smart TV / Developer CLI Tool",
        "No browser or input keyboard",
        "Requests device authorization",
        "Displays code & URL on TV screen",
        "Enters polling loop (interval=5s)",
        "Stores Access & Refresh Tokens"
      ]
    },
    {
      x: 50, y: 340, w: 260, h: 135,
      title: "User Smartphone / Laptop",
      tag: "Secondary Device",
      stroke: "#64748b",
      lines: [
        "User scans QR code or visits URL",
        "Types 8-char code: WDJB-HGXX",
        "Authenticates via password/MFA",
        "Confirms device authorization"
      ]
    },
    {
      x: 390, y: 110, w: 270, h: 200,
      title: "Authorization Server (IdP)",
      tag: "Device Token IdP",
      stroke: "#f59e0b",
      lines: [
        "POST /device/code endpoint",
        "Generates device_code & user_code",
        "Serves activation web portal",
        "Poll returns: authorization_pending",
        "On user consent: Issues Access JWT",
        "Expires device_code in 15 minutes"
      ]
    },
    {
      x: 390, y: 340, w: 270, h: 135,
      title: "Device Session State DB",
      tag: "Device State Cache",
      stroke: "#d97706",
      lines: [
        "Maps user_code -> device_code",
        "Status: PENDING -> AUTHORIZED",
        "Enforces poll rate limiting"
      ]
    },
    {
      x: 740, y: 110, w: 250, h: 200,
      title: "Media Streaming Service",
      tag: "Resource Server",
      stroke: "#10b981",
      lines: [
        "Streaming Video API / Backend",
        "Validates Bearer Access JWT via JWKS",
        "Verifies user subscription status",
        "Streams 4K HDR video payload",
        "Zero device password stored"
      ]
    },
    {
      x: 740, y: 340, w: 250, h: 135,
      title: "Video CDN / Edge PoP",
      tag: "Edge CDN",
      stroke: "#059669",
      lines: [
        "Edge PoP streaming chunks",
        "Continuous authenticated playback",
        "Validates signed media URLs"
      ]
    }
  ],
  [
    { d: "M 310 150 L 390 150", lx: 350, ly: 150, label: "1. POST /device/code", stroke: "#0284c7" },
    { d: "M 390 190 L 310 190", lx: 350, ly: 190, label: "2. Return user_code & URL", stroke: "#f59e0b" },
    { d: "M 310 390 C 350 390, 370 360, 420 310", lx: 360, ly: 350, label: "3. Visit URL & Enter Code", stroke: "#64748b" },
    { d: "M 310 230 L 390 230", lx: 350, ly: 230, label: "4. Poll: POST /token", stroke: "#0284c7" },
    { d: "M 390 270 L 310 270", lx: 350, ly: 270, label: "5. 200 OK + JWT & RT", stroke: "#10b981" },
    { d: "M 310 300 C 450 490, 680 490, 740 280", lx: 520, ly: 440, label: "6. Stream Media (Bearer JWT)", stroke: "#10b981" },
    { d: "M 865 310 L 865 340", lx: 865, ly: 325, label: "7. Stream 4K Video Data", stroke: "#059669" }
  ],
  false,
  [
    { x: 30, y: 80, w: 300, h: 410, label: "USER DEVICES DOMAIN", stroke: "#0284c7" },
    { x: 370, y: 80, w: 310, h: 410, label: "AUTHORIZATION SERVER (IDP)", stroke: "#f59e0b" },
    { x: 720, y: 80, w: 290, h: 410, label: "MEDIA STREAMING PLATFORM", stroke: "#10b981" }
  ]
);
fs.writeFileSync(path.join(diagramsDir, 'oauth2-flow-device-code-block.svg'), deviceFlowSvg, 'utf-8');
console.log("-> Generated oauth2-flow-device-code-block.svg");

// =========================================================================
// FLOW 5: Refresh Token Flow & Refresh Token Rotation (RTR)
// =========================================================================
const refreshTokenSvg = generateSvgDiagram(
  1040, 520,
  "OAuth 2.0 Refresh Token Rotation (RTR) & Replay Defense",
  "Single-Use Refresh Token Lifecycle, Token Family Registry & Automatic Breach Revocation",
  "#ef4444",
  "Token Lifecycle & Security (RTR)",
  [
    {
      x: 50, y: 110, w: 260, h: 180,
      title: "Legitimate Client (SPA)",
      tag: "Legitimate Client",
      stroke: "#0284c7",
      lines: [
        "React Single Page Application",
        "Access Token expired (10m TTL)",
        "Holds single-use RT_gen1",
        "Sends POST /token (RT_gen1)",
        "Receives AT_2 + RT_gen2 (Rotated)",
        "Replaces RT_gen1 in memory"
      ]
    },
    {
      x: 50, y: 320, w: 260, h: 155,
      title: "Adversary (Replay Attack)",
      tag: "Malicious Attacker",
      stroke: "#ef4444",
      lines: [
        "Stole consumed token: RT_gen1",
        "Attempts replay: POST /token",
        "Triggers Token Reuse Detection!",
        "Access DENIED (401 Unauthorized)",
        "Entire Token Family revoked!"
      ]
    },
    {
      x: 390, y: 110, w: 260, h: 250,
      title: "Authorization Server (IdP)",
      tag: "RTR Engine",
      stroke: "#f59e0b",
      lines: [
        "Evaluates refresh token state",
        "Enforces strict single-use policy",
        "On valid token: Invalidates RT_gen1,",
        "issues new AT_2 and new RT_gen2",
        "On consumed token: Detects breach!",
        "Revokes all tokens in family",
        "Logs high-priority security alert"
      ]
    },
    {
      x: 390, y: 390, w: 260, h: 90,
      title: "Security Audit & SIEM",
      tag: "SIEM Breach Alert",
      stroke: "#dc2626",
      lines: [
        "Dispatches SOC security alert",
        "Forces global re-login for user"
      ]
    },
    {
      x: 730, y: 110, w: 260, h: 230,
      title: "Token Family Store (Redis)",
      tag: "Family Registry",
      stroke: "#ef4444",
      lines: [
        "Family ID: fam_7891 (User 42)",
        "RT_gen1: status = 'USED'",
        "RT_gen2: status = 'ACTIVE'",
        "AT_1: status = 'EXPIRED'",
        "AT_2: status = 'ACTIVE'",
        "State lookup latency: <0.5ms"
      ]
    },
    {
      x: 730, y: 360, w: 260, h: 120,
      title: "Revocation Enforcement",
      tag: "Nuclear Revoke",
      stroke: "#991b1b",
      lines: [
        "On replay of 'USED' RT_gen1:",
        "UPDATE fam_7891 SET status='REVOKED'",
        "Both RT_gen1 and RT_gen2 invalidated!"
      ]
    }
  ],
  [
    { d: "M 310 150 L 390 150", lx: 350, ly: 150, label: "1. POST /token (RT_gen1)", stroke: "#0284c7" },
    { d: "M 650 150 L 730 150", lx: 690, ly: 150, label: "2. Lookup Family fam_7891", stroke: "#f59e0b" },
    { d: "M 390 200 L 310 200", lx: 350, ly: 200, label: "3. Issue AT_2 + RT_gen2", stroke: "#10b981" },
    { d: "M 650 200 L 730 200", lx: 690, ly: 200, label: "4. Mark RT_gen1=USED", stroke: "#10b981" },
    { d: "M 310 370 C 340 370, 360 330, 390 280", lx: 350, ly: 330, label: "5. Replay POST /token (stolen RT_gen1)", stroke: "#ef4444" },
    { d: "M 650 260 L 730 260", lx: 690, ly: 260, label: "6. Reuse Alarm: RT_gen1 USED!", stroke: "#ef4444" },
    { d: "M 650 340 C 680 340, 700 390, 730 400", lx: 690, ly: 370, label: "7. Revoke Entire Family fam_7891", stroke: "#dc2626" },
    { d: "M 520 360 L 520 390", lx: 520, ly: 375, label: "8. 401 Unauthorized + Alert", stroke: "#dc2626" }
  ],
  false,
  [
    { x: 30, y: 80, w: 300, h: 410, label: "CLIENT & ADVERSARY TIER", stroke: "#0284c7" },
    { x: 370, y: 80, w: 300, h: 410, label: "AUTHORIZATION SERVER (IDP)", stroke: "#f59e0b" },
    { x: 710, y: 80, w: 300, h: 410, label: "TOKEN FAMILY REGISTRY (STATE)", stroke: "#ef4444" }
  ]
);
fs.writeFileSync(path.join(diagramsDir, 'oauth2-flow-refresh-token-block.svg'), refreshTokenSvg, 'utf-8');
console.log("-> Generated oauth2-flow-refresh-token-block.svg");

// =========================================================================
// FLOW 6: Stateless JWT Validation Architecture (JWKS Verification)
// =========================================================================
const statelessJwtSvg = generateSvgDiagram(
  1040, 520,
  "Stateless JWT Validation & Distributed JWKS Verification",
  "Sub-Millisecond Asymmetric Signature Verification (RS256/ES256) via Local Key Caching",
  "#10b981",
  "Distributed Security (JWKS)",
  [
    {
      x: 50, y: 130, w: 220, h: 200,
      title: "Client Application",
      tag: "API Consumer",
      stroke: "#0284c7",
      lines: [
        "Web / Mobile / Third-Party",
        "Holds signed Bearer Access Token",
        "Header: alg=RS256, kid=key_2026",
        "Payload: sub=42, aud=api, exp=...",
        "Sends HTTP request with Bearer JWT",
        "Zero authentication cookies"
      ]
    },
    {
      x: 340, y: 110, w: 300, h: 230,
      title: "API Gateway / Envoy Proxy",
      tag: "Stateless Policy PEP",
      stroke: "#10b981",
      lines: [
        "Extracts JWT from Authorization header",
        "Reads kid without verifying payload",
        "Fetches public key from RAM (0.01ms)",
        "Verifies RS256 signature locally",
        "Validates exp, iss, aud, nbf claims",
        "Enforces RBAC / scope permissions",
        "Forwards sanitized request downstream"
      ]
    },
    {
      x: 340, y: 360, w: 300, h: 115,
      title: "In-Memory JWKS Cache",
      tag: "Local Public Key RAM",
      stroke: "#059669",
      lines: [
        "Caches RSA public keys by kid",
        "Stale-while-revalidate background sync",
        "Eliminates IdP network bottleneck (0ms IO)"
      ]
    },
    {
      x: 710, y: 360, w: 280, h: 115,
      title: "Authorization Server (IdP)",
      tag: "Public Key Host",
      stroke: "#f59e0b",
      lines: [
        "Exposes GET /.well-known/jwks.json",
        "Signs JWTs with Private Key",
        "Rotates keys smoothly via new kid"
      ]
    },
    {
      x: 710, y: 110, w: 280, h: 230,
      title: "Downstream Microservice",
      tag: "Resource Server",
      stroke: "#8b5cf6",
      lines: [
        "Receives verified internal RPC",
        "Extracts headers: X-User-Id, Roles",
        "Executes domain business operations",
        "Zero crypto or IdP validation overhead",
        "Focuses purely on application domain",
        "Sub-millisecond ingress response"
      ]
    }
  ],
  [
    { d: "M 540 340 C 580 430, 640 430, 710 410", lx: 620, ly: 420, label: "1. Sync /.well-known/jwks.json", stroke: "#f59e0b" },
    { d: "M 710 380 L 640 380", lx: 675, ly: 380, label: "2. Cache JWKS in RAM", stroke: "#059669" },
    { d: "M 270 180 L 340 180", lx: 305, ly: 180, label: "3. GET /orders (Bearer JWT)", stroke: "#0284c7" },
    { d: "M 490 340 L 490 360", lx: 490, ly: 350, label: "4. Read kid & Fetch Key (0.01ms)", stroke: "#10b981" },
    { d: "M 640 180 L 710 180", lx: 675, ly: 180, label: "5. Forward with X-User-Id (<1ms)", stroke: "#10b981" },
    { d: "M 710 230 L 640 230", lx: 675, ly: 230, label: "6. 200 OK Authorized Result", stroke: "#8b5cf6" },
    { d: "M 340 230 L 270 230", lx: 305, ly: 230, label: "7. Return HTTP 200 to Client", stroke: "#0284c7" }
  ],
  false,
  [
    { x: 30, y: 80, w: 260, h: 410, label: "PUBLIC INTERNET CLIENT", stroke: "#0284c7" },
    { x: 320, y: 80, w: 340, h: 410, label: "API GATEWAY (STATELESS PEP)", stroke: "#10b981" },
    { x: 690, y: 80, w: 320, h: 410, label: "IDENTITY PROVIDER & MICROSERVICES", stroke: "#8b5cf6" }
  ]
);
fs.writeFileSync(path.join(diagramsDir, 'oauth2-flow-stateless-jwt-block.svg'), statelessJwtSvg, 'utf-8');
console.log("-> Generated oauth2-flow-stateless-jwt-block.svg");

console.log("\nAll 6 OAuth 2.0 Flow Diagrams Generated Successfully!");
