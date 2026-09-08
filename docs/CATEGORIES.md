# CATEGORIES — skill-cli taxonomy

Machine-readable source: `scripts/taxonomy.mjs` (regenerate with `node scripts/taxonomy.mjs --docs`)

Every catalog record gets 1-3 categories. Category assignment source is recorded per record (`category_source`): `heuristic` (offline keyword match — these categories), `ai` (AI batch pass), `human` (review pass).

## 63 categories

- **llm-apps** — LLM Apps: Building applications that use large language models (OpenAI, Anthropic, RAG, embeddings).
- **prompt-engineering** — Prompt Engineering: Prompt design, system prompts, few-shot, and role patterns.
- **ai-agents** — AI Agents: Agent architecture, multi-agent systems, tool calling, and automation agents.
- **machine-learning** — Machine Learning: Model training, neural networks, deep learning, and ML frameworks.
- **data-science** — Data Science: Analysis, visualization, statistics, and data exploration.
- **data-engineering** — Data Engineering: ETL, warehouses, pipelines, streaming, and big data infrastructure.
- **computer-vision** — Computer Vision: Image classification, object detection, and vision models.
- **speech-audio** — Speech & Audio: ASR, TTS, transcription, and audio processing.
- **context-engineering** — Context Engineering: Context window management, compression, memory, and session continuity.
- **web-development** — Web Development: HTML/CSS/JS frontend, responsive layouts, and general web building.
- **react-frontend** — React Frontend: React, Next.js, hooks, and component patterns.
- **typescript-javascript** — TypeScript & JS: Language-level patterns for TS/JS, module systems, and tooling.
- **python-development** — Python: Python language patterns, asyncio, Django/Flask/FastAPI.
- **rust-development** — Rust: Rust language patterns, Makepad/Lapce/Robius UI stacks, Cargo.
- **dotnet-development** — .NET / C#: C#, WPF, Avalonia, ASP.NET, .NET patterns.
- **backend-development** — Backend: REST/GraphQL APIs, server frameworks, microservices.
- **software-architecture** — Software Architecture: ADR, design patterns, code review, refactoring, and system design.
- **skill-authoring** — Skill Authoring: Creating, writing, managing, and validating agent skills.
- **developer-tooling** — Developer Tooling: Editor/LSP/lint tooling, project scaffolding, CI helpers, meta-workflows.
- **database-management** — Databases: Postgres, Redis, MongoDB, SQL, and schema design.
- **devops** — DevOps: Containers, CI/CD, IaC, deployment, and platform engineering.
- **observability** — Observability: Logs, metrics, tracing, incident response, postmortems, on-call.
- **git-workflow** — Git & Repos: Git workflows, branching strategy, and repo hygiene.
- **cloud-aws** — Cloud · AWS: AWS services: Lambda, S3, EC2, deployments.
- **cloud-azure** — Cloud · Azure: Azure functions and Azure services.
- **cloud-gcp** — Cloud · GCP: Google Cloud Platform services.
- **serverless** — Serverless: Edge functions, Cloudflare, Vercel, and serverless patterns.
- **mobile-development** — Mobile: React Native, Flutter, iOS/Android, and mobile UX.
- **embedded-systems** — Embedded & Firmware: Firmware, microcontrollers, RTOS, FPGAs, low-level drivers.
- **performance-optimization** — Performance: Web performance, profiling, and optimization.
- **security-engineering** — Security: Defensive coding: secure patterns, XSS/injection prevention, hardening.
- **accessibility** — Accessibility: WCAG, ARIA, screen readers, and inclusive design.
- **browser-automation** — Browser Automation: Playwright, Puppeteer, Selenium, extensions.
- **software-testing** — Testing: Unit/integration/e2e tests, TDD, QA.
- **web-scraping** — Scraping: Crawlers, scrapers, proxy handling.
- **saas-integrations** — SaaS Integrations: Automating third-party app APIs via MCP/Composio-style builders (Airtable, Asana, Gmail apps…).
- **n8n-workflows** — n8n Workflows: n8n node patterns, self-hosted workflows, automation recipes.
- **whatsapp** — WhatsApp: WhatsApp API, bots, and messaging automation.
- **telegram** — Telegram: Telegram bots and automation.
- **discord** — Discord: Discord bots, permissions, and community automation.
- **slack** — Slack: Slack apps, slash commands, and workspace automation.
- **productivity-tools** — Productivity: Notion, Obsidian, Gmail, calendars, task management.
- **google-workspace** — Google Workspace: Sheets, Drive, Docs, Forms, and Google APIs.
- **home-automation** — Home Automation: Home Assistant, IoT, ESP32, sensors, smart home.
- **ecommerce** — Ecommerce: Shopify, Stripe, checkout, and store ops.
- **sales-crm** — Sales & CRM: CRM, lead gen, cold outreach, pipelines.
- **finance-banking** — Finance: Accounting, invoicing, trading, crypto, banking.
- **hr-recruiting** — HR & Recruiting: Recruiting, resumes, interviews, onboarding.
- **legal-compliance** — Legal & Compliance: Contracts, privacy, GDPR, trademarks.
- **healthcare** — Healthcare: Medical workflows, clinical, wellness.
- **education-learning** — Education: Courses, teaching, curriculum, language learning.
- **seo** — SEO: Search visibility: audits, sitemaps, schema, keyword research.
- **marketing** — Marketing: Campaigns, ads, funnels, social media.
- **copywriting** — Copywriting: Blogs, articles, newsletters, storytelling.
- **design-ui** — Design & UI: Design systems, Figma, branding, UX.
- **image-generation** — Image Generation: Diffusion, Midjourney, DALL-E, generative art.
- **video-media** — Video & Media: Video editing, ffmpeg, podcasts, YouTube.
- **writing-docs** — Docs & Writing: Documentation, READMEs, technical writing.
- **research-science** — Science & Research: Astronomy, chemistry, biology, scientific computing.
- **gaming** — Gaming: Game dev, Unity/Unreal, and playable design.
- **business-ops** — Business Ops: Startups, strategy, operations, SaaS.
- **offensive-security** — Offensive Security (index-only): Pentest/red-team skills. Index-only; never shipped. Assigned from risk=offensive flag.
- **misc** — Misc: No strong taxonomy match. Refine via AI/human tagging pass.

## Assignments (2.3 rules)

1. `risk=offensive` skills are forced to `offensive-security` (index-only).
2. Taxonomy order = priority; max 3 categories per record.
3. No match → `misc` (flagged for the AI/human pass).
