# 🩺 Care Link
> **Your Trusted Healthcare Companion, Powered by AI and Compassion.**
**Care Link** is a comprehensive, client-centric healthcare web application designed to connect users with vital health resources. The platform combines cutting-edge client-side AI (via Google Gemini) for health diagnostics and mental health support, database-backed tracking and session storage (via Supabase), profile customisation, a curated medicine marketplace, and an administrative control panel for data monitoring.
---
## 🚀 Key Features
*   **🎙️ AI-Powered Diagnostics**
    *   Interactive, client-side symptom checker powered by **Google Gemini API** (`gemini-2.5-flash` or `gemini-1.5-flash`).
    *   Detailed triage guidance prompting users to specify symptom duration, severity, and location.
    *   Intelligent, context-aware suggestions for specialist doctors and locations within India based on symptom profiles.
*   **🧠 Confidential Mental Health Support**
    *   Dedicated AI mental health companion providing 24/7 non-judgmental support, coping strategies, and mindfulness guidance.
    *   Integrated crisis triggers display high-visibility alerts with direct contacts for suicide prevention lifelines and local emergency services (112, 1800-233-3330).
*   **💊 Medicine Marketplace**
    *   One-click redirection to certified and trusted online pharmacies (Apollo Pharmacy, Walgreens, Tata 1mg, PharmEasy).
    *   Curated safety checklists, drug-interaction warnings, and dosage guidance.
*   **🛡️ Secure User Authentication**
    *   Robust registration and login flows powered by **Supabase Auth**.
    *   Support for standard email/password registration as well as Google and GitHub OAuth providers.
*   **👤 Comprehensive Profiles**
    *   Custom demographic details (date of birth, gender).
    *   Voluntary medical record indexing (blood group, active allergies, chronic conditions).
    *   Emergency contacts saved securely in the backend.
*   **📊 Administrative Dashboard**
    *   Real-time system diagnostics and analytics tracking (total users, active sessions, user reviews).
    *   Tabbed administration portal to manage user accounts, inspect stored chat sessions, review feedback, and alter feature flags.
---
## 🛠️ Technology Stack
*   **Frontend**: 
    *   **HTML5**: Semantic tags, accessible forms, and dynamic viewport layouts.
    *   **CSS3 (Vanilla)**: Features modular typography (Inter/Roboto), flexible CSS grid & flexbox structures, customized CSS variables for dark-mode mapping, and fluid keyframe animations (`animate-fade-in`, `animate-scale-in`, `animate-float`).
    *   **Modular ES6 JavaScript**: Event-driven component logic, stateful client-side routing detection, and custom icon rendering.
*   **Backend & DB**:
    *   **Supabase (BaaS)**: Managed PostgreSQL database, authentication triggers, dynamic row-level security (RLS), and private storage buckets.
*   **AI Integration**:
    *   **Google Gemini SDK**: Live client-side connection via REST API requests supporting system prompts, temperature controls, and parameter limits.
---
## 📂 Project Structure
```bash
care-link-wd/
├── index.html            # Main home page (landing, hero section, statistics, features)
├── about.html            # Informational "About Us" page detailing the mission
├── diagnostics.html      # AI symptom checker chat page
├── mental-health.html    # AI mental health companion chat page
├── medicines.html        # Pharmacy marketplace and safety rules
├── profile.html          # Profile settings, medical details, and emergency contacts
├── login.html            # Sign-in portal (with credentials & OAuth buttons)
├── register.html         # Sign-up portal (with validation & fields)
├── admin.html            # Portal administrator dashboard for data auditing
├── 404.html              # Custom page not found error template
├── css/
│   └── styles.css        # Central stylesheet containing design tokens, classes, and animations
├── js/
│   ├── config.js         # API and model configuration variables (contains Gemini Keys)
│   ├── icons.js          # SVG Icon component (helper yielding Lucide-style vectors)
│   ├── navigation.js     # Responsive navbar/mobile menu generator with Auth state synchronization
│   ├── home.js           # Populates elements and landing page statistics
│   ├── medicines.js      # Populates pharmacies, benefits, and safety warnings
│   ├── chat.js           # Core chat engine managing Gemini streams, mock state, and history
│   └── supabase-client.js# Supabase Client library adapter wrapping Auth & SQL calls
├── supabase/
│   ├── README.md         # Database environment setup documentation
│   ├── schema.sql        # Database tables, policies, triggers, and functions
│   └── seed.sql          # Sample SQL data queries for staging
└── test/
    ├── oauth-test.html   # Sandbox testing page for Google/GitHub OAuth integrations
    ├── test-api.html     # Diagnostics checklist for local Gemini API connections
    └── test-supabase.html# Integration check for Supabase DB client functions
```
---
## 🗄️ Database Schema & Security
The backend is built around a relational Postgres schema running on Supabase with the following primary tables:
1.  **`public.profiles`**: Extends standard credentials from `auth.users`. It stores full name, birthday, role (`user`/`admin`/`moderator`), blood group, allergies (array), chronic conditions, and emergency contact details.
2.  **`public.chat_sessions`**: Tracks conversations with metadata like the type of chat (`diagnostic` or `mental-health`), status (`is_active`), summary, and tags.
3.  **`public.chat_messages`**: Stores individual records per message, logging the sender (`user`/`assistant`/`system`), content, model used, and token count.
4.  **`public.medicine_reminders`**: Manages user-configured medicine schedules (dosages, start/end dates, repeat flags).
5.  **`public.health_records`**: Metadata repository pointing to files stored inside a private Supabase Storage bucket (`health-records`).
### Row Level Security (RLS)
Security is implemented directly on the database level:
*   **Authentication Check**: Users are only allowed to read/write their own profiles (`auth.uid() = id`).
*   **Chat Isolation**: Row-level policies restrict users to accessing session files and messages where `user_id` matches their verified user credentials.
*   **Storage Privacy**: Files in `health-records` inherit RLS settings allowing secure, authenticated access.
### Database Triggers & Stored Procedures
*   **Auto-profile Creation**: An database trigger automatically replicates basic parameters (ID, email, name) into `public.profiles` upon successful Auth sign-up.
*   **`get_chat_history()`**: Custom stored procedure executing paginated queries of active sessions along with message counts.
*   **`get_conversation()`**: Secure function returning the sequential history of messages for a verified session.
---
## ⚙️ Local Setup & Installation
Follow these steps to run Care Link locally on your machine:
### Prerequisite Checklist
*   A modern web browser (Chrome, Edge, Firefox, or Safari).
*   A **Google AI Studio** account to obtain a Gemini API key.
*   A **Supabase** project (free tier is fully compatible).
*   A local HTTP web server (e.g., `live-server` for VS Code, Node's `http-server`, or Python's built-in module).
### 1. Clone the Codebase
```bash
git clone https://github.com/dev-Pratham07/Care-Link-WD.git
cd Care-Link-WD
```
### 2. Configure Google Gemini API Key
Open [js/config.js](file:///home/pratty/.gemini/antigravity/scratch/care-link-wd/js/config.js) and replace the placeholder API key with your key from Google AI Studio:
```javascript
const CONFIG = {
  gemini: {
    apiKey: 'YOUR_GEMINI_API_KEY_HERE', // Add your key here
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    maxTokens: 1000
  },
  features: {
    useMockAPI: false,
    enableRetry: true,
    maxRetries: 3
  }
};
```
### 3. Initialize Supabase Database
1.  Log in to your **Supabase Dashboard** and create a new project.
2.  Navigate to the **SQL Editor** tab.
3.  Click **New Query**, copy the contents of [supabase/schema.sql](file:///home/pratty/.gemini/antigravity/scratch/care-link-wd/supabase/schema.sql), and click **Run**.
4.  If uploading health documents is needed, go to the **Storage** section, create a private bucket named `health-records`, and ensure RLS policies are applied.
### 5. Link Frontend to Supabase Client
Open [js/supabase-client.js](file:///home/pratty/.gemini/antigravity/scratch/care-link-wd/js/supabase-client.js) and update the `SUPABASE_CONFIG` object with your project credentials:
```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project-ref.supabase.co',
  anonKey: 'your-sb-anon-public-key-starting-with-eyJ...'
};
```
*(You can find these settings in your Supabase dashboard under **Project Settings** > **API**)*
### 6. Launch the Application
Start your local server from the root of the project folder:
**Using Python:**
```bash
python3 -m http.server 8000
```
**Using Node.js:**
```bash
npx http-server -p 8000
```
Open your browser and navigate to `http://localhost:8000` to interact with Care Link.
---
## 🔒 Security Best Practices
1.  **Protect API Keys**: The client-side execution in this application is designed for rapid prototyping. For public production deployments, **never expose your Gemini API keys or Supabase Service Role keys directly in the frontend**. Implement a proxy backend (such as Next.js API Routes, Express.js, or Supabase Edge Functions) to handle API transactions securely.
2.  **Add `config.js` to Gitignore**: Ensure that your local keys are not committed back to public repositories:
    ```bash
    echo "js/config.js" >> .gitignore
    ```
3.  **Audit RLS Policies**: Regularly review row-level security constraints in the Supabase Dashboard to prevent privilege escalation.
---
## ⚠️ Medical Disclaimer
> **IMPORTANT**: Care Link is an AI-powered educational and assistant platform. All information provided by the AI Diagnostics tool and the Mental Health Support chat is for educational/informational purposes only. It is **not** a replacement for professional medical advice, diagnosis, treatment, or psychotherapy. If you are experiencing a medical or mental health emergency, please immediately contact emergency services (112) or seek attention at the nearest medical facility.
