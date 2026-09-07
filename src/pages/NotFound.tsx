import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SneakerSilhouette } from '../components/SneakerSilhouette';

export function NotFound() {
  return (
    <PageTransition>
      <div className="container-nexus flex flex-col items-center py-24 text-center lg:py-32">
        <SneakerSilhouette className="mb-8 w-56 text-ink-200 dark:text-ink-800" />
        <p className="font-display text-7xl tracking-tightest text-nexus-text dark:text-nexus sm:text-8xl">
          404
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl">This pair doesn't exist</h1>
        <p className="mt-4 max-w-md text-sm text-ink-600 dark:text-ink-400">
          The page or product you're after has been moved, sold out of the catalogue, or
          never laced up in the first place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            Browse the shop
          </Link>
          <Link to="/" className="btn-outline">
            Back home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
