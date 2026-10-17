# JourneyX — AI-Powered Customer Journey Mapper 🗺️✨

> **Every Customer Has a Story. Map Every Moment.**
> An enterprise-grade AI customer journey mapping platform that transforms high-level product ideas, user feedback, or CX interview documents into interactive, full-lifecycle customer journey maps with sentiment curves, touchpoint friction scoring, opportunity roadmaps, and an intelligent CX Copilot.

---

## 🌟 Key Features

- **⚡ Instant AI Journey Generation**:
  - Type any product or business name (e.g. *Spotify HiFi*, *Tesla Cybertruck*, *Airbnb Experiences*) to instantly synthesize complete, multi-stage customer journeys.
  - Powered by Google Gemini with deep reasoning across Awareness, Consideration, Purchase, Onboarding, Retention, and Advocacy.

- **📊 Comprehensive Journey Stages & Cards**:
  - **Stage Objectives & User Mindset**: Clear psychological and transactional context.
  - **Touchpoints & Channels**: Digital, physical, support, and social interactions mapped to each phase.
  - **Friction Points & Pain Points**: Quantified friction metrics and blockers.
  - **Opportunities & Solutions**: Actionable CX recommendations with priority ratings.
  - **KPIs & Success Metrics**: Metrics to track at each milestone (NPS, CSAT, CAC, Time-to-Value).

- **📈 Real-Time Sentiment & Emotion Curve**:
  - Dynamic visual emotion tracking that highlights peaks of delight and troughs of customer anxiety.
  - Interactive curve hover cards and sentiment index (+1.0 to -1.0).

- **🤖 AI CX Copilot**:
  - Context-aware CX assistant conversing directly with your active journey state.
  - Suggests targeted UX interventions, churn reduction strategies, and growth experiments.

- **📄 Multimodal Document Insights**:
  - Upload research transcripts, customer survey exports, or product specifications to extract grounded journey maps directly from user data.

- **💾 Persistence & Export**:
  - Local auto-save across sessions.
  - Export to JSON, CSV, or formatted presentations for stakeholders.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide Icons](https://lucide.dev/)
  - [Motion](https://motion.dev/)
  - [Vite](https://vitejs.dev/)

- **Backend**:
  - [Express](https://expressjs.com/) & [Node.js](https://nodejs.org/)
  - [@google/genai SDK](https://github.com/googleapis/genai-js) (Gemini 3.8 Flash model)
  - Seamless Vite middleware integration for unified full-stack dev and production serving

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- A [Gemini API Key](https://aistudio.google.com/app/apikey) from Google AI Studio

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/journeyx.git
cd journeyx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and add your Google Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY="your-google-gemini-api-key-here"
```

*(Note: In Google AI Studio Build environments, the `GEMINI_API_KEY` is automatically provisioned and injected).*

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

- `npm run dev`: Starts the Express server with Vite middleware on port 3000
- `npm run build`: Compiles and bundles the frontend with Vite
- `npm run start`: Runs the production Express application
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`)
- `npm run clean`: Cleans build artifacts (`dist` folder)

---

## 🚢 Publishing & Deploying

### Pushing to GitHub

To push this codebase to a new repository on your GitHub account:

1. **Create a new repository on GitHub**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name it `journeyx` (or your preferred name) and leave it empty (without initializing README or .gitignore).

2. **Add the remote and push**:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Deploying to Production

This applet is pre-configured for one-click deployment on platforms like:
- **Cloud Run / Google Cloud**: Containerized deployment with Nginx proxy or direct node execution.
- **Render / Railway / Fly.io**: Run `npm install`, build with `npm run build`, and start with `npm run start`.
- **Vercel / Netlify**: Configure the serverless Express handler or split client and API functions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
