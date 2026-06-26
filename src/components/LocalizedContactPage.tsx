'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import { FaqSection } from '#/components/FaqSection'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import type { Locale } from '#/lib/i18n/locale'
import { localizedPaths } from '#/lib/i18n/routes'
import { resolveInquiryContext } from '#/lib/inquiries/inquiry'
import type {
  InquiryFieldErrors,
  InquirySubmissionResult,
} from '#/lib/inquiries/inquiry'
import { submitInquiryServer } from '#/lib/inquiries/server'
import { env } from '#/env'

type LocalizedContactPageProps = {
  locale: Locale
  search: {
    type?: string
    painting?: string
  }
}

type FormValues = {
  name: string
  email: string
  phone: string
  desiredDimensions: string
  budget: string
  customBudget: string
  message: string
  website: string
}

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  desiredDimensions: '',
  budget: '',
  customBudget: '',
  message: '',
  website: '',
}

export function LocalizedContactPage({
  locale,
  search,
}: LocalizedContactPageProps) {
  const copy = contactCopy[locale]
  const paths = localizedPaths[locale]
  const context = useMemo(
    () =>
      resolveInquiryContext({
        locale,
        type: search.type,
        painting: search.painting,
      }),
    [locale, search.painting, search.type],
  )
  const [values, setValues] = useState<FormValues>({
    ...initialValues,
    message: context.prefill,
  })
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({})
  const [status, setStatus] = useState<InquirySubmissionResult | null>(null)
  const [loadedAt, setLoadedAt] = useState('')
  const [clientToken, setClientToken] = useState('')
  const previousPrefill = useRef(context.prefill)
  const isSuccess = status?.status === 'success'

  useEffect(() => {
    setLoadedAt(new Date().toISOString())
    setClientToken(createClientToken())
  }, [])

  useEffect(() => {
    setValues((current) => ({
      ...current,
      message:
        current.message === '' || current.message === previousPrefill.current
          ? context.prefill
          : current.message,
    }))
    previousPrefill.current = context.prefill
  }, [context.prefill])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = await submitInquiryServer({
      data: {
        locale,
        type: search.type,
        painting: search.painting,
        name: values.name,
        email: values.email,
        phone: values.phone,
        desiredDimensions: values.desiredDimensions,
        budget: values.budget,
        customBudget: values.customBudget,
        message: values.message,
        website: values.website,
        loadedAt,
        clientToken,
      },
    })

    setStatus(result)
    setFieldErrors(
      result.status === 'validation-error' ? result.fieldErrors : {},
    )

    if (result.status === 'success') {
      setValues({ ...initialValues, message: context.prefill })
      setClientToken(createClientToken())
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Engela Art
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {copy.intro}
          </p>

          <div className="mt-10 border-y border-border py-6">
            <h2 className="text-xl font-semibold">{context.title}</h2>
            {context.fallbackNotice ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {context.fallbackNotice}
              </p>
            ) : null}
            {context.referenceNotice ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {context.referenceNotice}
              </p>
            ) : null}
          </div>

          <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
            <FormField id="name" label={copy.name} error={fieldErrors.name}>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={values.name}
                aria-invalid={fieldErrors.name ? true : undefined}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                onChange={(event) =>
                  setValues({ ...values, name: event.target.value })
                }
              />
            </FormField>

            <FormField id="email" label={copy.email} error={fieldErrors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                onChange={(event) =>
                  setValues({ ...values, email: event.target.value })
                }
              />
            </FormField>

            <FormField id="phone" label={copy.phone} error={fieldErrors.phone}>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                aria-invalid={fieldErrors.phone ? true : undefined}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                onChange={(event) =>
                  setValues({ ...values, phone: event.target.value })
                }
              />
            </FormField>

            {context.inquiryType === 'commission' ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  id="desiredDimensions"
                  label={copy.desiredDimensions}
                  error={fieldErrors.desiredDimensions}
                >
                  <Input
                    id="desiredDimensions"
                    name="desiredDimensions"
                    value={values.desiredDimensions}
                    aria-invalid={
                      fieldErrors.desiredDimensions ? true : undefined
                    }
                    aria-describedby={
                      fieldErrors.desiredDimensions
                        ? 'desiredDimensions-error'
                        : undefined
                    }
                    onChange={(event) =>
                      setValues({
                        ...values,
                        desiredDimensions: event.target.value,
                      })
                    }
                  />
                </FormField>

                <FormField
                  id="budget"
                  label={copy.budget}
                  error={fieldErrors.budget}
                >
                  <select
                    id="budget"
                    name="budget"
                    value={values.budget}
                    aria-invalid={fieldErrors.budget ? true : undefined}
                    aria-describedby={
                      fieldErrors.budget ? 'budget-error' : undefined
                    }
                    className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm"
                    onChange={(event) =>
                      setValues({
                        ...values,
                        budget: event.target.value,
                        customBudget:
                          event.target.value === 'custom'
                            ? values.customBudget
                            : '',
                      })
                    }
                  >
                    {copy.budgetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                {values.budget === 'custom' ? (
                  <div className="sm:col-span-2">
                    <FormField
                      id="customBudget"
                      label={copy.customBudget}
                      error={fieldErrors.customBudget}
                    >
                      <Input
                        id="customBudget"
                        name="customBudget"
                        value={values.customBudget}
                        aria-invalid={
                          fieldErrors.customBudget ? true : undefined
                        }
                        aria-describedby={
                          fieldErrors.customBudget
                            ? 'customBudget-error'
                            : undefined
                        }
                        onChange={(event) =>
                          setValues({
                            ...values,
                            customBudget: event.target.value,
                          })
                        }
                      />
                    </FormField>
                  </div>
                ) : null}
              </div>
            ) : null}

            <FormField
              id="message"
              label={copy.message}
              error={fieldErrors.message}
            >
              <Textarea
                id="message"
                name="message"
                required
                rows={8}
                value={values.message}
                aria-invalid={fieldErrors.message ? true : undefined}
                aria-describedby={
                  fieldErrors.message ? 'message-error' : undefined
                }
                onChange={(event) =>
                  setValues({ ...values, message: event.target.value })
                }
              />
            </FormField>

            <div className="hidden" aria-hidden="true">
              <Label htmlFor="website">{copy.website}</Label>
              <Input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(event) =>
                  setValues({ ...values, website: event.target.value })
                }
              />
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <p className="text-sm leading-6 text-muted-foreground">
                {copy.privacyBefore}{' '}
                <a
                  href={paths.privacy}
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  {copy.privacyLink}
                </a>
                {copy.privacyAfter}
              </p>

              {status ? (
                <StatusMessage status={status} locale={locale} />
              ) : null}

              <Button type="submit" disabled={isSuccess || !loadedAt}>
                {isSuccess ? copy.sent : copy.submit}
              </Button>
            </div>
          </form>
        </section>

        <aside className="space-y-6 text-sm leading-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              {copy.fallbackTitle}
            </h2>
            <p className="mt-3">{copy.fallbackBody}</p>
            <a
              href="mailto:kontakt@engelaart.no"
              className="mt-2 inline-block underline underline-offset-4 hover:text-foreground"
            >
              kontakt@engelaart.no
            </a>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              {copy.socialTitle}
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/'}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Instagram
              </a>
              <a
                href={env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/'}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Facebook
              </a>
            </div>
          </section>

          <FaqSection locale={locale} scope="contact" />
        </aside>
      </div>
    </main>
  )
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function StatusMessage({
  status,
  locale,
}: {
  status: InquirySubmissionResult
  locale: Locale
}) {
  const copy = contactCopy[locale]

  if (status.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-md border border-available/40 bg-available/10 p-4 text-sm leading-6"
      >
        {status.acknowledgement === 'delayed'
          ? copy.successDelayed
          : copy.success}
      </div>
    )
  }

  if (status.status === 'validation-error') {
    return (
      <div role="alert" className="text-sm leading-6 text-destructive">
        {copy.validationError}
      </div>
    )
  }

  if (status.status === 'delivery-error') {
    return (
      <div role="alert" className="text-sm leading-6 text-destructive">
        {copy.deliveryError}
      </div>
    )
  }

  return (
    <div role="alert" className="text-sm leading-6 text-destructive">
      {copy.rejected}
    </div>
  )
}

function createClientToken() {
  return globalThis.crypto.randomUUID()
}

const contactCopy = {
  no: {
    title: 'Kontakt',
    intro:
      'Bruk skjemaet for forespørsler om malerier. Du kan også sende e-post til kontakt@engelaart.no.',
    name: 'Navn',
    email: 'E-post',
    phone: 'Telefon (valgfritt)',
    desiredDimensions: 'Ønskede mål (valgfritt)',
    budget: 'Budsjett (valgfritt)',
    customBudget: 'Eget budsjettområde',
    budgetOptions: [
      { value: '', label: 'Velg budsjett hvis du ønsker' },
      { value: 'under-5000', label: 'Under 5 000 kr' },
      { value: '5000-10000', label: '5 000-10 000 kr' },
      { value: '10000-20000', label: '10 000-20 000 kr' },
      { value: 'over-20000', label: 'Over 20 000 kr' },
      { value: 'unsure', label: 'Ikke sikker ennå' },
      { value: 'custom', label: 'Eget område' },
    ],
    message: 'Melding',
    website: 'Nettside',
    submit: 'Send henvendelse',
    sent: 'Henvendelse sendt',
    privacyBefore:
      'Engela Art behandler opplysningene for å svare på henvendelsen din. Les',
    privacyLink: 'personvernerklæringen',
    privacyAfter: '.',
    fallbackTitle: 'E-post som alternativ',
    fallbackBody:
      'Hvis skjemaet ikke virker, kan du sende samme informasjon direkte på e-post.',
    socialTitle: 'Sosiale medier',
    success:
      'Henvendelsen er mottatt. Dette oppretter ingen reservasjon eller avtale. Du kan forvente personlig svar innen to virkedager. Sjekk søppelpost hvis bekreftelsen ikke kommer.',
    successDelayed:
      'Henvendelsen er mottatt, men den automatiske bekreftelsen kan være forsinket. Dette oppretter ingen reservasjon eller avtale. Du kan forvente personlig svar innen to virkedager.',
    validationError: 'Sjekk feltene som er markert og prøv igjen.',
    deliveryError:
      'Henvendelsen kunne ikke sendes akkurat nå. Prøv igjen, eller send e-post til kontakt@engelaart.no.',
    rejected:
      'Henvendelsen kunne ikke sendes akkurat nå. Prøv igjen senere eller send e-post til kontakt@engelaart.no.',
  },
  en: {
    title: 'Contact',
    intro:
      'Use the form for painting inquiries. You can also email kontakt@engelaart.no.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone (optional)',
    desiredDimensions: 'Desired dimensions (optional)',
    budget: 'Budget (optional)',
    customBudget: 'Custom budget range',
    budgetOptions: [
      { value: '', label: 'Choose a budget if useful' },
      { value: 'under-5000', label: 'Under NOK 5,000' },
      { value: '5000-10000', label: 'NOK 5,000-10,000' },
      { value: '10000-20000', label: 'NOK 10,000-20,000' },
      { value: 'over-20000', label: 'Over NOK 20,000' },
      { value: 'unsure', label: 'Not sure yet' },
      { value: 'custom', label: 'Custom range' },
    ],
    message: 'Message',
    website: 'Website',
    submit: 'Send inquiry',
    sent: 'Inquiry sent',
    privacyBefore:
      'Engela Art processes this information to answer your inquiry. Read the',
    privacyLink: 'privacy notice',
    privacyAfter: '.',
    fallbackTitle: 'Email fallback',
    fallbackBody:
      'If the form does not work, send the same information directly by email.',
    socialTitle: 'Social media',
    success:
      'Your inquiry has been received. This does not create a reservation or agreement. You can expect a personal response within two business days. Check spam if the acknowledgement does not arrive.',
    successDelayed:
      'Your inquiry has been received, but the automatic acknowledgement may be delayed. This does not create a reservation or agreement. You can expect a personal response within two business days.',
    validationError: 'Check the marked fields and try again.',
    deliveryError:
      'The inquiry could not be sent right now. Try again, or email kontakt@engelaart.no.',
    rejected:
      'The inquiry could not be sent right now. Try again later or email kontakt@engelaart.no.',
  },
} as const
