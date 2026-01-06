# Deployment Guide - Care Link

This guide will help you deploy Care Link to various hosting platforms.

---

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Recommended - FREE)

**Best for**: Simple, free hosting directly from your GitHub repository

#### Steps:

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository: https://github.com/dev-Pratham07/Care-Link-WD
   - Click **Settings** tab
   - Scroll to **Pages** section (left sidebar)
   - Under **Source**, select `main` branch
   - Select `/` (root) folder
   - Click **Save**

3. **Wait 2-3 minutes** for deployment

4. **Access your site**
   ```
   https://dev-pratham07.github.io/Care-Link-WD/
   ```

5. **Update Supabase OAuth Settings**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Update **Site URL** to: `https://dev-pratham07.github.io/Care-Link-WD/index.html`
   - Add redirect URLs:
     ```
     https://dev-pratham07.github.io/Care-Link-WD/index.html
     https://dev-pratham07.github.io/Care-Link-WD/
     ```

6. **Update OAuth Apps**
   - **Google OAuth**: Add `https://dev-pratham07.github.io` to authorized origins
   - **GitHub OAuth**: Update homepage URL to `https://dev-pratham07.github.io/Care-Link-WD/`

---

### Option 2: Vercel (FREE - Best for Modern Projects)

**Best for**: Fast deployment with automatic HTTPS and custom domains

#### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web Interface** (easier)
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click **Add New** > **Project**
   - Import `Care-Link-WD` repository
   - Configure:
     - Framework Preset: **Other**
     - Root Directory: `./`
     - Build Command: (leave empty)
     - Output Directory: `./`
   - Click **Deploy**

3. **OR Deploy via CLI**
   ```bash
   cd /home/pratty/Desktop/Programming\ Everything/HTML/Projects/vanilla-carelink
   vercel
   ```
   - Follow prompts
   - Select project settings
   - Deploy

4. **Your site will be live at**:
   ```
   https://care-link-wd.vercel.app
   ```
   (or custom domain)

5. **Update Supabase & OAuth** settings with your new Vercel URL

---

### Option 3: Netlify (FREE - Drag & Drop)

**Best for**: Easiest deployment with drag-and-drop

#### Steps:

1. **Via Web Interface**
   - Go to https://netlify.com
   - Sign in
   - Click **Add new site** > **Import an existing project**
   - Choose **GitHub**
   - Select `Care-Link-WD` repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `./`
   - Click **Deploy**

2. **OR Drag & Drop Method**
   - Zip your project folder (excluding `.git`, `node_modules`)
   - Go to https://app.netlify.com/drop
   - Drag and drop your zip file
   - Instant deployment!

3. **Your site will be at**:
   ```
   https://care-link-wd.netlify.app
   ```
   (can customize subdomain)

4. **Configure Custom Domain** (optional)
   - Go to Site settings > Domain management
   - Add custom domain

5. **Update Supabase & OAuth** with Netlify URL

---

### Option 4: Firebase Hosting (FREE)

**Best for**: Google ecosystem integration

#### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```bash
   cd /home/pratty/Desktop/Programming\ Everything/HTML/Projects/vanilla-carelink
   firebase init hosting
   ```
   - Select **Use an existing project** or create new
   - Public directory: `.` (current directory)
   - Single-page app: **No**
   - Set up automatic builds: **No**

4. **Deploy**
   ```bash
   firebase deploy
   ```

5. **Your site will be at**:
   ```
   https://your-project-id.web.app
   ```

6. **Update Supabase & OAuth** settings

---

## 🔧 Pre-Deployment Checklist

Before deploying to any platform, ensure:

- [ ] **Supabase Configuration**
  - ✅ `js/supabase-client.js` has correct Supabase URL and anon key
  - ✅ Database schema is deployed (`supabase/schema.sql` run in SQL Editor)
  - ✅ RLS policies are enabled

- [ ] **API Keys**
  - ✅ Google Gemini API key is set in `js/config.js`
  - ✅ API key is valid and has quota

- [ ] **OAuth Configuration** (if using OAuth)
  - ✅ Google OAuth credentials created
  - ✅ GitHub OAuth app created
  - ✅ Callback URLs configured in both providers
  - ✅ Providers enabled in Supabase dashboard

- [ ] **Test Locally**
  - ✅ `python3 -m http.server 8080` works
  - ✅ Can register/login
  - ✅ Chat features work
  - ✅ Profile updates work

---

## 🌐 Custom Domain Setup

### For GitHub Pages:

1. **Buy a domain** (Namecheap, Google Domains, etc.)

2. **Add CNAME record** in your domain DNS:
   ```
   Type: CNAME
   Host: www
   Value: dev-pratham07.github.io
   ```

3. **Add A records**:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

4. **Configure in GitHub**:
   - Repository Settings > Pages
   - Custom domain: `www.yourdomain.com`
   - Save
   - Wait for DNS propagation (up to 24 hours)

### For Vercel/Netlify:

1. **Buy domain**

2. **Add domain in platform**:
   - Vercel: Project Settings > Domains
   - Netlify: Site Settings > Domain Management

3. **Update DNS** as instructed by platform

4. **Wait for SSL certificate** (automatic, takes a few minutes)

---

## 🔒 Post-Deployment Security

### Update All OAuth Redirect URLs

After deployment, update these in:

1. **Google Cloud Console**
   - Add production URL to Authorized JavaScript origins
   - Add production callback to Authorized redirect URIs

2. **GitHub OAuth App**
   - Update Homepage URL
   - Update Authorization callback URL

3. **Supabase Dashboard**
   - Authentication > URL Configuration
   - Update Site URL
   - Add production URLs to Redirect URLs

### Environment Variables

For sensitive data, consider:

1. **Using Supabase Edge Functions** for API calls
2. **Backend proxy** for Gemini API calls
3. **Rate limiting** on your endpoints

---

## 📊 Recommended: GitHub Pages + Custom Domain

**Why?**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Easy updates (just push to GitHub)
- ✅ GitHub CDN for fast global delivery
- ✅ No build step needed
- ✅ Perfect for static sites with client-side JS

**Setup Time**: ~5 minutes

---

## 🚀 Deployment Commands Reference

### Deploy to GitHub Pages:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
# Enable in GitHub repo settings
```

### Deploy to Vercel:
```bash
vercel --prod
```

### Deploy to Netlify:
```bash
netlify deploy --prod
```

### Deploy to Firebase:
```bash
firebase deploy --only hosting
```

---

## 🔄 Continuous Deployment

### GitHub Pages
- Automatically deploys on every push to `main`

### Vercel
- Auto-deploys on every push to connected branch
- Preview deployments for pull requests

### Netlify
- Auto-deploys on Git push
- Branch deployments available
- Deploy previews for PRs

---

## 🐛 Troubleshooting

### Site is live but shows errors

1. **Check browser console** for errors
2. **Verify Supabase URL** in `js/supabase-client.js`
3. **Check API keys** are set correctly
4. **CORS issues?** Update Supabase allowed origins

### OAuth not working

1. **Verify callback URLs** match exactly
2. **Check Site URL** in Supabase dashboard
3. **Clear browser cache** and cookies
4. **Test in incognito mode**

### 404 errors on pages

1. **GitHub Pages**: Use relative paths, not absolute
2. **Check file names** are exact (case-sensitive)
3. **Verify all files** are in repository

### Slow loading

1. **Enable caching** headers
2. **Compress images** in `images/` folder
3. **Use CDN** for libraries (Supabase is already on CDN)
4. **Minify CSS/JS** (optional)

---

## 📈 Post-Deployment Monitoring

### Analytics (Optional)

Add Google Analytics:
```html
<!-- Add to all HTML files before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Uptime Monitoring

Use free services:
- UptimeRobot: https://uptimerobot.com
- StatusCake: https://www.statuscake.com
- Pingdom: https://www.pingdom.com

---

## 🎉 You're Ready!

Choose your platform and follow the steps above. **GitHub Pages** is recommended for simplicity and zero cost!

**Need help?** Check the platform's documentation:
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Docs](https://firebase.google.com/docs/hosting)
