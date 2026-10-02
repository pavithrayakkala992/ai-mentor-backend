# ⚙️ AI Mentor — Backend

> **The intelligence layer behind AI Mentor. 🧠**

This repository contains the **Node.js + Express backend** for AI Mentor — a personalized AI tutor built for learning Artificial Intelligence.

The backend connects the frontend with the **Google Gemini API** and provides the APIs responsible for AI-powered conversations, quizzes, lesson checks, topic challenges, feedback, and adaptive learning support.

### 🎯 Hackathon Track

**PS-03 — Personalised AI Tutor for Learning AI**

---

## 🧠 What the Backend Powers

The backend acts as the bridge between the learner, the application, and the AI layer.

| API Capability | Purpose |
|---|---|
| 💬 **AI Chat** | Provides contextual AI Mentor conversations. |
| 🧠 **Practice Generation** | Creates topic-based AI practice questions. |
| 📖 **Lesson Quiz** | Generates quick checks for completed lessons. |
| 🏆 **Topic Challenge** | Creates topic-level challenge questions. |
| 📊 **Quiz Feedback** | Generates feedback based on learner performance. |
| ⚡ **Adaptive Learning** | Supports difficulty and learning recommendations based on performance. |

### 🔄 The Core Flow

**Frontend → Backend API → Gemini AI → Backend Response → Learner**

The backend keeps the AI integration on the server side so the Gemini API key is **not exposed in the frontend**.

---


## 🛠️ Backend Stack

Built with a lightweight server architecture focused on AI-powered learning.

| Layer | Technology |
|---|---|
| ⚙️ **Runtime** | Node.js |
| 🚀 **Framework** | Express.js |
| 🧠 **AI** | Google Gemini API |
| 🔐 **Configuration** | dotenv |
| 🌐 **Cross-Origin Access** | CORS |
| 📡 **Communication** | REST APIs |
| ☁️ **Deployment** | Render |

### 🧩 AI Integration

The backend uses the Gemini API as the intelligence layer for generating dynamic learning experiences rather than relying only on fixed question data.

---


## 🔗 Connecting the AI Experience

The backend serves as the communication layer between the AI Mentor interface and the AI engine.

```text
👤 Learner
    ↓
🎨 React Frontend
    ↓
⚙️ Express Backend
    ↓
🧠 Gemini AI
    ↓
⚡ AI Response
    ↓
🎨 Learner Interface


## 🎯 Why This Backend Matters

The backend is the intelligence bridge of AI Mentor.

It transforms learner interactions into AI-powered responses and connects the learning interface with dynamic generation capabilities.

```text
💡 Learner Input
       ↓
⚙️ Backend Processing
       ↓
🧠 AI Generation
       ↓
📊 Learning Response
       ↓
👤 Learner


## 🧠 AI-Powered Endpoints

The backend exposes dedicated API routes for different parts of the learning journey.

| Endpoint | Role |
|---|---|
| 💬 `/api/chat` | AI Mentor conversations |
| 🧠 `/api/generate-quiz` | Generates practice questions |
| 📖 `/api/generate-lesson-quiz` | Generates lesson quick checks |
| 🏆 `/api/generate-topic-challenge` | Generates topic challenges |
| 📊 `/api/quiz-feedback` | Generates performance feedback |

Each endpoint is designed around a specific learning interaction, keeping the AI functionality organized and easy to extend.

---


## 🚀 Designed to Grow

The backend is structured so new AI-powered learning capabilities can be added without changing the overall architecture.

### Future possibilities

**📚 More Learning Modules**  
Expand the AI curriculum with additional topics, lessons, and challenges.

**🧠 Smarter Personalization**  
Use richer learner activity and performance signals for more detailed recommendations.

**📈 Deeper Analytics**  
Generate more meaningful insights from learning progress and practice performance.

**🔌 More AI Capabilities**  
Extend the backend with additional AI-powered learning and feedback features.

> **Built for today's learning experience, designed for tomorrow's AI-powered education.**

---


## 👩‍💻 Project

**AI Mentor — Personalized AI Tutor for Learning AI**

Built for:

**Build Fast with AI — AI Build Challenge 2026**

**Problem Statement:** PS-03  
**Track:** Personalised AI Tutor for Learning AI

### 🎯 Core Idea

**Personalize the path. Adapt the practice. Improve the learning.**

AI Mentor brings together AI-powered tutoring, adaptive practice, and progress tracking in one connected learning experience.

---

> **Learn → Practice → Adapt → Progress 🤖✨**

---


## 👤 Creator

**Pavithra Yakkala**

**B.Tech CSE • SRM University AP**

---

### 🤖 AI Tools Used

**Google Gemini API** — AI-powered generation and tutoring

**AI-assisted development tools** — used during the development process

All AI tools and external resources used in the project are disclosed as required by the hackathon.

---

> **AI Mentor — building a more personal way to learn AI. 🚀**


## 🌟 The Intelligence Behind the Experience

AI Mentor's backend brings together the APIs, AI generation, and learning logic that power the learner's journey.

```text
💬 Ask
  ↓
🧠 Understand
  ↓
⚡ Generate
  ↓
📊 Adapt
  ↓
🚀 Learn


