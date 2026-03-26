const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure messages file exists
async function initMessagesFile() {
  try {
    await fs.access(MESSAGES_FILE);
  } catch {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify([], null, 2));
  }
}

// In-memory transporter (configured via .env)
let transporter;
async function initTransporter() {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    
    // Test connection
    try {
      await transporter.verify();
      console.log('✅ Email transporter ready');
    } catch (err) {
      console.warn('⚠️ Email config invalid - emails disabled');
    }
  } else {
    console.log('ℹ️ No email config (.env) - messages saved only');
  }
}

// API Routes

// GET /api/messages - List all messages
app.get('/api/messages', async (req, res) => {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf8');
    const messages = JSON.parse(data);
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to read messages' });
  }
});

// POST /api/messages - Submit new message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message || !name.trim() || !email.trim() || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }
    
    const newMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Read existing messages
    const data = await fs.readFile(MESSAGES_FILE, 'utf8');
    const messages = JSON.parse(data || '[]');
    messages.unshift(newMessage); // Add to top
    
    // Write back
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    
    // Send email if configured
    let emailSent = false;
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          replyTo: email,
          subject: `New Portfolio Message: ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <blockquote>${message.replace(/\n/g, '<br>')}</blockquote>
            <hr>
            <small>Submitted: ${new Date().toLocaleString()}</small>
          `
        });
        emailSent = true;
        console.log(`📧 Email sent for message from ${name}`);
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Message received successfully!',
      saved: true,
      emailSent,
      id: newMessage.id
    });
    
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, error: 'Server error - please try again' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Backend running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
async function startServer() {
  await initMessagesFile();
  await initTransporter();
  
  app.listen(PORT, 'localhost', () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
    console.log(`📧 API endpoints: /api/messages (POST/GET), /api/health`);
    console.log(`💾 Messages saved to: ${MESSAGES_FILE}`);
    console.log(`📝 Open index.html and test contact form!`);
    console.log('');
    console.log('To enable emails:');
    console.log('1. Copy .env.example → .env');
    console.log('2. Add GMAIL_USER=your@gmail.com');
    console.log('3. Add GMAIL_PASS=your-app-password');
    console.log('4. Restart: npm run dev');
  });
}

startServer().catch(console.error);

