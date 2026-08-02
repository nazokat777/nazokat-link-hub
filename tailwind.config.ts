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
        ink: "#070409", // asosiy fon: chuqur plum-qora
        panel: "#0E0C16", // karta yuzasi
        panel2: "#161327", // ko'tarilgan yuza (hover, pill)
        line: "rgba(235, 230, 255, 0.08)", // 1px chegaralar

        // Matn ierarxiyasi
        fg: {
          hi: "#F5F3FF", // sarlavhalar
          mid: "#B8B2CE", // asosiy matn
          low: "#8A84A2", // ikkinchi darajali (glass yuzada ham WCAG AA ≥4.5:1)
        },

        // Nafis-texnologik aksent spektri: lavanda → atirgul-pushti → shampan
        // (token nomlari tarixiy — iris/cyan/magenta — qiymatlar ayollarga xos
        // elegant palitraga ko'chirilgan)
        iris: {
          DEFAULT: "#BE95FF",
          soft: "#D4BBFF",
        },
        cyan: {
          DEFAULT: "#FF7EB6",
          soft: "#FFA3CF",
        },
        magenta: "#F6C177",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        // Karta: ustki ichki yorug'lik chizig'i + yumshoq tashqi soya
        card: "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 36px -18px rgba(0,0,0,0.8)",
        // Aksent bloom (hover holatida karta ostidan taraladigan nur)
        glow: "0 0 40px -8px rgba(190, 149, 255, 0.45)",
        "glow-cyan": "0 0 40px -8px rgba(255, 126, 182, 0.38)",
        // Avatar atrofidagi nur
        halo: "0 10px 60px -10px rgba(255, 126, 182, 0.45)",
      },
      borderRadius: {
        "3.5xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
