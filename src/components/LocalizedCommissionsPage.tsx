import type { Locale } from '#/lib/i18n/locale'
import { localizedPaths } from '#/lib/i18n/routes'

import { Button } from './ui/button'

type CommissionTier = {
  name: string
  price: string
  timeline: string
}

export function LocalizedCommissionsPage({ locale }: { locale: Locale }) {
  const copy = commissionsCopy[locale]
  const contactHref = `${localizedPaths[locale].contact}?type=commission`

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
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
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={contactHref}>{copy.action}</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={localizedPaths[locale].paintings}>
              {copy.paintingsAction}
            </a>
          </Button>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        {copy.principles.map((principle) => (
          <article
            key={principle.title}
            className="rounded-md border border-border bg-surface p-5"
          >
            <h2 className="text-lg font-semibold">{principle.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {principle.body}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {copy.guidanceTitle}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            {copy.guidanceIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.tiers.map((tier) => (
            <CommissionTierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {copy.processTitle}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            {copy.processIntro}
          </p>
        </div>
        <ol className="space-y-4">
          {copy.process.map((step, index) => (
            <li
              key={step}
              className="grid grid-cols-[2rem_1fr] gap-4 border-b border-border pb-4 last:border-b-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-md border border-border bg-surface p-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {copy.approvalTitle}
        </h2>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
          {copy.approvalItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function CommissionTierCard({ tier }: { tier: CommissionTier }) {
  return (
    <article className="rounded-md border border-border bg-surface p-5">
      <h3 className="font-semibold">{tier.name}</h3>
      <p className="mt-3 text-sm font-semibold text-primary">{tier.price}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {tier.timeline}
      </p>
    </article>
  )
}

const commissionsCopy = {
  no: {
    title: 'Bestillingsverk',
    intro:
      'Forespørsler må være inspirert av Engelas eget uttrykk. Siden hvert arbeid vurderes individuelt, er dette en samtalestart og ikke en bestilling, avtale eller fast pris.',
    action: 'Start en forespørsel om bestillingsverk',
    paintingsAction: 'Se malerier som referanse',
    principles: [
      {
        title: 'Innenfor Engelas praksis',
        body: 'Nye malerier diskuteres når ønsket passer med Engelas materialer, uttrykk og motivverden. Urelaterte stiler eller dekoroppdrag kan avslås.',
      },
      {
        title: 'Ingen nøyaktig kopi',
        body: 'Et eksisterende maleri kan brukes som retning, men en nøyaktig reproduksjon loves ikke.',
      },
      {
        title: 'Kunstnerens vurdering',
        body: 'Engela kan takke nei, stille oppfølgingsspørsmål eller sende et skriftlig forslag hvis oppdraget virker riktig.',
      },
    ],
    guidanceTitle: 'Veiledende fra-priser og tidslinjer',
    guidanceIntro:
      'Prisene er startpunkter, og tidslinjene er omtrentlige. Det skriftlige forslaget setter endelig pris og plan etter størrelse, medium, materialer, motiv, detaljnivå og levering.',
    tiers: [
      {
        name: 'Liten studie, opptil 30 x 30 cm',
        price: 'fra 1 000 kr',
        timeline: 'omtrent 2-4 uker',
      },
      {
        name: 'Medium, opptil 50 x 50 cm',
        price: 'fra 3 000 kr',
        timeline: 'omtrent 4-8 uker',
      },
      {
        name: 'Stort, opptil 70 x 70 cm',
        price: 'fra 5 000 kr',
        timeline: 'omtrent 6-12 uker',
      },
      {
        name: 'Større eller uvanlig format',
        price: 'prises individuelt',
        timeline: 'estimeres individuelt',
      },
    ],
    processTitle: 'Slik fungerer prosessen',
    processIntro:
      'Bestillingsverk starter med en forespørsel og blir først bindende gjennom et skriftlig forslag som begge parter godtar.',
    process: [
      'Du beskriver ønsket retning, mulig størrelse, budsjett og eventuelle referansemalerier.',
      'Engela vurderer om oppdraget passer kunstnerisk og praktisk.',
      'Hvis arbeidet kan tas videre, sender hun et skriftlig forslag med konsept, mål, medium, pris, tidslinje, tilbakemeldingspunkter, levering og betaling.',
      'Standard betalingsplan er 50% depositum før arbeidet begynner og 50% sluttbetaling etter ferdig godkjenning og før levering eller henting.',
      'Prosessen inkluderer én konseptavklaring og én fremdriftsoppdatering. Store endringer krever separat avtale om pris og tid.',
    ],
    approvalTitle: 'Forventninger før du sender',
    approvalItems: [
      'En forespørsel oppretter ikke et godkjent oppdrag, ordre, betalingskrav eller garantert tidsplan.',
      'Arbeidet starter ikke før et skriftlig forslag er godtatt og depositum er betalt.',
      'Levering eller henting avtales i forslaget. Frakt kommer i tillegg der det er aktuelt.',
      'Ferdige bestillingsverk kan vises i Engela Arts portfolio med mindre personvern avtales skriftlig før arbeidet starter.',
      'Avbestilling og depositum må vurderes opp mot norsk forbrukerrett før endelig publisering.',
      'Norsk tekst, engelske oversettelser og kommersielle vilkår trenger kunstnerens og eventuell juridisk/regnskapsmessig godkjenning før lansering.',
    ],
  },
  en: {
    title: 'Commissions',
    intro:
      "New paintings are discussed only when they fit Engela's existing artistic practice. A message starts a conversation; it is not an order, accepted commission, fixed quote, or guaranteed schedule.",
    action: 'Start a commission inquiry',
    paintingsAction: 'View paintings for reference',
    principles: [
      {
        title: "Within Engela's practice",
        body: "Commission requests should be inspired by Engela's existing materials, visual language, and subjects. Unrelated styles or decorative briefs may be declined.",
      },
      {
        title: 'No exact reproduction',
        body: 'Exact reproductions are not promised. An existing painting can guide mood, scale, palette, or texture without becoming a copy request.',
      },
      {
        title: 'Artist review first',
        body: 'Engela may decline, ask follow-up questions, or send a written proposal when the request is a good fit.',
      },
    ],
    guidanceTitle: 'Indicative from-prices and timelines',
    guidanceIntro:
      'These are starting points, not automatic quotes. The written proposal sets the final price and schedule based on dimensions, medium, materials, subject, detail, complexity, and delivery.',
    tiers: [
      {
        name: 'Small study, up to 30 x 30 cm',
        price: 'from NOK 1,000',
        timeline: 'approximately 2-4 weeks',
      },
      {
        name: 'Medium, up to 50 x 50 cm',
        price: 'from NOK 3,000',
        timeline: 'approximately 4-8 weeks',
      },
      {
        name: 'Large, up to 70 x 70 cm',
        price: 'from NOK 5,000',
        timeline: 'approximately 6-12 weeks',
      },
      {
        name: 'Larger or unusual format',
        price: 'quoted individually',
        timeline: 'estimated individually',
      },
    ],
    processTitle: 'How the process works',
    processIntro:
      'Commission work starts with an inquiry and becomes real only through a written proposal that both sides accept.',
    process: [
      'You describe the desired direction, possible size, budget, and any reference paintings.',
      'Engela reviews whether the request fits creatively and practically.',
      'If the work can move forward, she sends a written proposal covering concept, dimensions, medium, price, timeline, feedback points, delivery, and payment.',
      'The default payment schedule is a 50% deposit before work begins and 50% final payment after completion approval and before delivery or pickup.',
      'The process includes one concept confirmation and one progress update. Major changes require a separate agreement on price and timing.',
    ],
    approvalTitle: 'Expectations before you inquire',
    approvalItems: [
      'An inquiry does not create an accepted project, order, payment request, or guaranteed schedule.',
      'Work does not begin before the written proposal is accepted and the deposit has cleared.',
      'Delivery or pickup is agreed in the proposal. Shipping is added where relevant.',
      'Completed commissions may appear in the Engela Art portfolio unless privacy is agreed in writing before work begins.',
      'Cancellation and deposit terms need review against Norwegian consumer law before final publication.',
      'Norwegian copy, English translations, and commercial terms still need artist and possible legal/accounting approval before launch.',
    ],
  },
} as const
