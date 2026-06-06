# Brandbook Generator — Phase 1 Setup Guide

## Backend Authentication Setup (Supabase)

This guide walks you through setting up Supabase authentication for the Brandbook Generator. Phase 1 adds login/signup and prepares for cloud project storage.

### Step 1: Create a Supabase Project

1. Go to **https://supabase.com**
2. Sign up or log in
3. Click **New Project**
4. Fill in:
   - **Project name:** `brandbook-generator`
   - **Database password:** (generate a strong one)
   - **Region:** Choose closest to you
5. Click **Create new project** and wait for it to initialize (2-3 minutes)

### Step 2: Get Your API Keys

Once the project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon Key** (public key, safe to share)
3. Save them somewhere safe — you'll need them in Step 5

### Step 3: Configure Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (default)
3. Go to **Email Templates**
4. For "Confirm signup" template, the URL should point to your app:
   - **Local dev:** `http://localhost:8080/`
   - **Vercel:** `https://your-app.vercel.app/`

### Step 4: Create Database Schema (Optional for Phase 1)

Phase 1 focuses on auth only. Projects still store in localStorage. Phase 2 will add cloud storage.

To prepare for Phase 2, you can optionally run this SQL now:

Go to **SQL Editor** and run:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Create index for faster queries
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_slug_idx ON projects(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
CREATE POLICY "users_can_view_own_projects" ON projects
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Users can insert their own projects
CREATE POLICY "users_can_create_projects" ON projects
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own projects
CREATE POLICY "users_can_update_own_projects" ON projects
  FOR UPDATE USING (user_id = auth.uid());

-- Policy: Users can delete their own projects
CREATE POLICY "users_can_delete_own_projects" ON projects
  FOR DELETE USING (user_id = auth.uid());
```

### Step 5: Configure Your App

#### Option A: Local Development

1. Open `index.html` in a text editor
2. Before the closing `</body>`, find the auth check script
3. Add this to `js/supabase.js` before the `initSupabase()` call:

```javascript
window.SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  key: 'YOUR_ANON_KEY',
};
```

**Or** set as sessionStorage:

```javascript
sessionStorage.setItem('sb_url', 'https://YOUR_PROJECT_ID.supabase.co');
sessionStorage.setItem('sb_key', 'YOUR_ANON_KEY');
```

#### Option B: Vercel Deployment

1. Go to **Vercel** → Your project → **Settings** → **Environment Variables**
2. Add:
   - `SUPABASE_URL` = Your Project URL
   - `SUPABASE_ANON_KEY` = Your Anon Key
3. Redeploy

### Step 6: Test Authentication

#### Test Locally

1. Start your local server:
   ```bash
   python3 -m http.server 8080 --bind 127.0.0.1
   ```

2. Open **http://localhost:8080**
   - Should redirect to `login.html`
   - Sign up with an email + password
   - Check your email for verification link (if email confirmation is required)
   - Click link to confirm
   - You should now see the dashboard

#### Test Magic Links

1. On the login page, click **Magic Link**
2. Enter your email
3. Check your email for a magic link
4. Click it — you should be logged in automatically

### Step 7: User Experience

After authentication is set up:

- **New users:** Sign up → Verify email → Redirected to dashboard
- **Returning users:** Sign in → Redirected to dashboard
- **Dashboard:** Shows logged-in user's email in top-right, "Sign Out" button
- **Projects:** Still stored in localStorage (Phase 2 migrates to cloud)

### Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Supabase not initialized"** | Check `sb_url` and `sb_key` are set correctly in sessionStorage or `window.SUPABASE_CONFIG` |
| **"Magic link not received"** | Check spam folder; verify email is in "Allowed email addresses" in Supabase Auth settings |
| **"Redirect loop to login"** | Check browser console for errors; ensure auth session is persisting in localStorage |
| **White screen on brandbook.html** | Check console for errors; ensure user is authenticated before accessing |

### Next Phase (Phase 2)

Once Phase 1 is stable:
1. Create `js/api.js` to switch from localStorage to Supabase API
2. Update `index.html` dashboard to load projects from cloud
3. Update `brandbook.html` to save/load from cloud instead of localStorage
4. Add real-time sync with Supabase subscriptions

---

**Questions?** Check `CLAUDE.md` for architecture details or see `API_PLAN.md` for the full backend roadmap.
