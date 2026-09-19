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

---


## How to run the project

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
