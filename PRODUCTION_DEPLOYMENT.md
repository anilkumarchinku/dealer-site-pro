# 🚀 Production Deployment Guide

**Status:** Ready for deployment (after completing all checklist items)
**Last Updated:** February 24, 2026

---

## ⚠️ PRE-DEPLOYMENT REQUIREMENTS

### Security (CRITICAL)
- [ ] **All API keys rotated** (see URGENT_KEY_ROTATION.md)
- [ ] **Git history cleaned** (`.env` removed from history)
- [ ] **All secrets in environment variables** (not in code)
- [ ] **RLS policies enabled** (run database migration)
- [ ] **Payment idempotency implemented** (new verification endpoint)
- [ ] **HTTPS enabled** on all domains
- [ ] **CORS configured** properly
- [ ] **Rate limiting enabled** on auth endpoints
- [ ] **Security headers configured** (CSP, X-Frame-Options, etc)

### Code Quality
- [ ] **TypeScript strict mode enabled** (tsconfig.json updated)
- [ ] **No `any` types** (scan codebase)
- [ ] **No `@ts-ignore`** comments
- [ ] **All tests passing**
- [ ] **Linter passing** (`npm run lint`)
- [ ] **No console.error in production code**
- [ ] **Unused dependencies removed**

### Database
- [ ] **RLS policies applied** (payment_idempotency_log table created)
- [ ] **Backup strategy configured** (daily automated backups)
- [ ] **Connection pooling enabled** (PgBouncer)
- [ ] **Indexes optimized** (slow query analysis done)
- [ ] **Row-level security verified** (test each table)

### Monitoring & Logging
- [ ] **Error tracking configured** (Sentry/DataDog)
- [ ] **Logging setup** (structured JSON logs)
- [ ] **Uptime monitoring** (Pingdom/UptimeRobot)
- [ ] **Performance monitoring** (Core Web Vitals)
- [ ] **Alert rules configured** (critical errors, down time)

### Documentation
- [ ] **API documentation updated**
- [ ] **Runbook created** (incident response)
- [ ] **Disaster recovery plan documented**
- [ ] **Database backup/restore process tested**
- [ ] **Team trained on deployment process**

---

## 📋 DEPLOYMENT CHECKLIST

### Phase 1: Environment Preparation (1-2 hours)

**Step 1: Rotate All API Keys**
```bash
# See URGENT_KEY_ROTATION.md for detailed instructions
# Must complete BEFORE deploying
```

**Step 2: Verify Git History is Clean**
```bash
# Check that .env is not in recent commits
git log --all --oneline -- .env

# Should show 0 results after git filter-repo
```

**Step 3: Set Environment Variables in Vercel**
```bash
# Dashboard → Project Settings → Environment Variables
# Add all keys from .env.example with real values
# Variables must be set for:
# - Production
# - Preview
# - Development (optional)
```

**Step 4: Run Database Migrations**
```sql
-- Execute in Supabase → SQL Editor
-- File: database/migrations/001_add_payment_idempotency_and_rls.sql

-- Creates:
-- - payment_idempotency_log table
-- - RLS policies on all tables
-- - Audit logging table
```

**Step 5: Verify Supabase Configuration**
```bash
# Test Supabase connection
curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "https://{PROJECT}.supabase.co/rest/v1/dealers?limit=1" \
  | jq .

# Should return 200 with dealer records
```

---

### Phase 2: Code Deployment (30 minutes)

**Step 6: Deploy to Vercel**
```bash
# Option A: Git push (automatic)
git add .
git commit -m "fix: production deployment (security, idempotency, RLS)"
git push origin main

# Option B: Vercel CLI
npm install -g vercel
vercel deploy --prod

# Monitor deployment:
# https://vercel.com/dashboard/deployments
```

**Step 7: Verify Deployment Health**
```bash
# Check build logs
vercel logs --tail prod

# Test API endpoints
curl -s https://your-domain.com/api/health
curl -s https://your-domain.com/api/payments/verify -X POST \
  -H "content-type: application/json" \
  -H "idempotency-key: test-123" \
  -d '{"orderId":"test"}'

# Should return 400 (missing required fields) not 500
```

---

### Phase 3: Post-Deployment Verification (1 hour)

**Step 8: Smoke Test All Critical Flows**

✓ **Authentication**
```bash
# Test login
curl -s -X POST https://your-domain.com/api/auth/login \
  -H "content-type: application/json" \
  -d '{"email":"test@dealer.com","password":"test"}'
# Expected: 200 or 400 (invalid), not 500
```

✓ **Payment Processing**
```bash
# Test payment verification
curl -s -X POST https://your-domain.com/api/payments/verify \
  -H "content-type: application/json" \
  -H "idempotency-key: unique-uuid" \
  -d '{...}'
# Expected: 200 or 400, with idempotency check
```

✓ **Domain Management**
```bash
# Test domain API
curl -s https://your-domain.com/api/domains
# Expected: 200 with domain list
```

✓ **Multi-tenant Routing**
```bash
# Test subdomain routing
curl -s -H "host: test-dealer.your-domain.com" https://your-domain.com
# Expected: 200 with dealer site

# Test custom domain routing
curl -s https://custom-dealer-domain.com
# Expected: 200 with dealer site
```

**Step 9: Run Performance Tests**

```bash
# Lighthouse
npm run build
npx lighthouse https://your-domain.com --chrome-flags="--headless"

# Expected scores:
# - Performance: > 80
# - Accessibility: > 90
# - Best Practices: > 90
```

**Step 10: Verify Monitoring**

```bash
# Check error tracking (Sentry)
# - Should show 0 errors on fresh deployment

# Check performance monitoring (DataDog)
# - Response times < 200ms
# - Error rate < 0.1%

# Check uptime monitoring (Pingdom)
# - Status: UP
```

---

### Phase 4: Production Verification (30 minutes)

**Step 11: Verify Database RLS**

```sql
-- Supabase SQL Editor

-- Test that users can only see their own dealers
SELECT * FROM dealers
WHERE user_id != auth.uid();
-- Expected: 0 rows

-- Test that payment logs are accessible
SELECT * FROM payment_idempotency_log LIMIT 1;
-- Expected: returns data without errors
```

**Step 12: Test Payment Idempotency**

```bash
# Create test payment
PAYMENT_ID="pay_test_123456"
SUBSCRIPTION_ID="sub_test_789012"
IDEMPOTENCY_KEY="idempotent_test_001"

# First request
curl -X POST https://your-domain.com/api/payments/verify \
  -H "content-type: application/json" \
  -H "idempotency-key: $IDEMPOTENCY_KEY" \
  -d "{\"paymentId\":\"$PAYMENT_ID\",\"subscriptionId\":\"$SUBSCRIPTION_ID\",\"signature\":\"test\"}"

# Second request (should return cached result)
curl -X POST https://your-domain.com/api/payments/verify \
  -H "content-type: application/json" \
  -H "idempotency-key: $IDEMPOTENCY_KEY" \
  -d "{\"paymentId\":\"$PAYMENT_ID\",\"subscriptionId\":\"$SUBSCRIPTION_ID\",\"signature\":\"test\"}"

# Both should return 200 with idempotent=true on second
```

**Step 13: Monitor Error Rates**

```bash
# For first 30 minutes after deployment:
# - Check Sentry for any new errors
# - Check Vercel logs for warnings
# - Monitor database connection pool
# - Check Razorpay webhook logs

# Expected state:
# - 0 critical errors
# - 0 failed payment verifications
# - Response times stable
```

---

## 🔄 Rollback Plan

If critical issues are found after deployment:

```bash
# Option 1: Rollback to previous version
vercel rollback

# Option 2: Force redeploy last working commit
git revert HEAD
git push origin main

# Option 3: Emergency database restore
# Supabase → Backups → Restore from before deployment
```

**Notify stakeholders immediately** if rollback is needed.

---

## 📞 On-Call Runbook

### If Payment Processing Fails

1. **Check API logs:** `vercel logs --tail`
2. **Verify Razorpay connection:** Test API endpoint
3. **Check database:** Is payment_idempotency_log table accessible?
4. **Verify secrets:** Are all env vars set correctly?
5. **Check RLS policies:** Did migrations run successfully?

### If Authentication Fails

1. **Verify Supabase:** Can we connect?
2. **Check JWT:** Is NEXT_PUBLIC_SUPABASE_ANON_KEY correct?
3. **Check middleware:** Are auth routes properly configured?
4. **Check session:** Are cookies being set correctly?

### If Performance Degrades

1. **Check database:** Any slow queries?
2. **Check functions:** Is code blocking?
3. **Check external APIs:** Are dependencies slow?
4. **Scale servers:** Increase Vercel concurrency if needed

---

## 📊 Monitoring Dashboard

**Set up these dashboards immediately after deployment:**

```
Sentry → Issues
  - Error rate
  - P95 response time
  - Failed transactions

Vercel → Analytics
  - Request rate
  - Error rate
  - Slowest pages

Supabase → Logs
  - Slow queries
  - Connection errors
  - Auth failures

Razorpay → Dashboard
  - Payment success rate
  - Failed subscriptions
  - Refunds
```

---

## ✅ Post-Deployment Checklist (24 hours)

After deployment, verify every 4 hours:

- [ ] Error rate is < 0.1%
- [ ] Response times are < 200ms (p95)
- [ ] Database connections are healthy
- [ ] No failed payments in Razorpay
- [ ] All SSL certificates valid
- [ ] Rate limiting working correctly
- [ ] Backups are being created

After 24 hours of stable operation:

- [ ] Monitor dashboard stable
- [ ] All alerts configured
- [ ] Team trained on runbook
- [ ] Incident response plan reviewed

---

## 🎯 Success Criteria

Deployment is successful when:

✅ All tests passing
✅ 0 critical errors in Sentry
✅ Response times < 200ms (p95)
✅ Error rate < 0.1%
✅ Payment processing 100% success rate
✅ All authentication flows working
✅ RLS policies enforced correctly
✅ Idempotency working (duplicate requests cached)
✅ Monitoring and alerting configured
✅ Team trained and ready

---

**Deployment Status:** ⏳ Awaiting execution
**Estimated Time:** 3-4 hours
**Risk Level:** 🟡 MEDIUM (due to security fixes)
**Rollback Time:** 15 minutes

---

For questions or issues, contact: [Your On-Call Contact]
