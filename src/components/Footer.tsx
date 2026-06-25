import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="mt-16 bg-footer text-footer-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <picture>
            <source
              srcSet="/assets/brand/logo-footer-light.webp"
              type="image/webp"
            />
            <img
              src="/assets/brand/logo-footer-light.png"
              width="720"
              height="202"
              alt="Engela Art"
              className="h-auto w-44"
              loading="lazy"
            />
          </picture>
          <p>© {new Date().getFullYear()}</p>
        </div>
        <Link
          to="/contact"
          className="w-fit rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-footer-foreground"
        >
          Contact
        </Link>
      </div>
    </footer>
  )
}
