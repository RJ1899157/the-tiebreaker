# ⚖️ The Tiebreaker

> An AI-powered decision analysis dashboard that helps you break any dilemma using weighted Pros & Cons, SWOT matrices, and multi-option comparison grids — powered by the Gemini API.

---

## 🚀 Live Demo

> _Built as part of the [Google AI Professional Certificate](https://grow.google/certificates/)_

---

## ✨ Features

- **Weighted Pros & Cons** — Interactive balance scale that updates in real-time as you adjust individual factor weights via sliders
- **SWOT Matrix** — Full 4-quadrant strategic analysis (Strengths, Weaknesses, Opportunities, Threats) with add/delete controls
- **Multi-Option Comparison Grid** — Score multiple options across custom weighted criteria; the app calculates a live weighted victor
- **AI-Generated Analysis** — Gemini API generates detailed breakdowns, confidence scores, and strategic recommendations
- **Intelligent Fallback System** — Exponential backoff with model fallback; if the API is unavailable, a structured offline draft is generated instantly
- **Decision Archive** — Save, reload, and delete past decision sessions via localStorage persistence
- **Fully Interactive** — All weights, scores, and items are editable on the fly without re-running the AI

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express |
| AI | Google Gemini API (`@google/genai`) |
| Build Tool | Vite 6 |
| Icons | Lucide React |
| Animation | Motion (Framer Motion) |

---

## 📁 Project Structure

```
the-tiebreaker/
├── src/
│   ├── components/
│   │   ├── DecisionForm.tsx       # Input form for topic, context, and analysis type
│   │   └── TieBalanceScale.tsx    # Animated SVG balance scale component
│   ├── App.tsx                    # Main app logic and state management
│   ├── types.ts                   # TypeScript interfaces
│   ├── presets.ts                 # Default example data
│   └── main.tsx                   # React entry point
├── server.ts                      # Express backend + Gemini API integration
├── index.html
├── vite.config.ts
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RJ1899157/the-tiebreaker.git
cd the-tiebreaker

# 2. Install dependencies
npm install

# 3. Set up your environment variables
cp .env.example .env.local
# Add your Gemini API key to .env.local:
# GEMINI_API_KEY=your_key_here

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## 🧠 How It Works

1. Enter your decision topic and optional context in the left panel
2. Choose an analysis mode: **Pros & Cons**, **SWOT**, or **Comparison**
3. The backend sends a structured prompt to the Gemini API with a JSON schema
4. The response populates an interactive dashboard — adjust weights and scores in real-time
5. Save your session to the archive for later reference

### API Architecture

```
Client (React) → POST /api/analyze → Express Server → Gemini API
                                          ↓ (on failure)
                                   Fallback Generator (offline draft)
```

---

## 📸 Screenshots

> _Add screenshots here after deploying or running locally_

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) |

---

## 📄 License

MIT License — feel free to fork and build on top of this.

---

## 👤 Author

**Rishabh Jain**
- GitHub: [@RJ1899157](https://github.com/RJ1899157)
- LinkedIn: _(add your LinkedIn URL)_
