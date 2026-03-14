# 🎨 Premium Design Visual Reference Guide

## Brand Color Palette

### Primary Colors

#### Luxury Green
```
Color Code: #546258
Usage: Main headings, primary buttons, primary CTAs, navigation accents
Hex: #546258
RGB: 84, 98, 88
HSL: 140°, 8%, 36%
```

#### Royal Cream
```
Color Code: #F8ECDC
Usage: Page backgrounds, soft backgrounds, section fills
Hex: #F8ECDC
RGB: 248, 236, 220
HSL: 30°, 64%, 94%
```

#### Light Gold
```
Color Code: #D9B48A
Usage: Secondary buttons, accents, borders, highlights
Hex: #D9B48A
RGB: 217, 180, 138
HSL: 32°, 55%, 70%
```

#### Light Gold Gradient
```
Color Code: #BA936F
Usage: Gradient endpoints, deeper accents
Hex: #BA936F
RGB: 186, 147, 111
HSL: 31°, 42%, 58%
```

---

## Design Elements & Colors

### Buttons

#### Primary Button
```css
Background: linear-gradient(90deg, #546258 0%, #6B7A66 50%, #546258 100%)
Text: white
Border: none
Padding: 12px 24px
Border Radius: 16px (rounded-2xl)
Hover: scale(1.05), shadow elevation
```

#### Secondary Button
```css
Background: linear-gradient(90deg, #D9B48A 0%, #BA936F 100%)
Text: white
Border: none
Padding: 12px 24px
Border Radius: 16px
Hover: shadow elevation, brightness increase
```

#### Outline Button
```css
Background: transparent
Border: 2px solid #546258
Text: #546258
Padding: 12px 24px
Border Radius: 16px
Hover: background #546258/5%, color changes to #D9B48A
```

### Form Inputs

#### Text Input
```css
Border: 1px solid #D9B48A/20
Background: white
Border Radius: 16px
Padding: 12px 16px
Focus Border: #D9B48A
Focus Shadow: 0 0 0 4px rgba(217, 180, 138, 0.2)
Transition: 0.3s ease
```

#### Text Area
```css
Same as text input
Resize: none
Min Height: 120px
Line Height: 1.5
```

### Cards

#### Premium Card
```css
Background: linear-gradient(135deg, white 0%, rgba(248, 236, 220, 0.3) 100%)
Border: 1px solid rgba(217, 180, 138, 0.2)
Border Radius: 24px
Padding: 24px
Shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
Hover Shadow: 0 12px 24px rgba(0, 0, 0, 0.1)
Transition: box-shadow 0.3s ease
```

### Text

#### Page Title
```css
Font: Playfair Display
Size: 36px (md), 48px (lg)
Weight: 700 (bold)
Color: #546258
Line Height: 1.2
Letter Spacing: -0.01em
```

#### Section Title
```css
Font: Playfair Display
Size: 24px
Weight: 700
Color: #546258
Underline: gold gradient (3px height)
Underline Gradient: from #D9B48A to #BA936F
```

#### Body Text
```css
Font: Inter
Size: 16px
Weight: 400
Color: #4B5563 (gray-600)
Line Height: 1.6
```

#### Price Text
```css
Font: Inter
Size: 18px
Weight: 700
Background: linear-gradient(135deg, #546258 0%, #6B7A66 50%, #D9B48A 100%)
Background Clip: text
Color: transparent
```

#### Label Text
```css
Font: Inter
Size: 12px (sm), 14px (base)
Weight: 600
Color: #546258
Letter Spacing: 0.5px
Uppercase: true (optional)
```

### Borders & Dividers

#### Premium Border
```css
Color: rgba(217, 180, 138, 0.2)
Width: 1px
Style: solid
```

#### Gold Divider
```css
Height: 1px
Background: linear-gradient(90deg, #D9B48A, transparent)
Margin: 16px 0
```

### Shadows

#### Soft Shadow
```css
Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
```

#### Card Shadow
```css
Box Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
```

#### Deep Shadow
```css
Box Shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
```

#### Gold Glow (Focus)
```css
Box Shadow: 0 0 0 4px rgba(217, 180, 138, 0.2)
```

### Background Gradients

#### Page Background
```css
Background: linear-gradient(180deg, white 0%, rgba(248, 236, 220, 0.2) 50%, white 100%)
```

#### Section Background
```css
Background: linear-gradient(135deg, rgba(248, 236, 220, 0.1) 0%, white 100%)
```

#### Green Gradient
```css
Background: linear-gradient(135deg, #546258 0%, #6B7A66 100%)
```

---

## Page-by-Page Color Usage

### Homepage
```
Page Background: Cream gradient
Heading Text: Green
Button Primary: Green gradient
Button Secondary: Gold gradient
Section Borders: Gold 20% opacity
Arrow Buttons: Green gradient
```

### Cart Page
```
Page Background: Cream gradient
Card Backgrounds: White to cream
Heading Text: Green
Price Text: Gold gradient
Button Primary: Green gradient
Input Focus: Gold glow
Quantity Buttons: Green/Gold
```

### Footer
```
Background: Green gradient (#546258 → #6B7A66)
Text: White with gold accents
Links: White → Gold on hover
Link Underline: Gold gradient
Icon Circles: Gold on hover
Section Titles: Cream uppercase
```

### About/Contact Pages
```
Page Background: Cream gradient
Main Title: Green with font-serif
Title Underline: Gold gradient
Card Backgrounds: White to cream
Card Borders: Gold 20% opacity
Button: Green gradient
Modal Background: Cream gradient
```

---

## Hover & Interaction States

### Button Hover States
```css
/* Primary Button */
Scale: 1.05
Shadow: Elevation 0 12px 24px
Duration: 0.3s ease

/* Secondary Button */
Scale: 1.05
Brightness: 110%
Duration: 0.3s ease

/* Link Hover */
Color: #D9B48A
Underline Scale: 0 → 100%
Duration: 0.3s ease
```

### Input Focus States
```css
Border Color: #D9B48A
Box Shadow: 0 0 0 4px rgba(217, 180, 138, 0.2)
Transition: all 0.3s ease
```

### Card Hover States
```css
Shadow: Elevation increase
Transform: translateY(-2px)
Duration: 0.3s ease
```

---

## Responsive Design

### Breakpoints
```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
```

### Typography Scaling
```
Title (Mobile):  32px
Title (Tablet):  40px
Title (Desktop): 48px

Body (Mobile):   14px
Body (Tablet):   16px
Body (Desktop):  16px
```

### Spacing Scale
```
Small:   4px
Base:    8px
Medium:  16px
Large:   24px
XLarge:  32px
```

---

## Animation Specifications

### Page Load
```css
Duration: 0.6s
Type: Fade + Slide
Easing: ease-out
Delay: Staggered 0.1s between elements
```

### Hover Effects
```css
Duration: 0.3s
Type: Smooth ease
Scale: 1.02 - 1.1 (elements)
Shadow: Elevation change
```

### Button Click
```css
Duration: 0.1s
Type: Scale down
Scale: 0.95
Followed by: Bounce back to 1.0
```

### Form Focus
```css
Duration: 0.2s
Type: Border color change
Shadow: Glow effect
Easing: ease-out
```

---

## Color Combinations Guide

### Text on Backgrounds
```
Green (#546258) on Cream (#F8ECDC): ✅ Good contrast
Gold (#D9B48A) on White: ✅ Good contrast
Gold (#D9B48A) on Green (#546258): ✅ Good contrast
White on Green (#546258): ✅ Good contrast
```

### Gradient Combinations
```
Green to Darker Green: Primary brand feel
Gold to Darker Gold: Elegant accents
White to Cream: Soft, premium
Green to Cream: Transitional sections
```

---

## CSS Custom Properties Reference

```css
/* In tailwind.config.js or globals.css */
--color-luxury-green: #546258
--color-royal-cream: #F8ECDC
--color-light-gold: #D9B48A
--color-light-gold-gradient: #BA936F

/* Usage in components */
text-[#546258]        /* luxury green */
bg-[#F8ECDC]          /* royal cream */
border-[#D9B48A]      /* light gold */
```

---

## Implementation Tips

1. **Always use the color palette** - Maintain consistency across all pages
2. **Apply gradients strategically** - Buttons, backgrounds, accents
3. **Use gold accents sparingly** - Not everything should be gold
4. **Maintain white space** - Luxury design needs breathing room
5. **Smooth transitions** - 0.3s ease for all interactive elements
6. **Test color contrast** - Ensure readability and accessibility
7. **Use proper font weights** - Bold for headings, regular for body
8. **Add subtle shadows** - Not too dark, just enough for depth

---

## Quick Copy-Paste Classes

```jsx
// Primary Button
className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#546258] to-[#6B7A66] text-white font-bold hover:scale-105 transition"

// Gold Accent Text
className="text-[#D9B48A] font-semibold"

// Premium Card
className="bg-gradient-to-br from-white to-[#F8ECDC]/30 rounded-3xl border border-[#D9B48A]/20 shadow-lg p-8"

// Page Background
className="bg-gradient-to-b from-white via-[#F8ECDC]/20 to-white"

// Gold Underline
className="h-1 w-16 bg-gradient-to-r from-[#D9B48A] to-[#BA936F]"

// Focus Glow Input
className="border border-[#D9B48A]/20 focus:border-[#D9B48A] focus:shadow-lg focus:shadow-[#D9B48A]/20"

// Gold Link Hover
className="text-white hover:text-[#D9B48A] transition-colors"
```

---

## Testing Color Palette

To verify colors are rendering correctly:
1. Open browser DevTools
2. Inspect element with brand color
3. Verify hex code matches
4. Check contrast ratio (should be 4.5:1 minimum)
5. Test on different lighting conditions

---

**Reference Guide**: Chioma Hair Premium Design System
**Last Updated**: 2024
**Status**: Ready for Implementation ✅

