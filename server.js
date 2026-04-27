require('dotenv').config();

// Validate required env vars at startup so problems surface immediately
const REQUIRED_ENV = ['EMAIL_USER', 'EMAIL_PASS'];
const missingEnv = REQUIRED_ENV.filter(
  key => !process.env[key] || process.env[key].startsWith('your-')
);
if (missingEnv.length > 0) {
  console.warn(`[WARN] Missing or placeholder env vars: ${missingEnv.join(', ')}`);
  console.warn('[WARN] Contact form emails will NOT be sent until these are set in .env');
}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();

// Vercel serverless function export
module.exports = app;

// Security middleware (relaxed for Vercel)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"]
    }
  },
  // Disable HSTS for Vercel (they handle HTTPS)
  hsts: false
}));

// Rate limiting (adjusted for serverless)
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 3, // Reduced for serverless
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(((process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration for Vercel
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:3000',
    'https://numyhomes2.vercel.app',
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to contact form
app.use('/api/contact', limiter);

// Serve static files
app.use(express.static('.', {
  maxAge: '1d',
  etag: true
}));

// Email transporter configuration
let transporter;
try {
  // Only configure if credentials are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password-here') {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify email configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('Email configuration error:', error.message);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  } else {
    console.log('Email not configured - set EMAIL_USER and EMAIL_PASS environment variables');
  }
} catch (error) {
  console.error('Failed to create email transporter:', error.message);
}

// Input validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('budget')
    .optional()
    .isIn(['Under $1M', '$1M - $3M', '$3M - $5M', '$5M - $10M', '$10M+', 'Not specified'])
    .withMessage('Please select a valid budget range'),

  body('intent')
    .optional()
    .isIn(['Buy a home', 'Sell my home', 'Investment', 'Rent', 'Consultation', 'Other'])
    .withMessage('Please select a valid intent'),

  body('neighborhood')
    .optional()
    .isIn(['Brickell', 'South Beach', 'Coral Gables', 'Bal Harbour', 'Fisher Island', 'Key Biscayne', 'Other'])
    .withMessage('Please select a valid neighborhood'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Contact form endpoint
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, budget, intent, neighborhood, message } = req.body;

    // Additional server-side sanitization
    const sanitizedData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      budget: budget || 'Not specified',
      intent: intent || 'Not specified',
      neighborhood: neighborhood || 'Not specified',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };

    const mailOptions = {
      from: `"${sanitizedData.name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: sanitizedData.email,
      subject: `New Luxury Real Estate Inquiry from ${sanitizedData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b8924a; border-bottom: 2px solid #b8924a; padding-bottom: 10px;">New Contact Form Submission</h2>

          <div style="background: #f8f4ee; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #333;">Client Information</h3>
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>
            <p><strong>Phone:</strong> ${sanitizedData.phone || 'Not provided'}</p>
          </div>

          <div style="background: #f8f4ee; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #333;">Property Details</h3>
            <p><strong>Budget Range:</strong> ${sanitizedData.budget}</p>
            <p><strong>Looking To:</strong> ${sanitizedData.intent}</p>
            <p><strong>Preferred Neighborhood:</strong> ${sanitizedData.neighborhood}</p>
          </div>

          <div style="background: #f8f4ee; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedData.message}</p>
          </div>

          <div style="background: #e8e2d8; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 12px; color: #666;">
            <p><strong>Submitted:</strong> ${new Date(sanitizedData.timestamp).toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${sanitizedData.ip}</p>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
            This inquiry was submitted through the Numy Luxury Real Estate website.
          </p>
        </div>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
New Luxury Real Estate Inquiry

Client Information:
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone || 'Not provided'}

Property Details:
Budget: ${sanitizedData.budget}
Intent: ${sanitizedData.intent}
Neighborhood: ${sanitizedData.neighborhood}

Message:
${sanitizedData.message}

Submitted: ${new Date(sanitizedData.timestamp).toLocaleString()}
IP: ${sanitizedData.ip}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log successful submission (in production, you'd want to store this in a database)
    console.log(`Contact form submission from ${sanitizedData.name} (${sanitizedData.email}) at ${sanitizedData.timestamp}`);

    res.json({
      success: true,
      message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    // Don't expose internal error details to client
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again or contact us directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found on this server.'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// Export for Vercel serverless functions
console.log(`🚀 Numy Luxury Real Estate server configured`);
console.log(`📧 Email service: ${transporter ? 'Configured' : 'Not configured'}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production (Vercel)'}`);
console.log(`🔒 Security: Enabled`);
console.log(`⚡ Rate limiting: ${process.env.RATE_LIMIT_MAX_REQUESTS || 3} requests per ${process.env.RATE_LIMIT_WINDOW || 15} minutes`);