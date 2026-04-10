# Numy Luxury Real Estate Website

A modern, responsive website for Miami luxury real estate services.

## Features

- **Multi-page website** with separate pages for listings, testimonials, and blog
- **Contact form** with backend email functionality
- **Responsive design** optimized for all devices
- **Modern UI** with smooth animations and interactions

## Pages

- `index.html` - Homepage with hero, listings preview, about, testimonials, blog, contact
- `listings.html` - All property listings (47 properties)
- `testimonials.html` - All client reviews
- `blog.html` - All articles
- `blog-post1.html` - Individual blog post (template for more posts)

## Setup Instructions

### Option 1: Static Site (Recommended for Production)

1. Upload all files to your web hosting service (Netlify, Vercel, etc.)
2. For the contact form, use a service like:
   - **Formspree**: Replace the form action with your Formspree endpoint
   - **Netlify Forms**: Add `netlify` attribute to the form
   - **EmailJS**: Use client-side email service

### Option 2: With Backend (Requires Node.js)

1. Install Node.js (version 14 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure email settings in `server.js`:
   - Replace `'numyhomes@gmail.com'` with your email
   - Get an app password from Gmail (not regular password)
   - Update the transporter auth
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in your browser

## File Structure

```
├── index.html          # Homepage
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
