# 🚀 Quick Start Guide - Care Link Vanilla

## Instant Setup (30 seconds)

### Step 1: Navigate to the Project
```bash
cd "vanilla-carelink"
```

### Step 2: Start the Server

**Option A: Use the start script (easiest)**
```bash
./start-server.sh
```

**Option B: Manual command**
```bash
# Python 3 (most common)
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or PHP
php -S localhost:8000

# Or Node.js
npx http-server -p 8000
```

### Step 3: Open in Browser
Navigate to: **http://localhost:8000**

That's it! 🎉

---

## 📱 What You'll See

### Available Pages
- **Home (/)**: Full homepage with hero, stats, features, testimonials
- **/diagnostics.html**: AI-powered symptom checker with chat
- **/mental-health.html**: Mental health support with chat
- **/medicines.html**: Online pharmacy directory
- **/awareness.html**: Health education resources
- **/about.html**: Company information
- **/login.html**: Sign-in page (demo mode)
- **/404.html**: Custom error page

### Test the Chat Feature
1. Go to Diagnostics or Mental Health page
2. Type a message like "I have a headache"
3. The AI responds with helpful guidance
4. **Note**: Currently in demo mode with pre-programmed responses

---

## 🎨 Customize Your Site

### Change Colors
Edit `css/styles.css` and modify the CSS variables:

```css
:root {
  --primary: 200 98% 39%;     /* Change this for your brand color */
  --secondary: 215 24% 26%;   /* Secondary color */
  --accent: 210 40% 98%;      /* Background accent */
}
```

### Add Your Logo
Replace the heart icon in `js/navigation.js` (line 11) with your logo.

### Update Content
All content is in the HTML files - just open and edit!

---

## 🌐 Deploy to Production

### Netlify (Free, Recommended)
1. Drag and drop the `vanilla-carelink` folder to https://app.netlify.com/drop
2. Done! Get a live URL instantly

### Vercel (Free)
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages (Free)
1. Push to GitHub
2. Enable Pages in repository settings
3. Access at `https://username.github.io/repo/`

---

## 🔧 Connect Real AI Chat

To use actual AI (requires Supabase account):

1. Create free Supabase project: https://supabase.com
2. Deploy the chat Edge Function (from original React project)
3. Edit `js/chat.js` lines 8-9:
   ```javascript
   this.supabaseUrl = 'https://bdkzyukynxxccvdkfimg.supabase.co';
   this.supabaseKey = 'seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p5dWt5bnh4Y2N2ZGtmaW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzg2ODQsImV4cCI6MjA3OTY1NDY4NH0.KEuGyt5IinI5Kgh76CEfOAI2PgIj_7X5jN8M-uE7Oac';
   ```
4. Uncomment lines 95-111 (real API code)
5. Comment out lines 88-90 (mock responses)

---

## 📊 Performance Tips

### Minify for Production
```bash
# Install tools
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o css/styles.min.css css/styles.css

# Minify JavaScript
uglifyjs js/*.js -o js/bundle.min.js

# Update HTML files to reference minified versions
```

### Optimize Images
```bash
# Use ImageOptim, TinyPNG, or:
npm install -g imagemin-cli
imagemin images/* --out-dir=images/optimized
```

---

## ❓ Common Issues

**Q: Images not loading?**
A: Check that image files are in `images/` folder. Use placeholders if missing.

**Q: Navigation broken?**
A: Use a local server (not file:// protocol). Run `./start-server.sh`

**Q: Chat not working?**
A: Check browser console for errors. Demo mode should work without setup.

**Q: Styles look broken?**
A: Clear cache (Ctrl+Shift+R) and verify `css/styles.css` loads.

---

## 📞 Need Help?

1. Check the full README.md
2. Open browser console (F12) for errors
3. Verify all files are in correct folders
4. Test with the start-server script

---

**Ready to build? Start editing the HTML files and see changes instantly!**

No compilation. No build step. Just pure web development. 🚀
