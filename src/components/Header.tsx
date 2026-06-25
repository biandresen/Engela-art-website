import { Link } from '@tanstack/react-router'

const navigationItems = [
  { to: '/paintings', label: 'Paintings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Engela Art
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-5 text-sm sm:gap-8">
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
