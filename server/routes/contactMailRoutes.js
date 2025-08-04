// routes/contactMailRoutes.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ========== Simple In-Memory Rate Limiting ==========
const rateLimitStore = new Map();

router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (rateLimitStore.has(ip) && now - rateLimitStore.get(ip) < 60000) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a minute before trying again.',
    });
  }
  rateLimitStore.set(ip, now);

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields: name, email, subject, message.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Admin email
    const adminMailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:16px;color:#333;">
          <h2 style="color:#c20e35;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#f9f9f9;padding:15px;border-radius:8px;border:1px solid #ddd;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <hr/>
          <p style="font-size:12px;color:#888;">Sent via EDIFICE website contact form.</p>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting EDIFICE',
      html: `
        <div style="font-family:Arial,sans-serif;font-size:16px;color:#333;">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us! We’ve received your message and will get back to you as soon as possible.</p>
          <p><strong>Your Message:</strong></p>
          <blockquote style="border-left:4px solid #c20e35;padding-left:10px;color:#555;">${message.replace(/\n/g, '<br/>')}</blockquote>
          <p>Regards,<br/>The EDIFICE Team</p>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('❌ Email Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while sending your message. Please try again later.',
    });
  }
});

module.exports = router;
