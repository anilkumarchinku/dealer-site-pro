# 🚨 URGENT: Key Rotation Required

**Your .env file was found in Git history with LIVE API credentials.**
**These keys are NOW COMPROMISED and must be rotated immediately.**

---

## 📋 Keys That MUST Be Rotated

| Service | Key Name | Status | Risk |
|---------|----------|--------|------|
| **Supabase** | NEXT_PUBLIC_SUPABASE_ANON_KEY | 🔴 EXPOSED | Database access |
| **GitHub** | GITHUB_TOKEN | 🔴 EXPOSED | Full org access |
| **Vercel** | VERCEL_TOKEN | 🔴 EXPOSED | Can deploy/delete |
| **Razorpay** | RAZORPAY_KEY_SECRET | ⚠️ EXPOSED | Payment processing |
| **GoDaddy** | GODADDY_API_KEY/SECRET | ⚠️ EXPOSED | Domain management |

---

## 🔄 Rotation Instructions

### 1. Supabase (HIGHEST PRIORITY)
**Risk:** Attacker can read/write all dealer data

```bash
# Go to: https://app.supabase.com → your project
# 1. Settings → API
# 2. Find "anon" key
# 3. Click "Rotate" button
# 4. Copy new key
# 5. Update NEXT_PUBLIC_SUPABASE_ANON_KEY in production
```

### 2. GitHub (HIGHEST PRIORITY)
**Risk:** Attacker can push malicious code, access all org repos

```bash
# Go to: https://github.com/settings/tokens
# 1. Find "dealer-site-pro-deploy" token
# 2. Delete it (click "Delete")
# 3. Click "Generate new token (classic)"
# 4. Name: dealer-site-pro-deploy-v2
# 5. Scopes: repo, delete_repo, read:org
# 6. Generate and copy immediately
# 7. Update GITHUB_TOKEN in production

# Also check if any PATs were used elsewhere:
git log --all --oneline -- .env | head -5
```

### 3. Vercel (HIGHEST PRIORITY)
**Risk:** Attacker can deploy to production, delete projects

```bash
# Go to: https://vercel.com/account/tokens
# 1. Find current token
# 2. Delete it
# 3. Create new token: "DealerSite Pro Deploy - v2"
# 4. Copy and update VERCEL_TOKEN in production
```

### 4. Razorpay (HIGH PRIORITY)
**Risk:** Attacker can create fraudulent charges

```bash
# Go to: https://dashboard.razorpay.com/app/settings/api-keys
# 1. Scroll to "Secret Key"
# 2. Click "Regenerate"
# 3. Confirm and copy new key
# 4. Update RAZORPAY_KEY_SECRET in production
```

### 5. GoDaddy (MEDIUM PRIORITY)
**Risk:** Attacker can register/transfer domains

```bash
# Go to: https://developer.godaddy.com/keys
# 1. Find API key
# 2. Delete and create new
# 3. Update GODADDY_API_KEY and GODADDY_API_SECRET
```

### 6. Cloudflare (MEDIUM PRIORITY)
**Risk:** Attacker can modify DNS, delete records

```bash
# Go to: https://dash.cloudflare.com/profile/api-tokens
# 1. Create new token instead of reusing old one
# 2. Permissions: "Zone.DNS:Edit, Zone.Zone:Read"
# 3. Update CLOUDFLARE_API_TOKEN
```

### 7. Resend (LOW PRIORITY)
**Risk:** Attacker can send emails from your account

```bash
# Go to: https://resend.com/api-keys
# Delete old, create new
# Update RESEND_API_KEY
```

---

## ✅ Checklist

- [ ] **SUPABASE:** Key rotated, new key in production env
- [ ] **GITHUB:** Old token deleted, new token in production env
- [ ] **VERCEL:** Old token deleted, new token in production env
- [ ] **RAZORPAY:** Secret regenerated, new key in production env
- [ ] **GODADDY:** Keys regenerated, updated in production
- [ ] **CLOUDFLARE:** New token created, updated in production
- [ ] **RESEND:** New API key created, updated in production
- [ ] **GIT:** .env removed from history (see next section)
- [ ] **VERIFY:** All services still working with new keys

---

## 🔨 Remove .env from Git History

**Before doing this, ensure all keys are rotated above.**

```bash
# Clean history
git filter-repo --path .env --invert-paths

# Force push (CAUTION: destructive)
git push origin main --force-with-lease

# If force-with-lease fails due to branch protection:
# 1. Go to GitHub repo settings
# 2. Temporarily disable branch protection on 'main'
# 3. Run force push again
# 4. Re-enable branch protection
```

**After pushing, have all team members:**
```bash
git pull --rebase
# They'll get the clean history
```

---

## 🚀 Deploy New Keys to Production

Once rotated, update environment variables in:

### Option A: Vercel Dashboard
```
1. Dashboard → Your Project → Settings → Environment Variables
2. Update each variable with new values
3. Redeploy all environments (Preview, Production)
```

### Option B: Vercel CLI
```bash
vercel env pull  # Get current
# Edit .env with new values
vercel env add GITHUB_TOKEN "new_token_value"
vercel env add VERCEL_TOKEN "new_token_value"
# ... repeat for all keys
vercel redeploy
```

---

## 🔒 Prevention Going Forward

Add this to your `.gitignore` (should already be there):
```
.env
.env.local
.env*.local
```

Add pre-commit hook to prevent accidental commits:
```bash
# .git/hooks/pre-commit
#!/bin/bash
if git diff --cached | grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY\|GITHUB_TOKEN\|VERCEL_TOKEN"; then
  echo "ERROR: Detected secrets in commit!"
  exit 1
fi
```

---

## 📞 If Keys Were Compromised

If you believe someone used these keys:

1. **Check Supabase audit logs:**
   - Dashboard → Logs → Recent activity
   - Look for unauthorized changes to dealer data

2. **Check GitHub audit log:**
   - https://github.com/organizations/{org}/settings/audit-log
   - Look for suspicious pushes or repo deletions

3. **Check Vercel deployments:**
   - https://vercel.com/dashboard/deployments
   - Look for unexpected deploys

4. **Check Razorpay transactions:**
   - https://dashboard.razorpay.com/app/payments
   - Look for fraudulent charges

---

## ⏰ Timeline

- **Right Now (< 1 hour):** Rotate all 7 keys listed above
- **Within 1 hour:** Update keys in production environment
- **Within 2 hours:** Remove .env from git history and force push
- **Within 4 hours:** Audit all services for suspicious activity
- **Monitor:** Watch for 24-48 hours for any anomalies

---

**COMPLETION DEADLINE:** Before any production deployment

**DO NOT DEPLOY** with compromised keys still in use.
