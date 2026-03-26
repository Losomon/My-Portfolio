# 🌐 Solomon Mwangi Portfolio — Full Stack Contact System

> A powerful, simple backend for connecting your static portfolio to a reliable API

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit%20Live%20Demo-blue?style=for-the-badge&logo=vercel)](https://my-portfolio-v51e.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-@Losomon-black?style=for-the-badge&logo=github)](https://github.com/Losomon)

---

## ✨ Overview

A full-stack backend for personal portfolio websites built with **Node.js** and **Express**. Perfect for connecting a static frontend to a simple, reliable backend that handles:

- 📝 Contact form submissions
- 💾 Persistent message storage
- 📧 Optional email notifications (Gmail SMTP)
- ✅ Input validation
- 🔒 Security best practices

---

## 🚀 Key Features

| Feature | Details |
|---------|---------|
| ✅ Contact Forms | Submit and store messages seamlessly |
| ✅ Persistent Storage | Messages saved permanently in `messages.json` |
| ✅ Email Notifications | Optional Gmail SMTP integration |
| ✅ REST API | Easy integration with your frontend |
| ✅ Validation | Prevents bad or malicious data |
| ✅ CORS Enabled | Works with Vercel, Netlify & self-hosted servers |
| ✅ Health Checks | Monitor server status |
| ✅ Quick Deploy | Simple setup and deployment |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| 🎨 Frontend | HTML, CSS, JavaScript (Fetch API) |
| ⚙️ Backend | Node.js, Express.js |
| 📧 Email | Nodemailer (Gmail SMTP) |
| 💾 Storage | JSON file system |

---

## ⚡ Quick Start

### Step 1️⃣ — Clone & Install

```bash
git clone https://github.com/your-username/portfolio-backend.git
cd portfolio-backend
npm install
```

### Step 2️⃣ — Start the Server

```bash
npm run dev
```

Your server will be running at: **http://localhost:3000** 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/messages` | Submit a new message |
| `GET` | `/api/messages` | Get all messages |
| `GET` | `/api/health` | Check server status |

### Example Request

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Hello!"}'
```

---

## 🧪 Testing

1. 📂 Open `index.html` in your browser
2. 📝 Fill out the contact form
3. 📤 Click submit
4. ✅ View saved messages in `messages.json`

---

## 📧 Enable Email Notifications (Optional)

### 1️⃣ Copy Environment File

```bash
copy .env.example .env
```

### 2️⃣ Add Gmail Credentials

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

> 🔑 **Generate App Password**: [Google Account Security](https://myaccount.google.com/apppasswords)

### 3️⃣ Restart Server

```bash
npm run dev
```

📬 **Done!** Every message will now trigger an email notification.

---

## 📂 Project Structure

```
my-portfolio/
│
├── 📄 server.js              # Express backend
├── 📋 package.json           # Dependencies
├── 📝 messages.json          # Message storage
├── 🔐 .env                   # Environment variables
├── 🌐 index.html             # Frontend
└── 📖 README.md              # This file
```

---

## 🌍 Deployment

### Live Demo
Check out the live portfolio: **[my-portfolio-v51e.vercel.app](https://my-portfolio-v51e.vercel.app)**

### Deploy to Vercel/Netlify
⚠️ Ensure your backend is:
- Properly hosted on a backend service (Heroku, Railway, etc.)
- Configured with CORS headers
- Proxied correctly from your frontend

---

## 🔒 Security Best Practices

- 🚫 Never commit `.env` to Git
- 🔑 Always use Gmail App Passwords (not your main password)
- ✅ Validate all form inputs on both client & server
- 🛡️ Sanitize user data before processing

---

## 👨‍💻 About

**Solomon Mwangi** • Full Stack Developer

This project demonstrates my ability to:
- Build secure, functional backend APIs
- Handle real-world scenarios (form submissions, email delivery)
- Maintain code simplicity and professionalism
- Deploy and scale web applications

---

## 📄 License

This project is open source and available under the MIT License.

---

<div align="center">

**Made with ❤️ by [Solomon Mwangi](https://github.com/Losomon)**

⭐ If you find this helpful, please give it a star! ⭐

</div>