# Typography System Documentation

## Font Configuration

### Installed Fonts

1. **Outfit** (Weights: 300, 400, 500, 600, 700)

   - Primary font for body text and headings
   - Modern, clean, geometric sans-serif

2. **Playfair Display** (Weights: 400, 600, 700, 800)
   - Display font for hero sections and special headings
   - Classic, elegant serif with high contrast

---

## Auto-Applied Styles

### Body Text

All body text automatically uses **Outfit** with weight 400:

```css
body {
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 400;
}
```

### Headings (h1-h6)

All headings automatically use **Outfit** with `tracking-tight`:

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  letter-spacing: -0.025em; /* tracking-tight */
}

h1,
h2 {
  font-weight: 700;
}
h3 {
  font-weight: 600;
}
h4-h6 {
  font-weight: 600;
}
```

---

## Utility Classes

### Font Family

```jsx
<div className="font-outfit">    // Outfit font
<div className="font-display">   // Playfair Display font
<div className="font-body">      // Outfit (alias)
```

### Letter Spacing (Tracking)

```jsx
<h1 className="tracking-tight">   // -0.025em (default for headings)
<p className="tracking-normal">   // 0
<p className="tracking-wide">     // 0.025em
<p className="tracking-wider">    // 0.05em
<p className="tracking-widest">   // 0.3em (for uppercase small text)
```

### Font Weights

```jsx
<p className="font-light">        // 300
<p className="font-normal">       // 400
<p className="font-medium">       // 500
<p className="font-semibold">     // 600
<p className="font-bold">         // 700
```

---

## Usage Examples

### Hero Section Heading (Playfair Display)

```jsx
<h1
  className="text-5xl font-bold tracking-tight"
  style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
>
  Inspired by Heritage
</h1>
```

### Section Heading (Outfit)

```jsx
<h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
```

### Small Uppercase Label

```jsx
<p className="text-xs tracking-widest uppercase font-medium">
  CURATED SELECTION
</p>
```

### Body Text

```jsx
<p className="text-base font-normal">
  Regular paragraph text automatically uses Outfit.
</p>
```

### Category Labels

```jsx
<span className="text-sm tracking-wider uppercase font-semibold">SOFA</span>
```

---

## Tailwind Configuration

Available in `tailwind.config.js`:

```javascript
fontFamily: {
  display: ["Playfair Display", "Georgia", "serif"],
  outfit: ["Outfit", "Inter", "system-ui", "sans-serif"],
  body: ["Outfit", "Inter", "system-ui", "sans-serif"],
}
```

---

## Quick Reference

| Element       | Font             | Weight  | Tracking |
| ------------- | ---------------- | ------- | -------- |
| Body text     | Outfit           | 400     | normal   |
| h1, h2        | Outfit           | 700     | tight    |
| h3-h6         | Outfit           | 600     | tight    |
| Hero headings | Playfair Display | 700     | tight    |
| Small labels  | Outfit           | 500-600 | widest   |
| Buttons       | Outfit           | 600     | normal   |

---

## Browser Support

Both fonts are loaded from Google Fonts with `display=swap` for optimal performance and fallback to system fonts.
