# How to Run the Bloom Project

This is a simple static website that displays the content for the Bloom women's health platform. Here are several ways to run it:

## Method 1: Open Directly in Browser (Simplest)

1. Navigate to the project folder: `A:\project2.0`
2. Double-click on `index.html`
3. The website will open in your default web browser

**That's it!** No installation or setup needed.

---

## Method 2: Using Python's Built-in Server (Recommended for Development)

If you have Python installed:

### Windows (PowerShell):
```powershell
cd A:\project2.0
python -m http.server 8000
```

### Then open your browser and go to:
```
http://localhost:8000
```

### To stop the server:
Press `Ctrl + C` in the terminal

---

## Method 3: Using Node.js (if you have it installed)

If you have Node.js installed, you can use `npx` to run a simple server:

```powershell
cd A:\project2.0
npx http-server -p 8000
```

Then open: `http://localhost:8000`

---

## Method 4: Using VS Code Live Server Extension

If you're using Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The website will open automatically with live reload

---

## Method 5: Using Any Web Server

You can use any web server software (Apache, Nginx, etc.) and point it to the `A:\project2.0` directory.

---

## File Structure

```
project2.0/
├── index.html              # Main landing page
├── login.html              # Login page
├── signup.html             # Sign up page
├── calendar.html           # Period tracking calendar page
├── pregnancy.html          # Pregnancy tracking page with daily updates
├── profile.html             # User profile page with personal details
├── styles.css              # Main website styling
├── login-styles.css        # Login/Signup page styling
├── calendar-styles.css     # Calendar page styling
├── pregnancy-styles.css    # Pregnancy page styling
├── profile-styles.css      # Profile page styling
├── auth.js                 # Authentication system JavaScript
├── login.js                # Login page JavaScript
├── calendar.js             # Calendar functionality JavaScript
├── pregnancy.js            # Pregnancy tracking JavaScript
├── profile.js              # Profile page JavaScript
├── index-auth.js           # Index page authentication check
├── content.md              # Complete content (reference)
├── hero-content.md         # Hero section content
├── features-content.md     # Features content
├── trust-safety-content.md # Trust & safety content
├── cta-buttons.md          # CTA button options
├── taglines-short-copy.md  # Short copy for marketing
├── README.md               # Project overview
└── HOW-TO-RUN.md           # This file
```

---

## Troubleshooting

### Images or styles not loading?
- Make sure `styles.css` is in the same folder as `index.html`
- If using a web server, ensure it's serving from the correct directory

### Want to edit the content?
- Edit `index.html` to change the website content
- Edit `styles.css` to change colors, fonts, and layout
- The `.md` files are reference content files

### Need to customize colors?
Edit `styles.css` and look for the `:root` section at the top to change the color palette.

---

## Next Steps

- Customize the design by editing `styles.css`
- Add more content by editing `index.html`
- Add images by creating an `images/` folder and referencing them in the HTML
- Deploy to a hosting service (GitHub Pages, Netlify, Vercel, etc.)

---

## Quick Start (Fastest Method)

**Just double-click `index.html`** - it will open in your browser immediately!

No installation, no setup, no dependencies needed. 🎉

## Pages Available

- **`index.html`** - Main landing page with all features
- **`login.html`** - Beautiful login page with form validation
- **`signup.html`** - Sign up page for new users
- **`calendar.html`** - Period tracking calendar with predictions and tips
- **`pregnancy.html`** - Pregnancy tracker with daily updates, tips, and week-by-week journey
- **`profile.html`** - User profile page to manage personal information

## User Flow & Authentication

**Important:** The website now requires login to access protected pages!

1. Start at `index.html` (landing page) - No login required
2. Click "Start Your Journey" or "Join Now Free" → Goes to `login.html`
3. After login → Redirects to `calendar.html` (period tracker)
4. Navigate to `pregnancy.html` or `profile.html` from navigation
5. **All protected pages (calendar, pregnancy, profile) require authentication**
   - If not logged in, you'll be automatically redirected to login
   - After login, you'll be redirected back to the page you were trying to access

## Authentication System

- **Login Required:** Calendar, Pregnancy, and Profile pages require authentication
- **Session Duration:** 
  - Default: 24 hours
  - With "Remember Me": 30 days
- **Profile Data:** Stored locally in browser (name, mobile, DOB, address, etc.)
- **Logout:** Click the user icon in the header to logout

All pages are linked together with authentication protection!
