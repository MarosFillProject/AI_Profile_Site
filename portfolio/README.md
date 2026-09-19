# Portfolio Website with an AI “Digital Twin” Chatbot

This project is a personal portfolio website built with Angular, plus a small Node.js backend that connects to OpenRouter so visitors can ask questions about your career, education, and experience in a conversational way.

This tutorial explains, in beginner-friendly language, what was built, why it was built, and how the code works.

---

## 1. Summary

The website is a professional portfolio that presents:

- your background
- your technical skills
- your career timeline
- your education
- your awards and publications
- a digital twin chatbot that answers questions about your experience

The key idea is that the website is not just static text. It becomes interactive by combining:

- Angular for the front-end interface
- TypeScript for logic
- SCSS for styling
- a lightweight Node.js API as a secure bridge to OpenRouter
- OpenRouter to access a large language model
- a .env file to store the API key safely

In simple terms: the browser shows the portfolio, and the AI chatbot uses your profile information to answer questions like:

- What roles did you have?
- What technologies did you use?
- What did you study?
- Where did you work?

---

## 2. Technologies used

### Angular
Angular is a front-end framework from Google used to build modern web apps with reusable components.

Think of it like this:

- a component is a reusable building block
- a page is made from several components
- Angular helps manage data and rendering elegantly

### TypeScript
TypeScript is JavaScript with better structure and safety.

It helps prevent mistakes like mistyping property names or using the wrong data type.

### SCSS
SCSS is a CSS extension that adds useful features like variables and nesting.

It makes styling cleaner and more maintainable than plain CSS.

### Node.js
Node.js lets JavaScript run on the server, outside the browser.

This matters because API keys should not sit directly in the browser, and a server can act as a safer proxy.

### OpenRouter
OpenRouter gives access to AI models through a single API.

This project uses OpenRouter to send user questions to a model and receive answers.

### .env
A .env file stores private configuration values such as API keys.

This is important because secrets should not be hardcoded into your front-end code.

---

## 3. High-level architecture

The app has two main layers:

### Front-end layer
The Angular app displays:

- hero section
- about section
- career timeline
- portfolio cards
- digital twin chatbot

### Back-end layer
The Node.js server acts as a proxy.

It does the following:

1. receives the user question from the Angular app
2. reads the API key from the .env file
3. sends the message to OpenRouter
4. receives the model response
5. returns the AI answer to the front-end

This architecture is useful because it hides the secret key from the browser.

---

## 4. What was built

This project created a portfolio website with a chatbot called a digital twin.

The digital twin is not a generic AI assistant. It is based on your profile data, including:

- career history
- education
- skills
- technologies
- publications
- awards

This makes the chatbot useful for answering questions about your professional story, not random questions unrelated to your background.

---

## 5. High-level walk-through

### Step 1: Build the portfolio data
The app begins with a data file that describes you.

This is often stored as a structured object in TypeScript.

Example concept:

```ts
export const PROFILE = {
  name: 'Maroš Fill',
  title: 'Senior Software Engineer',
  summary: 'Software engineer with 9 years of experience...',
  career: [...],
  education: [...],
  skills: [...],
};
```

This is useful because the UI can simply read from the same object and render it in different sections.

### Step 2: Create Angular components
The portfolio is separated into components, such as:

- hero
- about
- career
- digital-twin
- footer

Each component is like a small reusable section of the page.

### Step 3: Add the chat UI
The `DigitalTwinComponent` includes:

- a message area
- text input
- send button
- suggested prompts
- loading state

When a user types a question and clicks send, the code sends it to a local API endpoint.

### Step 4: Add a secure backend proxy
The built-in Angular dev server is a front-end tool, but it is not a safe place to store secrets.

A Node.js server sits in front of OpenRouter and handles the request:

```js
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o-mini',
    messages,
  }),
});
```

This pattern is common in production apps.

### Step 5: Use the .env file
The project root .env file contains your OpenRouter key.

Example:

```env
OPENROUTER_API_KEY=your_key_here
```

The server reads this file on startup, so the browser never sees the secret.

---

## 6. Detailed code review

Below is a beginner-friendly review of the main files and logic.

### 6.1 Profile data file
File: `src/app/data/profile.data.ts`

This file contains the information that the portfolio and chatbot rely on.

```ts
export interface CareerEntry {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string[];
  technologies?: string[];
  highlight?: boolean;
}
```

Why this matters:

- it gives TypeScript a clear structure
- it reduces errors when building the app
- it makes the data reusable across multiple sections

Then we define the profile object:

```ts
export const PROFILE: Profile = {
  name: 'Maroš Fill',
  title: 'Senior Software Engineer',
  location: 'Málaga, Andalusia, Spain',
  skills: ['Angular', 'Vue.js', 'TypeScript', 'Node.js'],
  career: [
    {
      company: 'Celonis SE',
      role: 'Senior Software Engineer',
      period: 'Aug 2024 — Jan 2026',
      description: ['Senior member of international team building a process management system.'],
    },
  ],
  education: [...],
};
```

This is one of the most important files in the app because it becomes the content source for both the website and the AI digital twin.

### 6.2 Angular app shell
File: `src/app/app.component.ts`

```ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    TechStripComponent,
    AboutComponent,
    CareerComponent,
    PortfolioSectionComponent,
    DigitalTwinComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

This tells Angular which components appear on the page.

`imports` is a list of child components. The root app includes them and renders them in the template.

### 6.3 App HTML structure
File: `src/app/app.component.html`

```html
<app-navbar />
<main>
  <app-hero />
  <app-tech-strip />
  <app-about />
  <app-career />
  <app-portfolio-section />
  <app-digital-twin />
</main>
<app-footer />
```

This is a great beginner example of component composition.

The page is assembled by stacking smaller sections together. Each section can be designed and tested separately.

### 6.4 Digital twin component logic
File: `src/app/components/digital-twin/digital-twin.component.ts`

```ts
messages: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Hi, I am Maroš’s digital twin. Ask me about his software engineering career, education, or key projects.',
  },
];
```

This creates the initial welcome message shown to the user.

Then there is the `sendMessage()` method:

```ts
async sendMessage(): Promise<void> {
  const message = this.draft.trim();

  if (!message || this.isLoading) {
    return;
  }

  const userMessage: ChatMessage = { role: 'user', content: message };
  this.messages = [...this.messages, userMessage];
  this.draft = '';
  this.isLoading = true;

  try {
    const response = await fetch('/api/digital-twin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: this.messages.slice(0, -1),
      }),
    });
```

What this does:

- trims the input
- ignores empty messages
- adds the user message to chat history
- clears the input field
- sends the message to the backend proxy

This is a normal frontend-to-backend request pattern.

### 6.5 Digital twin HTML
File: `src/app/components/digital-twin/digital-twin.component.html`

```html
<div class="digital-twin__messages" aria-live="polite">
  @for (message of messages; track message; let i = $index) {
    <div class="digital-twin__message" [class.is-user]="message.role === 'user'" [class.is-assistant]="message.role === 'assistant'">
      <div class="digital-twin__bubble">
        {{ message.content }}
      </div>
    </div>
  }
</div>
```

This loops through the chat messages and renders them as chat bubbles.

The `@for` syntax is Angular’s control-flow syntax. It is similar to a JavaScript loop but is built into Angular templates.

---

### 6.6 Backend proxy server
File: `server.js`

This is the most important backend piece.

First, it reads the .env file:

```js
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
```

This reads the environment file from the project root and loads it into Node’s `process.env`.

Then it creates the API route:

```js
if (req.url === '/api/digital-twin' && req.method === 'POST') {
  const payload = await readJsonBody(req);
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
```

This code:

- checks if the endpoint is correct
- reads the incoming JSON body
- extracts the user’s message
- validates it

Then it prepares the OpenRouter request:

```js
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
```

This is the actual OpenRouter integration.

A few beginner notes:

- `fetch()` is the browser/Node way to make HTTP requests
- `Authorization` header sends the API key
- `body` contains JSON payload
- `messages` is the conversation sent to the model
- `model` chooses which AI model to use

### 6.7 Prompt engineering
The most important concept in this app is the prompt.

```js
const profileContext = `
You are Maroš Fill's digital twin. Answer as Maroš in the first person only, using only the facts below.
...
Response guidance:
- Always respond as Maroš using first-person language only. Use "I" throughout.
- Do not use third-person references like "Maroš Fill's...", "he", "his", or "him".
- Never invent facts or claim details not written here.
`;
```

This is not random string-building. It is the instruction set for the AI.

The model is told:

- who it is
- what facts it may use
- what style to write in
- what not to invent

This is called prompt design or system prompting.

This is one of the most important ideas in AI app building.

---

## 7. How the entire flow works

Here is the end-to-end flow:

1. The user opens the portfolio page.
2. The UI loads the profile data.
3. The user asks a question in the chatbot.
4. Angular sends the message to `/api/digital-twin`.
5. The Node.js proxy reads the API key from `.env`.
6. The proxy sends the request to OpenRouter.
7. OpenRouter calls the selected model.
8. The model uses the profile context and the user question.
9. The answer is returned to the browser.
10. The Angular chatbot displays the reply in the UI.

This is a classic frontend + API pattern.

---

## 8. Beginner concepts to understand

### Component
A component is a reusable UI building block.

For example:

- `HeroComponent`
- `AboutComponent`
- `CareerComponent`
- `DigitalTwinComponent`

### State
State is the data the component tracks while the app runs.

For example:

```ts
messages: ChatMessage[] = [];
this.draft = '';
this.isLoading = true;
```

### API request
An API request is a message sent from the browser or server to another service.

In this project, the browser sends a request to the local Node server, which then sends a request to OpenRouter.

### Environment variables
Environment variables are values stored outside the codebase, usually in a `.env` file.

This keeps secrets like API keys out of version control.

### Model prompt
A model prompt is the instruction we give the AI so it knows how to answer.

Good prompts reduce incorrect or vague answers.

---

## 9. How to run the project

From the project folder:

```bash
cd portfolio
npm install
npm run build
```

Then start the app and backend:

```bash
PORT=3005 node server.js
```

In a second terminal:

```bash
ng serve --host 127.0.0.1 --port 4200 --proxy-config proxy.conf.json
```

Then open:

```text
http://127.0.0.1:4200/
```

---

## 10. Five suggestions for improvement

Here are five self-review suggestions for improving this project.

### 1. Add a loading spinner and better error states
Right now the app handles loading, but it could be improved with:

- a clearer animated spinner
- better message text for failed requests
- retry buttons

This makes the user experience calmer and more polished.

### 2. Improve the AI prompt with stronger role-based instructions
The current system prompt is solid, but it could be made more consistent by explicitly defining:

- tone
- answer length
- answer format
- safe boundaries
- persona consistency

This helps reduce random or off-topic answers.

### 3. Add conversation memory improvements
The app keeps some previous messages, but it could be improved by:

- limiting by token count
- storing prior chat in a more structured way
- summarizing older messages instead of sending all history every time

This would reduce API cost and improve quality.

### 4. Use a real backend framework for production readiness
Right now the app uses plain Node.js HTTP logic. For larger apps, a framework such as Express could make the code cleaner and easier to extend.

Benefits would include:

- easier routing
- cleaner validation
- middleware support
- better error handling

### 5. Add stronger separation between content and code
The profile data is already separated from the UI, which is good. But it could be improved by:

- splitting profile data into a dedicated content layer
- creating a `services` folder for API logic
- moving the chat API call into a dedicated Angular service

This would make the app more modular and easier to maintain as it grows.

---

## 11. Final thoughts

This project is a great beginner example of how modern web development works in practice:

- the front-end renders content
- the data model describes the real information
- the AI layer adds interactive intelligence
- the backend keeps secrets safe
- the app becomes more than static marketing—it becomes a conversation

If you are learning web development, this project shows a very realistic flow of how a modern app connects UI, data, and AI services.

It is a strong example of how code can be modular, maintainable, and useful in real life.

---

## 12. Next ideas to explore

If you want to build on this project, the next steps could include:

- adding a voice mode
- adding chat history persistence
- adding a “Ask about my experience” landing page
- adding richer conversation memory
- moving the OpenRouter logic into a dedicated service layer

These are natural next steps for someone learning full-stack and AI integration.
