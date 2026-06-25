import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© {new Date().getFullYear()} Engela Art</p>
        <Link
          to="/contact"
          className="w-fit underline-offset-4 hover:text-foreground hover:underline"
        >
          Contact
        </Link>
      </div>
    </footer>
  )
}
