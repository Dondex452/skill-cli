import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const TAXONOMY = [
  {
    id: "llm-apps",
    name: "LLM Apps",
    desc: "Building applications that use large language models (OpenAI, Anthropic, RAG, embeddings).",
    matchers: [
      `\\bllm\\b`, `\\bgpt\\b`, `openai`, `anthropic`, `chatgpt`, `langchain`,
      `\\brag\\b`, `vector store`, `embeddings`, `semantic search`, `chatbot`,
    ],
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    desc: "Prompt design, system prompts, few-shot, and role patterns.",
    matchers: [
      `prompt engin`, `system prompt`, `prompting`, `prompt template`,
      `few[- ]?shot`, `chain of thought`, `prompt librar`,
    ],
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    desc: "Agent architecture, multi-agent systems, tool calling, and automation agents.",
    matchers: [
      `multi[- ]?agent`, `sub[- ]?agent`, `agent[- ]+memory`, `agent[- ]+tool`,
      `agent[- ]+(?:architecture|design|framework|orchestrat|manag|team|swarm|system)`,
      `tool[- ]?call`, `function[- ]?call`, `autonom`, `\\bbdi\\b`, `mental state`,
    ],
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    desc: "Model training, neural networks, deep learning, and ML frameworks.",
    matchers: [
      `machine learning`, `neural network`, `pytorch`, `tensorflow`, `sklearn`,
      `xgboost`, `deep learning`, `model training`, `feature engineering`, `\\bmlops\\b`,
    ],
  },
  {
    id: "data-science",
    name: "Data Science",
    desc: "Analysis, visualization, statistics, and data exploration.",
    matchers: [
      `pandas`, `numpy`, `matplotlib`, `seaborn`, `jupyter`, `data science`,
      `data analysis`, `statistical`, `regression`,
    ],
  },
  {
    id: "data-engineering",
    name: "Data Engineering",
    desc: "ETL, warehouses, pipelines, streaming, and big data infrastructure.",
    matchers: [
      `\\betl\\b`, `airflow`, `\\bdbt\\b`, `kafka`, `databricks`, `spark`,
      `data pipeline`, `streaming`, `warehouse`, `snowflake`, `bigquery`,
      `\\banalytics\\b`,
    ],
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    desc: "Image classification, object detection, and vision models.",
    matchers: [
      `opencv`, `object detection`, `image classification`, `image segmentation`,
      `computer vision`, `\\byolo\\b`,
    ],
  },
  {
    id: "speech-audio",
    name: "Speech & Audio",
    desc: "ASR, TTS, transcription, and audio processing.",
    matchers: [
      `\\basr\\b`, `speech to text`, `text to speech`, `\\btts\\b`, `whisper`,
      `transcri`, `audio processing`, `voice assistant`,
    ],
  },
  {
    id: "context-engineering",
    name: "Context Engineering",
    desc: "Context window management, compression, memory, and session continuity.",
    matchers: [
      `context window`, `context compression`, `context manag`, `context optimiz`,
      `context engineering`, `long context`, `token budget`, `context restor`,
      `session continuity`, `context save`,
    ],
  },
  {
    id: "web-development",
    name: "Web Development",
    desc: "HTML/CSS/JS frontend, responsive layouts, and general web building.",
    matchers: [
      `front[- ]?end`, `\\bhtml\\b`, `\\bcss\\b`, `web design`, `landing page`,
      `website`, `responsive`, `\\bangular\\b`, `\\bvue\\b`, `\\bsvelte\\b`,
    ],
  },
  {
    id: "react-frontend",
    name: "React Frontend",
    desc: "React, Next.js, hooks, and component patterns.",
    matchers: [`\\breact\\b`, `next[.]?js`, `nextjs`, `jsx`, `\\btsx\\b`, `react native`],
  },
  {
    id: "typescript-javascript",
    name: "TypeScript & JS",
    desc: "Language-level patterns for TS/JS, module systems, and tooling.",
    matchers: [
      `typescript`, `javascript`, `node[.]?js`, `es modules`, `\\bnpm\\b`,
      `\\bvite\\b`, `bundler`,
    ],
  },
  {
    id: "python-development",
    name: "Python",
    desc: "Python language patterns, asyncio, Django/Flask/FastAPI.",
    matchers: [
      `\\bpython\\b`, `asyncio`, `django`, `fastapi`, `flask`, `virtualenv`,
      `pydantic`, `\\bpip\\b`,
    ],
  },
  {
    id: "rust-development",
    name: "Rust",
    desc: "Rust language patterns, Makepad/Lapce/Robius UI stacks, Cargo.",
    matchers: [
      `\\brust\\b`, `makepad`, `\\brobius\\b`, `\\bcargo\\b`, `borrow checker`,
      `\\bglsl\\b`, `\\bsplash\\b`,
    ],
  },
  {
    id: "dotnet-development",
    name: ".NET / C#",
    desc: "C#, WPF, Avalonia, ASP.NET, .NET patterns.",
    matchers: [
      `avalonia`, `\\bwpf\\b`, `winforms`, `\\bdotnet\\b`, `\\bc#\\b`,
      `asp[.]net`, `visual studio`,
    ],
  },
  {
    id: "backend-development",
    name: "Backend",
    desc: "REST/GraphQL APIs, server frameworks, microservices.",
    matchers: [
      `backend`, `express`, `fastify`, `nestjs`, `rest api`, `graphql`,
      `microservice`, `\\bapi\\b`, `full[- ]?stack`,
    ],
  },
  {
    id: "software-architecture",
    name: "Software Architecture",
    desc: "ADR, design patterns, code review, refactoring, and system design.",
    matchers: [
      `architect`, `\\badr\\b`, `design pattern`, `code review`, `refactor`,
      `clean code`, `system design`, `context matrix`,
    ],
  },
  {
    id: "skill-authoring",
    name: "Skill Authoring",
    desc: "Creating, writing, managing, and validating agent skills.",
    matchers: [
      `agent skill`, `skill author`, `skill writ`, `skill manag`, `skill check`,
      `skill install`, `skill optimiz`, `skill scan`, `skill improv`,
    ],
  },
  {
    id: "developer-tooling",
    name: "Developer Tooling",
    desc: "Editor/LSP/lint tooling, project scaffolding, CI helpers, meta-workflows.",
    matchers: [
      `extension development`, `\\blsp\\b`, `shellcheck`, `\\bvscode\\b`,
      `settings[.]json`, `scaffold`, `lint`, `editor`, `dev tools`,
      `development environment`,
    ],
  },
  {
    id: "database-management",
    name: "Databases",
    desc: "Postgres, Redis, MongoDB, SQL, and schema design.",
    matchers: [
      `redis`, `postgres`, `\\bsql\\b`, `mongodb`, `mysql`, `sqlite`,
      `database design`, `dynamodb`, `supabase`, `vector database`,
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    desc: "Containers, CI/CD, IaC, deployment, and platform engineering.",
    matchers: [
      `docker`, `kubernetes`, `\\bk8s\\b`, `ci/cd`, `ci[- ]cd`, `github actions`,
      `gitlab ci`, `terraform`, `ansible`, `\\bhelm\\b`, `deploy`, `nginx`, `containers`,
      `\\bbash\\b`, `\\blinux\\b`, `bazel`, `\\bbusybox\\b`, `\\bunix\\b`,
    ],
  },
  {
    id: "observability",
    name: "Observability",
    desc: "Logs, metrics, tracing, incident response, postmortems, on-call.",
    matchers: [
      `observab`, `monitoring`, `incident`, `on[- ]?call`, `postmortem`, `grafana`,
      `sentry`, `prometheus`, `datadog`, `error[- ]?tracking`, `root[- ]?cause`,
      `tracing`,
    ],
  },
  {
    id: "git-workflow",
    name: "Git & Repos",
    desc: "Git workflows, branching strategy, and repo hygiene.",
    matchers: [
      `\\bgit\\b`, `github`, `pull request`, `gitlab`, `commit convention`,
      `rebase`, `branching`,
    ],
  },
  {
    id: "cloud-aws",
    name: "Cloud · AWS",
    desc: "AWS services: Lambda, S3, EC2, deployments.",
    matchers: [`\\baws\\b`, `lambda`, `\\bs3\\b`, `\\bec2\\b`, `dynamodb`, `eks`],
  },
  {
    id: "cloud-azure",
    name: "Cloud · Azure",
    desc: "Azure functions and Azure services.",
    matchers: [`azure`],
  },
  {
    id: "cloud-gcp",
    name: "Cloud · GCP",
    desc: "Google Cloud Platform services.",
    matchers: [`google cloud`, `\\bgcp\\b`, `bigquery`, `firestore`],
  },
  {
    id: "serverless",
    name: "Serverless",
    desc: "Edge functions, Cloudflare, Vercel, and serverless patterns.",
    matchers: [`serverless`, `cloudflare`, `vercel`, `edge function`, `netlify`],
  },
  {
    id: "mobile-development",
    name: "Mobile",
    desc: "React Native, Flutter, iOS/Android, and mobile UX.",
    matchers: [
      `react native`, `flutter`, `\\bexpo\\b`, `\\bios\\b`, `android`,
      `\\bswift\\b`, `kotlin`, `mobile app`, `push notification`,
    ],
  },
  {
    id: "embedded-systems",
    name: "Embedded & Firmware",
    desc: "Firmware, microcontrollers, RTOS, FPGAs, low-level drivers.",
    matchers: [
      `firmware`, `embedded`, `cortex`, `\\brtos\\b`, `\\bfpga\\b`, `microcontroller`,
      `bare metal`, `driver development`, `\\bc language\\b`, `c code`,
    ],
  },
  {
    id: "performance-optimization",
    name: "Performance",
    desc: "Web performance, profiling, and optimization.",
    matchers: [
      `performance optimization`, `\\bperf\\b`, `lighthouse`, `core web vitals`,
      `load time`, `bundle size`, `profiling`,
    ],
  },
  {
    id: "security-engineering",
    name: "Security",
    desc: "Defensive coding: secure patterns, XSS/injection prevention, hardening.",
    matchers: [
      `\\bxss\\b`, `sanitiz`, `secret management`, `threat model`, `hardening`,
      `secure coding`, `security best`, `encryption`, `zero trust`,
      `authentication`, `authorization`, `oauth`, `\\bburp\\b`,
    ],
  },
  {
    id: "accessibility",
    name: "Accessibility",
    desc: "WCAG, ARIA, screen readers, and inclusive design.",
    matchers: [`accessibility`, `wcag`, `\\baria\\b`, `a11y`, `screen reader`, `contrast`],
  },
  {
    id: "browser-automation",
    name: "Browser Automation",
    desc: "Playwright, Puppeteer, Selenium, extensions.",
    matchers: [
      `playwright`, `puppeteer`, `selenium`, `chrome extension`, `browser automation`,
      `webdriver`, `extension developer`, `browser extension`, `content script`,
    ],
  },
  {
    id: "software-testing",
    name: "Testing",
    desc: "Unit/integration/e2e tests, TDD, QA.",
    matchers: [
      `\\btdd\\b`, `unit test`, `testing`, `cypress`, `\\bjest\\b`, `vitest`,
      `pytest`, `e2e test`, `test fixture`, `assertion`, `mocha`,
    ],
  },
  {
    id: "web-scraping",
    name: "Scraping",
    desc: "Crawlers, scrapers, proxy handling.",
    matchers: [
      `scraping`, `\\bscrape\\b`, `crawler`, `crawl`, `beautifulsoup`, `cheerio`,
      `\\bhttpx\\b`, `apify`, `actor development`,
    ],
  },
  {
    id: "saas-integrations",
    name: "SaaS Integrations",
    desc: "Automating third-party app APIs via MCP/Composio-style builders (Airtable, Asana, Gmail apps…).",
    matchers: [
      `composio`, `rube mcp`, `\\bmcp\\b`, `automate \\w+ tasks`,
    ],
  },
  {
    id: "n8n-workflows",
    name: "n8n Workflows",
    desc: "n8n node patterns, self-hosted workflows, automation recipes.",
    matchers: [`\\bn8n\\b`, `workflow`],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    desc: "WhatsApp API, bots, and messaging automation.",
    matchers: [`whatsapp`, `wa business`],
  },
  {
    id: "telegram",
    name: "Telegram",
    desc: "Telegram bots and automation.",
    matchers: [`telegram`],
  },
  {
    id: "discord",
    name: "Discord",
    desc: "Discord bots, permissions, and community automation.",
    matchers: [`discord`],
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Slack apps, slash commands, and workspace automation.",
    matchers: [`\\bslack\\b`],
  },
  {
    id: "productivity-tools",
    name: "Productivity",
    desc: "Notion, Obsidian, Gmail, calendars, task management.",
    matchers: [
      `notion`, `obsidian`, `todoist`, `gmail`, `google calendar`, `outlook`,
      `task management`, `note[- ]?taking`, `second brain`, `productivity`, `habit`,
      `libreoffice`, `spreadsheet`,
    ],
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    desc: "Sheets, Drive, Docs, Forms, and Google APIs.",
    matchers: [
      `google sheets`, `google drive`, `google docs`, `google workspace`,
      `google forms`, `google api`, `calendar api`,
    ],
  },
  {
    id: "home-automation",
    name: "Home Automation",
    desc: "Home Assistant, IoT, ESP32, sensors, smart home.",
    matchers: [
      `home assistant`, `\\biot\\b`, `smart home`, `esp32`, `esp8266`, `arduino`,
      `zigbee`, `mqtt`,
    ],
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    desc: "Shopify, Stripe, checkout, and store ops.",
    matchers: [
      `shopify`, `ecommerce`, `e-commerce`, `woocommerce`, `stripe`, `\\bcart\\b`,
      `checkout`, `payment gateway`, `merchant`, `\\bamazon\\b`,
    ],
  },
  {
    id: "sales-crm",
    name: "Sales & CRM",
    desc: "CRM, lead gen, cold outreach, pipelines.",
    matchers: [
      `\\bcrm\\b`, `salesforce`, `hubspot`, `pipedrive`, `lead gen`,
      `cold outreach`, `\\bsales\\b`, `\\bvendas\\b`, `\\bcliente\\b`,
    ],
  },
  {
    id: "finance-banking",
    name: "Finance",
    desc: "Accounting, invoicing, trading, crypto, banking.",
    matchers: [
      `finance`, `accounting`, `bookkeep`, `quickbooks`, `invoice`, `\\btax\\b`,
      `budget`, `ledger`, `trading`, `crypto`, `banking`, `investment`,
      `\\bfinanc`, `contab`, `faturament`,
    ],
  },
  {
    id: "hr-recruiting",
    name: "HR & Recruiting",
    desc: "Recruiting, resumes, interviews, onboarding.",
    matchers: [
      `recruit`, `resume`, `\\bcv\\b`, `interview`, `candidate`, `job description`,
      `onboard`, `hiring`, `\\bjobs\\b`,
    ],
  },
  {
    id: "legal-compliance",
    name: "Legal & Compliance",
    desc: "Contracts, privacy, GDPR, trademarks.",
    matchers: [
      `legal`, `contract`, `\\blaw\\b`, `compliance`, `gdpr`, `privacy`,
      `trademark`, `patent`, `terms of service`, `\\bnda\\b`, `advogad`,
      `direito`, `jurid`, `abaixo assinad`, `processo judic`,
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    desc: "Medical workflows, clinical, wellness.",
    matchers: [
      `medical`, `clinical`, `patient`, `nursing`, `pharma`, `wellness`, `nutrition`,
      `health`, `sa[úu]de`, `健康`, `醫生|医生`, `健身|康复|减肥|急救|医疗`,
    ],
  },
  {
    id: "education-learning",
    name: "Education",
    desc: "Courses, teaching, curriculum, language learning.",
    matchers: [
      `teach`, `curriculum`, `lesson plan`, `language learning`, `student`,
      `course`, `tutorial`, `study guide`, `\\bquiz\\b`,
    ],
  },
  {
    id: "seo",
    name: "SEO",
    desc: "Search visibility: audits, sitemaps, schema, keyword research.",
    matchers: [
      `\\bseo\\b`, `organic search`, `search engine optimization`, `sitemap`,
      `schema markup`, `keyword research`, `backlink`,
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    desc: "Campaigns, ads, funnels, social media.",
    matchers: [
      `marketing`, `facebook ads`, `google ads`, `campaign`, `funnel`,
      `social media`, `instagram`, `tiktok`, `email marketing`, `growth`,
      `a[/ ]?b test`, `新闻`, `营销`,
    ],
  },
  {
    id: "copywriting",
    name: "Copywriting",
    desc: "Blogs, articles, newsletters, storytelling.",
    matchers: [
      `copywrit`, `blog post`, `article`, `newsletter`, `creative writ`,
      `storytell`, `content writer`, `conte[úu]do`, `撰写|写作`, `ai writin`,
    ],
  },
  {
    id: "design-ui",
    name: "Design & UI",
    desc: "Design systems, Figma, branding, UX.",
    matchers: [
      `design system`, `figma`, `brand guideline`, `branding`, `logo`,
      `typography`, `color palette`, `\\bux\\b`, `\\bui\\b`, `mockup`, `wireframe`,
      `design philosophy`,
    ],
  },
  {
    id: "image-generation",
    name: "Image Generation",
    desc: "Diffusion, Midjourney, DALL-E, generative art.",
    matchers: [
      `image generation`, `text to image`, `stable diffusion`, `midjourney`,
      `dall[ -]?e`, `generative art`, `image synthesis`, `\\bvlm\\b`, `ai studio`,
    ],
  },
  {
    id: "video-media",
    name: "Video & Media",
    desc: "Video editing, ffmpeg, podcasts, YouTube.",
    matchers: [
      `video edit`, `ffmpeg`, `podcast`, `youtube`, `subtitle`, `live stream`,
      `screen record`, `\\bvideo\\b`,
    ],
  },
  {
    id: "writing-docs",
    name: "Docs & Writing",
    desc: "Documentation, READMEs, technical writing.",
    matchers: [
      `documentation`, `technical writer`, `\\bdocs\\b`, `readme`, `markdown`,
      `changelog`, `wiki`,
    ],
  },
  {
    id: "research-science",
    name: "Science & Research",
    desc: "Astronomy, chemistry, biology, scientific computing.",
    matchers: [
      `astropy`, `astronomy`, `astro`, `physics`, `chemistry`, `biolog`, `genom`,
      `scientific`, `simulation`, `mathematics`, `research lab`, `protein`,
      `alphafold`, `\\bdna\\b`,
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    desc: "Game dev, Unity/Unreal, and playable design.",
    matchers: [`game developer`, `unity`, `unreal engine`, `gamedev`, `game design`, `\\bbevy\\b`],
  },
  {
    id: "business-ops",
    name: "Business Ops",
    desc: "Startups, strategy, operations, SaaS.",
    matchers: [
      `startup`, `entrepreneur`, `b2b`, `\\bsaas\\b`, `founder`, `business plan`,
      `neg[óo]ci`, `empreend`, `consultor`, `negocio`,
    ],
  },
  {
    id: "offensive-security",
    name: "Offensive Security (index-only)",
    desc: "Pentest/red-team skills. Index-only; never shipped. Assigned from risk=offensive flag.",
    matchers: [],
  },
  {
    id: "misc",
    name: "Misc",
    desc: "No strong taxonomy match. Refine via AI/human tagging pass.",
    matchers: [],
  },
];

const CACHE = new Map();
function matcherRegex(cat) {
  if (CACHE.has(cat.id)) return CACHE.get(cat.id);
  const r = new RegExp(cat.matchers.join("|"), "i");
  CACHE.set(cat.id, r);
  return r;
}

export function MAX_CATEGORIES() {
  return 3;
}

export function classify({ name = "", description = "", risk = "unknown" }) {
  if (risk === "offensive") return ["offensive-security"];
  const text = `${name} ${description}`.toLowerCase().replace(/[-_]+/g, " ");
  const hits = [];
  for (const cat of TAXONOMY) {
    if (cat.id === "offensive-security" || cat.id === "misc") continue;
    if (cat.matchers.length && matcherRegex(cat).test(text)) hits.push(cat.id);
  }
  return hits.length ? hits.slice(0, MAX_CATEGORIES()) : ["misc"];
}

export const VALID_IDS = new Set(TAXONOMY.map((c) => c.id));

function renderDocs() {
  let md = `# CATEGORIES — skill-cli taxonomy\n\n`;
  md += `Machine-readable source: \`scripts/taxonomy.mjs\` (regenerate with \`node scripts/taxonomy.mjs --docs\`)\n\n`;
  md += `Every catalog record gets 1-3 categories. Category assignment source is recorded per record (\`category_source\`): \`heuristic\` (offline keyword match — these categories), \`ai\` (AI batch pass), \`human\` (review pass).\n\n## ${TAXONOMY.length} categories\n\n`;
  for (const cat of TAXONOMY) {
    md += `- **${cat.id}** — ${cat.name}: ${cat.desc}\n`;
  }
  md += `\n## Assignments (2.3 rules)\n\n`;
  md += `1. \`risk=offensive\` skills are forced to \`offensive-security\` (index-only).\n2. Taxonomy order = priority; max 3 categories per record.\n3. No match → \`misc\` (flagged for the AI/human pass).\n`;
  const out = path.join(import.meta.dirname, "..", "docs", "CATEGORIES.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
  console.log(`wrote ${out}`);
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  if (process.argv.includes("--docs")) renderDocs();
  else if (process.argv.includes("--test-classify")) {
    console.log(JSON.stringify({
      n8n: classify({ name: "n8n-workflow-patterns", description: "workflows" }),
      seo: classify({ name: "sitemap-audit", description: "seo" }),
      offensive: classify({ name: "x", description: "y", risk: "offensive" }),
      misc: classify({ name: "zzz", description: "zzz" }),
    }, null, 2));
  }
}
