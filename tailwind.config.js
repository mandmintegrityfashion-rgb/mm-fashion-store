module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: "#0F1923",
        charcoal: "#1A2332",
        slate: "#2D3748",
        gold: "#C9A96E",
        "gold-light": "#E8D5A8",
        "gold-dark": "#A88B4A",
        rose: "#B76E79",
        ivory: "#FDFBF7",
        "surface-muted": "#F5F0E8",
        // Keep legacy for backward compat
        luxuryGreen: "#546258",
        royalCream: "#F8ECDC",
        lightGold: "#D9B48A",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A96E, #A88B4A)",
        "dark-gradient": "linear-gradient(135deg, #0F1923, #1A2332)",
        "ivory-gradient": "linear-gradient(180deg, #FDFBF7, #F5F0E8)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        overpass: ["var(--font-overpass)", "sans-serif"],
      },
      boxShadow: {
        "premium": "0 4px 16px rgba(15, 25, 35, 0.06)",
        "premium-lg": "0 8px 32px rgba(15, 25, 35, 0.08)",
        "premium-xl": "0 16px 48px rgba(15, 25, 35, 0.12)",
        "gold": "0 4px 24px rgba(201, 169, 110, 0.15)",
        "gold-lg": "0 8px 32px rgba(201, 169, 110, 0.2)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
