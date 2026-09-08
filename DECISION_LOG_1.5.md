# DECISION LOG 1.5 — Distribution Gate (Phase 1.5a)

Generated: 2026-09-01 · Source: `src/data/licenses.json` + `src/data/catalog.jsonl`
Owner task: fill the **Decision** column (core | index-only) per row. AI default: any row with a permissive license **and** an attribution = candidate core; everything else defaults index-only. Rows already flagged risk=offensive stay index-only by design (install gate refuses them anyway). "core" means the skill ships in `skills-core/` + npm.

Legend for license _level_: `file` = LICENSE file on disk · `front-matter` = SKILL.md front-matter · `mention` = only mentioned in prose (weakest — owner may want to verify).

## Summary

- **With license: 131** — permissive (core candidates): 124 · non-permissive (stay index-only): 7
- **Attribution without license: 166** — keep index-only unless owner verifies license by hand
- Note: 24 risk=offensive skills exist catalog-wide; any of them listed below must stay index-only.

---

## A. Permissive license (124) — core candidates

| Name | License | Level | Attribution | Risk | Description (truncated) | Decision |
|---|---|---|---|---|---|---|
| 3d-web-experience | Apache-2.0 | mention |  |  | Expert in building 3D experiences for the web - Three.js, React |  |
| agent-evaluation | Apache-2.0 | mention |  |  | Testing and benchmarking LLM agents including behavioral testing, |  |
| agent-memory-systems | Apache-2.0 | mention |  |  | "Memory is the cornerstone of intelligent agents. Without it, every |  |
| agent-tool-builder | Apache-2.0 | mention |  |  | Tools are how AI agents interact with the world. A well-designed |  |
| ai-agents-architect | Apache-2.0 | mention |  |  | Expert in designing and building autonomous AI agents. Masters tool |  |
| ai-product | Apache-2.0 | mention |  |  | Every product will be AI-powered. The question is whether you'll |  |
| ai-wrapper-product | Apache-2.0 | mention |  |  | Expert in building products that wrap AI APIs (OpenAI, Anthropic, |  |
| algolia-search | Apache-2.0 | mention |  |  | Expert patterns for Algolia search implementation, indexing |  |
| algorithmic-art | Apache-2.0 | file |  |  | Algorithmic philosophies are computational aesthetic movements that ar |  |
| ASR | MIT | front-matter |  |  | Implement speech-to-text (ASR/automatic speech recognition) capabiliti |  |
| astropy | BSD-3 | front-matter |  |  | Astropy is the core Python package for astronomy, providing essential |  |
| autonomous-agents | Apache-2.0 | mention |  |  | Autonomous agents are AI systems that can independently decompose |  |
| aws-serverless | Apache-2.0 | mention |  |  | Specialized skill for building production-ready serverless |  |
| azure-functions | Apache-2.0 | mention |  |  | Expert patterns for Azure Functions development including isolated |  |
| brand-guidelines-anthropic | Apache-2.0 | file |  |  | To access Anthropic's official brand identity and style resources, use |  |
| brand-guidelines-community | Apache-2.0 | file |  |  | To access Anthropic's official brand identity and style resources, use |  |
| browser-automation | Apache-2.0 | mention |  |  | Browser automation powers web testing, scraping, and AI agent |  |
| browser-extension-builder | Apache-2.0 | mention |  |  | Expert in building browser extensions that solve real problems - |  |
| building-native-ui | MIT | front-matter |  |  | Complete guide for building beautiful apps with Expo Router. Covers fu |  |
| bullmq-specialist | Apache-2.0 | mention |  |  | BullMQ expert for Redis-backed job queues, background processing, |  |
| canvas-design | Apache-2.0 | file |  |  | These are instructions for creating design philosophies - aesthetic mo |  |
| cirq | Apache-2.0 | front-matter |  |  | Cirq is Google Quantum AI's open-source framework for designing, simul |  |
| citation-management | MIT | front-matter |  |  | Manage citations systematically throughout the research and writing pr |  |
| claude-api | Apache-2.0 | file |  |  | Build apps with the Claude API or Anthropic SDK. TRIGGER when: code im |  |
| clerk-auth | Apache-2.0 | mention |  |  | Expert patterns for Clerk auth implementation, middleware, |  |
| computer-use-agents | Apache-2.0 | mention |  |  | Build AI agents that interact with computers like humans do - |  |
| context-window-management | Apache-2.0 | mention |  |  | Strategies for managing LLM context windows including |  |
| conversation-memory | Apache-2.0 | mention |  |  | Persistent memory systems for LLM conversations including |  |
| crewai | Apache-2.0 | mention |  |  | Expert in CrewAI - the leading role-based multi-agent framework |  |
| daily-gift | MIT | front-matter | jiawei248 |  | Relationship-aware daily gift engine with five-stage creative pipeline |  |
| devcontainer-setup | Apache-2.0 | mention |  |  | Creates devcontainers with Claude Code, language-specific tooling (Pyt |  |
| diary | MIT | file |  |  | Unified Diary System: A context-preserving automated logger for multi- |  |
| discord-bot-architect | Apache-2.0 | mention |  |  | Specialized skill for building production-ready Discord bots. |  |
| email-systems | Apache-2.0 | mention |  |  | Email has the highest ROI of any marketing channel. $36 for every |  |
| expo-api-routes | MIT | front-matter |  |  | Guidelines for creating API routes in Expo Router with EAS Hosting |  |
| expo-cicd-workflows | MIT | front-matter |  |  | Helps understand and write EAS workflow YAML files for Expo projects. |  |
| expo-dev-client | MIT | front-matter |  |  | Build and distribute Expo development clients locally or via TestFligh |  |
| expo-tailwind-setup | MIT | front-matter |  |  | Set up Tailwind CSS v4 in Expo with react-native-css and NativeWind v5 |  |
| faf-wizard | MIT | mention | wolfejam |  | Done-for-you .faf generator. One-click AI context for any project - ne |  |
| file-uploads | Apache-2.0 | mention |  |  | Expert at handling file uploads and cloud storage. Covers S3, |  |
| firebase | Apache-2.0 | mention |  |  | Firebase gives you a complete backend in minutes - auth, database, |  |
| fixing-metadata | MIT | front-matter |  |  | Audit and fix HTML metadata including page titles, meta descriptions, |  |
| frontend-design | Apache-2.0 | file |  |  | You are a frontend designer-engineer, not a layout generator. |  |
| gcp-cloud-run | Apache-2.0 | mention |  |  | Specialized skill for building production-ready serverless |  |
| gmail-automation | Apache-2.0 | front-matter |  |  | Lightweight Gmail integration with standalone OAuth authentication. No |  |
| google-calendar-automation | Apache-2.0 | front-matter |  |  | Lightweight Google Calendar integration with standalone OAuth authenti |  |
| google-docs-automation | Apache-2.0 | front-matter |  |  | Lightweight Google Docs integration with standalone OAuth authenticati |  |
| google-drive-automation | Apache-2.0 | front-matter |  |  | Lightweight Google Drive integration with standalone OAuth authenticat |  |
| google-sheets-automation | Apache-2.0 | front-matter |  |  | Lightweight Google Sheets integration with standalone OAuth authentica |  |
| google-slides-automation | Apache-2.0 | front-matter |  |  | Lightweight Google Slides integration with standalone OAuth authentica |  |
| graphql | Apache-2.0 | mention |  |  | GraphQL gives clients exactly the data they need - no more, no |  |
| hubspot-integration | Apache-2.0 | mention |  |  | Expert patterns for HubSpot CRM integration including OAuth |  |
| hugging-face-paper-publisher | Apache-2.0 | mention |  |  | Publish and manage research papers on Hugging Face Hub. Supports creat |  |
| humanizer | MIT | front-matter |  |  | Remove signs of AI-generated writing from text. Use when editing or re |  |
| idea-os | MIT | front-matter | Slashworks-biz |  | Five-phase pipeline (triage → clarify → research → PRD → plan) that tu |  |
| image-edit | MIT | front-matter |  |  | Implement AI image editing and modification capabilities using the z-a |  |
| image-generation | MIT | front-matter |  |  | Implement AI image generation capabilities using the z-ai-web-dev-sdk. |  |
| image-understand | MIT | front-matter |  |  | Implement specialized image understanding capabilities using the z-ai- |  |
| impeccable | Apache-2.0 | front-matter |  |  | Use when the user wants to design, redesign, shape, critique, audit, p |  |
| inngest | Apache-2.0 | mention |  |  | Inngest expert for serverless-first background jobs, event-driven |  |
| interactive-portfolio | Apache-2.0 | mention |  |  | Expert in building portfolios that actually land jobs and clients - |  |
| internal-comms | Apache-2.0 | file |  |  | Write internal communications such as status reports, leadership updat |  |
| internal-comms-anthropic | Apache-2.0 | file |  |  | To write internal communications, use this skill for: |  |
| internal-comms-community | Apache-2.0 | file |  |  | To write internal communications, use this skill for: |  |
| lambdatest-agent-skills | MIT | front-matter | tanveer-farooq |  | Production-grade test automation skills for 46 frameworks across E2E, |  |
| langfuse | Apache-2.0 | mention |  |  | Expert in Langfuse - the open-source LLM observability platform. |  |
| langgraph | Apache-2.0 | mention |  |  | Expert in LangGraph - the production-grade framework for building |  |
| LLM | MIT | front-matter |  |  | Implement large language model (LLM) chat completions using the z-ai-w |  |
| loki-mode | MIT | file |  |  | Version 2.35.0 \| PRD to Production \| Zero Human Intervention > Researc |  |
| mcp-builder | Apache-2.0 | file |  |  | Create MCP (Model Context Protocol) servers that enable LLMs to intera |  |
| micro-saas-launcher | Apache-2.0 | mention |  |  | Expert in launching small, focused SaaS products fast - the indie |  |
| moyu | MIT | front-matter |  |  | Anti-over-engineering guardrail that activates when an AI coding agent |  |
| native-data-fetching | MIT | front-matter |  |  | Use when implementing or debugging ANY network request, API call, or d |  |
| neon-postgres | Apache-2.0 | mention |  |  | Expert patterns for Neon serverless Postgres, branching, connection |  |
| nextjs-supabase-auth | Apache-2.0 | mention |  |  | Expert integration of Supabase Auth with Next.js App Router |  |
| notebooklm | MIT | file |  |  | Interact with Google NotebookLM to query documentation with Gemini's s |  |
| notion-template-business | Apache-2.0 | mention |  |  | Expert in building and selling Notion templates as a business - not |  |
| personal-tool-builder | Apache-2.0 | mention |  |  | Expert in building custom tools that solve your own problems first. |  |
| plaid-fintech | Apache-2.0 | mention |  |  | Expert patterns for Plaid API integration including Link token |  |
| plotly | MIT | front-matter |  |  | Interactive visualization library. Use when you need hover info, zoom, |  |
| podcast-generate | MIT | front-matter |  |  | Generate podcast episodes from user-provided content or by searching t |  |
| prompt-caching | Apache-2.0 | mention |  |  | Caching strategies for LLM prompts including Anthropic prompt |  |
| protect-mcp-governance | MIT | mention |  |  | Agent governance skill for MCP tool calls — Cedar policy authoring, sh |  |
| python-development-python-scaffold | MIT | mention |  |  | You are a Python project architecture expert specializing in scaffoldi |  |
| qiskit | Apache-2.0 | front-matter |  |  | Qiskit is the world's most popular open-source quantum computing frame |  |
| rag-engineer | Apache-2.0 | mention |  |  | Expert in building Retrieval-Augmented Generation systems. Masters |  |
| salesforce-development | Apache-2.0 | mention |  |  | Expert patterns for Salesforce platform development including |  |
| scientific-writing | MIT | front-matter |  |  | This is the core skill for the deep research and writing tool—combinin |  |
| scikit-learn | BSD-3 | front-matter |  |  | Machine learning in Python with scikit-learn. Use for classification, |  |
| scroll-experience | Apache-2.0 | mention |  |  | Expert in building immersive scroll-driven experiences - parallax |  |
| seaborn | BSD-3 | front-matter |  |  | Seaborn is a Python visualization library for creating publication-qua |  |
| segment-cdp | Apache-2.0 | mention |  |  | Expert patterns for Segment Customer Data Platform including |  |
| shopify-apps | Apache-2.0 | mention |  |  | Expert patterns for Shopify app development including Remix/React |  |
| skill-check | MIT | front-matter | olgasafonova |  | Validate Claude Code skills against the agentskills specification. Cat |  |
| skill-creator | Apache-2.0 | file |  |  | To create new CLI skills following Anthropic's official best practices |  |
| slack-bot-builder | Apache-2.0 | mention |  |  | Build Slack apps using the Bolt framework across Python, |  |
| slack-gif-creator | Apache-2.0 | file |  |  | A toolkit providing utilities and knowledge for creating animated GIFs |  |
| statsmodels | BSD-3 | front-matter |  |  | Statsmodels is Python's premier library for statistical modeling, prov |  |
| stop-slop | MIT | file |  |  | Remove AI writing patterns from prose. Use when drafting, editing, or |  |
| technical-change-tracker | MIT | mention | Elkidogz |  | Track code changes with structured JSON records, state machine enforce |  |
| telegram-bot-builder | Apache-2.0 | mention |  |  | Expert in building Telegram bots that solve real problems - from |  |
| telegram-mini-app | Apache-2.0 | mention |  |  | Expert in building Telegram Mini Apps (TWA) - web apps that run |  |
| terraform-skill | Apache-2.0 | mention |  |  | Terraform infrastructure as code best practices |  |
| theme-factory | Apache-2.0 | file |  |  | This skill provides a curated collection of professional font and colo |  |
| transformers-js | Apache-2.0 | front-matter |  |  | Run Hugging Face models in JavaScript or TypeScript with Transformers. |  |
| trigger-dev | Apache-2.0 | mention |  |  | Trigger.dev expert for background jobs, AI workflows, and reliable |  |
| TTS | MIT | front-matter |  |  | Implement text-to-speech (TTS) capabilities using the z-ai-web-dev-sdk |  |
| twilio-communications | Apache-2.0 | mention |  |  | "Build communication features with Twilio: SMS messaging, voice |  |
| unslop | MIT | front-matter | MohamedAbdallah-14 |  | Post-process AI-generated text through the unslop CLI to strip AI writ |  |
| upstash-qstash | Apache-2.0 | mention |  |  | Upstash QStash expert for serverless message queues, scheduled |  |
| vercel-deployment | Apache-2.0 | mention |  |  | Expert knowledge for deploying to Vercel with Next.js |  |
| video-generation | MIT | front-matter |  |  | Implement AI-powered video generation capabilities using the z-ai-web- |  |
| video-understand | MIT | front-matter |  |  | Implement specialized video understanding capabilities using the z-ai- |  |
| viral-generator-builder | Apache-2.0 | mention |  |  | Expert in building shareable generator tools that go viral - name |  |
| VLM | MIT | front-matter |  |  | Implement vision-based AI chat capabilities using the z-ai-web-dev-sdk |  |
| voice-agents | Apache-2.0 | mention |  |  | Voice agents represent the frontier of AI interaction - humans |  |
| voice-ai-development | Apache-2.0 | mention |  |  | Expert in building voice AI applications - from real-time voice |  |
| web-artifacts-builder | Apache-2.0 | file |  |  | To build powerful frontend claude.ai artifacts, follow these steps: |  |
| web-reader | MIT | front-matter |  |  | Implement web page content extraction capabilities using the z-ai-web- |  |
| web-search | MIT | front-matter |  |  | Implement web search capabilities using the z-ai-web-dev-sdk. Use this |  |
| webapp-testing | Apache-2.0 | file |  |  | To test local web applications, write native Python Playwright scripts |  |
| workflow-automation | Apache-2.0 | mention |  |  | Workflow automation is the infrastructure that makes AI agents |  |
| xvary-stock-research | MIT | file |  |  | Thesis-driven equity analysis from public SEC EDGAR and market data; / |  |
| zapier-make-patterns | Apache-2.0 | mention |  |  | No-code automation democratizes workflow building. Zapier and Make |  |

---

## B. Non-permissive license (7) — always index-only

| Name | License | Level | Attribution | Risk | Description (truncated) | Decision |
|---|---|---|---|---|---|---|
| docx | proprietary | front-matter |  |  | Comprehensive document creation, editing, and analysis with support fo |  |
| pdf | proprietary | front-matter |  |  | Comprehensive PDF manipulation toolkit for extracting text and tables, |  |
| pptx | proprietary | front-matter |  |  | Presentation creation, editing, and analysis. When Claude needs to wor |  |
| skyvern-browser-automation | AGPL | front-matter | mark1ian |  | AI-powered browser automation — navigate sites, fill forms, extract st |  |
| Videos | proprietary | front-matter |  |  | Use this skill whenever the user wants to create, read, edit, or manip |  |
| wordpress-theme-development | GPL | mention |  |  | WordPress theme development workflow covering theme architecture, temp |  |
| xlsx | proprietary | front-matter |  |  | Comprehensive spreadsheet creation, editing, and analysis with support |  |

---

## C. Attribution only, no license found (166) — index-only unless verified

| Name | License | Level | Attribution | Risk | Description (truncated) | Decision |
|---|---|---|---|---|---|---|
| 007 |  | front-matter | renat |  | Security audit, hardening, threat modeling (STRIDE/PASTA), Red/Blue Te |  |
| active-directory-attacks |  | front-matter | zebbern | offensive | Provide comprehensive techniques for attacking Microsoft Active Direct |  |
| advogado-criminal |  | front-matter | renat |  | Advogado criminalista especializado em Maria da Penha, violencia domes |  |
| advogado-especialista |  | front-matter | renat |  | 'Advogado especialista em todas as areas do Direito brasileiro: famili |  |
| aegisops-ai |  | front-matter | Champbreed |  | Autonomous DevSecOps & FinOps Guardrails. Orchestrates Gemini 3 Flash |  |
| agent-orchestrator |  | front-matter | renat |  | Meta-skill que orquestra todos os agentes do ecossistema. Scan automat |  |
| ai-dev-jobs-mcp |  | front-matter | unitedideas |  | Search 8,400+ AI and ML jobs across 489 companies, inspect listings an |  |
| ai-engineering-toolkit |  | front-matter | viliawang-pm | offensive | 6 production-ready AI engineering workflows: prompt evaluation (8-dime |  |
| ai-studio-image |  | front-matter | renat |  | Geracao de imagens humanizadas via Google AI Studio (Gemini). Fotos re |  |
| akf-trust-metadata |  | front-matter | HMAKT99 |  | The AI native file format. EXIF for AI — stamps every file with trust |  |
| amazon-alexa |  | front-matter | renat |  | Integracao completa com Amazon Alexa para criar skills de voz intelige |  |
| analytics-product |  | front-matter | renat |  | Analytics de produto — PostHog, Mixpanel, eventos, funnels, cohorts, r |  |
| andrej-karpathy |  | front-matter | renat |  | Agente que simula Andrej Karpathy — ex-Director of AI da Tesla, co-fun |  |
| api-fuzzing-bug-bounty |  | front-matter | zebbern | offensive | Provide comprehensive techniques for testing REST, SOAP, and GraphQL A |  |
| astro |  | front-matter | suhaibjanjua |  | Build content-focused websites with Astro — zero JS by default, island |  |
| audit-skills |  | front-matter | MAIOStudio |  | Expert security auditor for AI Skills and Bundles. Performs non-intrus |  |
| auri-core |  | front-matter | renat |  | Auri: assistente de voz inteligente (Alexa + Claude claude-opus-4-2025 |  |
| aws-penetration-testing |  | front-matter | zebbern | offensive | Provide comprehensive techniques for penetration testing AWS cloud env |  |
| bdistill-behavioral-xray |  | front-matter | FrancyJGLisboa |  | X-ray any AI model's behavioral patterns — refusal boundaries, halluci |  |
| bdistill-knowledge-extraction |  | front-matter | FrancyJGLisboa |  | Extract structured domain knowledge from AI models in-session or from |  |
| bill-gates |  | front-matter | renat |  | Agente que simula Bill Gates — cofundador da Microsoft, arquiteto da i |  |
| broken-authentication |  | front-matter | zebbern |  | Identify and exploit authentication and session management vulnerabili |  |
| bulletmind |  | front-matter | tejasashinde |  | Convert input into clean, structured, hierarchical bullet points for s |  |
| burp-suite-testing |  | front-matter | zebbern | offensive | Execute comprehensive web application security testing using Burp Suit |  |
| clarity-gate |  | front-matter | Francesco Marinoni Moretto |  | Pre-ingestion verification for epistemic quality in RAG systems. Ensur |  |
| clarvia-aeo-check |  | front-matter | digitamaz |  | Score any MCP server, API, or CLI for agent-readiness using Clarvia AE |  |
| claude-code-expert |  | front-matter | renat |  | Especialista profundo em Claude Code - CLI da Anthropic. Maximiza prod |  |
| claude-monitor |  | front-matter | renat |  | Monitor de performance do Claude Code e sistema local. Diagnostica len |  |
| cloud-penetration-testing |  | front-matter | zebbern | offensive | Conduct comprehensive security assessments of cloud infrastructure acr |  |
| comfyui-gateway |  | front-matter | renat |  | REST API gateway for ComfyUI servers. Workflow management, job queuing |  |
| context-agent |  | front-matter | renat |  | Agente de contexto para continuidade entre sessoes. Salva resumos, dec |  |
| context-guardian |  | front-matter | renat |  | Guardiao de contexto que preserva dados criticos antes da compactacao |  |
| cred-omega |  | front-matter | renat |  | CISO operacional enterprise para gestao total de credenciais e segredo |  |
| design-taste-frontend |  | front-matter | Leonxlnx |  | Use when building high-agency frontend interfaces with strict design t |  |
| devops-deploy |  | front-matter | renat |  | DevOps e deploy de aplicacoes — Docker, CI/CD com GitHub Actions, AWS |  |
| earllm-build |  | front-matter | renat |  | Build, maintain, and extend the EarLLM One Android project — a Kotlin/ |  |
| elon-musk |  | front-matter | renat |  | Agente que simula Elon Musk com profundidade psicologica e comunicacio |  |
| ethical-hacking-methodology |  | front-matter | zebbern | offensive | Master the complete penetration testing lifecycle from reconnaissance |  |
| faf-expert |  | front-matter | wolfejam |  | Advanced .faf (Foundational AI-context Format) specialist. IANA-regist |  |
| file-path-traversal |  | front-matter | zebbern | offensive | Identify and exploit file path traversal (directory traversal) vulnera |  |
| fp-async |  | front-matter | kadu |  | Practical async patterns using TaskEither - clean pipelines instead of |  |
| fp-backend |  | front-matter | kadu |  | Functional programming patterns for Node.js/Deno backend development u |  |
| fp-data-transforms |  | front-matter | Claude |  | Everyday data transformations using functional patterns - arrays, obje |  |
| fp-errors |  | front-matter | kadu |  | Stop throwing everywhere - handle errors as values using Either and Ta |  |
| fp-pragmatic |  | front-matter | kadu |  | A practical, jargon-free guide to functional programming - the 80/20 a |  |
| fp-react |  | front-matter | fp-ts-skills |  | Practical patterns for using fp-ts with React - hooks, state, forms, d |  |
| fp-refactor |  | front-matter | fp-ts-skills |  | Comprehensive guide for refactoring imperative TypeScript code to fp-t |  |
| frontend-api-integration-patterns |  | front-matter | avij1109 |  | Production-ready patterns for integrating frontend applications with b |  |
| full-output-enforcement |  | front-matter | Leonxlnx |  | Use when a task requires exhaustive unabridged output, complete files, |  |
| gdb-cli |  | front-matter | Cerdore |  | GDB debugging assistant for AI agents - analyze core dumps, debug live |  |
| geoffrey-hinton |  | front-matter | renat |  | Agente que simula Geoffrey Hinton — Godfather of Deep Learning, Prêmio |  |
| global-chat-agent-discovery |  | front-matter | pumanitro |  | Discover and search 18K+ MCP servers and AI agents across 6+ registrie |  |
| gpt-taste |  | front-matter | Leonxlnx |  | Use when generating elite GSAP-heavy frontend pages with strict AIDA s |  |
| growth-engine |  | front-matter | renat |  | Motor de crescimento para produtos digitais -- growth hacking, SEO, AS |  |
| helium-mcp |  | front-matter | connerlambden |  | Connect to Helium's MCP server for news research, media bias analysis, |  |
| high-end-visual-design |  | front-matter | Leonxlnx |  | Use when designing expensive agency-grade interfaces with premium font |  |
| hono |  | front-matter | suhaibjanjua |  | Build ultra-fast web APIs and full-stack apps with Hono — runs on Clou |  |
| html-injection-testing |  | front-matter | zebbern | offensive | Identify and exploit HTML injection vulnerabilities that allow attacke |  |
| idor-testing |  | front-matter | zebbern | offensive | Provide systematic methodologies for identifying and exploiting Insecu |  |
| ilya-sutskever |  | front-matter | renat |  | Agente que simula Ilya Sutskever — co-fundador da OpenAI, ex-Chief Sci |  |
| image-studio |  | front-matter | renat |  | Studio de geracao de imagens inteligente — roteamento automatico entre |  |
| indexing-issue-auditor |  | front-matter | WHOISABHISHEKADHIKARI |  | High-level technical SEO and site architecture auditor. Invoke to scan |  |
| industrial-brutalist-ui |  | front-matter | Leonxlnx |  | Use when creating raw industrial or tactical telemetry UIs with rigid |  |
| instagram |  | front-matter | renat |  | Integracao completa com Instagram via Graph API. Publicacao, analytics |  |
| interview-coach |  | front-matter | dbhat93 |  | Full job search coaching system — JD decoding, resume, storybank, mock |  |
| jq |  | front-matter | kostakost2 |  | Expert jq usage for JSON querying, filtering, transformation, and pipe |  |
| junta-leiloeiros |  | front-matter | renat |  | Coleta e consulta dados de leiloeiros oficiais de todas as 27 Juntas C |  |
| k6-load-testing |  | front-matter | Kairo Official |  | Comprehensive k6 load testing skill for API, browser, and scalability |  |
| kotler-macro-analyzer |  | front-matter | justmiroslav |  | Professional PESTEL/SWOT analysis agent based on Kotler's methodology |  |
| lambda-lang |  | front-matter | voidborne-d |  | Native agent-to-agent language for compact multi-agent messaging. A sh |  |
| landing-page-generator |  | front-matter | alirezarezvani |  | Generates high-converting Next.js/React landing pages with Tailwind CS |  |
| leiloeiro-avaliacao |  | front-matter | renat |  | Avaliacao pericial de imoveis em leilao. Valor de mercado, liquidacao |  |
| leiloeiro-edital |  | front-matter | renat |  | Analise e auditoria de editais de leilao judicial e extrajudicial. Ris |  |
| leiloeiro-ia |  | front-matter | renat |  | Especialista em leiloes judiciais e extrajudiciais de imoveis. Analise |  |
| leiloeiro-juridico |  | front-matter | renat |  | 'Analise juridica de leiloes: nulidades, bem de familia, alienacao fid |  |
| leiloeiro-mercado |  | front-matter | renat |  | Analise de mercado imobiliario para leiloes. Liquidez, desagio tipico, |  |
| leiloeiro-risco |  | front-matter | renat |  | Analise de risco em leiloes de imoveis. Score 36 pontos, riscos juridi |  |
| lex |  | front-matter | Svobikl |  | Centralized 'Truth Engine' for cross-jurisdictional legal context (US, |  |
| linkedin-profile-optimizer |  | front-matter | WHOISABHISHEKADHIKARI |  | High-intent expert for LinkedIn profile checks, authority building, an |  |
| linux-privilege-escalation |  | front-matter | zebbern | offensive | Execute systematic privilege escalation assessments on Linux systems t |  |
| linux-shell-scripting |  | front-matter | zebbern |  | Provide production-ready shell script templates for common Linux syste |  |
| llm-ops |  | front-matter | renat |  | LLM Operations -- RAG, embeddings, vector databases, fine-tuning, prom |  |
| matematico-tao |  | front-matter | renat |  | Matemático ultra-avançado inspirado em Terence Tao. Análise rigorosa d |  |
| maxia |  | front-matter | MAXIA |  | Connect to MAXIA AI-to-AI marketplace on Solana. Discover, buy, sell A |  |
| metasploit-framework |  | front-matter | zebbern | offensive | ⚠️ AUTHORIZED USE ONLY > This skill is for educational purposes or aut |  |
| mindfulness-meditation |  | front-matter | clawd-team |  | Build a meditation practice with guided sessions, streaks, and mindful |  |
| minimalist-ui |  | front-matter | Leonxlnx |  | Use when creating clean editorial interfaces with warm monochrome pale |  |
| mise-configurator |  | front-matter | community |  | Generate production-ready mise.toml setups for local development, CI/C |  |
| monetization |  | front-matter | renat |  | Estrategia e implementacao de monetizacao para produtos digitais - Str |  |
| monte-carlo-monitor-creation |  | front-matter | monte-carlo-data |  | Guides creation of Monte Carlo monitors via MCP tools, producing monit |  |
| monte-carlo-prevent |  | front-matter | monte-carlo-data |  | Surfaces Monte Carlo data observability context (table health, alerts, |  |
| monte-carlo-push-ingestion |  | front-matter | monte-carlo-data |  | Expert guide for pushing metadata, lineage, and query logs to Monte Ca |  |
| monte-carlo-validation-notebook |  | front-matter | monte-carlo-data |  | Generates SQL validation notebooks for dbt PR changes with before/afte |  |
| multi-advisor |  | front-matter | renat |  | Conselho de especialistas — consulta multiplos agentes do ecossistema |  |
| multi-agent-task-orchestrator |  | front-matter | milkomida77 |  | Route tasks to specialized AI agents with anti-duplication, quality ga |  |
| network-101 |  | front-matter | zebbern |  | Configure and test common network services (HTTP, HTTPS, SNMP, SMB) fo |  |
| not-human-search-mcp |  | front-matter | unitedideas |  | Search AI-ready websites, inspect indexed site details, verify MCP end |  |
| openclaw-github-repo-commander |  | front-matter | wd041216-bit |  | 7-stage super workflow for GitHub repo audit, cleanup, PR review, and |  |
| osterwalder-canvas-architect |  | front-matter | justmiroslav |  | Iterative consultant agent for building and validating logically consi |  |
| pakistan-payments-stack |  | front-matter | community-contributor |  | Design and implement production-grade Pakistani payment integrations ( |  |
| pentest-checklist |  | front-matter | zebbern | offensive | Provide a comprehensive checklist for planning, executing, and followi |  |
| pentest-commands |  | front-matter | zebbern | offensive | Provide a comprehensive command reference for penetration testing tool |  |
| playwright-java |  | front-matter | amalsam18 |  | Scaffold, write, debug, and enhance enterprise-grade Playwright E2E te |  |
| privilege-escalation-methods |  | front-matter | zebbern |  | Provide comprehensive techniques for escalating privileges from a low- |  |
| product-design |  | front-matter | renat |  | Design de produto nivel Apple — sistemas visuais, UX flows, acessibili |  |
| product-inventor |  | front-matter | renat |  | Product Inventor e Design Alchemist de nivel maximo — combina Product |  |
| product-manager |  | front-matter | Digidai |  | Senior PM agent with 6 knowledge domains, 30+ frameworks, 12 templates |  |
| progressive-estimation |  | front-matter | Enreign |  | Estimate AI-assisted and hybrid human+agent development work with rese |  |
| puzzle-activity-planner |  | front-matter | fruitwyatt |  | Plan puzzle-based activities for classrooms, parties, and events with |  |
| pydantic-ai |  | front-matter | suhaibjanjua |  | Build production-ready AI agents with PydanticAI — type-safe tool use, |  |
| python-pptx-generator |  | front-matter | spideyashith |  | Generate complete Python scripts that build polished PowerPoint decks |  |
| rayden-code |  | front-matter | Leslie Williams |  | Generate React code with Rayden UI components using correct props, tok |  |
| rayden-use |  | front-matter | Leslie Williams |  | Build and maintain Rayden UI components and screens in Figma via Figma |  |
| recallmax |  | front-matter | christopherlhammer11-ai |  | FREE — God-tier long-context memory for AI agents. Injects 500K-1M cle |  |
| red-team-tools |  | front-matter | zebbern | offensive | Implement proven methodologies and tool workflows from top security re |  |
| redesign-existing-projects |  | front-matter | Leonxlnx |  | Use when upgrading existing websites or apps by auditing generic UI pa |  |
| sam-altman |  | front-matter | renat |  | Agente que simula Sam Altman — CEO da OpenAI, ex-presidente da Y Combi |  |
| satori |  | front-matter | MetcalfSolutions |  | Clinically informed wisdom companion blending psychology and philosoph |  |
| scanning-tools |  | front-matter | zebbern |  | Master essential security scanning tools for network discovery, vulner |  |
| seek-and-analyze-video |  | front-matter | kennyzheng-builds |  | Seek and analyze video content using Memories.ai Large Visual Memory M |  |
| shodan-reconnaissance |  | front-matter | zebbern |  | Provide systematic methodologies for leveraging Shodan as a reconnaiss |  |
| skill-finder-cn |  | front-matter | 赚钱小能手 |  | Skill 查找器 \| Skill Finder. 帮助发现和安装 ClawHub Skills \| Discover and instal |  |
| skill-installer |  | front-matter | renat |  | Instala, valida, registra e verifica novas skills no ecossistema. 10 c |  |
| skill-sentinel |  | front-matter | renat |  | Auditoria e evolucao do ecossistema de skills. Qualidade de codigo, se |  |
| smtp-penetration-testing |  | front-matter | zebbern | offensive | Conduct comprehensive security assessments of SMTP (Simple Mail Transf |  |
| social-orchestrator |  | front-matter | renat |  | Orquestrador unificado de canais sociais — coordena Instagram, Telegra |  |
| social-post-writer-seo |  | front-matter | WHOISABHISHEKADHIKARI |  | Social Media Strategist and Content Writer. Creates clear, engaging so |  |
| sql-injection-testing |  | front-matter | zebbern | offensive | Execute comprehensive SQL injection vulnerability assessments on web a |  |
| sqlmap-database-pentesting |  | front-matter | zebbern |  | Provide systematic methodologies for automated SQL injection detection |  |
| ssh-penetration-testing |  | front-matter | zebbern | offensive | Conduct comprehensive SSH security assessments including enumeration, |  |
| stability-ai |  | front-matter | renat |  | Geracao de imagens via Stability AI (SD3.5, Ultra, Core). Text-to-imag |  |
| steve-jobs |  | front-matter | renat |  | Agente que simula Steve Jobs — cofundador da Apple, CEO da Pixar, fund |  |
| stitch-design-taste |  | front-matter | Leonxlnx |  | Use when generating Google Stitch DESIGN.md systems for premium typogr |  |
| sveltekit |  | front-matter | suhaibjanjua |  | Build full-stack web applications with SvelteKit — file-based routing, |  |
| task-intelligence |  | front-matter | renat |  | Protocolo de Inteligência Pré-Tarefa — ativa TODOS os agentes relevant |  |
| telegram |  | front-matter | renat |  | Integracao completa com Telegram Bot API. Setup com BotFather, mensage |  |
| tmux |  | front-matter | kostakost2 |  | Expert tmux session, window, and pane management for terminal multiple |  |
| tool-use-guardian |  | front-matter | christopherlhammer11-ai |  | FREE — Intelligent tool-call reliability wrapper. Monitors, retries, f |  |
| top-web-vulnerabilities |  | front-matter | zebbern |  | Provide a comprehensive, structured reference for the 100 most critica |  |
| trpc-fullstack |  | front-matter | suhaibjanjua |  | Build end-to-end type-safe APIs with tRPC — routers, procedures, middl |  |
| ui-a11y |  | front-matter | bitjaru |  | Audit a StyleSeed-based component or page for WCAG 2.2 AA issues and a |  |
| ui-component |  | front-matter | bitjaru |  | Generate a new UI component that follows StyleSeed Toss conventions fo |  |
| ui-page |  | front-matter | bitjaru |  | Scaffold a new mobile-first page using StyleSeed Toss layout patterns, |  |
| ui-pattern |  | front-matter | bitjaru |  | Generate reusable UI patterns such as card sections, grids, lists, for |  |
| ui-review |  | front-matter | bitjaru |  | Review UI code for StyleSeed design-system compliance, accessibility, |  |
| ui-setup |  | front-matter | bitjaru |  | Interactive StyleSeed setup wizard for choosing app type, brand color, |  |
| ui-tokens |  | front-matter | bitjaru |  | List, add, and update StyleSeed design tokens while keeping JSON sourc |  |
| uncle-bob-craft |  | front-matter | antigravity-contributors |  | Use when performing code review, writing or refactoring code, or discu |  |
| ux-audit |  | front-matter | bitjaru |  | Audit screens against Nielsen's heuristics and mobile UX best practice |  |
| ux-copy |  | front-matter | bitjaru |  | Generate UX microcopy in StyleSeed's Toss-inspired voice for buttons, |  |
| ux-feedback |  | front-matter | bitjaru |  | Add loading, empty, error, and success feedback states to StyleSeed co |  |
| ux-flow |  | front-matter | bitjaru |  | Design user flows and screen structure using StyleSeed UX patterns suc |  |
| uxui-principles |  | front-matter | uxuiprinciples |  | Evaluate interfaces against 168 research-backed UX/UI principles, dete |  |
| viboscope |  | front-matter | ivanschmidt |  | Psychological compatibility matching — find cofounders, collaborators, |  |
| vscode-extension-guide-en |  | front-matter | lewiswigmore |  | Guide for VS Code extension development from scaffolding to Marketplac |  |
| warren-buffett |  | front-matter | renat |  | Agente que simula Warren Buffett — o maior investidor do seculo XX e X |  |
| web-scraper |  | front-matter | renat |  | Web scraping inteligente multi-estrategia. Extrai dados estruturados d |  |
| whatsapp-cloud-api |  | front-matter | renat |  | Integracao com WhatsApp Business Cloud API (Meta). Mensagens, template |  |
| wireshark-analysis |  | front-matter | zebbern |  | Execute comprehensive network traffic analysis using Wireshark to capt |  |
| wordpress-centric-high-seo-optimized-blogwriting-skill |  | front-matter | Whoisabhishekadhikari |  | Create long-form, high-quality, SEO-optimized blog posts ready for Wor |  |
| wordpress-penetration-testing |  | front-matter | zebbern | offensive | Assess WordPress installations for common vulnerabilities and WordPres |  |
| xss-html-injection |  | front-matter | zebbern | offensive | Execute comprehensive client-side injection vulnerability assessments |  |
| yann-lecun |  | front-matter | renat |  | Agente que simula Yann LeCun — inventor das Convolutional Neural Netwo |  |
| yann-lecun-debate |  | front-matter | renat |  | Sub-skill de debates e posições de Yann LeCun. Cobre críticas técnicas |  |
| yann-lecun-filosofia |  | front-matter | renat |  | Sub-skill filosófica e pedagógica de Yann LeCun. |  |
| yann-lecun-tecnico |  | front-matter | renat |  | Sub-skill técnica de Yann LeCun. Cobre CNNs, LeNet, backpropagation, J |  |

---

## Checklist before Phase 4.0 publish gate

- [ ] Every row marked **core** has: permissive license + attribution
- [ ] No risk=offensive row marked core
- [ ] Core pack size ends up in the 150–200 skill target (may add from verified C rows)
- [ ] `catalog.jsonl` regenerated with `availability` set per this table
- [ ] This log committed next to BUILD_SCHEMA.md
