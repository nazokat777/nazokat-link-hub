# 🌆 Nazokat — Cyberpunk Synthwave Link Hub

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion asosida qurilgan
shaxsiy Link Hub. Qora fon, neon pushti/binafsha aksentlar va glassmorphism.

## 🚀 Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda: http://localhost:3000

## 🧩 Skriptlar

| Buyruq            | Vazifa                          |
| ----------------- | ------------------------------- |
| `npm run dev`     | Development server              |
| `npm run build`   | Production build                |
| `npm run start`   | Build'ni ishga tushirish        |
| `npm run lint`    | ESLint tekshiruvi               |
| `npm run type-check` | TypeScript tiplarini tekshirish |

## 📁 Struktura

```
LINK HUB/
├── app/
│   ├── globals.css        # Neon + glassmorphism global uslublar
│   ├── layout.tsx         # Root layout, fontlar, Analytics sozlamasi
│   └── page.tsx           # Asosiy sahifa (Server Component)
├── components/
│   ├── Icon.tsx           # lucide-react ikonkalarini dinamik render
│   ├── LinkCard.tsx       # Havola kartasi (Framer Motion)
│   ├── ProfileHeader.tsx  # Avatar + ism + bio
│   └── SocialBar.tsx      # Ijtimoiy tarmoqlar qatori
├── data/
│   └── links.json         # Barcha havolalar (kelajakda CMS bilan almashtiriladi)
├── lib/
│   └── getLinks.ts        # Type-safe data-access layer
└── types/
    └── index.ts           # Markaziy TypeScript interfeyslar
```

## ✏️ Havolalarni tahrirlash

Faqat `data/links.json` faylini o'zgartiring. Kod tegmaydi.

## 🔌 CMS'ga o'tish

`lib/getLinks.ts` ichidagi JSON o'qishni CMS API chaqiruviga almashtiring —
qaytish tipi (`LinkHubData`) bir xil qolgani uchun komponentlar o'zgarmaydi.

## 📊 Vercel Analytics

`app/layout.tsx` yuqorisidagi izohli ko'rsatmaga amal qiling.
```bash
npm install @vercel/analytics @vercel/speed-insights
```

## ☁️ Deploy

[Vercel](https://vercel.com/new) ga repozitoriyni ulang — avtomatik deploy bo'ladi.
