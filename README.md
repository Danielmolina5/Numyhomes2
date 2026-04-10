# Numy Luxury Real Estate Website

A modern, responsive website for Miami luxury real estate services with production-ready backend.

## Features

- **Multi-page website** with separate pages for listings, testimonials, blog, and neighborhood guides
- **Secure contact form** with backend email functionality and validation
- **Responsive design** optimized for all devices
- **Modern UI** with smooth animations and interactions
- **Production security** with rate limiting, input validation, and security headers

## Pages

- `index.html` - Homepage with hero, listings preview, about, testimonials, blog, contact
- `listings.html` - All property listings (47 properties)
- `testimonials.html` - All client reviews
- `blog.html` - All articles with individual post pages
- Neighborhood pages: Brickell, South Beach, Coral Gables, Bal Harbour, Fisher Island, Key Biscayne
- Property type pages: Off-Market, New Developments, Sold Portfolio, Market Reports, Commercial, Videos

## Backend Features

- ✅ **Email Integration**: Secure Gmail SMTP with app passwords
- ✅ **Input Validation**: Server-side validation with express-validator
- ✅ **Rate Limiting**: Protection against spam (5 requests per 15 minutes)
- ✅ **Security Headers**: Helmet.js with CSP, HSTS, and security headers
- ✅ **Environment Variables**: Sensitive data stored securely
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **CORS Protection**: Configured CORS for security
- ✅ **Health Check**: `/api/health` endpoint for monitoring

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- Gmail account with app password

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Danielmolina5/Numyhomes2.git
   cd Numyhomes2
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual values:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Get Gmail App Password:**
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password for "Mail"
   - Use this password (not your regular password) in EMAIL_PASS

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## API Endpoints

### POST `/api/contact`
Submits contact form data. Requires validation.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "budget": "$1M - $3M",
  "intent": "Buy a home",
  "neighborhood": "Brickell",
  "message": "I'm interested in luxury properties..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your inquiry! We'll get back to you within 24 hours."
}
```

### GET `/api/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-10T...",
  "environment": "development"
}
```

## Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Input Validation**: Comprehensive server-side validation
- **Security Headers**: CSP, HSTS, XSS protection
- **CORS**: Restricted to allowed origins
- **Data Sanitization**: All inputs sanitized and validated
- **Error Handling**: No sensitive information exposed in errors

## Deployment

### Option 1: Vercel (Recommended)

Your project is pre-configured for Vercel deployment:

1. **Connect to Vercel:**
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect the `vercel.json` configuration

2. **Set Environment Variables in Vercel:**
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   CORS_ORIGIN=https://your-project.vercel.app
   ```

3. **Deploy:**
   - Push to GitHub main branch
   - Vercel auto-deploys
   - Your site will be live instantly

See `VERCEL-DEPLOYMENT.md` for detailed instructions.

### Option 2: Traditional Hosting

For traditional hosting with Node.js support:

1. Upload files to your hosting provider
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start server: `npm start`

### Option 3: Static Site

For static hosting (Netlify, GitHub Pages):

- Remove `server.js` and backend dependencies
- Use form services like Formspree or Netlify Forms
- Update contact form to use external service

## File Structure

```
├── index.html              # Homepage
├── listings.html           # All property listings
├── testimonials.html       # Client reviews
├── blog.html              # Blog listing
├── blog-post1-3.html      # Individual blog posts
├── neighborhood-pages/    # Brickell, South Beach, etc.
├── property-pages/        # Off-market, new developments, etc.
├── styles.css             # All styling
├── script.js              # Frontend JavaScript
├── server.js              # Backend server
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (gitignored)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server (same as start for now)

### Testing the Contact Form

You can test the contact form using curl:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct
- Check spam folder
- Ensure 2FA is enabled on Gmail account
- Check server logs for error messages

### CORS Errors
- Verify `CORS_ORIGIN` matches your frontend URL
- For development, use `http://localhost:3000`

### Rate Limiting
- Wait 15 minutes between form submissions
- Check server logs for rate limit violations

## License

ISC License - see LICENSE.md for details.

## Contact

Numy Luxury Real Estate
- Email: numyhomes@gmail.com
- Phone: (754) 268-0425
- Website: https://numyhomes.com
├── listings.html       # All properties page
├── testimonials.html   # All reviews page
├── blog.html          # All articles page
├── blog-post1.html    # Blog post template
├── styles.css         # All styles
├── script.js          # All JavaScript
├── server.js          # Backend server (optional)
├── package.json       # Dependencies
└── README.md          # This file
```

## Customization

- **Properties**: Edit the listing cards in `listings.html` and `index.html`
- **Testimonials**: Add more reviews in `testimonials.html`
- **Blog Posts**: Create new `blog-postX.html` files and link them
- **Styling**: Modify `styles.css` for design changes
- **Email**: Update contact information in all HTML files

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript
- Express.js (backend)
- Nodemailer (email)

## License

© 2026 Numy Luxury Real Estate. All rights reserved.
