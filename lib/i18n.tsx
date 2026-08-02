"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Yengil klient-tomon i18n: uz / en / ru. Matnlar bitta lug'atda (dict)
 * saqlanadi; `data/links.json` faqat struktura (id, url, icon, featured).
 * Til localStorage'da saqlanadi, standart — o'zbekcha (SSR bilan mos).
 *
 * Copy ataylab so'zma-so'z emas — har tilda nafis, xalqaro brend ohangida.
 */

export const LANGS = ["uz", "en", "ru"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, string> = {
  uz: "O'z",
  en: "EN",
  ru: "RU",
};

interface LinkCopy {
  title: string;
  description: string;
}

interface Dict {
  bio: string;
  roles: string[];
  tags: string[];
  links: Record<string, LinkCopy>;
  ui: {
    linksKicker: string;
    linksTitle: string;
    status: string;
    verified: string;
    footerLocation: string;
    footerTag: string;
    marqueeStop: string;
    marqueeResume: string;
    socialsLabel: string;
    langLabel: string;
  };
}

export const dict: Record<Lang, Dict> = {
  uz: {
    bio: "Sun'iy intellekt va dizayn chorrahasida ishlayman — g'oyangizni sotadigan, esda qoladigan raqamli tajribaga aylantiraman.",
    roles: [
      "AI mutaxassisi",
      "AI Content Creator",
      "UI/UX mutaxassisi",
      "UI/UX dizayneri",
      "Software Engineer",
    ],
    tags: [
      "AI mutaxassisi",
      "AI Content",
      "UI/UX dizayn",
      "Software Engineer",
      "Prompt Engineering",
      "Sun'iy intellekt",
    ],
    links: {
      portfolio: {
        title: "Ishlarim",
        description: "Saralangan AI va dizayn loyihalari — natijani o'zingiz ko'ring.",
      },
      telegram: {
        title: "Telegram kanal",
        description: "AI, promptlar va dizayn — har kuni amaliy bilim.",
      },
      github: {
        title: "GitHub",
        description: "Ochiq kodli loyihalar va AI eksperimentlar.",
      },
      instagram: {
        title: "Instagram",
        description: "Dizayn va AI jarayoni — sahna ortidan.",
      },
      email: {
        title: "Hamkorlik",
        description: "Loyihangizni yozing — 24 soat ichida javob beraman.",
      },
    },
    ui: {
      linksKicker: "// Havolalar",
      linksTitle: "Meni shu yerda toping",
      status: "Yangi loyihalarga ochiqman",
      verified: "Tasdiqlangan profil",
      footerLocation: "Toshkent, O'zbekiston",
      footerTag: "AI × Dizayn",
      marqueeStop: "To'xtatish",
      marqueeResume: "Davom ettirish",
      socialsLabel: "Ijtimoiy tarmoqlar",
      langLabel: "Til",
    },
  },
  en: {
    bio: "I work at the intersection of artificial intelligence and design — turning your idea into a digital experience that sells and stays remembered.",
    roles: [
      "AI Specialist",
      "AI Content Creator",
      "UI/UX Specialist",
      "UI/UX Designer",
      "Software Engineer",
    ],
    tags: [
      "AI Specialist",
      "AI Content",
      "UI/UX Design",
      "Software Engineer",
      "Prompt Engineering",
      "Artificial Intelligence",
    ],
    links: {
      portfolio: {
        title: "My work",
        description: "Selected AI & design projects — see the results for yourself.",
      },
      telegram: {
        title: "Telegram channel",
        description: "AI, prompts and design — practical knowledge, every day.",
      },
      github: {
        title: "GitHub",
        description: "Open-source projects and AI experiments.",
      },
      instagram: {
        title: "Instagram",
        description: "Design & AI process — behind the scenes.",
      },
      email: {
        title: "Let's collaborate",
        description: "Tell me about your project — I reply within 24 hours.",
      },
    },
    ui: {
      linksKicker: "// Links",
      linksTitle: "Where to find me",
      status: "Available for new projects",
      verified: "Verified profile",
      footerLocation: "Tashkent, Uzbekistan",
      footerTag: "AI × Design",
      marqueeStop: "Pause",
      marqueeResume: "Resume",
      socialsLabel: "Social links",
      langLabel: "Language",
    },
  },
  ru: {
    bio: "Работаю на стыке искусственного интеллекта и дизайна — превращаю вашу идею в цифровой опыт, который продаёт и запоминается.",
    roles: [
      "AI-специалист",
      "AI Content Creator",
      "UI/UX-специалист",
      "UI/UX-дизайнер",
      "Software Engineer",
    ],
    tags: [
      "AI-специалист",
      "AI Content",
      "UI/UX-дизайн",
      "Software Engineer",
      "Prompt Engineering",
      "Искусственный интеллект",
    ],
    links: {
      portfolio: {
        title: "Мои работы",
        description: "Избранные проекты по AI и дизайну — оцените результат сами.",
      },
      telegram: {
        title: "Telegram-канал",
        description: "AI, промпты и дизайн — практика каждый день.",
      },
      github: {
        title: "GitHub",
        description: "Проекты с открытым кодом и AI-эксперименты.",
      },
      instagram: {
        title: "Instagram",
        description: "Процесс дизайна и AI — за кулисами.",
      },
      email: {
        title: "Сотрудничество",
        description: "Расскажите о проекте — отвечу в течение 24 часов.",
      },
    },
    ui: {
      linksKicker: "// Ссылки",
      linksTitle: "Где меня найти",
      status: "Открыта для новых проектов",
      verified: "Подтверждённый профиль",
      footerLocation: "Ташкент, Узбекистан",
      footerTag: "AI × Дизайн",
      marqueeStop: "Пауза",
      marqueeResume: "Продолжить",
      socialsLabel: "Социальные сети",
      langLabel: "Язык",
    },
  },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  // Klientda saqlangan tilni tiklaymiz (SSR mosligi uchun effektda)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved && LANGS.includes(saved)) setLangState(saved);
    } catch {
      /* private mode */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* private mode */
    }
  };

  const value = useMemo<LangCtx>(() => ({ lang, setLang, t: dict[lang] }), [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
