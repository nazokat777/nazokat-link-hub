import type { Config } from "tailwindcss";

/**
 * "AI Futurizm" dizayn tizimi tokenlari.
 * Chuqur kosmik qora fon + uch aksentli neon spektr (iris–cyan–magenta).
 * Barcha neytrallar binafshaga tinted — sof qora/oq ishlatilmaydi.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Yuzalar
        ink: "#050508", // asosiy fon: deyarli qora, binafsha tusli
        panel: "#0E0C16", // karta yuzasi
        panel2: "#161327", // ko'tarilgan yuza (hover, pill)
        line: "rgba(235, 230, 255, 0.08)", // 1px chegaralar

        // Matn ierarxiyasi
        fg: {
          hi: "#F5F3FF", // sarlavhalar
          mid: "#B8B2CE", // asosiy matn
          low: "#8A84A2", // ikkinchi darajali (glass yuzada ham WCAG AA ≥4.5:1)
        },

        // Neon aksent spektri
        iris: {
          DEFAULT: "#8B5CF6",
          soft: "#A78BFA",
        },
        cyan: {
          DEFAULT: "#22D3EE",
          soft: "#67E8F9",
        },
        magenta: "#E879F9",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        // Karta: ustki ichki yorug'lik chizig'i + yumshoq tashqi soya
        card: "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 36px -18px rgba(0,0,0,0.8)",
        // Aksent bloom (hover holatida karta ostidan taraladigan nur)
        glow: "0 0 40px -8px rgba(139, 92, 246, 0.45)",
        "glow-cyan": "0 0 40px -8px rgba(34, 211, 238, 0.35)",
        // Avatar atrofidagi nur
        halo: "0 10px 60px -10px rgba(139, 92, 246, 0.55)",
      },
      borderRadius: {
        "3.5xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
