import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: "#0B3D6B",
          light: "#1A5996",
          dark: "#07294A",
          50: "#EBF4FB",
          100: "#C2DDF2",
          200: "#99C7E9",
          300: "#70B0DF",
          400: "#4799D6",
          500: "#1A5996",
          600: "#0B3D6B",
          700: "#092E52",
          800: "#061F38",
          900: "#03101E",
        },
        sand: {
          DEFAULT: "#C9A96E",
          light: "#E2C99A",
          dark: "#A07840",
          50: "#FDF8F0",
          100: "#F5EAD5",
          200: "#E2C99A",
          300: "#D5B880",
          400: "#C9A96E",
          500: "#B89355",
          600: "#A07840",
          700: "#7D5C30",
          800: "#5A4122",
          900: "#372713",
        },
        coconut: {
          DEFAULT: "#FAF7F2",
          dark: "#F0EBE0",
          darker: "#E5DDD0",
        },
        palm: {
          DEFAULT: "#2D6A4F",
          light: "#40916C",
          dark: "#1B4332",
          50: "#ECFDF5",
          100: "#C6F0DC",
          200: "#95E0BC",
          300: "#52C98D",
          400: "#40916C",
          500: "#2D6A4F",
          600: "#1B4332",
          700: "#15362A",
          800: "#0E2620",
          900: "#071613",
        },
        charcoal: "#1C1C1E",
        warmgray: "#6B6560",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-1": ["5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-2": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-3": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "heading-1": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "heading-2": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-3": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.005em" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "20px",
        "3xl": "32px",
        "4xl": "48px",
      },
      boxShadow: {
        "luxury": "0 4px 24px rgba(11, 61, 107, 0.08), 0 1px 4px rgba(11, 61, 107, 0.04)",
        "luxury-md": "0 8px 40px rgba(11, 61, 107, 0.12), 0 2px 8px rgba(11, 61, 107, 0.06)",
        "luxury-lg": "0 16px 64px rgba(11, 61, 107, 0.16), 0 4px 16px rgba(11, 61, 107, 0.08)",
        "sand": "0 4px 24px rgba(201, 169, 110, 0.2)",
        "glass": "0 8px 32px rgba(11, 61, 107, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backgroundImage: {
        "gradient-ocean": "linear-gradient(135deg, #0B3D6B 0%, #1A5996 100%)",
        "gradient-sand": "linear-gradient(135deg, #C9A96E 0%, #E2C99A 100%)",
        "gradient-tropical": "linear-gradient(160deg, #0B3D6B 0%, #2D6A4F 100%)",
        "gradient-hero": "linear-gradient(to bottom, rgba(7,41,74,0.3) 0%, rgba(7,41,74,0.6) 60%, rgba(7,41,74,0.85) 100%)",
        "gradient-warm": "linear-gradient(135deg, #FAF7F2 0%, #F0EBE0 100%)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "section": "6rem",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
