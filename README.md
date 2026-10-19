# rizzByJulius — AI Dating Wingman & Romantic Text Reply Engine

> Powered by Google Gemini AI (`@google/genai` SDK)

A full-stack modern web application that analyzes dating app screenshots and text replies (Tinder, Hinge, Bumble, iMessage, WhatsApp), decodes romantic subtext and interest levels, and generates 5 deeply calibrated romantic replies matching her energy.

---

## 🚀 Quick Start (Local Run)

1. **Extract / Clone the repository**:
   ```bash
   unzip rizzByJulius.zip
   # or
   tar -xzvf rizzByJulius.tar.gz
   cd rizzByJulius
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set your Gemini API Key**:
   Create a `.env` file (copy from `.env.example`):
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel & GitHub

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and import your GitHub repository.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.
4. Deploy! Both the frontend and backend API endpoints (`/api/analyze`, `/api/chat`) work immediately.
5. If hosting purely statically on GitHub Pages, users can also input their Gemini API key directly via the in-app **Settings** modal.

---

## 📂 Complete File Directory & Architecture

```
rizzByJulius/
├── index.html                   # HTML entry point with fonts & metadata
├── metadata.json                # Project capabilities & configuration
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript strict configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── server.ts                    # Full-stack Express server with Google Gemini SDK
├── .env.example                 # Template for required environment variables
├── .gitignore                   # Ignored files (node_modules, dist, etc.)
│
├── src/
│   ├── main.tsx                 # React DOM client entry point
│   ├── App.tsx                  # Root app layout, tabs, state management
│   ├── index.css                # Tailwind CSS v4 directives & theme styles
│   │
│   ├── components/
│   │   ├── Header.tsx           # Brand bar, Gemini status & tab navigation
│   │   ├── InputSection.tsx     # Dual input (Screenshot & text), 6 moods & length
│   │   ├── ResultsSection.tsx   # Decoded message banner, radar & 5 replies
│   │   ├── JuliusChat.tsx       # Interactive AI Wingman chat bot
│   │   ├── DatingPlaybook.tsx   # Searchable modern dating vocabulary & rules
│   │   └── SettingsModal.tsx    # Vercel/GitHub deployment instructions & export
│   │
│   ├── data/
│   │   └── datingKnowledge.ts   # Dating terms (rizz, ghosting, etc.) & sample texts
│   │
│   └── types/
│       └── index.ts             # TypeScript interfaces for replies, metrics, chat
│
├── rizzByJulius.zip             # Downloadable full source code (ZIP)
└── rizzByJulius.tar.gz          # Downloadable full source code (TAR.GZ)
```

---

## ✨ Features

- **Dual Inputs**:
  - Upload screenshot of chat (iMessage, WhatsApp, Tinder, Hinge, Bumble) with instant preview.
  - Type or paste her text, with optional extra backstory context.
- **6 Calibrated Target Moods**:
  - 💖 **Romantic** (Featured default): Heartfelt, swoon-worthy, emotional chemistry.
  - 🔥 **Flirty**: Warm, teasing, intimate questions.
  - 🌶️ **Spicy**: Romantic passion, magnetic tension.
  - 😂 **Funny**: Cute rom-com banter, playful late-night humor.
  - ☕ **Casual**: Relaxed, natural, sweet effortless cool.
  - 🚀 **Motivating**: Tender encouragement and emotional support.
- **Reply Length Selector**: Short (< 12 words), Medium (1–2 sentences), Detailed (2–3 sentences).
- **5 High-Rizz Reply Options**: Every reply includes a "Why this works" tactical breakdown and 1-click copy with confetti burst.
- **Subtext Signal Decoder & Interest Radar**: Low / Medium / High with one-line explanation and Anti-Dry-Texter radar.
- **Julius Live Wingman Chat**: Interactive real-time wingman chat powered by Google Gemini.
- **Dating Playbook Cheatsheet**: Field-tested guides on ghosting, breadcrumbing, orbiting, situationships, and date closing.
