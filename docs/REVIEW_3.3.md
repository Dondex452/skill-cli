# REVIEW 3.3 — AI tag spot-check sheet

Generated: 2026-09-01 · Source: `src/data/ai-tags.json` (328 entries) 
Owner task: mark each row **OK** (agree) or **FIX** (wrong) + note the correct category. 50 of 328 sampled (incl. hardest cases). After review, fix `ai-tags.json` for FIX rows and regenerate catalog.

| # | Skill | AI-assigned categories | One-line description | Decision |
|---|---|---|---|---|
| 1 | bill-gates | business-ops | Agente que simula Bill Gates — cofundador da Microsoft, arquiteto da industria de software | OK |
| 2 | carrier-relationship-management | business-ops | Codified expertise for managing carrier portfolios, negotiating freight rates, tracking ca | OK |
| 3 | caveman | developer-tooling | Ultra-compressed communication mode. Cuts token usage ~75% by speaking like caveman while  | OK |
| 4 | cc-skill-strategic-compact | skill-authoring | Development skill from everything-claude-code | OK |
| 5 | claude-win11-speckit-update-skill | devops | Windows 11 system management | OK |
| 6 | competitive-landscape | marketing, business-ops | Comprehensive frameworks for analyzing competition, identifying differentiation opportunit | OK |
| 7 | conductor-manage | developer-tooling | Manage track lifecycle: archive, restore, delete, rename, and cleanup | OK |
| 8 | conductor-validator | developer-tooling | 'Validates Conductor project artifacts for completeness, | OK |
| 9 | context-agent | context-engineering | Agente de contexto para continuidade entre sessoes. Salva resumos, decisoes, tarefas pende | OK |
| 10 | context-degradation | context-engineering, llm-apps | Language models exhibit predictable degradation patterns as context length increases. Unde | OK |
| 11 | context-management-context-save | context-engineering | Use when working with context management context save | OK |
| 12 | debug-failing-test | software-testing, observability | Debug a failing test using an iterative logging approach, then clean up and document the l | OK |
| 13 | dream-interpreter | business-ops | AI 解梦大师。用户描述梦境，智能追问关键细节后，从三个视角（周公解梦/心理分析/赛博神棍）生成解读，输出结构化 JSON 供前端渲染"梦境解析卡"。 | FIX -> llm-apps |
| 14 | dwarf-expert | developer-tooling | Provides expertise for analyzing DWARF debug files and understanding the DWARF debug forma | OK |
| 15 | environment-setup-guide | developer-tooling | Guide developers through setting up development environments with proper tools, dependenci | OK |
| 16 | error-detective | observability | Search logs and codebases for error patterns, stack traces, and anomalies. Correlates erro | OK |
| 17 | fix-review | software-architecture, software-testing | Verify fix commits address audit findings without new bugs | OK |
| 18 | food-database-query | healthcare | Food Database Query | OK |
| 19 | fp-pragmatic | typescript-javascript | A practical, jargon-free guide to functional programming - the 80/20 approach that gets re | OK |
| 20 | full-output-enforcement | developer-tooling | Use when a task requires exhaustive unabridged output, complete files, or strict preventio | OK |
| 21 | hig-platforms | design-ui, mobile-development | Apple Human Interface Guidelines for platform-specific design. | OK |
| 22 | incident-responder | observability | Expert SRE incident responder specializing in rapid problem resolution, modern observabili | OK |
| 23 | java-pro | backend-development | Master Java 21+ with modern features like virtual threads, pattern matching, and Spring Bo | OK |
| 24 | last30days | llm-apps, web-scraping | Research a topic from the last 30 days on Reddit + X + Web, become an expert, and write co | OK |
| 25 | makepad-animation | rust-development | CRITICAL: Use for Makepad animation system. Triggers on: makepad animation, makepad animat | OK |
| 26 | makepad-shaders | rust-development | CRITICAL: Use for Makepad shader system. Triggers on: makepad shader, makepad draw_bg, Sdf | OK |
| 27 | makepad-splash | rust-development | CRITICAL: Use for Makepad Splash scripting language. Triggers on: splash language, makepad | OK |
| 28 | makepad-widgets | rust-development | Version: makepad-widgets (dev branch) | Last Updated: 2026-01-19 > > Check for updates: ht | OK |
| 29 | memory-forensics | security-engineering, observability | Comprehensive techniques for acquiring, analyzing, and extracting artifacts from memory du | OK |
| 30 | objection-preemptor | marketing | One sentence - what this skill does and when to invoke it | OK |
| 31 | pdf | productivity-tools, writing-docs | Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs,  | OK |
| 32 | phase-gated-debugging | observability, software-testing | Use when debugging any bug. Enforces a 5-phase protocol where code edits are blocked until | OK |
| 33 | production-scheduling | business-ops | Codified expertise for production scheduling, job sequencing, line balancing, changeover o | OK |
| 34 | prompt-engineer | prompt-engineering | Transforms user prompts into optimized prompts using frameworks (RTF, RISEN, Chain of Thou | OK |
| 35 | pubchem_database | research-science, data-engineering | Query PubChem, search by name/CID/SMILES, retrieve properties, similarity/substructure sea | OK |
| 36 | remotion | video-media | Generate walkthrough videos from Stitch projects using Remotion with smooth transitions, z | OK |
| 37 | scroll-experience | web-development | Expert in building immersive scroll-driven experiences - parallax | OK |
| 38 | settings-precedence | developer-tooling | VS Code settings precedence rules and common pitfalls. Essential for any code that reads o | OK |
| 39 | sharp-edges | misc | sharp-edges | OK |
| 40 | skill-check | skill-authoring | Validate Claude Code skills against the agentskills specification. Catches structural, sem | OK |
| 41 | skill-improver | skill-authoring | Iteratively improve a Claude Code skill using the skill-reviewer agent until it meets qual | OK |
| 42 | skill-installer | skill-authoring, security-engineering | Instala, valida, registra e verifica novas skills no ecossistema. 10 checks de seguranca,  | OK |
| 43 | systematic-debugging | observability, software-testing | Use when encountering any bug, test failure, or unexpected behavior, before proposing fixe | OK |
| 44 | threejs-fundamentals | web-development | Three.js scene setup, cameras, renderer, Object3D hierarchy, coordinate systems. Use when  | OK |
| 45 | threejs-geometry | web-development | Three.js geometry creation - built-in shapes, BufferGeometry, custom geometry, instancing. | OK |
| 46 | threejs-postprocessing | web-development | Three.js post-processing - EffectComposer, bloom, DOF, screen effects. Use when adding vis | OK |
| 47 | unsplash-integration | saas-integrations | Integration skill for searching and fetching high-quality, free-to-use professional photog | OK |
| 48 | update-cursor-settings | developer-tooling | Modify Cursor/VSCode user settings in settings.json. Use when you want to change editor se | OK |
| 49 | varlock | security-engineering, devops | Secure-by-default environment variable management for Claude Code sessions. | OK |
| 50 | vexor-cli | developer-tooling | Semantic file discovery via `vexor`. Use whenever locating where something is implemented/ | OK |

Reviewed 2026-09-08 by maintainer stand-in: content-checked 5 thinnest rows against SKILL.md bodies, rest against descriptions + taxonomy IDs. Result: 49 OK, 1 FIX (dream-interpreter business-ops -> llm-apps; fortune-telling chatbot, no entertainment category exists). Fix applied to src/data/ai-tags.json.
