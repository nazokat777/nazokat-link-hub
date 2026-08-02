# Nazokat Abduazizova — Link Hub

AI mutaxassis · AI Content Creator · UI/UX dizayner · Software Engineer uchun
shaxsiy link hub. "AI Futurizm" uslubi: chuqur kosmik fon, neon spektr va
GSAP boshqaradigan wow-animatsiyalar.

**Jonli sayt:** https://nazokat777.github.io/nazokat-link-hub/

## Stack

| Qatlam | Texnologiya |
| --- | --- |
| Framework | Next.js 14 (App Router, Server Components) |
| Til | TypeScript (strict) |
| Uslub | Tailwind CSS + dizayn tokenlari |
| Animatsiya | GSAP 3 (SplitText, ScrambleText, ScrollTrigger, quickTo) |
| Ikonkalar | lucide-react (nomma-nom import — tree-shaking uchun) |
| Shriftlar | Unbounded + Manrope (self-hosted) |

## Animatsiyalar

- **Preloader** — Figma-uslub seleksiya ramkasi, RGB-split glitch matn,
  0→100 hisoblagich, so'ng 5 vertikal panelga bo'linib ochiladigan parda.
  Sessiya davomida bir marta ko'rsatiladi (`sessionStorage`).
- **Hero** — ism harf-harf 3D reveal (SplitText), gradient familiya, rollar
  ScrambleText bilan almashadi, portret holo-kartada kursor parallaksi bilan.
- **Fon** — kursorga reaksiya beruvchi neyron-tarmoq canvas'i + aurora nurlar.
- **Havolalar** — glass kartalar, spotlight, 3D tilt, scroll stagger va
  velocity-skew.
- **Boshqa** — custom cursor, magnetic ikonkalar, cheksiz marquee, scroll
  progress chizig'i, jonli Toshkent vaqti.

Barcha harakat `prefers-reduced-motion` ni hurmat qiladi.

## Ishga tushirish

```bash
npm install
npm run dev
```

Sayt http://localhost:3000 da ochiladi.

| Buyruq | Vazifa |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Ishlab chiqarish build'i |
| `npm run start` | Build'ni ishga tushirish |
| `npm run type-check` | TypeScript tekshiruvi |
| `npm run lint` | ESLint |

## Struktura

```
LINK HUB/
├── app/
│   ├── globals.css        # Dizayn tizimi, aurora, glass, glitch
│   ├── layout.tsx         # Root layout, shriftlar, metadata
│   └── page.tsx           # Asosiy sahifa (Server Component)
├── components/
│   ├── Preloader.tsx      # Kirish pardasi
│   ├── Hero.tsx           # SplitText ism + rol rotatori
│   ├── PortraitCard.tsx   # Holo-karta portret (parallaks, shine)
│   ├── NeuralField.tsx    # Neyron-tarmoq canvas fon
│   ├── CustomCursor.tsx   # Ikki qatlamli kursor
│   ├── LinksSection.tsx   # Scroll reveal + velocity skew
│   ├── LinkCard.tsx       # Spotlight + 3D tilt karta
│   ├── RoleMarquee.tsx    # Cheksiz teg lentasi
│   ├── ScrollProgress.tsx # Tepadagi progress chizig'i
│   ├── SiteFooter.tsx     # Jonli Toshkent vaqti
│   └── Icon.tsx           # Ikonka xaritasi
├── data/links.json        # Barcha kontent va havolalar
├── lib/                   # Data-access + intro sinxronizatsiyasi
└── types/index.ts         # Markaziy TypeScript interfeyslar
```

## Kontentni tahrirlash

Barcha matn va havolalar — [`data/links.json`](data/links.json) da.
Komponentlarga tegmasdan profil, rollar, teglar va havolalarni o'zgartirish
mumkin. Ikonka nomlari [`components/Icon.tsx`](components/Icon.tsx) dagi
xaritadan olinadi (yangi ikonka kerak bo'lsa o'sha yerga qo'shiladi).

## CMS'ga o'tish

`lib/getLinks.ts` ichidagi JSON o'qishni CMS API chaqiruviga almashtiring —
qaytish tipi (`LinkHubData`) bir xil qolgani uchun komponentlar o'zgarmaydi.

## Deploy

- **GitHub Pages** — `main` ga har push'da avtomatik
  ([workflow](.github/workflows/deploy-pages.yml)). `GITHUB_PAGES=true`
  bo'lganda statik eksport va `basePath` yoqiladi.
- **Vercel** — [vercel.com/new](https://vercel.com/new) dan repozitoriyani
  import qiling; qo'shimcha sozlama shart emas (odatiy Next server rejimi).
