import { env } from '#/env'

export const defaultPublicContactEmail = 'kontakt@engelaart.no'

export function getPublicContactEmail() {
  return env.VITE_PUBLIC_CONTACT_EMAIL ?? defaultPublicContactEmail
}
