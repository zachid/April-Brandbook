# Backend Integration Plan

## Current State
- Client-side only (localStorage)
- No user accounts
- No cloud sync
- No sharing

## Target State (like Sylvia)
- User authentication (email/magic link)
- Cloud storage (Supabase PostgreSQL)
- Real-time sync
- Share brandbooks via link
- Project history/versions

## Architecture

### Database Schema (Supabase)

```sql
-- Users (via Supabase Auth)
-- Auto-created by Supabase auth

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  data JSONB NOT NULL, -- entire BRAND object
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Collaborators (for multi-user)
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor', -- 'viewer', 'editor', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Version history (optional)
CREATE TABLE project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

### API Endpoints (via Supabase)

```
POST   /auth/signup              → Create account
POST   /auth/login               → Login (magic link or password)
POST   /auth/logout              → Logout

GET    /projects                 → List user's projects
POST   /projects                 → Create project
GET    /projects/:id             → Get single project
PUT    /projects/:id             → Update project
DELETE /projects/:id             → Delete project
GET    /projects/:slug           → Get public project by slug

POST   /projects/:id/collaborators    → Add collaborator
GET    /projects/:id/collaborators    → List collaborators
DELETE /projects/:id/collaborators/:uid → Remove collaborator

GET    /projects/:id/versions    → Version history
POST   /projects/:id/versions    → Save version
```

### Frontend Changes

1. **Login page** (like Sylvia 01-login.js)
   - Email input
   - Magic link or password auth
   - Redirect to dashboard on success

2. **Dashboard** (update index.html)
   - Show logged-in user's projects
   - Cloud sync indicator
   - Share button (copy link)

3. **Brandbook view** (update brandbook.html)
   - Load from Supabase instead of localStorage
   - Real-time sync on save
   - Share/collaborate button

4. **Settings** (new)
   - Manage collaborators
   - Make public/private
   - Version history

## Migration Path

Phase 1: Set up Supabase + auth
Phase 2: Add project CRUD operations
Phase 3: Add real-time sync
Phase 4: Add sharing + collaboration
Phase 5: Add version history

## Files to Create/Modify

New:
- `js/supabase.js` - Supabase client initialization
- `js/auth.js` - Authentication logic
- `js/api.js` - Project CRUD operations
- `login.html` - Login/signup page
- `settings.html` - Project settings

Modify:
- `index.html` - Add user info, update project loading
- `brandbook.html` - Load from cloud, add share button
- `js/app.js` - Switch from localStorage to API calls
