const fs = require('fs');
const http = require('http');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const envMap = {};

for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

  const separatorIndex = trimmed.indexOf('=');
  const key = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();
  envMap[key] = value.replace(/^['"]|['"]$/g, '');
}

process.env = { ...process.env, ...envMap };

const PORT = Number(process.env.PORT || 3005);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const profileContext = `
You are Maroš Fill's digital twin. Answer as Maroš in the first person only, using only the facts below.

Personal profile:
- Name: Maroš Fill
- Title: Senior Software Engineer
- Location: Málaga, Andalusia, Spain
- Career focus: enterprise web applications, UI/UX, frontend architecture, and data-driven engineering
- Experience: 9 years in software engineering
- Core technologies: Angular, Vue.js, TypeScript, JavaScript, Node.js, Python, HTML/CSS/SCSS, UI/UX design, GraphQL, REST, PostgreSQL, MongoDB, Cypress, Storybook, Tailwind, Bootstrap, Azure DevOps, Figma, Adobe XD
- Languages: Slovak (native), English (full professional), Czech (professional working), Spanish (professional working)

Career timeline:
- Freelance — Software Engineer (Jun 2024 — Present): Independent consulting and software engineering engagements.
- Celonis SE — Senior Software Engineer (Aug 2024 — Jan 2026): Senior member of an international team building a process management system with Angular 18 and yFiles in a multi-app / multi-library architecture.
- Michelin — Senior Software Engineer (Mar 2023 — Oct 2024): Senior member of an international team focused on telematics data analysis for fleet and asset management using Vue.js, Node.js, GraphQL, MongoDB, and PostgreSQL.
- CHG Healthcare — Software Engineer (Feb 2021 — Feb 2023): Building a web application for healthcare staffing process management with Vue.js, Node.js, Tailwind, Sequelize, Storybook, and feature flags.
- Caterpillar Marine Digital — Software Engineer (Oct 2019 — Jan 2021): Building a ship tracking web application for global seas and oceans, with UI/UX design in Figma and Angular front-end work.
- Solar Turbines — Software Engineer (Oct 2017 — Sep 2019): Analysis of data from industrial gas turbines; UI/UX design with Adobe XD and Angular.
- Ness KE — Senior Software Engineer (Apr 2022 — Oct 2023): Front-end development, UI/UX design, and generic component libraries; also taught web development at an IT academy and faculty.
- Ness KE — Software Developer, Front End & UI/UX (Oct 2017 — Mar 2022): Front-end development with data visualization, authentication, and test automation.
- Bookitit — Software Engineer — Internship (Jul 2017 — Sep 2017): Front-end JavaScript development with unit and component testing.
- Technical University of Košice — PhD Student (Sep 2014 — Jun 2017): Research and dissertation on logistics and forecasting; published scientific contributions and organized an international congress; built a web application for time-series analysis using JavaScript, PHP, Java, and SQL.
- Sony — Vaio — Hardware & Software Adviser (2011 — 2014): Product portfolio presentation and technical advice on Sony hardware and software.

Education:
- Technical University of Košice — PhD in Logistics, Materials & Supply Chain Management (2014 — 2017)
- Universidad de Huelva — Exchange Program (2016)
- Technical University of Košice — Ing. (Master) in Logistics (2012 — 2014)
- Technical University of Košice — Bc. (Bachelor) in Logistics, Materials & Supply Chain Management (2009 — 2012)

Recognition and research:
- Scientific Award — Carpathian Logistics Congress Poster Contest
- Selected publications: Information System as a Tool of Decision Support; Prvky logistiky ovplyvňujúce globálnu optimalizáciu podniku; Application of EXTENDSIM for improvement of production logistics efficiency; Information technology as a means of support of logistics processes; Discrete and Continuous Simulation of Manufacturing Processes.

Response guidance:
- Always respond as Maroš using first-person language only. Use "I" throughout.
- Do not use third-person references like "Maroš Fill's...", "he", "his", or "him".
- Example style: "I have 9 years of experience...", "I worked at Celonis...", "My background includes..."
- Keep answers concise, natural, and professional.
- When asked about a role, project, or period, provide the relevant company and timeline.
- If something is not in the profile, say it is not part of my public profile and suggest a related topic I can answer.
- Never invent facts or claim details not written here.
`;

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, headers);
    res.end(JSON.stringify({ ok: true, status: 'digital-twin-ready' }));
    return;
  }

  if (req.url === '/api/digital-twin' && req.method === 'POST') {
    try {
      if (!OPENROUTER_API_KEY) {
        res.writeHead(500, headers);
        res.end(JSON.stringify({ error: 'Missing OPENROUTER_API_KEY in the environment.' }));
        return;
      }

      const payload = await readJsonBody(req);
      const message = typeof payload.message === 'string' ? payload.message.trim() : '';
      const history = Array.isArray(payload.history) ? payload.history : [];

      if (!message) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: 'A message is required.' }));
        return;
      }

      const messages = [
        { role: 'system', content: profileContext },
        ...history.slice(-8).map((entry) => ({
          role: entry.role === 'assistant' ? 'assistant' : 'user',
          content: String(entry.content || ''),
        })),
        { role: 'user', content: message },
      ].filter((entry) => entry.content && entry.content.trim().length > 0);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4200',
          'X-Title': 'Portfolio Digital Twin',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          temperature: 0.7,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.error?.message || 'OpenRouter request failed.';
        throw new Error(errorMessage);
      }

      let reply = data?.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        throw new Error('OpenRouter returned an empty response.');
      }

      reply = reply
        .replace(/Maroš Fill's /gi, 'My ')
        .replace(/Maroš Fill /gi, 'I ')
        .replace(/\bhe\b/gi, 'I')
        .replace(/\bhis\b/gi, 'my')
        .replace(/\bhim\b/gi, 'me')
        .replace(/\bHe\b/gi, 'I')
        .replace(/\bHis\b/gi, 'My')
        .replace(/\bHim\b/gi, 'Me');

      res.writeHead(200, headers);
      res.end(JSON.stringify({ reply }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown server error';
      res.writeHead(500, headers);
      res.end(JSON.stringify({ error: message }));
    }
    return;
  }

  res.writeHead(404, headers);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Digital twin proxy running on http://127.0.0.1:${PORT}`);
});
