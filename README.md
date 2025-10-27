# Carbon Track - AI Mining Emission Analytics Platform

An AI-powered platform that helps mining companies track, analyze, and reduce their carbon emissions through intelligent document analysis and actionable insights.

![Live Link](https://carbon-track-l3hf.vercel.app/)

## 🚀 Features

- **AI Document Analysis** – Upload mining PDFs and automatically extract emission sources
- **Interactive Dashboard** – Real-time visualization with charts & trends
- **Automated Reporting** – Generate professional PDF sustainability reports
- **AI Insights** – Actionable recommendations for emission reduction
- **Performance Leaderboard** – Compare mines based on sustainability performance
- **Multi-mine Management** – Manage multiple mining operations in one place

## 🛠️ Tech Stack

**Frontend**
- React.js (Context API)
- Tailwind CSS
- Chart.js
- jsPDF + autoTable

**AI & Backend**
- Google Gemini API
- Clerk Authentication
- localStorage persistence
- Deployed on Vercel

## Project Structure
```bash
src/
├── components/          # React components
│   ├── DashboardPage.jsx
│   ├── Documents.jsx
│   ├── InsightsPage.jsx
│   ├── Leaderboard.jsx
│   └── Profile.jsx
├── context/            # State management
│   └── UserContext.js
├── utils/              # Helper functions
│   └── reportGenerator.js
└── App.jsx             # Main application
```bash

## 📦 Installation

```bash
git clone myrepolink
cd carbon-track
npm install
