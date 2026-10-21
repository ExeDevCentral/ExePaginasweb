<div align="center">

# ExePaginasWeb • Enterprise Cloud Ecosystem
### *High-Throughput Multi-Tenant SaaS Platform, Reactive LLM Inference & Hexagonal Domain Kernel*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.7_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase RLS](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-183%2F183_Tests_Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Certified-45BA4B?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary_Engineering-blue.svg?style=for-the-badge)](https://exepaginasweb.com)

<p align="center">
  <b>An enterprise cloud SaaS architecture featuring Hexagonal Domain-Driven Design (DDD), streaming LLM telemetry with automated ticket generation, cryptographic Svix HMAC webhook verification, and hardware-accelerated Delaunay triangulation shaders.</b>
</p>

---

</div>

## 1. Abstract & System Foundations

**ExePaginasWeb** is an enterprise-scale software-as-a-service (SaaS) and digital engineering platform architected to unify client lifecycle management, streaming generative artificial intelligence (AI SDK), billing reconciliation (PayPal SDK), and low-latency client dashboard telemetry.

Structured under **Hexagonal Clean Architecture**, the core domain logic remains strictly isolated from framework and persistence drivers:
- **Streaming LLM Orchestration:** Low-latency conversational streams leveraging Google Gemini and Groq engines, backed by automated client ticket indexing.
- **Cryptographic Webhook Ingestion:** Invariant Svix SHA-256 HMAC payload verification preventing replay and forged injection attacks.
- **Delaunay Geometric Shaders:** WebGL computational geometry (`delaunator`, `three`) delivering hardware-accelerated interactive topology fields.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EDGE ADAPTERS & INGESTION                       │
│  [Next.js App Router] ──► [Cryptographic Svix Verifier] ──► [Edge Guard]│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 HEXAGONAL DOMAIN KERNEL (CLEAN ARCHITECTURE)           │
│    • Domain Ports: IAuthRepository, ITenantRepository, IClientRepository│
│    • Pure Entities: Immutable Value Objects, Strict Invariant Checks   │
│    • Zero External Coupling: Independent of Database Drivers or UI     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│      SUPABASE POSTGRESQL (RLS)   │        │     REAL-TIME STREAMING & AI     │
│  Multi-Tenant Complex Isolation  │        │   Vercel AI SDK (Gemini/Groq)    │
│  27 Atomic SQL Migrations        │        │   TanStack Query Cache Layer     │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

## 2. Mathematical Invariants & Cryptographic Handshakes

### 2.1. Cryptographic HMAC-SHA256 Webhook Verification
Inbound transactional events (Resend, PayPal) enforce cryptographic signature validation over raw request streams prior to JSON deserialization:

$$\text{HMAC}_{\mathcal{K}}(\text{MsgId} \mathbin{\Vert} \text{Timestamp} \mathbin{\Vert} \text{RawBody}) = \text{Signature}$$

Rejects unauthorized transmissions or replay attacks where $|T_{\text{current}} - T_{\text{signature}}| > 300\text{ s}$.

### 2.2. Delaunay Triangulation Topography
Interactive spatial backgrounds compute planar Delaunay triangulations in $\mathcal{O}(N \log N)$ complexity:

$$\forall \Delta(p_i, p_j, p_k) \in \mathcal{DT}(P), \quad \mathcal{B}(p_i, p_j, p_k) \cap P = \emptyset$$

Where the circumcircle $\mathcal{B}$ of any triangle contains no extraneous vertices from vertex set $P$.

---

## 3. Technology Stack & Multi-Tier Topology

| Layer | Technology | Architectural Functionality |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3 | App Router, React 19 Concurrent Mode, Turbopack |
| **Compiler** | React Compiler | Automated memoization (`babel-plugin-react-compiler`) |
| **AI Inference** | Vercel AI SDK | Edge-streamed tokens from Google Gemini & Groq Llama 3.3 |
| **State & Cache** | TanStack Query v5 | Multi-tiered asynchronous server-state cache management |
| **Data Engine** | Supabase (PostgreSQL 15) | Row Level Security (RLS) with 27 versioned DDL migrations |
| **Visual Geometry** | Three.js + Delaunator | WebGL canvas shaders, holographic particle fields |
| **Telemetry** | PostHog + Vercel Analytics | Micro-interaction tracking, Core Web Vitals diagnostics |

---

## 4. Systems Directory Hierarchy

```text
ExePaginasweb/
├── app/                          # Next.js 16 App Router pages & serverless handlers
│   ├── api/                      # REST endpoints (chat, contact, webhooks)
│   ├── dashboard/                # Client & Enterprise Operations Cockpit
│   └── page.tsx                  # High-performance landing page
├── src/
│   ├── core/
│   │   ├── domain/               # Hexagonal domain models, entities & value objects
│   │   │   ├── auth/             # Session boundaries & role-based ACLs
│   │   │   ├── financial/        # Monetary calculations & subscription ledgers
│   │   │   └── onboarding/       # Workspace tenant provisioning
│   │   └── infra/                # Supabase concrete drivers & InMemory test fakes
│   ├── components/               # Atomic design primitives & WebGL canvases
│   └── hooks/                    # Reactive hooks (`useDashboard`, `useTenant`)
├── supabase/
│   └── migrations/               # 27 production SQL migration scripts
├── tests/
│   ├── api/                      # Route handler integration tests
│   └── e2e-units/                # Playwright E2E and Vitest unit suites (183 tests)
└── web-automation-cli/           # Autonomous CLI tooling for workspace workflows
```

---

## 5. Development Runtime & Quality Verification

### Prerequisites
- **Node.js**: $\ge 24.0.0$
- **Package Manager**: `npm` $\ge 10.x$

### Installation & Initialization
```bash
# Clone the repository
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb

# Install dependencies deterministically
npm install

# Launch Next.js development server
npm run dev
```

### Static Analysis & Verification Suite
```bash
# Execute full Vitest suite (183 tests covering domain, API, and auth)
npm test

# Run strict TypeScript static typecheck (0 errors)
npm run typecheck

# Execute code formatting and linting
npm run lint
npm run format

# Compile production-optimized artifact
npm run build
```

---

## 6. Formal Verification

```
 ✓ tests/api/audit/system-audit.test.js           (10 tests)
 ✓ tests/api/contact.test.ts                     (6 tests)
 ✓ tests/api/chat.test.ts                        (5 tests)
 ✓ tests/api/webhooks-resend.test.ts             (5 tests)
 ✓ tests/api/paypal-webhook.test.ts              (4 tests)
 ✓ tests/e2e-units/dashboard.test.tsx            (8 tests)
 ✓ tests/e2e-units/mobile-landing.test.tsx       (6 tests)
 ✓ src/core/domain/financial/financial.test.ts   (12 tests)
 ✓ src/core/domain/tenant/tenant.test.ts         (10 tests)
 ✓ src/core/domain/auth/authPolicy.test.ts       (14 tests)
 ✓ src/core/domain/onboarding/onboarding.test.ts (8 tests)
 ✓ src/core/domain/reservations/collision.test.ts(9 tests)
 ✓ src/core/domain/availability/slots.test.ts    (7 tests)
 ✓ src/core/infra/repositories/repositories.test (18 tests)

 Test Files  30 passed (30)
      Tests  183 passed (183)
   Duration  2.82s
```

---

## 7. Contact & Engineering Inquiries

**Exequiel Echevarría — Systems & Software Architect**  
*ExeDevCentral · Digital Acceleration & Cloud Systems*

- 🌐 **Official Portal:** [exepaginasweb.com](https://exepaginasweb.com)
- 📱 **Direct Channel:** [+54 9 341 6874786](https://wa.me/5493416874786)
- 📧 **Enterprise Inquiries:** [Contacto@exepaginasweb.com](mailto:Contacto@exepaginasweb.com)
- 💻 **GitHub Profile:** [@ExeDevCentral](https://github.com/ExeDevCentral)

---

<div align="center">
  <sub>Engineered by <strong>Exequiel Echevarría</strong>. All rights reserved.</sub>
</div>
