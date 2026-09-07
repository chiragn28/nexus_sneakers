import type { Product } from '../types';
import aj1ChicagoImg from '../assets/products/aj1-chicago.png';
import aj1BredToeImg from '../assets/products/aj1-bred-toe.png';
import aj1RoyalImg from '../assets/products/aj1-royal.png';
import dunkLowPandaImg from '../assets/products/dunk-low-panda.png';
import dunkLowUncImg from '../assets/products/dunk-low-unc.png';
import af1TripleWhiteImg from '../assets/products/af1-triple-white.png';
import af1TripleBlackImg from '../assets/products/af1-triple-black.png';
import aj4MilitaryBlackImg from '../assets/products/aj4-military-black.png';
import aj4BredImg from '../assets/products/aj4-bred.png';
import aj11ConcordImg from '../assets/products/aj11-concord.png';
import aj3WhiteCementImg from '../assets/products/aj3-white-cement.png';
import aj5FireRedImg from '../assets/products/aj5-fire-red.png';
import aj12FluGameImg from '../assets/products/aj12-flu-game.png';
import am1AnniversaryRedImg from '../assets/products/am1-anniversary-red.png';
import am90InfraredImg from '../assets/products/am90-infrared.png';
import am97SilverBulletImg from '../assets/products/am97-silver-bullet.png';
import sbDunkCourtPurpleImg from '../assets/products/sb-dunk-court-purple.png';
import blazerMid77Img from '../assets/products/blazer-mid-77.png';

/* ============================================================================
 * NEXUS SNEAKERS — CENTRAL PRODUCT CATALOGUE
 * ============================================================================
 *
 * This is the ONLY file you need to touch to change the catalogue. No component
 * reads product data from anywhere else.
 *
 * ---------------------------------------------------------------------------
 * ARTWORK vs PHOTOGRAPHY
 * ---------------------------------------------------------------------------
 * Every product carries BOTH:
 *
 *   image: ''   → falls back to `art`
 *   art: {...}  → a colourway spec rendered by <SneakerArt>: one shared side-
 *                 profile geometry, one shared studio backdrop, per-model
 *                 colours and cut. That's what keeps the grid uniform.
 *
 * These are original vector illustrations in each model's real colourway — not
 * official product photography, which is copyrighted and can't be redistributed
 * here.
 *
 * TO DROP IN REAL PHOTOS (nothing else has to change):
 *   a) LOCAL FILES (recommended) — put files in `src/assets/products/`, then at
 *      the top of this file:
 *          import aj1Chicago from '../assets/products/aj1-chicago.webp';
 *      and set `image: aj1Chicago`. Vite fingerprints and bundles it.
 *   b) REMOTE URL — `image: 'https://cdn.example.com/aj1-chicago.webp'`.
 *
 *   Shoot/crop at ~4:3 landscape on a plain light background so photos sit on
 *   the same studio panel as the artwork. If a photo 404s at runtime the art
 *   automatically renders again, so a broken URL never shows a broken image.
 *   Keep `art` populated even after adding photos — it's the safety net.
 *
 * ---------------------------------------------------------------------------
 * OTHER FIELDS
 * ---------------------------------------------------------------------------
 * • price — a plain number in USD. Formatting lives in `src/lib/format.ts`;
 *   never store a pre-formatted string here.
 * • Brand / category / size / price filter options are DERIVED from this array
 *   (see the exports at the bottom) — add a new brand and the filter panel picks
 *   it up automatically.
 * • isFeatured → appears in the Home "Featured Drops" rail.
 *   isNew       → renders the "NEW" badge and sorts first under "Newest".
 *   Keep newest-first ordering in this array; "Newest" uses array order as the
 *   recency proxy.
 * • id is used in the URL (`/product/:id`) and as the cart key. Keep it unique
 *   and URL-safe — changing an id invalidates saved carts and wishlists.
 * ==========================================================================*/

/* Shared palette so colourways stay consistent across models. */
const C = {
  white: '#F6F4F0',
  offWhite: '#EDEAE3',
  bone: '#E3DFD6',
  grey: '#C9C6BF',
  silver: '#C3C6CA',
  steel: '#A5A8AD',
  black: '#141414',
  jet: '#0C0C0C',
  varsityRed: '#C8102E',
  fireRed: '#CE1141',
  infrared: '#FF3B21',
  royal: '#12326E',
  unc: '#7BAFD4',
  concord: '#2B2C6E',
  icy: '#CFE3E0',
  gum: '#C08E52',
  courtPurple: '#4B2E83',
  vintage: '#E8DFC8',
} as const;

export const products: Product[] = [
  {
    id: 'aj1-chicago',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 499.0,
    category: 'Basketball',
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    colorway: 'Chicago',
    description:
      "The colourway that started everything. White tumbled leather split by varsity red overlays, a black Swoosh and the Wings logo stamped at the ankle — the 1985 original, re-cut on the OG high-top last with Nike Air branding on the tongue.",
    image: aj1ChicagoImg,
    art: {
      cut: 'high',
      base: C.white,
      overlay: C.varsityRed,
      swoosh: C.black,
      midsole: C.white,
      outsole: C.varsityRed,
      laces: C.varsityRed,
      collar: C.black,
      accent: C.varsityRed,
      label: 'Air Jordan 1 High Chicago',
    },
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'aj1-bred-toe',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 439.0,
    category: 'Basketball',
    sizes: [7, 8, 9, 9.5, 10, 11, 12, 13],
    colorway: 'Bred Toe',
    description:
      'Three panels, three eras: a varsity red toe box lifted from Chicago, a white quarter and a black heel and collar pulled from Bred. Full-grain leather over an Air-Sole unit, on a red rubber cupsole.',
    image: aj1BredToeImg,
    art: {
      cut: 'high',
      base: C.white,
      overlay: C.varsityRed,
      swoosh: C.jet,
      midsole: C.white,
      outsole: C.varsityRed,
      laces: C.jet,
      collar: C.jet,
      accent: C.varsityRed,
      label: 'Air Jordan 1 High Bred Toe',
    },
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'dunk-low-panda',
    name: 'Dunk Low Retro',
    brand: 'Nike',
    price: 139.0,
    category: 'Lifestyle',
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12, 13],
    colorway: 'Black / White ("Panda")',
    description:
      "The most-worn shoe of the decade, and for good reason. Crisp white leather base, black overlays, a flat foam midsole and a low-profile rubber outsole. Goes with everything, which is exactly why everyone has a pair.",
    image: dunkLowPandaImg,
    art: {
      cut: 'low',
      base: C.white,
      overlay: C.jet,
      swoosh: C.jet,
      midsole: C.white,
      outsole: C.white,
      laces: C.white,
      collar: C.jet,
      accent: C.jet,
      label: 'Nike Dunk Low Panda',
    },
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'af1-triple-white',
    name: "Air Force 1 '07",
    brand: 'Nike',
    price: 119.0,
    category: 'Lifestyle',
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    colorway: 'Triple White',
    description:
      "Bruce Kilgore's 1982 basketball shoe, unchanged where it counts. Full-grain white leather, perforated toe box, encapsulated Air in the heel and a pivot-circle outsole. The default, and undefeated.",
    image: af1TripleWhiteImg,
    art: {
      cut: 'low',
      base: '#FBFAF7',
      overlay: '#F2F0EB',
      swoosh: '#FFFFFF',
      midsole: '#FFFFFF',
      outsole: C.offWhite,
      laces: '#FFFFFF',
      collar: '#F2F0EB',
      accent: C.bone,
      label: 'Nike Air Force 1 Triple White',
    },
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'aj4-military-black',
    name: 'Air Jordan 4 Retro',
    brand: 'Jordan',
    price: 329.0,
    category: 'Basketball',
    sizes: [8, 8.5, 9, 10, 10.5, 11, 12, 13],
    colorway: 'Military Black',
    description:
      "Tinker Hatfield's 1989 design in its cleanest modern execution — white leather, black nubuck wings and neutral grey accents. Netted side panels, plastic lace cages and a visible Air unit under the heel.",
    image: aj4MilitaryBlackImg,
    art: {
      cut: 'mid',
      base: C.white,
      overlay: C.jet,
      swoosh: C.jet,
      midsole: C.white,
      outsole: C.jet,
      laces: C.jet,
      collar: C.steel,
      accent: C.steel,
      label: 'Air Jordan 4 Military Black',
    },
    isFeatured: true,
  },
  {
    id: 'aj11-concord',
    name: 'Air Jordan 11 Retro',
    brand: 'Jordan',
    price: 379.0,
    category: 'Basketball',
    sizes: [8, 9, 9.5, 10, 11, 12, 13],
    colorway: 'Concord',
    description:
      'Patent leather on a basketball shoe — still the boldest call anyone made in 1995. Ballistic mesh upper, carbon fibre spring plate and a translucent icy outsole that will yellow if you let it.',
    image: aj11ConcordImg,
    art: {
      cut: 'high',
      base: C.white,
      overlay: C.jet,
      swoosh: C.jet,
      midsole: C.white,
      outsole: C.icy,
      laces: C.white,
      collar: C.jet,
      accent: C.concord,
      label: 'Air Jordan 11 Concord',
    },
    isFeatured: true,
  },
  {
    id: 'aj1-royal',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 389.0,
    category: 'Basketball',
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colorway: 'Black / Royal Blue',
    description:
      'One of the five original 1985 colourways and the one collectors argue hardest for. Black leather quarters against royal blue overlays, with a black Swoosh and a white Air-Sole midsole.',
    image: aj1RoyalImg,
    art: {
      cut: 'high',
      base: C.jet,
      overlay: C.royal,
      swoosh: C.jet,
      midsole: C.white,
      outsole: C.royal,
      laces: C.jet,
      collar: C.royal,
      accent: C.royal,
      label: 'Air Jordan 1 High Royal',
    },
  },
  {
    id: 'am90-infrared',
    name: 'Air Max 90',
    brand: 'Nike',
    price: 149.0,
    category: 'Running',
    sizes: [7, 8, 8.5, 9, 10, 10.5, 11, 12, 13],
    colorway: 'Infrared',
    description:
      "The shoe that made the Air window impossible to ignore. Leather and mesh panelling, a waffle outsole and that infrared TPU mudguard — 1990's loudest running shoe, still legible from across the street.",
    image: am90InfraredImg,
    art: {
      cut: 'low',
      base: C.offWhite,
      overlay: C.jet,
      swoosh: C.infrared,
      midsole: C.white,
      outsole: C.jet,
      laces: C.white,
      collar: C.jet,
      accent: C.infrared,
      air: true,
      label: 'Nike Air Max 90 Infrared',
    },
    isFeatured: true,
  },
  {
    id: 'aj4-bred',
    name: 'Air Jordan 4 Retro',
    brand: 'Jordan',
    price: 419.0,
    category: 'Basketball',
    sizes: [8, 9, 9.5, 10, 11, 12, 13],
    colorway: 'Bred',
    description:
      'Black nubuck, cement grey netting and red on the tongue tag and midsole hit. The pair "The Shot" was taken in, and the one every retro list opens with.',
    image: aj4BredImg,
    art: {
      cut: 'mid',
      base: C.jet,
      overlay: C.black,
      swoosh: C.jet,
      midsole: C.jet,
      outsole: C.varsityRed,
      laces: C.jet,
      collar: C.grey,
      accent: C.varsityRed,
      label: 'Air Jordan 4 Bred',
    },
  },
  {
    id: 'dunk-low-unc',
    name: 'Dunk Low Retro',
    brand: 'Nike',
    price: 189.0,
    category: 'Lifestyle',
    sizes: [7, 8, 8.5, 9, 10, 11, 12],
    colorway: 'University Blue ("UNC")',
    description:
      'The Be True To Your School colourway that started as a 1985 college exclusive. White leather base, university blue overlays, and a soft-blue collar lining that lifts the whole shoe.',
    image: dunkLowUncImg,
    art: {
      cut: 'low',
      base: C.white,
      overlay: C.unc,
      swoosh: C.unc,
      midsole: C.white,
      outsole: C.white,
      laces: C.white,
      collar: C.unc,
      accent: C.unc,
      label: 'Nike Dunk Low University Blue',
    },
  },
  {
    id: 'aj3-white-cement',
    name: 'Air Jordan 3 Retro',
    brand: 'Jordan',
    price: 289.0,
    category: 'Basketball',
    sizes: [8, 8.5, 9, 10, 11, 12, 13],
    colorway: 'White Cement Reimagined',
    description:
      'The first Jordan with elephant print, the first with a visible Air unit, and the first with the Jumpman. Aged white leather, grey cement panels and a red Jumpman on the heel.',
    image: aj3WhiteCementImg,
    art: {
      cut: 'mid',
      base: C.white,
      overlay: C.grey,
      swoosh: C.steel,
      midsole: C.offWhite,
      outsole: C.grey,
      laces: C.white,
      collar: C.jet,
      accent: C.varsityRed,
      label: 'Air Jordan 3 White Cement',
    },
  },
  {
    id: 'am1-anniversary-red',
    name: 'Air Max 1',
    brand: 'Nike',
    price: 159.0,
    category: 'Running',
    sizes: [7, 8, 9, 9.5, 10, 11, 12],
    colorway: 'Anniversary Red',
    description:
      "Tinker Hatfield's 1987 original — the first shoe to put the Air unit on show. White mesh and leather with a varsity red mudguard, on a polyurethane midsole with the window at the heel.",
    image: am1AnniversaryRedImg,
    art: {
      cut: 'low',
      base: C.white,
      overlay: C.varsityRed,
      swoosh: C.varsityRed,
      midsole: C.white,
      outsole: C.grey,
      laces: C.white,
      collar: C.varsityRed,
      accent: C.varsityRed,
      air: true,
      label: 'Nike Air Max 1 Anniversary Red',
    },
  },
  {
    id: 'af1-triple-black',
    name: "Air Force 1 '07",
    brand: 'Nike',
    price: 119.0,
    category: 'Lifestyle',
    sizes: [7, 8, 9, 10, 10.5, 11, 12, 13],
    colorway: 'Triple Black',
    description:
      'Same 1982 pattern, blacked out end to end — leather upper, black midsole, black outsole. The pair you wear when you want the fit to do the talking.',
    image: af1TripleBlackImg,
    art: {
      cut: 'low',
      base: '#191919',
      overlay: '#0B0B0B',
      swoosh: '#242424',
      midsole: '#131313',
      outsole: '#0A0A0A',
      laces: '#2A2A2A',
      collar: '#0B0B0B',
      accent: '#333333',
      label: 'Nike Air Force 1 Triple Black',
    },
  },
  {
    id: 'aj12-flu-game',
    name: 'Air Jordan 12 Retro',
    brand: 'Jordan',
    price: 249.0,
    category: 'Basketball',
    sizes: [8, 9, 10, 11, 12, 13],
    colorway: 'Flu Game',
    description:
      'Black tumbled leather with varsity red stitching and a metallic lace lock, built on a full-length Zoom Air unit. Named for Game 5 of the 1997 Finals, and nobody has needed the story explained since.',
    image: aj12FluGameImg,
    art: {
      cut: 'mid',
      base: C.black,
      overlay: C.jet,
      swoosh: C.varsityRed,
      midsole: C.jet,
      outsole: C.varsityRed,
      laces: C.jet,
      collar: C.varsityRed,
      accent: C.varsityRed,
      label: 'Air Jordan 12 Flu Game',
    },
  },
  {
    id: 'am97-silver-bullet',
    name: 'Air Max 97',
    brand: 'Nike',
    price: 199.0,
    category: 'Running',
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colorway: 'Silver Bullet',
    description:
      'Full-length visible Air, wrapped in reflective silver ripple panels supposedly modelled on a bullet train. Christian Tresser designed it in 1997 and nothing since has looked quite like it.',
    image: am97SilverBulletImg,
    art: {
      cut: 'low',
      base: C.silver,
      overlay: C.steel,
      swoosh: C.varsityRed,
      midsole: C.silver,
      outsole: C.jet,
      laces: C.steel,
      collar: C.jet,
      accent: C.varsityRed,
      air: true,
      label: 'Nike Air Max 97 Silver Bullet',
    },
  },
  {
    id: 'aj5-fire-red',
    name: 'Air Jordan 5 Retro',
    brand: 'Jordan',
    price: 239.0,
    category: 'Basketball',
    sizes: [8, 9, 10, 11, 12],
    colorway: 'Fire Red',
    description:
      'Fighter-jet shark teeth on the midsole, a reflective 3M tongue and a translucent icy outsole. White leather with fire red trim — the 1990 pair, brought back with the black tongue liner intact.',
    image: aj5FireRedImg,
    art: {
      cut: 'mid',
      base: C.white,
      overlay: C.jet,
      swoosh: C.fireRed,
      midsole: C.white,
      outsole: C.icy,
      laces: C.jet,
      collar: C.jet,
      accent: C.fireRed,
      label: 'Air Jordan 5 Fire Red',
    },
  },
  {
    id: 'sb-dunk-court-purple',
    name: 'SB Dunk Low Pro',
    brand: 'Nike SB',
    price: 179.0,
    category: 'Skate',
    sizes: [7, 8, 9, 10, 11, 12],
    colorway: 'Court Purple',
    description:
      'The skate-spec Dunk: a fatter Zoom Air insole, a padded tongue that actually protects, and reinforced stitching where laces get shredded. Court purple suede over a white leather base.',
    image: sbDunkCourtPurpleImg,
    art: {
      cut: 'low',
      base: C.white,
      overlay: C.courtPurple,
      swoosh: C.courtPurple,
      midsole: C.white,
      outsole: C.gum,
      laces: C.courtPurple,
      collar: C.courtPurple,
      accent: C.courtPurple,
      label: 'Nike SB Dunk Low Court Purple',
    },
  },
  {
    id: 'blazer-mid-77',
    name: "Blazer Mid '77 Vintage",
    brand: 'Nike',
    price: 109.0,
    category: 'Lifestyle',
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colorway: 'Vintage White / Black',
    description:
      "Nike's first basketball shoe, kept deliberately rough around the edges — exposed foam on the tongue, a pre-yellowed midsole and an oversized Swoosh stitched straight onto the leather.",
    image: blazerMid77Img,
    art: {
      cut: 'mid',
      base: '#FAF7EF',
      overlay: C.vintage,
      swoosh: C.jet,
      midsole: C.vintage,
      outsole: C.gum,
      laces: '#FAF7EF',
      collar: C.vintage,
      accent: C.jet,
      label: "Nike Blazer Mid '77 Vintage White",
    },
  },
];

/* --------------------------------------------------------------------------
 * Derived lookups — everything below recomputes automatically from `products`.
 * ------------------------------------------------------------------------ */

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const brands: string[] = [...new Set(products.map((p) => p.brand))].sort();

export const categories: string[] = [...new Set(products.map((p) => p.category))].sort();

export const allSizes: number[] = [
  ...new Set(products.flatMap((p) => p.sizes)),
].sort((a, b) => a - b);

export const priceBounds: { min: number; max: number } = {
  min: Math.floor(Math.min(...products.map((p) => p.price))),
  max: Math.ceil(Math.max(...products.map((p) => p.price))),
};

/** Array order is the recency proxy — index 0 is the most recent drop. */
export const productOrder = new Map(products.map((p, i) => [p.id, i]));
