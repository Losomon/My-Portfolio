# Solomon Mwangi Portfolio - Backend Setup

## 🚀 Quick Start (Backend + Frontend)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server
```bash
npm run dev
```
- Server runs at `http://localhost:3000`
- API: `POST /api/messages`, `GET /api/messages`, `/api/health`

### 3. Test Frontend
- Open `index.html` in browser
- Fill contact form → submits to backend!
- Check `messages.json` for saved messages
- View all: `http://localhost:3000/api/messages`

## 📧 Enable Email Notifications (Optional)

1. Copy config:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with Gmail:
   ```
   GMAIL_USER=your@gmail.com
   GMAIL_PASS=your-app-password  # Generate at https://myaccount.google.com/apppasswords
   ```

3. Restart: `npm run dev`

## 📱 Features
- ✅ Save messages to `messages.json` (persistent)
- ✅ Email notifications (Gmail SMTP)
- ✅ CORS enabled (works with static HTML)
- ✅ Input validation
- ✅ GET all messages API
- ✅ Health check endpoint

## 🛠 Tech Stack
```
Backend: Express.js + Node.js + Nodemailer
Storage: JSON file
Frontend: Vanilla JS fetch() API calls
```

## 📊 View Messages
```bash
# In new terminal
curl http://localhost:3000/api/messages
```

## 🎉 Production Deploy
- Render.com / Railway / Vercel (free)
- Or any Node.js host

**Messages saved forever in `messages.json`!** 📝

