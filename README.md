# 🌐 Solomon Mwangi Portfolio — Full Stack Contact System

A professional portfolio backend built with **Node.js + Express** that handles contact form submissions, saves messages, and sends email notifications.

This project connects a **frontend portfolio website** to a **backend API** for storing and managing messages.

---

## 🚀 Features

* ✅ Contact form connected to backend API
* ✅ Messages saved permanently in `messages.json`
* ✅ Email notifications using Gmail SMTP
* ✅ REST API endpoints
* ✅ Input validation
* ✅ CORS enabled (works with static HTML / Vercel / Netlify)
* ✅ Health check endpoint
* ✅ Easy deployment

---

## 🛠 Tech Stack

```
Frontend: HTML, CSS, JavaScript (Fetch API)
Backend: Node.js, Express.js
Email: Nodemailer (Gmail SMTP)
Storage: JSON file
```

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | /api/messages | Save contact message |
| GET    | /api/messages | Get all messages     |
| GET    | /api/health   | Server status        |

Example:

```
http://localhost:3000/api/messages
```

---

## 🧪 Test Contact Form

1. Open `index.html`
2. Fill the contact form
3. Submit
4. Check file:

```
messages.json
```

All messages will be saved there.

---

## 📧 Enable Email Notifications (Optional)

### Step 1 — Copy env file

```bash
copy .env.example .env
```

### Step 2 — Edit `.env`

```
GMAIL_USER=your@gmail.com
GMAIL_PASS=your-app-password
```

Generate Gmail App Password:

https://myaccount.google.com/apppasswords

### Step 3 — Restart server

```bash
npm run dev
```

Now every message sends email notification.

---

## 📂 Project Structure

```
project/
│
├── server.js
├── package.json
├── messages.json
├── .env
├── public/
│   └── index.html
│
└── README.md
```

---

## 📊 View Messages

You can view messages using browser or curl:

```bash
curl http://localhost:3000/api/messages
```

---

## 🌍 Deployment
follow to see :
my-portfolio-v51e.vercel.app

## 🔒 Security Notes

* Do not upload `.env`
* Use Gmail App Password
* Enable validation before saving messages

---

## 👨‍💻 Author

**Solomon Mwangi**
Full Stack Developer
Portfolio Project

--
