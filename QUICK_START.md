# PRODUCTION SETUP QUICK START

## ⚡ 5-Minute Setup Guide

### 1. Environment Variables

```bash
# Copy template and fill in values
cp .env.local.example .env.local
```

**Edit `.env.local` and set:**

```env
# Database (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chioma-hair

# JWT (Generate: openssl rand -hex 32)
JWT_SECRET=your_generated_32_char_hex_here

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-specific-password

# Paystack (Get from dashboard)
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_WEBHOOK_SECRET=webhook_secret_xxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

### 2. Database Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & cluster (M0 free tier for testing)
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/`
4. Add your IP to IP whitelist
5. Create database `chioma-hair`
6. Copy to `MONGODB_URI` in .env.local

---

### 3. Payment Setup (Paystack)

1. Go to https://paystack.com
2. Sign up and complete KYC
3. Go to Settings → Developers
4. Copy Test keys (for development) or Live keys (for production)
5. Paste into .env.local:
   - `PAYSTACK_PUBLIC_KEY` → Public key
   - `PAYSTACK_SECRET_KEY` → Secret key
6. Add webhook: Settings → Webhooks
   - URL: `https://your-domain.com/api/paystack/verify`
   - Select: `charge.success`, `charge.failed`
   - Copy webhook secret to `PAYSTACK_WEBHOOK_SECRET`

---

### 4. Email Setup

#### Option A: Gmail (Free)

1. Enable 2-factor authentication
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use email as `EMAIL_USER`
4. Use generated password as `EMAIL_PASS`

#### Option B: SendGrid / Mailgun

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_api_key
```

---

### 5. Verify Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
npm run start
# Visit http://localhost:3000

# Run security check
npm audit

# Check MongoDB connection
node -e "require('./lib/mongodb').default().then(() => console.log('✅ DB Connected')).catch(e => console.log('❌', e))"
```

---

### 6. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Settings → Environment Variables

# Set domains
# Settings → Domains
```

**Or manually add to Vercel:**

1. Push to GitHub
2. Go to vercel.com
3. Import project
4. Add environment variables
5. Deploy

---

### 7. Post-Deployment Verification

- [ ] Test home page loads
- [ ] Test product browsing
- [ ] Test login/register
- [ ] Test add to cart
- [ ] Test payment (use Paystack test card: 4084 0850 3330 7357)
- [ ] Check error logs
- [ ] Verify email sending

---

## Configuration Reference

| Item | Location | Example |
|------|----------|---------|
| **Database** | MongoDB Atlas | mongodb+srv://user:pass@cluster.net/chioma-hair |
| **JWT** | .env.local | JWT_SECRET=abc123... |
| **Paystack** | Paystack Dashboard | pk_live_xxxxx |
| **Email** | Gmail App Password | EMAIL_PASS=xxxx xxxx xxxx xxxx |
| **Domain** | Vercel/Host | https://chioma-hair.com |

---

## Troubleshooting

### MongoDB Connection Failed

```
Error: ECONNREFUSED
Solution: 
1. Check MONGODB_URI is correct
2. Verify IP is whitelisted in MongoDB Atlas
3. Check database name exists
4. Verify credentials are correct
```

### Paystack Payment Not Working

```
Error: 401 Unauthorized
Solution:
1. Verify PAYSTACK_SECRET_KEY is correct
2. Check it's in Live keys (not test)
3. Verify webhook secret is set
4. Check CORS includes Paystack domain
```

### Email Not Sending

```
Error: Gmail authentication failed
Solution:
1. Enable 2FA on Gmail account
2. Generate app-specific password
3. Use generated password (with spaces)
4. Not your regular password
```

### Build Fails

```
Error: Module not found
Solution:
1. npm install
2. npm audit fix
3. npm run build
4. Check for syntax errors
```

---

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Check dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check MongoDB status
npm test

# View logs (Vercel)
vercel logs

# Clear build cache
rm -rf .next
```

---

## What's Included

✅ Full e-commerce platform
✅ Product catalog with categories
✅ Shopping cart & wishlist
✅ User authentication
✅ Paystack payment integration
✅ Order management
✅ Customer account dashboard
✅ Product reviews & ratings
✅ Admin features
✅ Responsive mobile design
✅ Security features (rate limiting, validation, etc.)
✅ Performance optimizations
✅ Comprehensive documentation

---

## Next Steps

1. **Custom Branding**
   - Update colors in tailwind.config.js
   - Change logo in Navbar.js
   - Update site name in _app.js

2. **Add Products**
   - Admin interface (create pages/admin/products.js)
   - Bulk import script
   - Image upload service

3. **Analytics**
   - Google Analytics
   - Sentry error tracking
   - Custom metrics

4. **Marketing**
   - Newsletter automation
   - Email campaigns
   - Social media integration

5. **Advanced Features**
   - Coupon system
   - Loyalty rewards
   - Product recommendations
   - Live chat support

---

## Support Resources

- **Next.js**: https://nextjs.org/docs
- **MongoDB**: https://docs.mongodb.com
- **Paystack**: https://paystack.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **React**: https://react.dev

---

**🎉 You're ready to launch!**

Questions? Check DEPLOYMENT_GUIDE.md or SECURITY_AUDIT.md
