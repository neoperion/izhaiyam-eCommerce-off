# IZHAYAM HANDLOOM FURNITURE - Quick Reference Guide

## 🎨 Color System

### Using Tailwind Classes

```jsx
// Primary Sage Green
className="bg-primary text-primary-foreground"
className="text-primary"
className="border-primary"
className="hover:bg-primary/90"

// Backgrounds
className="bg-background"  // Cream #faf0e6
className="bg-card"        // White #ffffff

// Text Colors
className="text-foreground"          // Dark charcoal #2c2c2c
className="text-foreground/80"       // 80% opacity
className="text-muted-foreground"    // Gray #6b7280
className="text-primary-foreground"  // Off-white for dark backgrounds

// Wood Tones
className="bg-wood-light"   // hsl(35, 30%, 75%)
className="bg-wood-medium"  // hsl(30, 40%, 55%)
className="bg-wood-dark"    // hsl(25, 35%, 30%)
className="bg-wood-header"  // hsl(35, 30%, 85%)

// Accent Colors
className="bg-amber-600 text-white"
className="bg-teal-600 text-white"
className="bg-rose-700 text-white"
className="bg-orange-600 text-white"

// Borders
className="border border-border"  // hsl(0, 0%, 89%)
```

---

## 📝 Typography

### Font Families

```jsx
// Headlines (Playfair Display)
className="font-display"

// Body Text (Outfit)
className="font-body"
```

### Font Sizes

```jsx
// Hero Heading
className="text-4xl md:text-5xl lg:text-7xl"

// Section Heading
className="text-3xl md:text-4xl lg:text-5xl"

// Subsection Heading
className="text-2xl md:text-3xl"

// Product Title
className="text-lg md:text-xl"

// Body Text
className="text-base md:text-lg"

// Small Text
className="text-sm"

// Extra Small (Labels)
className="text-xs tracking-widest uppercase"
```

### Font Weights

```jsx
className="font-normal"    // 400
className="font-medium"    // 500
className="font-semibold"  // 600
className="font-bold"      // 700
className="font-extrabold" // 800
```

---

## 📐 Layout Utilities

### Containers

```jsx
// Standard page container
<div className="container-page">
  {/* max-w-1280px, mx-auto, px-4 md:px-8 */}
</div>

// Section padding
<section className="section-padding">
  {/* py-16 md:py-20 lg:py-24 */}
</section>
```

### Grids

```jsx
// Product Grid (4 columns)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// Categories Grid (3 columns)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// Testimonials Grid (3 columns)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// 2-Column Promo
<div className="grid md:grid-cols-2 gap-6">
```

---

## 🎯 Common Component Patterns

### Card

```jsx
<div className="bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
  {/* Content */}
</div>
```

### Button - Primary

```jsx
<button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
  Click Me
</button>
```

### Button - Secondary

```jsx
<button className="px-8 py-4 border-2 border-foreground text-foreground rounded-lg font-semibold hover:bg-foreground/10 transition-colors">
  Learn More
</button>
```

### Icon Button

```jsx
<button className="p-2 rounded-lg hover:bg-primary/10 transition-colors focus-ring">
  <Icon className="w-5 h-5" />
</button>
```

### Input Field

```jsx
<input 
  className="px-6 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
  type="text"
  placeholder="Enter text..."
/>
```

### Badge

```jsx
<span className="px-3 py-1 bg-rose-700 text-primary-foreground text-sm font-bold rounded-md">
  Sale
</span>
```

---

## 🖼️ Image Guidelines

### Aspect Ratios

```jsx
// Hero Images
className="aspect-[16/9]"

// Product Images
className="aspect-[4/3]"

// Category Images
className="aspect-[4/3]"
```

### Image with Hover Scale

```jsx
<div className="relative overflow-hidden">
  <img 
    src={image}
    alt={title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
  />
</div>
```

### Image Overlays

```jsx
// Dark gradient
<div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />

// Minimal gradient
<div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/30" />
```

---

## ✨ Animation Patterns

### Hover Scale

```jsx
className="hover:scale-105 transition-transform duration-300"
```

### Hover Translate

```jsx
className="group-hover:translate-x-1 transition-transform"
className="group-hover:translate-y-0 transition-transform"
```

### Hover Color

```jsx
className="text-foreground/80 hover:text-foreground transition-colors"
```

### Hover Shadow

```jsx
className="shadow-md hover:shadow-xl transition-shadow duration-300"
```

### Bounce Animation

```jsx
className="animate-bounce"
```

---

## 📱 Responsive Design

### Show/Hide on Breakpoints

```jsx
// Hide on mobile, show on desktop
className="hidden md:block"

// Show on mobile, hide on desktop
className="md:hidden"

// Inline on mobile, block on desktop
className="inline md:block"
```

### Responsive Spacing

```jsx
className="px-4 md:px-8 lg:px-16"
className="py-8 md:py-12 lg:py-16"
className="gap-4 md:gap-6 lg:gap-8"
```

### Responsive Grid Columns

```jsx
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
```

### Responsive Flex Direction

```jsx
className="flex flex-col md:flex-row"
```

---

## 🎨 Section Templates

### Section Header

```jsx
<div className="text-center mb-12 md:mb-16">
  <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
    Label Text
  </p>
  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
    Section Title
  </h2>
</div>
```

### Section with Header and CTA

```jsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
  <div className="mb-6 md:mb-0">
    <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
      Label
    </p>
    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
      Title
    </h2>
  </div>
  <button className="flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
    View All
    <ArrowRight className="w-5 h-5" />
  </button>
</div>
```

---

## 🔗 Lucide Icons Usage

```jsx
import { 
  ArrowRight, 
  ChevronDown, 
  Star, 
  Mail, 
  MapPin, 
  Phone,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";

// In JSX
<ArrowRight className="w-5 h-5" />
<Star className="w-4 h-4 fill-amber-600 text-amber-600" />
```

---

## ♿ Accessibility

### Focus States

```jsx
className="focus-ring"  // Custom utility
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
```

### ARIA Labels

```jsx
<button aria-label="Add to wishlist">
  <Heart className="w-5 h-5" />
</button>
```

### Alt Text

```jsx
<img src={image} alt={`${productName} - Handcrafted furniture`} />
```

---

## 🎯 Quick Checklist

When creating a new component:

- [ ] Use `container-page` for layout containment
- [ ] Apply `section-padding` for consistent spacing
- [ ] Use `font-display` for headings, `font-body` for text
- [ ] Add hover states for interactive elements
- [ ] Include focus states for accessibility
- [ ] Test on mobile, tablet, and desktop
- [ ] Add ARIA labels to icon-only buttons
- [ ] Use semantic HTML (section, article, nav, etc.)
- [ ] Apply transition classes for smooth animations
- [ ] Use `group` and `group-hover:` for parent-child interactions

---

## 📞 Color Reference

```css
/* Primary */
--primary: hsl(92, 25%, 52%);           /* #93A267 */
--primary-foreground: hsl(35, 50%, 98%); /* #faf5ed */

/* Wood Tones */
--wood-dark: hsl(25, 35%, 30%);    /* #6b4423 */
--wood-medium: hsl(30, 40%, 55%);  /* #b38b5d */
--wood-light: hsl(35, 30%, 75%);   /* #d4c3ad */
--wood-header: hsl(35, 30%, 85%);  /* #e8ded0 */

/* Neutrals */
--background: #faf0e6;  /* Cream */
--foreground: #2c2c2c;  /* Charcoal */
--card: #ffffff;        /* White */
--border: hsl(0, 0%, 89%); /* #e3e3e3 */
--muted-foreground: #6b7280; /* Gray */

/* Accents */
--amber-600: #d97706;
--amber-700: #b45309;
--teal-600: #0d9488;
--rose-700: #be123c;
--orange-600: #ea580c;
```

---

## 🚀 Performance Tips

1. **Images**: Use WebP format with JPG fallback
2. **Lazy Loading**: Add `loading="lazy"` to images below fold
3. **Code Splitting**: Import components dynamically if large
4. **CSS Transitions**: Prefer CSS over JS animations
5. **Debounce**: Use for search inputs and resize handlers

---

**Happy Coding! 🎨**  
*IZHAYAM HANDLOOM FURNITURE*
