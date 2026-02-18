# API Keys & Tokens — Setup Guide

You need 2 things: a **GitHub token** and a **Vercel token**.
Everything else (GitHub org, template repo) is a one-time manual setup.

---

## 1. GitHub Personal Access Token

### What it does
Lets our app create repos, push files, and manage the dealer GitHub repos automatically.

### Steps

1. Go to **https://github.com/settings/tokens**
2. Click **"Generate new token"** → choose **"Generate new token (classic)"**
3. Give it a name: `dealer-site-pro-deploy`
4. Set expiration: **No expiration** (or 1 year — your choice)
5. Select these scopes:
   - [x] `repo` — full control of private repositories *(required)*
   - [x] `delete_repo` — needed to clean up dealer repos *(optional but recommended)*
   - [x] `read:org` — needed if using a GitHub Organisation *(required if using org)*
   - [x] `workflow` — needed if template repo uses GitHub Actions *(optional)*
6. Click **"Generate token"**
7. Copy the token immediately — it won't be shown again

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Tip:** Store it in 1Password / Bitwarden immediately after copying.

---

## 2. GitHub Organisation (or use your personal account)

### Option A — Use your personal GitHub account (easiest to start)
- No setup needed
- Set `GITHUB_ORG` to your GitHub **username** (e.g. `anilkumarkolukulapalli`)
- All dealer repos will appear in your personal account

```env
GITHUB_ORG=your-github-username
```

### Option B — Create a GitHub Organisation (recommended for production)
1. Go to **https://github.com/organizations/new**
2. Choose **Free plan** (sufficient for unlimited private repos)
3. Name it something like `dealersitepro`
4. Finish setup (skip inviting members for now)
5. Use that org name as `GITHUB_ORG`

```env
GITHUB_ORG=dealersitepro
```

---

## 3. GitHub Template Repo

This is the base Next.js site that every dealer repo is cloned from.

### Steps

1. Go to your GitHub org/account
2. Create a new repo named **`dealer-site-template`**
   - Set it to **Private**
   - Check "Add a README file" so it's not empty
3. After creating, go to repo **Settings → General**
4. Scroll down to **"Template repository"** checkbox → **tick it**
5. That's it — our code will use this repo as the source when creating dealer repos

```env
GITHUB_TEMPLATE_REPO=dealer-site-template
```

> **Note:** The template repo needs actual Next.js code in it before the deploy pipeline works.
> This is Phase 5 in `DEPLOY_CHECKLIST.md` — we'll build that code together.

---

## 4. Vercel API Token

### What it does
Lets our app create Vercel projects, link them to GitHub repos, and trigger deployments.

### Steps

1. Go to **https://vercel.com/account/tokens**
   *(You must be logged in to Vercel)*
2. Click **"Create"**
3. Give it a name: `dealer-site-pro`
4. Set scope: **Full Account** (or select your team if on Teams plan)
5. Set expiration: **No expiration**
6. Click **"Create Token"**
7. Copy the token — it won't be shown again

```env
VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 5. Vercel Team ID (optional)

Only needed if your Vercel account is part of a **Team** (not personal).

### How to find it
1. Go to **https://vercel.com/teams** → select your team
2. Go to **Settings → General**
3. Copy the **Team ID** (looks like `team_xxxxxxxxxxxxxxxxxxxx`)

```env
VERCEL_TEAM_ID=team_xxxxxxxxxxxxxxxxxxxx
```

> **If you're on a personal Vercel account:** leave this blank or don't add it at all.

---

## Final `.env.local` File

Add these to your `.env.local` (never commit this file to git):

```env
# ── GitHub ────────────────────────────────────────────────────────────────────
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=dealersitepro
GITHUB_TEMPLATE_REPO=dealer-site-template

# ── Vercel ────────────────────────────────────────────────────────────────────
VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_TEAM_ID=          # leave blank if personal account
```

---

## Quick Checklist

- [ ] GitHub token created with `repo` + `read:org` + `delete_repo` scopes
- [ ] GitHub org created (or using personal account)
- [ ] `dealer-site-template` repo created and "Template repository" enabled
- [ ] Vercel token created
- [ ] All 4 vars added to `.env.local`
- [ ] All 4 vars added to Vercel project env vars (for production deploys)

---

## Verifying Everything Works

Once env vars are set, you can test the connection by running this in the terminal:

```bash
# Test GitHub token
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user

# Test Vercel token
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user
```

Both should return JSON with your account info. If you get a 401, the token is wrong.
