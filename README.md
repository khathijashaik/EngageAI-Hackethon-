# EngageAI-Hackethon-
Personalized Event Engagement Tracker
# 🎯 Engage AI - Personalized Event Engagement Tracker

![Engage AI Banner](https://img.shields.io/badge/EngageAI-Hackathon-blueviolet)

## 🧠 Problem Statement

Students often attend college/university events, but meaningful engagement is missing. Organizers struggle to measure:
- Who actually attended?
- Who interacted with polls/Q&A?
- Who engaged with event resources?

---

## 🚀 Solution

**Engage AI** is a complete system that:
- Tracks event **session attendance**
- Monitors **poll/Q&A participation**
- Logs **resource downloads**
- Calculates a **real-time engagement score** per student
- Visualizes all data in a clean **React dashboard**

🎯 Ideal for event organizers, colleges, or student bodies who want to measure real engagement, not just headcounts.

---

## 📦 Features

- ✅ RESTful API built with **Node.js + Express**
- ✅ Data stored securely using **MongoDB**
- ✅ Live engagement score per user
- ✅ Simple UI to query users and view stats
- ✅ Modular and scalable architecture
- ✅ Designed for solo hackathon submission

---

## 🖼️ Demo

![Dashboard Screenshot](https://via.placeholder.com/800x400?text=Engage+AI+Dashboard)

---

## 🔧 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React, Tailwind CSS |
| Backend     | Node.js, Express  |
| Database    | MongoDB (Atlas or local) |
| Auth (optional) | Firebase (can be added) |

---

## 📁 Project Structure
engage-ai/
├── backend/ # Express API
│ ├── models/ # Mongoose models
│ ├── routes/ # Attendance, Poll, User APIs
│ └── index.js # Server entry point
├── frontend/ # React App
│ └── src/ # Components, App.js

---

## ▶️ How to Run

### 🔌 Backend
```bash
cd backend
npm install
# Update .env with your MongoDB URI
node index.js
cd frontend
npm install
npm start
cd frontend
npm install
npm start

📊 Engagement Scoring Model
Action	Points
Attending a session	+10
Answering a poll/Q&A	+5
Downloading a resource	+3
Multiple interactions	✅ Supported and accumulative
📈 Future Improvements

    Admin dashboard to view all users

    Firebase login with roles (Student / Organizer)

    QR-code-based check-in for sessions

    Analytics charts (Recharts, Chart.js)

🙋‍♂️ Author

Solo Submission
Built with ❤️ during a hackathon by Khathija Shaik Chintakrindi

