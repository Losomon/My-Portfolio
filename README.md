🌐 Solomon Mwangi Portfolio — Full Stack Contact System

**Live Demo** | **Portfolio Project**

A full stack backend for my personal portfolio website, built with Node.js and Express, that handles contact form submissions, stores messages, and optionally sends email notifications.

It’s perfect for connecting a static frontend portfolio to a simple, reliable backend API.

## 🚀 Features
✅ Submit and store messages via a contact form  
✅ Messages saved permanently in messages.json  
✅ Optional email notifications with Gmail SMTP  
✅ REST API endpoints for easy integration  
✅ Input validation to prevent bad data  
✅ CORS enabled – works with Vercel, Netlify, or your own server  
✅ Health check endpoint  
✅ Simple and quick deployment  

## 🛠 Tech Stack
**Layer** | **Technology**  
---|---  
Frontend | HTML, CSS, JavaScript (Fetch API)  
Backend | Node.js, Express.js  
Email | Nodemailer (Gmail SMTP)  
Storage | JSON file  

## ⚡ Quick Start
**1️⃣ Clone the repo & install dependencies**
```bash
git clone https://github.com/your-username/portfolio-backend.git
cd portfolio-backend  
npm install
```

**2️⃣ Start the server**
```bash
npm run dev
```

Your server will run at: **http://localhost:3000**

## 📡 API Endpoints
**Method** | **Endpoint** | **Description**  
---|---|---  
POST | /api/messages | Submit a new message  
GET | /api/messages | Get all messages  
GET | /api/health | Check server status  

**Example request:**
```bash
curl http://localhost:3000/api/messages  
```

## 🧪 Testing the Contact Form
1. Open index.html in your browser  
2. Fill out the contact form  
3. Submit  
4. Check the saved messages in: **messages.json**

All submissions are stored for later review.

## 📧 Optional: Email Notifications
Enable Gmail notifications for each new message:

**1️⃣ Copy the env file**
```bash
copy .env.example .env
```

**2️⃣ Add your Gmail credentials**
```
GMAIL_USER=your@gmail.com
GMAIL_PASS=your-app-password
```

Generate a Gmail App Password [here](https://myaccount.google.com/apppasswords)

**3️⃣ Restart the server**
```bash
npm run dev
```

📬 Now, every message triggers an email notification.

## 📂 Project Structure
```
project/
│
├── server.js          # Backend server
├── package.json       # Node dependencies
├── messages.json      # Saved messages
├── .env               # Environment variables
├── index.html         # Frontend portfolio
└── README.md          # This file
```

## 🌍 Deployment
Check the live portfolio here: [my-portfolio-v51e.vercel.app](https://my-portfolio-v51e.vercel.app)

⚠️ If deploying to Vercel or Netlify, make sure your backend is properly hosted or proxied to handle API requests.

## 🔒 Security Tips
- Never upload .env to GitHub  
- Always use Gmail App Passwords  
- Validate form inputs to prevent bad or malicious data  

## 👨‍💻 Author
**Solomon Mwangi**  
Full Stack Developer | Portfolio Project  

[![Portfolio](https://img.shields.io/badge/Portfolio-my--portfolio--v51e.vercel.app-black?style=flat-square&logo=vercel)](https://my-portfolio-v51e.vercel.app) [![GitHub](https://img.shields.io/badge/GitHub-@your--username-181717?style=flat-square&logo=github)](https://github.com/your-username)

This backend project demonstrates my ability to connect a frontend portfolio to a secure, functional backend API while keeping things simple, reliable, and professional.
