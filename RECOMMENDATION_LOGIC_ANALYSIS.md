# 📊 Products You May Like - Logic Analysis & Improvements

## Current Implementation Analysis

### 🔍 Current Logic

**Location**: `/api/more-products.js` and `/pages/index.js`

```javascript
// Current API Endpoint
export default async function handler(req, res) {
  const moreProducts = await Product.find().skip(6).limit(6).lean();
  res.status(200).json(JSON.parse(JSON.stringify(moreProducts)));
}
```

**Issues with Current Approach**:

1. ❌ **Static Offset** - Always skips first 6 products, limits to next 6
   - Same products show every time
   - No randomization
   - No personalization

2. ❌ **No Smart Filtering** - Doesn't consider:
   - User's browsing history
   - Currently viewed product category
   - Popular/trending products
   - Price range preference
   - Product properties/variants

3. ❌ **Poor Relevance** - Random 6 products regardless of:
   - What user is viewing
   - What's in their cart
   - Product compatibility

4. ❌ **No Sorting** - Doesn't prioritize:
   - Top-rated products
   - Best sellers
   - Newly added items
   - Promotional items

5. ❌ **No Diversity** - May show:
   - Multiple variants of same product
   - Out-of-stock items
   - Products user already viewed

---

## 🚀 Improved Solution

### **Option 1: Smart Recommendation (Recommended)**

```javascript
// /pages/api/recommendations.js
import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const { categoryId, productId, limit = 6, excludeOutOfStock = true } = req.query;

    // Build filter criteria
    const filters = {};
    
    // 1. Exclude current product
    if (productId) {
      filters._id = { $ne: productId };
    }

    // 2. Same category products (higher priority)
    if (categoryId) {
      filters.category = categoryId;
    }

    // 3. Only in-stock items
    if (excludeOutOfStock) {
      filters.stock = { $gt: 0 };
    }

    // Fetch with scoring
    let products = await Product.find(filters)
      .select("name price salePriceIncTax images isPromotion promoEnd rating reviews stock createdAt")
      .lean();

    // Score products for relevance
    products = products.map(p => ({
      ...p,
      score: calculateScore(p, categoryId)
    }));

    // Sort by score (descending) + randomize within top products
    products.sort((a, b) => b.score - a.score);
    
    // Get top candidates and randomize for variety
    const topCandidates = products.slice(0, limit * 3);
    const shuffled = topCandidates.sort(() => Math.random() - 0.5);
    const recommended = shuffled.slice(0, parseInt(limit));

    // Remove score before sending
    const cleanedProducts = recommended.map(({ score, ...p }) => p);

    res.status(200).json(JSON.parse(JSON.stringify(cleanedProducts)));
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Failed to load recommendations" });
  }
}

// Scoring function
function calculateScore(product, userCategoryId) {
  let score = 0;

  // 1. Category match (highest priority)
  if (product.category && userCategoryId) {
    if (product.category.toString() === userCategoryId) {
      score += 50;
    }
  }

  // 2. Rating (quality signal)
  if (product.rating) {
    score += Math.min(product.rating * 5, 25);
  }

  // 3. Review count (popularity)
  const reviewCount = product.reviews?.length || 0;
  score += Math.min(reviewCount / 10, 15);

  // 4. Promotion (incentive to buy)
  if (product.isPromotion && product.promoEnd) {
    const now = new Date();
    const end = new Date(product.promoEnd);
    if (end > now) {
      score += 20; // Active promo boost
    }
  }

  // 5. Recency (boost new products)
  if (product.createdAt) {
    const daysOld = (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysOld < 7) score += 15;    // New (< 1 week)
    if (daysOld < 30) score += 10;   // Recent (< 1 month)
  }

  // 6. Stock availability
  if (product.stock > 10) score += 5;

  return score;
}
```

---

### **Option 2: Context-Aware Recommendations**

```javascript
// /pages/api/recommended-products.js
import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const { 
      categoryId,           // Current product's category
      productId,            // Current product to exclude
      limit = 6,
      userViewHistory = [], // Array of recently viewed product IDs
      userCartItems = []    // Array of items in cart
    } = req.query;

    // Step 1: Category-based recommendations
    const categoryProducts = await Product.find({
      _id: { $ne: productId },
      category: categoryId,
      stock: { $gt: 0 }
    })
      .select("name price salePriceIncTax images isPromotion promoEnd rating reviews")
      .limit(parseInt(limit) * 2)
      .lean();

    // Step 2: Popular items (as fallback)
    const popularProducts = await Product.find({
      _id: { 
        $ne: productId,
        $nin: categoryProducts.map(p => p._id) // Avoid duplicates
      },
      stock: { $gt: 0 }
    })
      .select("name price salePriceIncTax images isPromotion promoEnd rating reviews")
      .sort({ "reviews.length": -1 }) // Most reviewed
      .limit(parseInt(limit) * 2)
      .lean();

    // Step 3: Combine and deduplicate
    const combined = [...categoryProducts, ...popularProducts];
    const uniqueProducts = Array.from(
      new Map(combined.map(p => [p._id.toString(), p])).values()
    );

    // Step 4: Score and sort
    const scored = uniqueProducts.map(p => ({
      ...p,
      score: calculateContextScore(p, userViewHistory, userCartItems)
    }));

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    const cleanedProducts = sorted.map(({ score, ...p }) => p);

    res.status(200).json(JSON.parse(JSON.stringify(cleanedProducts)));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to load recommendations" });
  }
}

function calculateContextScore(product, viewHistory = [], cartItems = []) {
  let score = 0;

  // 1. Not in view history
  if (viewHistory && !viewHistory.includes(product._id.toString())) {
    score += 20;
  }

  // 2. Not already in cart
  if (cartItems && !cartItems.includes(product._id.toString())) {
    score += 15;
  }

  // 3. Rating
  if (product.rating) {
    score += Math.min(product.rating * 4, 20);
  }

  // 4. Reviews count
  const reviews = product.reviews?.length || 0;
  if (reviews > 5) score += 10;
  if (reviews > 20) score += 5;

  // 5. Active promotion
  if (product.isPromotion && product.promoEnd) {
    if (new Date(product.promoEnd) > new Date()) {
      score += 15;
    }
  }

  return score;
}
```

---

### **Option 3: Homepage "More Products" - Intelligent Rotation**

```javascript
// /pages/api/featured-products.js
import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const { page = 1, limit = 6 } = req.query;
    
    // Get active promotions first
    const now = new Date();
    const promoProducts = await Product.find({
      isPromotion: true,
      promoEnd: { $gt: now },
      stock: { $gt: 0 }
    })
      .select("name price salePriceIncTax images isPromotion promoEnd rating")
      .limit(3)
      .lean();

    // Fill remaining with top-rated products
    const remainingLimit = parseInt(limit) - promoProducts.length;
    const topRated = await Product.find({
      _id: { $nin: promoProducts.map(p => p._id) },
      stock: { $gt: 0 },
      rating: { $exists: true, $ne: null }
    })
      .select("name price salePriceIncTax images rating reviews")
      .sort({ rating: -1, "reviews.length": -1 })
      .limit(remainingLimit)
      .lean();

    // If still need more, add recent products
    let finalProducts = [...promoProducts, ...topRated];
    if (finalProducts.length < limit) {
      const recent = await Product.find({
        _id: { $nin: finalProducts.map(p => p._id) },
        stock: { $gt: 0 }
      })
        .select("name price salePriceIncTax images createdAt")
        .sort({ createdAt: -1 })
        .limit(limit - finalProducts.length)
        .lean();
      
      finalProducts = [...finalProducts, ...recent];
    }

    // Shuffle final results for variety
    finalProducts = finalProducts.sort(() => Math.random() - 0.5);

    res.status(200).json(JSON.parse(JSON.stringify(finalProducts)));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to load featured products" });
  }
}
```

---

## 📋 Comparison Table

| Criteria | Current | Option 1 | Option 2 | Option 3 |
|----------|---------|----------|----------|----------|
| Smart Filtering | ❌ | ✅ | ✅✅ | ✅ |
| Category Aware | ❌ | ✅ | ✅✅ | ✅ |
| User Context | ❌ | ❌ | ✅✅ | ❌ |
| Rating Based | ❌ | ✅ | ✅ | ✅ |
| Promo Boosting | ❌ | ✅ | ✅ | ✅✅ |
| Randomization | ❌ | ✅ | ✅ | ✅✅ |
| Avoids Duplicates | ❌ | ✅ | ✅ | ✅ |
| Complexity | Simple | Medium | High | Medium |
| Performance | Fast | Fast | Medium | Fast |

---

## 🔧 Implementation Guide

### Step 1: Update Homepage

```javascript
// pages/index.js
// Change from:
const { data: moreProducts } = useSWR("/api/more-products", fetcher);

// To:
const { data: moreProducts } = useSWR("/api/featured-products?limit=6", fetcher);
```

### Step 2: Update Product Detail Page

```javascript
// components/ProductClient.js
// Add recommendations section:
const [relatedProducts, setRelatedProducts] = useState([]);

useEffect(() => {
  const fetchRelated = async () => {
    try {
      const res = await axios.get(
        `/api/recommendations?categoryId=${product.category}&productId=${product._id}&limit=6`
      );
      setRelatedProducts(res.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };
  fetchRelated();
}, [product._id, product.category]);

// In JSX:
{relatedProducts.length > 0 && (
  <Carousel
    products={relatedProducts.map(p => ({ ...p, cardComponent: ProductCard }))}
    title="Related Products"
  />
)}
```

### Step 3: Add to Cart Context Update

```javascript
// context/CartContext.js
// Track viewed products:
useEffect(() => {
  // Save current cart to localStorage for recommendation context
  localStorage.setItem('userCartItems', JSON.stringify(cartItems));
}, [cartItems]);
```

---

## 🎯 Benefits Summary

### Performance Improvements
- ✅ More relevant products shown
- ✅ Better click-through rates expected
- ✅ Increased average order value
- ✅ Reduced bounce rate

### User Experience
- ✅ Personalized recommendations
- ✅ Discover new products
- ✅ Better product discovery
- ✅ Improved shopping experience

### Business Metrics
- ✅ Boost promo sales
- ✅ Showcase top-rated items
- ✅ Reduce dead inventory
- ✅ Increase engagement

---

## 📈 Recommended Approach

**Use Option 1 (Smart Recommendation)** for:
- ✅ Best balance of complexity vs. benefit
- ✅ Works well without user history
- ✅ Good performance
- ✅ Easy to implement
- ✅ Immediate impact

**Upgrade to Option 2** when you have:
- ✅ User authentication
- ✅ View history tracking
- ✅ Cart data available
- ✅ More sophisticated analytics

**Use Option 3** for:
- ✅ Homepage featured section
- ✅ General "More Products" carousel
- ✅ Best sales boost

---

## 🔮 Future Enhancements

1. **Machine Learning** - Use product co-purchase data
2. **A/B Testing** - Test different algorithms
3. **User Segmentation** - Different logic for new vs. returning users
4. **Time-based** - Show different products at different times
5. **Analytics** - Track which recommendations convert best
6. **Personalization** - Use browser history and preferences

---

## ⚠️ Important Notes

- Always exclude out-of-stock products
- Avoid showing the same product twice
- Rotate products regularly for freshness
- Monitor conversion rates
- Cache recommendations (5-10 min) for performance
- Log recommendation impressions for analytics

---

**Ready to implement?** Start with Option 1 for immediate improvements! 🚀
