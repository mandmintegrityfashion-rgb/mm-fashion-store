module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: "#1F2D3D",
        charcoal: "#1A2332",
        slate: "#2D3748",
        gold: "#4C9EFF",
        "gold-light": "#E6F0FA",
        "gold-dark": "#1A5DAB",
        rose: "#B76E79",
        ivory: "#F7FAFC",
        "surface-muted": "#F1F5F9",
        // Keep legacy for backward compat
        luxuryGreen: "#546258",
        royalCream: "#F8ECDC",
        lightGold: "#E6F0FA",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #4C9EFF, #1A5DAB)",
        "dark-gradient": "linear-gradient(135deg, #1F2D3D, #1A2332)",
        "ivory-gradient": "linear-gradient(180deg, #F7FAFC, #F1F5F9)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        overpass: ["var(--font-overpass)", "sans-serif"],
      },
      boxShadow: {
        "premium": "0 4px 16px rgba(31, 45, 61, 0.06)",
        "premium-lg": "0 8px 32px rgba(31, 45, 61, 0.08)",
        "premium-xl": "0 16px 48px rgba(31, 45, 61, 0.12)",
        "gold": "0 4px 24px rgba(76, 158, 255, 0.15)",
        "gold-lg": "0 8px 32px rgba(76, 158, 255, 0.2)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
