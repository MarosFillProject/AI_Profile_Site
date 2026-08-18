import { createServer, request as httpRequest } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4200);
const DEV_PORT = Number(process.env.ANGULAR_DEV_PORT || 4201);
const isDev = process.argv.includes('--dev');
const distDir = path.join(__dirname, 'dist', 'portfolio', 'browser');
const indexPath = path.join(distDir, 'index.html');

loadRootEnv();

const modelCandidates = process.env.OPENROUTER_MODEL
  ? [process.env.OPENROUTER_MODEL]
  : ['openai/gpt-oss-120b:free', 'openai/gpt-oss-20b:free'];
const openRouterApiKey =
  process.env.OPENROUTER_API_KEY ||
  process.env.openrouter_api_key ||
  process.env.OPENrouter_api_key ||
  process.env.OPENROUTER_KEY;

const careerContext = `
Name: Maros Fill
Location: Malaga, Andalusia, Spain
Title: Senior Software Engineer
Email: marosfill@gmail.com
LinkedIn: https://www.linkedin.com/in/maros-fill
Summary: Software engineer with 9 years of experience focused on web application development, UI/UX front-end technologies, and intermediate back-end experience. PhD in Logistics of Information, data analysis, and forecasting. Experienced in teaching web development and leading international engineering teams.
Core skills: Angular, Vue.js, TypeScript, JavaScript, Node.js, Python, HTML, CSS, SCSS, UI/UX Design, GraphQL, REST, PostgreSQL, MongoDB, Cypress, Storybook, Tailwind, Bootstrap, Azure DevOps, Figma, Adobe XD.
Languages: Slovak native, English full professional, Czech professional working, Spanish professional working.

Career:
- Freelance, Software Engineer, Jun 2024 to Present, Remote. Independent consulting and software engineering engagements.
- Celonis SE, Senior Software Engineer, Aug 2024 to Jan 2026, Munich, Germany. Senior member of an international team building a process management system. Multi-app and multi-library architecture with Angular 18 and yFiles. Technologies: Angular 18, GitHub Copilot, yFiles, multi-lib architecture.
- Michelin, Senior Software Engineer, Mar 2023 to Oct 2024, France. Senior member of an international team working on telematics data analysis for fleet and asset management. Technologies: Vue.js, Node.js, GraphQL, MongoDB, PostgreSQL, Vuetify.
- CHG Healthcare, Software Engineer, Feb 2021 to Feb 2023, Utah, USA. Built a web application for healthcare staffing process management with a US team. Technologies: Vue.js, Node.js, Tailwind, Sequelize, Storybook, feature flags.
- Caterpillar Marine Digital, Software Engineer, Oct 2019 to Jan 2021, Virginia, USA. Built a ship tracking web application for seas and oceans worldwide. Created UI/UX designs in Figma. Technologies: Angular, Bootstrap, Cypress, Figma.
- Solar Turbines, Software Engineer, Oct 2017 to Sep 2019, San Diego, USA. Worked on analysis of data gathered from industrial gas turbines and UI/UX design in Adobe XD. Technologies: Angular, Angular Material, Adobe XD.
- Ness KE, Senior Software Engineer, Apr 2022 to Oct 2023, Kosice, Slovakia. Front-end development, UI/UX design, generic component libraries, and web development lecturer at IT academy and Faculty of Informatics. Technologies: Vue.js, REST API, SQL and NoSQL, Scrum.
- Ness KE, Software Developer Front End and UI/UX, Oct 2017 to Mar 2022, Kosice, Slovakia. Front-end development, data visualization, authentication, and test automation.
- Bookitit, Software Engineer Internship, Jul 2017 to Sep 2017, Valencia, Spain. Front-end development in JavaScript with unit and component testing.
- Technical University of Kosice, PhD Student, Sep 2014 to Jun 2017, Kosice, Slovakia. Research and dissertation on logistics and forecasting. Published scientific contributions and organized an international congress. Built a web application using JavaScript, PHP, Java, and SQL for time-series analysis.
- Sony, Vaio Hardware and Software Adviser, 2011 to 2014, Slovakia. Product portfolio presentation and technical advice on Sony hardware and software.

Education:
- PhD, Technical University of Kosice, Logistics, Materials and Supply Chain Management, 2014 to 2017.
- Exchange Program, Universidad de Huelva, 2016.
- Ing. / Master, Technical University of Kosice, Logistics, 2012 to 2014.
- Bc. / Bachelor, Technical University of Kosice, Logistics, Materials and Supply Chain Management, 2009 to 2012.

Publications:
- Information System as a Tool of Decision Support
- Prvky logistiky ovplyvnujuce globalnu optimalizaciu podniku
- Application of EXTENDSIM for improvement of production logistics efficiency
- Information technology as a means of support of logistics processes
- Discrete and Continuous Simulation of Manufacturing Processes

Award:
- Scientific Award, Carpathian Logistics Congress Poster Contest

Portfolio focus:
- Process Management Platform: Angular, enterprise, yFiles.
- Fleet Telematics Dashboard: Vue.js, GraphQL, data visualization.
- Marine Tracking System: Angular, maps, Cypress.
- Healthcare Staffing Platform: Vue.js, Tailwind, Storybook.
`.trim();

const systemPrompt = `
You are the Digital Twin of Maros Fill on his portfolio website.
Answer in first person as Maros when the user asks about career, education, skills, publications, awards, portfolio projects, professional strengths, or fit for roles.
Use only the supplied career context. Do not invent dates, employers, degrees, private details, or unavailable project specifics.
Keep answers concise, confident, warm, and practical. When helpful, connect experience to the visitor's question.
If a question is unrelated to Maros's professional background, politely say you can only answer about Maros's career and education.

Career context:
${careerContext}
`.trim();

if (isDev) {
  startAngularDevServer();
}

const server = createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/digital-twin-chat')) {
      await handleDigitalTwinChat(req, res);
      return;
    }

    if (isDev) {
      proxyToAngularDev(req, res);
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: 'The portfolio server hit an unexpected error.' });
  }
});

server.listen(PORT, () => {
  const mode = isDev ? `dev proxy with Angular on ${DEV_PORT}` : 'built Angular app';
  console.log(`Portfolio server ready at http://localhost:${PORT} (${mode})`);
});

async function handleDigitalTwinChat(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!openRouterApiKey) {
    sendJson(res, 500, { error: 'OpenRouter API key is missing from the project root .env file.' });
    return;
  }

  const body = await readJsonBody(req);
  const messages = normalizeMessages(body?.messages);

  if (!messages.length) {
    sendJson(res, 400, { error: 'Please send at least one message.' });
    return;
  }

  let completion;

  try {
    completion = await requestOpenRouter(messages);
  } catch (error) {
    sendJson(res, error.status || 502, {
      error: error.message || 'OpenRouter could not complete the chat request.',
    });
    return;
  }

  const reply = completion.reply;

  if (!reply) {
    sendJson(res, 502, { error: 'OpenRouter returned an empty response.' });
    return;
  }

  sendJson(res, 200, { reply, model: completion.model });
}

async function requestOpenRouter(messages) {
  let lastError = 'OpenRouter could not complete the chat request.';
  let lastStatus = 502;

  for (const candidate of modelCandidates) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || `http://localhost:${PORT}`,
        'X-Title': 'Maros Fill Portfolio Digital Twin',
      },
      body: JSON.stringify({
        model: candidate,
        temperature: 0.35,
        max_tokens: 900,
        reasoning: {
          effort: 'low',
          exclude: true,
        },
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {};
    }

    if (response.ok) {
      const message = data?.choices?.[0]?.message;

      return {
        model: candidate,
        reply: (message?.content || message?.reasoning || '').trim(),
      };
    }

    lastStatus = response.status;
    lastError = data?.error?.message || lastError;

    if (!lastError.toLowerCase().includes('unavailable for free')) {
      break;
    }
  }

  const error = new Error(lastError);
  error.status = lastStatus;
  throw error;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role))
    .map((message) => ({
      role: message.role,
      content: String(message.content || '').trim().slice(0, 3000),
    }))
    .filter((message) => message.content)
    .slice(-12);
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

async function serveStatic(req, res) {
  if (!existsSync(indexPath)) {
    sendJson(res, 500, { error: 'Build output is missing. Run npm run build first.' });
    return;
  }

  const pathname = decodeURIComponent(new URL(req.url || '/', `http://localhost:${PORT}`).pathname);
  const requestedPath = pathname === '/' ? indexPath : path.join(distDir, pathname);
  const safePath = path.normalize(requestedPath);

  if (!safePath.startsWith(distDir)) {
    sendJson(res, 403, { error: 'Forbidden.' });
    return;
  }

  const filePath = existsSync(safePath) && statSync(safePath).isFile() ? safePath : indexPath;

  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  createReadStream(filePath).pipe(res);
}

function proxyToAngularDev(req, res) {
  const proxyReq = httpRequest(
    {
      hostname: '127.0.0.1',
      port: DEV_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    },
  );

  proxyReq.on('error', () => {
    sendHtml(res, 503, '<h1>Angular dev server is starting</h1><p>Refresh in a moment.</p>');
  });

  req.pipe(proxyReq, { end: true });
}

function startAngularDevServer() {
  const ngBinary = path.join(__dirname, 'node_modules', '.bin', 'ng');
  const child = spawn(ngBinary, ['serve', '--host', '127.0.0.1', '--port', String(DEV_PORT)], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(DEV_PORT) },
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`Angular dev server exited with code ${code}`);
    }
  });
}

function loadRootEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');

  if (!existsSync(envPath)) {
    return;
  }

  const rawEnv = readFileSync(envPath, 'utf8');

  for (const line of rawEnv.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    const value = rawValue.trim().replace(/^['"]|['"]$/g, '');

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function sendHtml(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };

  return types[ext] || 'application/octet-stream';
}
