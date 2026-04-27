require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://numyhomes.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Vercel parses JSON body automatically; fall back to manual parse if needed
  const data = req.body && typeof req.body === 'object'
    ? req.body
    : JSON.parse(req.body || '{}');

  const { name, email, phone, budget, intent, neighborhood, message } = data;

  if (!name || name.trim().length < 2)
    return res.status(400).json({ success: false, message: 'Name is required' });
  if (!email || !email.includes('@'))
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  if (!message || message.trim().length < 10)
    return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: `"${name.trim()}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email.trim(),
        subject: `New Luxury Real Estate Inquiry from ${name.trim()}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#b8924a;border-bottom:2px solid #b8924a;padding-bottom:10px">New Contact Form Submission</h2>
            <div style="background:#f8f4ee;padding:20px;margin:20px 0;border-radius:5px">
              <p><strong>Name:</strong> ${name.trim()}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            </div>
            <div style="background:#f8f4ee;padding:20px;margin:20px 0;border-radius:5px">
              <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
              <p><strong>Looking To:</strong> ${intent || 'Not specified'}</p>
              <p><strong>Neighborhood:</strong> ${neighborhood || 'Not specified'}</p>
            </div>
            <div style="background:#f8f4ee;padding:20px;margin:20px 0;border-radius:5px">
              <p style="white-space:pre-wrap">${message.trim()}</p>
            </div>
            <p style="color:#666;font-size:12px;text-align:center">
              Submitted at ${new Date().toLocaleString()} from numyhomes.com
            </p>
          </div>`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nBudget: ${budget || 'N/A'}\nIntent: ${intent || 'N/A'}\nNeighborhood: ${neighborhood || 'N/A'}\n\n${message}`
      });
    } else {
      console.warn('[contact] Email not configured — submission logged only');
      console.log('[contact]', { name, email, message, timestamp: new Date().toISOString() });
    }

    res.json({ success: true, message: "Thank you for your inquiry! We'll be in touch within 24 hours." });
  } catch (err) {
    console.error('[contact] Error:', err.message);
    res.status(500).json({ success: false, message: 'Error sending your message. Please try again or call us directly.' });
  }
};
