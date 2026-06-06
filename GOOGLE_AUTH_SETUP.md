# Google OAuth Setup — Brandbook Generator

Quick setup for Google Sign-In authentication via Supabase (same as Sylvia & Mika).

## Step 1: Enable Google in Supabase

1. Go to your Supabase dashboard: **https://supabase.com**
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list
4. Click on **Google** to expand it
5. Toggle **Enabled** to ON (switch should be green)

You'll see two fields:
- **Client ID** (empty)
- **Client Secret** (empty)

These need to be filled in. Continue to Step 2.

---

## Step 2: Get Google OAuth Credentials

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **+ Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Under **Authorized redirect URIs**, add:
   ```
   https://crqjjjtpiocqddjrlquw.supabase.co/auth/v1/callback
   ```
   (Replace `crqjjjtpiocqddjrlquw` with your actual Supabase project ID)

7. Click **Create**
8. Copy the **Client ID** and **Client Secret** that appear

---

## Step 3: Add Credentials to Supabase

1. Go back to your Supabase dashboard
2. **Authentication** → **Providers** → **Google**
3. Paste your Google credentials:
   - **Client ID** → paste here
   - **Client Secret** → paste here
4. Click **Save**

---

## Step 4: Test It

1. Start your local server:
   ```bash
   python3 -m http.server 8080 --bind 127.0.0.1
   ```

2. Open **http://localhost:8080/login.html**

3. Click **"Sign in with Google"**

4. You'll be redirected to Google login, then back to your dashboard

**Done!** 🎉

---

## For Vercel Deployment

When you deploy to Vercel, add this redirect URI to Google Cloud Console:
```
https://your-app.vercel.app/auth/v1/callback
```

(Replace `your-app` with your actual Vercel domain)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Invalid OAuth provider"** | Make sure Google is Enabled in Supabase Providers |
| **"Redirect URL mismatch"** | Check the redirect URI in Google Cloud matches Supabase project ID |
| **Blank page after clicking "Sign in"** | Check browser console for errors; make sure Supabase is initialized |
| **Works locally but not on Vercel** | Add Vercel redirect URI to Google Cloud Console |

---

**Questions?** See `SETUP.md` or `CLAUDE.md` for more details.
