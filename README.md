# 🏛 Citizen Services Chatbot
### AI + Rule-Based Government Service Automation (WhatsApp + Web)

A full-stack conversational platform that helps citizens access government services such as **bill payments, grievance filing, certificate information, and application tracking** through **WhatsApp and a Web Chatbot**.

The system combines **Rule-Based Logic for deterministic workflows** and **Generative AI (Google Gemini)** for natural language understanding to provide fast, accurate, and human-like interactions.

Built with **Node.js, Express, React, TypeScript, Supabase (PostgreSQL), and Google Gemini AI**.

---

## 🚀 Features

### ✅ Bill Payments
- Electricity, Water, Property Tax
- Retrieve bills via consumer number
- Mock database-driven billing

### ✅ Grievance Redressal
- Categories: Roads, Water, Garbage, Street Lights
- Mandatory photo upload
- Auto-generated ticket IDs (GR00XXX)
- Status tracking via Admin Panel

### ✅ Information Services
- Birth, Caste, Income certificates
- Document requirements
- AI explanations in simple language

### ✅ Multilingual Support
- English
- Hindi
- Hinglish

### ✅ Multi-Channel Access
- WhatsApp Bot
- Web Chatbot
- Admin Dashboard

---

# 🧠 Architecture Overview
Citizen → WhatsApp/Web → Backend → Rule Engine → AI (Gemini) → Supabase DB → Admin Panel

---

## 📦 Project Structure
Citizen-Services-Chatbot/
│
├── backend/ → WhatsApp Webhook Server (Node.js/Express)
├── chatbot/ → Web Chatbot (React + TypeScript + Vite)
├── admin-panel/ → Operations Dashboard (React)
└── README.md


---

# ⚙️ Tech Stack

### Backend
- Node.js
- Express.js
- Meta WhatsApp Graph API
- Google Generative AI (Gemini 2.5 Flash)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Database
- Supabase
- PostgreSQL

### DevOps/Tools
- REST APIs
- Webhooks
- Environment Variables
- Git

---

# 🔍 Core System Design

## 1️⃣ Backend (WhatsApp Webhook)

**Path:** `/backend`

Handles real-time WhatsApp messages using Meta Webhooks.

### Logic Flow
### Level 1 – Rule-Based Engine
- Keyword detection (Bill, Complaint, Status)
- Instant deterministic responses

### Level 2 – AI Fallback
- Gemini AI handles natural language queries
- Flexible, human-like conversations

### State Management
- Current: In-memory sessions (Map)
- Planned: Supabase persistent storage

---

## 2️⃣ Web Chatbot (Frontend)

**Path:** `/chatbot`

- WhatsApp-like UI
- Real-time messaging
- Direct Supabase integration
- Persistent chat history

---

## 3️⃣ Admin Panel (Ops Console)

**Path:** `/admin-panel`

Government-facing dashboard for:

- Viewing citizens
- Tracking grievances
- Managing applications
- Monitoring chat history

---

# 🗄 Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| citizens | User profiles |
| grievances | Complaint tickets |
| bills | Utility payments |
| applications | Certificates/licenses |
| conversations | Chat logs |

---

# 🔄 User Flow Examples

### Bill Payment
User → Enter consumer number → Fetch bill → Confirm → Payment


### Grievance
User → Select category → Upload photo → Ticket generated → Track status


---

# 🔐 Environment Variables

Create `.env` in backend:

GEMINI_API_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
SUPABASE_URL=
SUPABASE_ANON_KEY=


---

# ▶️ Running Locally

## Backend
```bash
cd backend
npm install
npm run dev
Web Chatbot
cd chatbot
npm install
npm run dev
Admin Panel
cd admin-panel
npm install
npm run dev
🚧 Current Limitations
WhatsApp backend sessions stored in RAM

Persistence integration with Supabase planned

Mock payment gateway

🧪 Future Improvements
Persistent session storage

Real payment gateway integration

OTP authentication

Voice bot support

Analytics dashboard

Multi-state support

📈 Why This Project is Strong
This project demonstrates:

✅ Full-stack development
✅ API integration
✅ AI + Rule hybrid architecture
✅ Real-time messaging systems
✅ Database design
✅ Admin dashboard
✅ Production-like system design

👤 Author
Bhaskar Poddar
LinkedIn: https://www.linkedin.com/in/bhaskar-poddar-7a0848286/
GitHub: https://github.com/BhaskarPoddar2423


