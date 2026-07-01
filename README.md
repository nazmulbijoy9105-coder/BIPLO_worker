# BIPLOB Skills Academy - Global Skills & Overseas Career Platform

BIPLOB Skills Academy is a full-stack learning and employment-matching platform designed for overseas aspirants aiming for placements in countries like Japan, Germany, and South Korea. It features an interactive student training portal, live classes, simulated skill trade & language quizzes, a CV/resume generator, an AI companion chatbot, and real-time training quality feedback.

This repository is optimized for **local development**, **GitHub synchronization**, and seamless **Vercel Serverless deployment**.

---

## 🚀 Quick Start (Local Development)

To run the application locally on your computer, follow these simple steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system.

### 2. Install Dependencies
In your terminal, navigate to the project directory and run:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project (you can copy `.env.example` as a template):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note:** If `GEMINI_API_KEY` is not provided, the platform automatically runs in fallback/mock mode so you can preview the flow without crashes.

### 4. Run the Development Server
Start the unified full-stack server (Vite frontend + Express backend) by running:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🏗️ Architecture & Features

The platform is designed with a modern, modular, and highly performant full-stack architecture:

*   **Frontend (React + Vite + Tailwind CSS)**: Highly responsive, tactile single-page app with custom components (`src/components/`), premium typography, and fluid micro-interactions powered by `motion`.
*   **Backend API Service (Express + Node.js)**: Runs server-side logic in `server.ts` to secure API keys and handle heavy-lifting operations:
    *   `/api/chat`: Gemini-powered conversational AI specialized in overseas career coaching.
    *   `/api/resume-builder`: Generates custom formatted, translation-ready CVs and cover letters tailored to country-specific formats (e.g., Japanese Rirekisho, German Lebenslauf).
    *   `/api/feedback`: Collects student evaluation data and uses Gemini to analyze response sentiment, returning a personalized thank-you response from the Academy Director.
*   **Type Safety**: Centrally declared interfaces in `src/types.ts` prevent runtime errors and ensure strict compilation guidelines.
*   **Vercel Serverless Setup (`/api/index.ts`)**: Bypasses traditional server configurations on serverless platforms by exposing the Express routing tree through Vercel's Edge/Serverless node runtime.

---

## ⚡ Deployment to Vercel

The repository has been configured with a production-ready `vercel.json` file to make deployment to [Vercel](https://vercel.com/) instantaneous and zero-config.

### Step-by-Step Deployment:

1.  **Create a Vercel Account**: Sign up or log in at [Vercel](https://vercel.com).
2.  **Import Project**:
    *   Click **"Add New"** > **"Project"** in your Vercel Dashboard.
    *   Connect your GitHub account and import your repository.
3.  **Configure Framework Preset**:
    *   Vercel will automatically detect **Vite** as the framework preset. Keep this default.
4.  **Add Environment Variables**:
    *   Under the **"Environment Variables"** section, add your Gemini API Key:
        *   **Name**: `GEMINI_API_KEY`
        *   **Value**: *Your actual Google Gemini API Key*
5.  **Click Deploy**:
    *   Vercel will compile the Vite frontend into optimized static files (`dist/`) and deploy your Express routes as a globally distributed Serverless Function (`api/index.ts`).
    *   Any push to your main branch on GitHub will now trigger automatic preview and production deployments.

---

## 🐙 Push to GitHub

To store your code in GitHub and enable automatic continuous integration (CI/CD):

1.  **Create a New GitHub Repository**: Go to [GitHub](https://github.com/) and create a new empty repository (do not add a README, license, or gitignore, as they are already included here).
2.  **Initialize Git and Push**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit: BIPLOB Platform with Vercel configuration"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    git push -u origin main
    ```

---

## 🛡️ Trust Seals & Compliance

The platform includes **Verified Trust & Compliance Seals** in the Hero section, confirming alignment with:
*   **ISO 9001:2015 Quality Standards** (Curriculum Audit and Quality)
*   **Registered Skills Provider** (Government Partnership for international migration)
*   **Secure Payments Gateways** (Safe tuition Fee Shield)
