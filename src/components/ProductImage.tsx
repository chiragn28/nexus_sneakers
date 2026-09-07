import { useState } from 'react';
import type { Product } from '../types';
import { cx } from '../lib/format';
import { SneakerArt } from './SneakerArt';

/**
 * The single studio panel every product sits on. It is deliberately identical
 * for all products and in both themes — that uniformity is what makes the grid
 * read like a real catalogue. Photos supplied via `product.image` land on the
 * same panel, so artwork and photography can coexist without a visible seam.
 */
interface Props {
  product: Product;
  className?: string;
  /** Scales the artwork inside the panel — smaller for thumbnails. */
  size?: 'sm' | 'md' | 'lg';
}

const ART_WIDTH = {
  sm: 'w-[88%]',
  md: 'w-[84%]',
  lg: 'w-[80%]',
} as const;

export function ProductImage({ product, className, size = 'md' }: Props) {
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(product.image) && !failed;

  return (
    <div
      className={cx(
        'relative flex h-full w-full items-center justify-center overflow-hidden',
        className,
      )}
      style={{
        background:
          'radial-gradient(circle at 50% 34%, #FFFFFF 0%, #F3F2EE 52%, #E4E2DC 100%)',
      }}
    >
      {hasPhoto ? (
        <img
          src={product.image}
          alt={`${product.brand} ${product.name} — ${product.colorway ?? ''}`.trim()}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-contain p-4"
        />
      ) : (
        <SneakerArt
          art={product.art}
          uid={product.id}
          className={cx('relative', ART_WIDTH[size])}
        />
      )}
    </div>
  );
}
