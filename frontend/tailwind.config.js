/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.{js,jsx,ts,tsx}", "./src/pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Wood tones
        "wood-light": "hsl(var(--wood-light))",
        "wood-medium": "hsl(var(--wood-medium))",
        "wood-dark": "hsl(var(--wood-dark))",
        "wood-header": "hsl(var(--wood-header))",
        // Sage variations
        "sage-light": "hsl(var(--sage-light))",
        "sage-medium": "hsl(var(--sage-medium))",
        "sage-dark": "hsl(var(--sage-dark))",
        // Cream variations
        "cream-light": "hsl(var(--cream-light))",
        cream: "hsl(var(--cream))",
        "cream-dark": "hsl(var(--cream-dark))",
        // Accent colors
        "amber-600": "#d97706",
        "amber-700": "#b45309",
        "rose-700": "#be123c",
        "orange-600": "#ea580c",

        // Legacy colors (keep for backward compatibility)
        primaryColor: "hsl(92, 25%, 52%)",
        lightPrimaryColor: "hsl(92, 25%, 62%)",
        lighterPrimaryColor: "hsl(92, 25%, 75%)",
        lightestPrimaryColor: "#f5f7f0",
        darkPrimaryColor: "hsl(92, 25%, 42%)",
        secondaryColor: "#2c2c2c",
        neutralColor: "#e5e5e5",
        LightSecondaryColor: "#2c2c2c4d",
        lightestSecondaryColor: "#ecf0f9",
        lightBlack: "hsl(0deg 0% 60%)",
      },
      screens: {
        tablet: { min: "480px", max: "767px" },
        mdHeight: { raw: "(min-height:700px)" },
        lgHeight: { raw: "(min-height:850px)" },
      },
      fontFamily: {
        // Primary fonts - Inter as default
        display: ["Playfair Display", "Georgia", "serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        outfit: ["Inter", "Outfit", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],

        // Legacy support - all use Inter now
        OpenSans: ["Inter", "Open Sans", "sans-serif"],
        RobotoCondensed: ["Inter", "Roboto Condensed", "sans-serif"],
        RobotoSlab: ["Playfair Display", "Roboto Slab", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
      },
      letterSpacing: {
        'widest': '0.3em',
      },
    },
  },
  plugins: [],
};
