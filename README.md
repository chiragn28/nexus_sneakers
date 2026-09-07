# Nexus Sneakers

A bold, streetwear-flavoured sneaker storefront. Front-end only — the full shopping
flow (browse → filter → detail → cart → checkout → confirmation) is simulated, no
backend and no real payments.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

## Stack

React 18 + Vite · TypeScript · Tailwind CSS (`darkMode: 'class'`) · React Router ·
Zustand (persisted to `localStorage`) · Framer Motion · Lucide React.

## Product images

The catalogue ships with 18 real hyped models — Air Jordan 1 (Chicago, Bred Toe,
Royal), AJ3/4/5/11/12, Air Force 1, Dunk Low, SB Dunk, Air Max 1/90/97, Blazer Mid —
with their actual brands, colourways, prices and descriptions.

The images are **original vector illustrations**, not official product photography
(which is copyrighted and can't be redistributed here). `src/components/SneakerArt.tsx`
draws one shared side-profile geometry — low / mid / high ankle cuts, an optional
visible Air unit — and colours it per model. Every product sits on the same studio
panel, so the grid stays uniform.

### Swapping in real photos

Everything lives in **`src/data/products.ts`**, which has a full comment block at the
top. Short version:

- Set `image` to a URL, or `import` a file from `src/assets/products/` and use that.
  Leave it `''` and the vector artwork renders instead. If a photo URL fails at
  runtime the artwork comes back automatically, so a broken link never shows a broken
  image — keep `art` populated as the safety net.
- Shoot/crop at ~4:3 on a plain light background so photos match the studio panel.
- Brand / category / size / price filter options are **derived** from the array — new
  values appear in the filter panel automatically.

## Structure

```
src/
  data/products.ts     ← single source of product truth (edit this)
  store/useStore.ts    ← cart, wishlist, theme, toasts (persisted)
  lib/                 ← price formatting, cart join helper
  components/          ← Navbar, ProductCard, FilterPanel, CartDrawer, …
  pages/               ← Home, Shop, ProductDetail, Wishlist, Cart, About, Contact
```

## Notes

- **Theme** follows `prefers-color-scheme` on first visit, then remembers the manual
  choice. An inline script in `index.html` applies it before first paint so there's no
  flash; the toggle cross-fades every surface over 300ms.
- **Accent colour** is Nexus Orange `#FF4D00`, identical in both themes. Orange fills
  always carry black text (6.3:1); accent *text* on light backgrounds uses `#D93C00`
  (4.6:1) so both themes clear WCAG AA.
- **Persistence** covers cart, wishlist and theme only. Drawer/toast state is
  deliberately not persisted.
