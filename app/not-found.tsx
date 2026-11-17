import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__inner">
        <p className="not-found__code" aria-hidden="true">404</p>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__text">
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="not-found__link">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
