require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://numyhomes.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Robust body parsing: handle auto-parsed object, string, or raw stream
  let data = {};
  try {
    if (req.body && typeof req.body === 'object') {
      data = req.body;
    } else if (typeof req.body === 'string') {
      data = JSON.parse(req.body);
    } else {
      // Manually read stream (fallback for some Vercel environments)
      const raw = await new Promise((resolve, reject) => {
        let buf = '';
        req.on('data', chunk => { buf += chunk; });
        req.on('end', () => resolve(buf));
        req.on('error', reject);
      });
      data = JSON.parse(raw || '{}');
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Invalid request format.' });
  }

  const { name, email, phone, budget, intent, neighborhood, message } = data;

  if (!name || String(name).trim().length < 2)
    return res.status(400).json({ success: false, message: 'Please enter your name.' });
  if (!email || !String(email).includes('@'))
    return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
  if (!message || String(message).trim().length < 10)
    return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: `"${String(name).trim()}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: String(email).trim(),
        subject: `New Luxury Real Estate Inquiry from ${String(name).trim()}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#b8924a;border-bottom:2px solid #b8924a;padding-bottom:10px">New Contact Form Submission</h2>
            <div style="background:#f8f4ee;padding:20px;margin:20px 0;border-radius:5px">
              <p><strong>Name:</strong> ${String(name).trim()}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            </div>
            <div style="background:#f8f4ee;padding:20px;margin:20px 0;border-radius:5px">
              <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
              <p><strong>Looking To:</strong> ${intent || 'Not specified'}</p>
              <p><strong>Neighborhood:</strong> ${neighborhood || 'Not specified'}</p>
            </div>
            <div style="background:#f8f4ee;padding:20px;margin:20px 0;border-radius:5px">
              <p style="white-space:pre-wrap">${String(message).trim()}</p>
            </div>
            <p style="color:#666;font-size:12px;text-align:center">
              Submitted ${new Date().toLocaleString()} — numyhomes.com
            </p>
          </div>`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nBudget: ${budget || 'N/A'}\nIntent: ${intent || 'N/A'}\nNeighborhood: ${neighborhood || 'N/A'}\n\n${message}`
      });
    } else {
      // Log submission when email is not yet configured
      console.log('[contact] Submission (email not configured):', {
        name, email, phone, budget, intent, neighborhood,
        message: String(message).substring(0, 100),
        timestamp: new Date().toISOString()
      });
    }

    res.json({ success: true, message: "Thank you for your inquiry! We'll be in touch within 24 hours." });
  } catch (err) {
    console.error('[contact] Send error:', err.message);
    res.status(500).json({
      success: false,
      message: 'There was a problem sending your message. Please call us directly at (754) 268-0425.'
    });
  }
};
