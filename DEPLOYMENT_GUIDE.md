# DEPLOYMENT & PRODUCTION GUIDE

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Database Configuration](#database-configuration)
3. [Payment Gateway Setup](#payment-gateway-setup)
4. [Security Configuration](#security-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Deployment Checklist](#deployment-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Backup Strategy](#backup-strategy)
9. [Troubleshooting](#troubleshooting)

---

## ENVIRONMENT SETUP

### Step 1: Create Production Environment File

```bash
# Create .env.local in root directory
cp .env.local.example .env.local
```

### Step 2: Configure Required Variables

**Critical Variables (Must Configure):**

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/chioma-hair

# Authentication
JWT_SECRET=<generate-strong-random-32-chars>
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-specific-password

# Paystack
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_WEBHOOK_SECRET=<webhook-secret>

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Step 3: Generate Secure Secrets

```bash
# Generate JWT Secret (Linux/Mac)
openssl rand -hex 32

# Generate JWT Secret (Windows PowerShell)
[System.Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## DATABASE CONFIGURATION

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier
   - Create new project

2. **Create Database Cluster**
   - Choose AWS/GCP/Azure (closest to your users)
   - Select M0 Sandbox for development, M2+ for production
   - Enable backups (automatic daily for M2+)

3. **Configure Database Access**
   - Create database user with strong password
   - Copy connection string
   - Replace `<password>` and `<database>` placeholders

4. **Whitelist IP Addresses**
   - Add your deployment server IP
   - Add your local development IP
   - For development: Allow 0.0.0.0/0 (not recommended for production)

5. **Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
   ```

### Database Optimization

**Enable Indexes for Performance:**

```javascript
// In MongoDB Atlas, create these indexes:

// Users collection
db.customers.createIndex({ "email": 1 }, { unique: true })
db.customers.createIndex({ "phone": 1 })

// Products collection
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "name": "text" })
db.products.createIndex({ "isPromotion": 1 })

// Orders collection
db.orders.createIndex({ "customerId": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "createdAt": -1 })

// Reviews collection
db.reviews.createIndex({ "productId": 1 })
db.reviews.createIndex({ "customerId": 1 })
```

---

## PAYMENT GATEWAY SETUP

### Paystack Configuration

1. **Create Paystack Account**
   - Go to https://paystack.com
   - Sign up and complete KYC verification
   - Go to Dashboard > Settings > Developers

2. **Obtain API Keys**
   - **Test Keys**: Use for development
   - **Live Keys**: Use for production (after verification)

3. **Configure Webhook**
   - URL: `https://your-domain.com/api/paystack/verify`
   - Select events: `charge.success`, `charge.failed`
   - Copy webhook secret to `PAYSTACK_WEBHOOK_SECRET`

4. **Testing Paystack Integration**

   ```javascript
   // Test with these credentials:
   Card: 4084 0850 3330 7357
   CVV: 408
   Expiry: 12/25
   OTP: 123456
   ```

5. **Paystack Status Check**

   ```bash
   # Verify your Paystack configuration
   curl -H "Authorization: Bearer sk_live_xxxxx" \
        https://api.paystack.co/customer
   ```

---

## SECURITY CONFIGURATION

### 1. HTTPS & SSL Certificate

```javascript
// In next.config.mjs
export default {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

### 2. Environment Variable Protection

**Never commit secrets:**

```bash
# Add to .gitignore
.env.local
.env.*.local
*.key
*.pem
```

### 3. JWT Configuration

```env
JWT_SECRET=<32-char-hex-string>
JWT_EXPIRY=7d
```

### 4. Rate Limiting

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. CORS Configuration

```env
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### 6. Security Headers

Add to `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]
    }
  ]
}
```

---

## PERFORMANCE OPTIMIZATION

### 1. Image Optimization

```javascript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="description"
  width={400}
  height={300}
  priority  // For above-the-fold images
  loading="lazy"  // For below-the-fold
/>
```

### 2. Caching Strategy

```env
# .env.local
NEXT_REVALIDATE=3600  # 1 hour
ISR_REVALIDATE=86400  # 24 hours
```

### 3. Database Query Optimization

```javascript
// Add pagination
const limit = 20;
const page = 1;
const skip = (page - 1) * limit;

Product.find()
  .limit(limit)
  .skip(skip)
  .select('name price image category')  // Only needed fields
  .lean()  // Faster for read-only queries
```

### 4. Compression & Minification

Already enabled in Next.js production build.

```bash
# Verify build size
npm run build
# Check .next/static size
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database indexes created
- [ ] Paystack test payment successful
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] SSL certificate installed
- [ ] CORS configured correctly
- [ ] Email service verified
- [ ] Backups configured
- [ ] Monitoring setup

### Deployment Steps

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Test Production Build Locally**
   ```bash
   npm run build
   npm run start
   # Visit http://localhost:3000
   ```

3. **Deploy to Production**

   **Option A: Vercel (Recommended)**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

   **Option B: Self-hosted (AWS, DigitalOcean, etc.)**
   ```bash
   # Build
   npm run build
   
   # Copy to server
   scp -r .next package.json package-lock.json user@server:/app/
   
   # On server
   cd /app
   npm install --production
   npm run start
   ```

   **Option C: Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

4. **Post-Deployment**
   - [ ] Test all critical flows
   - [ ] Verify SSL certificate
   - [ ] Check monitoring dashboards
   - [ ] Review error logs
   - [ ] Monitor performance metrics

---

## MONITORING & MAINTENANCE

### 1. Health Checks

Create `/pages/api/health.js`:

```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
}
```

### 2. Error Tracking

Integrate Sentry:

```env
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/xxxxx
```

### 3. Performance Monitoring

Use tools:
- Google PageSpeed Insights
- WebPageTest
- Lighthouse CI

### 4. Log Monitoring

```bash
# View application logs
pm2 logs chioma-hair
# or
tail -f /var/log/app.log
```

### 5. Database Monitoring

- MongoDB Atlas Dashboard
- Set up alerts for:
  - High connection count
  - Disk usage > 80%
  - CPU usage > 80%

---

## BACKUP STRATEGY

### Automated Backups

1. **MongoDB Atlas Built-in**
   - M2+ clusters: Daily automatic backups (35 days retention)
   - Backup window: Configure in Atlas dashboard
   - Restore: One-click restore to new cluster

2. **Manual Backups**

   ```bash
   # Export data
   mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/chioma-hair" \
             --out ./backup_$(date +%Y%m%d)
   
   # Compress
   tar -czf backup_$(date +%Y%m%d).tar.gz backup_$(date +%Y%m%d)
   
   # Upload to cloud storage
   aws s3 cp backup_$(date +%Y%m%d).tar.gz s3://your-bucket/backups/
   ```

3. **File Backups**
   - Backup uploaded images from `/public`
   - Store in S3/Google Cloud Storage
   - Retention: 30 days minimum

### Backup Schedule

- **Frequency**: Daily at 02:00 UTC
- **Retention**: 30 days
- **Testing**: Weekly restore test
- **Documentation**: Backup logs

### Disaster Recovery

1. **Recovery Time Objective (RTO)**: 4 hours
2. **Recovery Point Objective (RPO)**: 24 hours
3. **Test restores**: Monthly
4. **Document process**: Keep recovery procedures updated

---

## TROUBLESHOOTING

### MongoDB Connection Issues

```javascript
// Check connection status
const mongoose = require('mongoose');
console.log(mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
```

### Paystack Payment Failures

```javascript
// Check Paystack status
const status = getPaystackStatus();
console.log(status);
// Verify webhook configuration
// Check firewall/CORS settings
```

### Performance Issues

```bash
# Check Next.js analysis
npm run analyze

# Monitor database queries
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5).pretty()
```

### Email Service Issues

```javascript
// Test email configuration
const transporter = nodemailer.createTransport({...});
await transporter.verify();
```

---

## IMPORTANT REMINDERS

1. **Never expose secrets** in logs or error messages
2. **Keep dependencies updated**: `npm audit`, `npm update`
3. **Monitor costs**: Check MongoDB Atlas, Paystack charges
4. **Regular security updates**: Apply patches promptly
5. **Test before deploying**: Staging environment required
6. **Document changes**: Keep deployment logs
7. **Monitor 24/7**: Set up alerts for critical issues

---

**Questions?** Check logs or contact your DevOps team.
