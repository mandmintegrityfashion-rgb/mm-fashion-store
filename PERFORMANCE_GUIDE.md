# PERFORMANCE OPTIMIZATION GUIDE

## Core Web Vitals Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Largest Contentful Paint (LCP)** | < 2.5s | TBD | Monitor |
| **First Input Delay (FID)** | < 100ms | TBD | Monitor |
| **Cumulative Layout Shift (CLS)** | < 0.1 | TBD | Monitor |
| **First Contentful Paint (FCP)** | < 1.8s | TBD | Monitor |

---

## 1. IMAGE OPTIMIZATION

### Current Implementation

```javascript
// ✅ Already using Next.js Image component
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  priority={isAboveFold}
  loading="lazy"
/>
```

### Further Optimizations

```javascript
// Use WebP format with fallback
<Image
  src="/image.webp"
  alt="description"
  width={400}
  height={300}
  onError={(e) => { e.currentTarget.src = "/image.jpg" }}
/>

// Configure sizes for responsive images
<Image
  src={image}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Configuration in next.config.mjs

```javascript
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['res.cloudinary.com', 'your-cdn.com'],
    loader: 'cloudinary', // Use CDN instead of Next.js
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```

---

## 2. CODE SPLITTING & LAZY LOADING

### Dynamic Imports (Code Splitting)

```javascript
// Split large components
import dynamic from 'next/dynamic';

const ProductGallery = dynamic(() => import('./ProductGallery'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Load on client only
});
```

### Lazy Load Heavy Components

```javascript
// ProductClient.js - Already implemented
const ProductClient = dynamic(() => import('./ProductClient'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

---

## 3. CACHING STRATEGIES

### Static Site Generation (SSG)

```javascript
// pages/product/[id].js
export async function getStaticProps({ params }) {
  const product = await Product.findById(params.id);
  
  return {
    props: { product },
    revalidate: 3600 // Revalidate every 1 hour (ISR)
  };
}

export async function getStaticPaths() {
  const products = await Product.find().select('_id');
  
  return {
    paths: products.map(p => ({ params: { id: p._id.toString() } })),
    fallback: 'blocking'
  };
}
```

### Server-Side Rendering Cache

```javascript
// pages/api/products.js
export default async function handler(req, res) {
  // Cache for 5 minutes
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  
  const products = await Product.find();
  res.json(products);
}
```

### Browser Caching

```javascript
// next.config.mjs
export default {
  headers: async () => {
    return [
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000' }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300' }
        ]
      }
    ];
  }
}
```

---

## 4. DATABASE QUERY OPTIMIZATION

### Lean Queries (Read-Only)

```javascript
// Faster for read-only data
const products = await Product.find()
  .lean()
  .select('name price image category')
  .limit(20);
```

### Field Projection

```javascript
// Only fetch needed fields
const user = await Customer.findById(id)
  .select('name email phone') // Exclude password, addresses
  .lean();
```

### Pagination

```javascript
const limit = 20;
const page = parseInt(req.query.page) || 1;

const products = await Product
  .find()
  .limit(limit)
  .skip((page - 1) * limit)
  .lean();

const total = await Product.countDocuments();
```

### Indexing

```javascript
// Create indexes in MongoDB
db.products.createIndex({ category: 1 })
db.products.createIndex({ name: "text" })
db.products.createIndex({ isPromotion: 1, createdAt: -1 })

db.customers.createIndex({ email: 1 }, { unique: true })

db.orders.createIndex({ customerId: 1 })
db.orders.createIndex({ status: 1, createdAt: -1 })
```

### Connection Pooling

```env
# .env.local
MONGODB_POOL_SIZE=10
MONGODB_MAX_RETRIES=5
```

---

## 5. CLIENT-SIDE PERFORMANCE

### React Best Practices

```javascript
// Use React.memo for components that don't change
const ProductCard = React.memo(({ product }) => {
  return (
    // Component JSX
  );
});

// Use useCallback for stable function references
const handleAddToCart = useCallback((product) => {
  addToCart(product);
}, [addToCart]);

// Use useMemo for expensive calculations
const filteredProducts = useMemo(() => {
  return products.filter(p => p.category === selectedCategory);
}, [products, selectedCategory]);
```

### Infinite Scroll Optimization

```javascript
// Instead of loading all products, use pagination
const [page, setPage] = useState(1);

const { data: products } = useSWR(
  `/api/products?page=${page}&limit=20`,
  fetcher,
  { 
    revalidateOnFocus: false,
    dedupingInterval: 60000 // 1 minute
  }
);
```

---

## 6. BUNDLE SIZE OPTIMIZATION

### Tree Shaking

```javascript
// ✅ Good - Only imports needed functions
import { validateEmail } from '@/lib/validation';

// ❌ Bad - Imports entire module
import * as validation from '@/lib/validation';
```

### Remove Unused Dependencies

```bash
# Analyze bundle
npm install --save-dev webpack-bundle-analyzer

# Build analysis
npm run build
npm run analyze
```

### Minification & Compression

```javascript
// next.config.mjs
export default {
  compress: true, // Enable gzip compression
  swcMinify: false, // Use default minification (SWC)
}
```

---

## 7. API OPTIMIZATION

### Response Compression

```javascript
// Automatic with Next.js, but ensure enabled
export default {
  compress: true
}
```

### Request Deduplication (SWR)

```javascript
const { data: products } = useSWR(
  '/api/products',
  fetcher,
  {
    dedupingInterval: 60000, // 1 minute
    focusThrottleInterval: 300000 // 5 minutes
  }
);
```

### Request Batching

```javascript
// Instead of multiple requests, batch them
const data = await Promise.all([
  fetch('/api/products'),
  fetch('/api/categories'),
  fetch('/api/heroes')
]);
```

---

## 8. MONITORING PERFORMANCE

### Google PageSpeed Insights

```bash
# Test production URL
# https://pagespeed.web.dev/
```

### Next.js Analytics

```javascript
// pages/_app.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Log page view to analytics
      console.log(`Navigated to ${url}`);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

### Core Web Vitals Reporting

```javascript
// pages/_app.js
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to your analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

---

## 9. PRODUCTION BUILD CHECKLIST

- [ ] Run `npm run build` successfully
- [ ] Bundle size < 500KB (initial JavaScript)
- [ ] All images optimized (WebP format)
- [ ] Database indexes created
- [ ] API rate limiting enabled
- [ ] Caching headers configured
- [ ] CDN configured for static assets
- [ ] Monitoring setup complete
- [ ] Performance baseline established

---

## 10. PERFORMANCE TARGETS

### Page Load Time Targets

| Page | Target |
|------|--------|
| Home | < 2.5s |
| Product List | < 3.0s |
| Product Detail | < 2.0s |
| Checkout | < 2.0s |
| Account Dashboard | < 2.5s |

### Metric Targets

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| TTFB | < 600ms | Chrome DevTools |
| Bundle Size | < 500KB | webpack-bundle-analyzer |

---

## Monitoring Commands

```bash
# Analyze bundle size
npm run analyze

# Test production build locally
npm run build && npm run start

# Check Lighthouse score
npm install -g lighthouse
lighthouse https://your-domain.com

# Monitor performance in real-time
node inspect-cli --url https://your-domain.com
```

---

**Remember**: Performance is a continuous process. Monitor, optimize, and iterate!
