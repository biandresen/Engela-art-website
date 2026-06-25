import { Link } from '@tanstack/react-router'

const navigationItems = [
  { to: '/paintings', label: 'Paintings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-8 lg:px-12">
        <Link
          to="/"
          aria-label="Engela Art home"
          className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <picture>
            <source
              srcSet="/assets/brand/logo-header-dark.webp"
              type="image/webp"
            />
            <img
              src="/assets/brand/logo-header-dark.png"
              width="720"
              height="202"
              alt="Engela Art"
              className="h-auto w-28 sm:w-52"
            />
          </picture>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-3 text-xs sm:gap-8 sm:text-sm">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  activeProps={{
                    className: 'text-foreground',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
