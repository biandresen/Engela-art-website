import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
  isActive: boolean
}

type MobileNavigationProps = {
  items: Array<NavigationItem>
  menuLabel: string
  closeLabel: string
}

export function MobileNavigation({
  items,
  menuLabel,
  closeLabel,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !isOpen) {
        return
      }

      setIsOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  function closeAfterNavigation() {
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? closeLabel : menuLabel}
        className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          aria-label={menuLabel}
          className="absolute inset-x-0 top-full border-b border-border bg-background px-4 py-4 shadow-sm"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1">
            {items.map((item, index) => (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-current={item.isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md border border-transparent bg-transparent px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    item.isActive && 'border-border bg-muted',
                  )}
                  onClick={closeAfterNavigation}
                >
                  <item.icon
                    aria-hidden="true"
                    focusable="false"
                    className="size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
