# 🌸 My Daily Habits Tracker

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](#-contributing)

A clean and functional **React app** to track your daily habits with a beautiful and responsive UI.  
This tracker helps you build consistency by logging your habits like **Sleep, Water Intake, Study, Meditation, Workout, Screen Time, and more** — all visualized in a **weekly checklist format**.

---

## 🚀 Live Demo
👉 [**Try It Out Here**](https://my-habit-tracker-k4bc.vercel.app/)

---
# Project/ File Structure

    📂 my-habit-tracker/\
    │
    ├── 📂 .github/\
    │   ├── pull_request_template.md\
    │   ├── 📂 Issue_Template/\
    │   │   ├── bug_report.md\
    │   │   ├── config.yml\
    │   │   ├── custom_issue.md\
    │   │   ├── documentation_issue.md\
    │   │   └── feature_request.md\
    │   │
    │   └── 📂 workflows/\
    │       └── deploy.yml\
    │
    ├── 📂 public/\
    │   ├── favicon.ico\
    │   ├── favicon.svg\
    │   ├── index.html\
    │   ├── logo192.png\
    │   ├── logo512.png\
    │   ├── manifest.json\
    │   └── robots.txt\
    │
    ├── 📂 src/\
    │   ├── 📂 components/\
    │   │   ├── About.css\
    │   │   ├── About.jsx\
    │   │   ├── Auth.css\
    │   │   ├── BackToTop.css\
    │   │   ├── BackToTop.js\
    │   │   └── ... (more components)\
    │   │
    │   ├── App.css\
    │   ├── App.js\
    │   ├── App.test.js\
    │   ├── i18n.js\
    │   ├── index.css\
    │   ├── index.js\
    │   ├── logo.svg\
    │   ├── privacy.html\
    │   ├── reportWebVitals.js\
    │   ├── setupTests.js\
    │   └── terms.html\
    │
    ├── .gitignore\
    ├── CODE_OF_CONDUCT.md\
    ├── Contributing.md\
    ├── HabitStreakTracker.html\
    ├── License\
    ├── README.md\
    ├── heatmap-demo.html\
    ├── package-lock.json\
    ├── package.json\
    └── todolist.html\


## ✨ Features

- 🤖 **AI Chatbot Assistant** - Get personalized habit and fitness advice powered by Gemini AI

- ✅ Weekly checklist for multiple habits (**Sun → Sat**)
- 🌙 Light/Dark mode toggle
- 🌱 Interactive **tree that grows** as you complete habits
- 📊 Habit tracking with structured inputs:
  - **Sleep Tracker** → Date, hours slept, ideal sleep info  
  - **Mood Tracker** → Emoji + reason  
  - **Water Tracker** → Date, glasses drank, recommended intake  
  - **Study / Workout / Steps / Screen Time** → Hours, steps, yes/no, all with dates  

---


## 🛠️ Tech Stack

```yaml
- React.js — UI library
- CSS — Styling (responsive design)
- JavaScript — Functionality
- Vercel — Deployment
```

## 🚀 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Clone the Repo

```bash
git clone https://github.com/Riti2407/my-daily-habits-tracker.git
cd my-daily-habits-tracker
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   # On Windows (PowerShell)
   Copy-Item .env.example .env
   ```
2. Get a Gemini API key from Google AI Studio and paste it into `.env`:
   ```
   REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
   Never commit your real API key. The `.env` file is gitignored.

### Start the Development Server

```bash
npm install
```

### Start the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see it in action.

---

## 🤖 AI Chatbot (Gemini)

This project includes an in-app AI assistant powered by Google's Gemini.

- Path: `src/components/Chatbot/Chatbot.js`
- Model: `gemini-1.5-flash`
- Features:
  - Floating chat button (bottom-right)
  - Glassmorphism chat window with date dividers and typing indicators
  - Context-aware replies with short recent history
  - Error handling and safe logging (no API keys printed)

To enable the chatbot, set `REACT_APP_GEMINI_API_KEY` in `.env` and restart `npm start`.

---

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

---

## 🎯 Usage Example

-Log your daily sleep hours

-Track your mood with emojis

-Record water intake (glasses/day)

-Update study/workout progress

-Watch the tree grow as you complete tasks 🌱

## 🔧 Contribution Steps
Follow these steps to contribute:

### 1️⃣ Fork the Repository
Click the **Fork** button in the top-right corner of this repo.

### 2️⃣ Clone Your Fork
```bash
git clone https://github.com/Riti2407/my-habit-tracker.git
cd my-habit-tracker
```

### 3️⃣ Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 4️⃣ Make Your Changes
Edit styles, fix bugs, or update content.

### 5️⃣ Commit Your Work
```bash
git add .
git commit -m "✨ Add: Your clear commit message"
```

### 6️⃣ Push to GitHub
```bash
git push origin feature/your-feature-name
```

### 7️⃣ Create a Pull Request
- Go to your fork on GitHub
- Click **Compare & pull request**
- Add a clear title and description
- Click **Create Pull Request**


Open a Pull Request 🎉

---

## ✅ PR Checklist

Before opening a PR, please ensure:

- [ ] `.env` is NOT committed (use `.env.example` for placeholders)
- [ ] `npm install` and `npm start` work locally without errors
- [ ] No console errors during basic usage; warnings minimized
- [ ] `README.md` updated for any user-facing changes
- [ ] UI changes include screenshots/GIFs in the PR description (if applicable)

## 📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Docs](https://create-react-app.dev/)

---

> Built with ❤️ by Riti
