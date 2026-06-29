import { FaqSection } from '#/components/FaqSection'
import type { Locale } from '#/lib/i18n/locale'

type LegalPageKind = 'privacy' | 'sales'

type LocalizedLegalPageProps = {
  locale: Locale
  page: LegalPageKind
}

type LegalSection = {
  title: string
  body: Array<string>
}

type LegalPageContent = {
  eyebrow: string
  title: string
  intro: string
  reviewNotice: string
  sections: Array<LegalSection>
}

const legalLastUpdated = {
  isoDate: '2026-06-29',
  text: {
    no: 'Sist oppdatert: 29. juni 2026',
    en: 'Last updated: June 29, 2026',
  },
} satisfies {
  isoDate: `${number}-${number}-${number}`
  text: Record<Locale, string>
}

export function LocalizedLegalPage({ locale, page }: LocalizedLegalPageProps) {
  const content = legalContent[locale][page]

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {content.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {content.intro}
        </p>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          <time dateTime={legalLastUpdated.isoDate}>
            {legalLastUpdated.text[locale]}
          </time>
        </p>
        <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm font-medium leading-6">
          {content.reviewNotice}
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,42rem)_minmax(18rem,1fr)]">
        <div className="space-y-10">
          {content.sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {page === 'sales' ? (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FaqSection locale={locale} scope="full" />
          </aside>
        ) : null}
      </div>
    </main>
  )
}

const legalContent: Record<Locale, Record<LegalPageKind, LegalPageContent>> = {
  no: {
    privacy: {
      eyebrow: 'Engela Art',
      title: 'Personvernerklæring',
      intro:
        'Denne siden forklarer hvordan Engela Art behandler opplysninger når du bruker nettstedet, sender henvendelser eller fullfører et manuelt salg utenfor nettstedet.',
      reviewNotice:
        'Juridisk sluttgjennomgang kreves før produksjonsgodkjenning. Teksten er praktisk publiseringsutkast, ikke endelig juridisk eller regnskapsmessig rådgivning.',
      sections: [
        {
          title: 'Behandlingsansvarlig og kontakt',
          body: [
            'Engela Art er behandlingsansvarlig for personopplysninger som samles inn gjennom nettstedet og den etterfølgende kjøpsdialogen. Endelige ENK-detaljer og organisasjonsnummer må bekreftes før produksjonslansering.',
            'Personvernspørsmål og henvendelser sendes via kontaktsiden eller til kontakt@engelaart.no. Nøyaktig privat bostedsadresse og personlig e-postadresse publiseres ikke på nettstedet.',
          ],
        },
        {
          title: 'Opplysninger som behandles',
          body: [
            'Kontaktskjemaet samler inn navn, e-postadresse, valgfritt telefonnummer, meldingstekst og eventuell maleri- eller bestillingsreferanse.',
            'Systemet legger til språk, henvendelsestype og servergenerert tidspunkt. Skjemaet samler ikke inn postadresse, betalingskort, konto, innlogging eller opplastede filer.',
          ],
        },
        {
          title: 'Formål og grunnlag',
          body: [
            'Opplysningene brukes til å svare på henvendelser, avklare tilgjengelighet, håndtere interesselister, diskutere bestillingsverk og følge opp manuelle salg.',
            'Grunnlaget er normalt at behandlingen er nødvendig for å svare på forespørselen din, forberede eller følge opp en avtale, oppfylle lovpålagte plikter, eller ivareta en berettiget interesse i sikker drift, dokumentasjon og kravshåndtering.',
            'Etter et fullført salg kan nødvendige opplysninger brukes til faktura, bokføring, levering, reklamasjon, retur, dokumentasjon og rettskrav.',
          ],
        },
        {
          title: 'Leverandører og informasjonskapsel',
          body: [
            'Resend brukes for nettstedets transaksjonelle e-post, Zoho for den menneskelige virksomhetsmailboksen, PostHog for personvernvennlig cookieless statistikk og Sentry for feilovervåking med filtrering av sensitive data.',
            'Nettstedet bruker én nødvendig language-preference cookie når du velger språk. Den inneholder bare språkkoden, varer i ett år og brukes for å vise riktig språk ved senere besøk.',
            'Det vises ingen samtykkebanner for ikke-nødvendige informasjonskapsler fordi v1 ikke bruker ikke-nødvendige cookies, reklamesporing eller innebygde sosiale medier.',
          ],
        },
        {
          title: 'Lagring og rettigheter',
          body: [
            'Mislykkede eller uaktuelle henvendelser slettes eller anonymiseres normalt 12 måneder etter siste kontakt. Interesseoppføringer slettes når maleriet er solgt eller når videre oppfølging ikke lenger er nødvendig.',
            'Fullførte salgsoppføringer, regnskapsgrunnlag og relevant salgsdokumentasjon kan beholdes i fem år når det trengs for bokføring, reklamasjonshåndtering eller rettskrav. Aktive klager eller tvister beholdes til saken er avsluttet.',
            'Du kan be om innsyn, retting, sletting, begrensning, dataportabilitet eller protest der reglene gir slike rettigheter. Du kan også klage til Datatilsynet. Kontakt Engela Art via kontaktsiden eller på kontakt@engelaart.no.',
          ],
        },
      ],
    },
    sales: {
      eyebrow: 'Engela Art',
      title: 'Salg, vilkår og retur',
      intro:
        'Denne siden samler vilkår, betaling, levering, retur og praktisk kjøpsinformasjon for originale malerier som selges manuelt etter dialog.',
      reviewNotice:
        'Juridisk sluttgjennomgang kreves før produksjonsgodkjenning. Salgs-, angrerett-, reklamasjons- og regnskapsordlyd må godkjennes profesjonelt før lansering.',
      sections: [
        {
          title: 'Struktur og selgeridentitet',
          body: [
            'Engela Art bruker to offentlige informasjonssider i v1: Personvernerklæring og Salg, vilkår og retur. Det opprettes ikke egne sider for vilkår eller betaling og levering før salgsmodellen trenger mer detaljerte skiller.',
            'Selger er Engela Art. Endelige ENK-detaljer og organisasjonsnummer må bekreftes før produksjonslansering. Privat bostedsadresse deles ikke offentlig; nødvendig hentested deles privat etter avtale.',
          ],
        },
        {
          title: 'Originale malerier, priser og avtale',
          body: [
            'Nettstedet viser originale fysiske malerier fra Engela Art.',
            'Alle tilgjengelige malerier viser pris i NOK. Prisen inkluderer ikke frakt, toll, importkostnader eller særskilt emballasje med mindre dette er skriftlig avtalt. Alle v1-malerier selges uten ramme.',
            'Det finnes ingen handlekurv eller nettbasert checkout. Kjøp skjer først etter skriftlig dialog der maleri, tilgjengelighet, pris, betaling, levering og eventuelle forbehold er bekreftet.',
            'Nettsidens vilkår er informasjonsbasert veiledning. Bindende aksept skjer i transaksjonsspesifikk skriftlig e-post, faktura eller kommisjonsforslag når endelig maleri, pris, levering og omfang er kjent.',
          ],
        },
        {
          title: 'Betaling',
          body: [
            'Etter at tilgjengelighet, tilstand og levering er bekreftet skriftlig, sender Engela Art faktura eller annen manuell betalingsavtale. Betaling kan normalt gjøres med bankoverføring, Vipps Business eller PayPal Business.',
            'Betaling må være mottatt før sending eller overlevering med mindre Engela Art uttrykkelig avtaler noe annet skriftlig. Ingen betalingskort eller betalingsopplysninger samles inn på nettstedet.',
          ],
        },
        {
          title: 'Henting, sporbar frakt og marked',
          body: [
            'Henting i Nannestad etter avtale er mulig. Nøyaktig hentested deles privat først etter at kjøper og tidspunkt er bekreftet.',
            'Norge er standardmarkedet ved lansering. Innenlands frakt avtales enkeltvis, kjøper får beskjed om fraktkostnad før betaling, og alle sendte malerier bruker sporbar frakt med passende tilgjengelig dekning.',
            'Transportør velges etter maleriets størrelse, verdi, destinasjon, tilgjengelig sporing og praktisk forsikring eller dekning. Leveringstid er estimat, ikke garanti.',
            'Internasjonalt salg vurderes fra sak til sak. Mottakerland, transportør, sporing, dekning, tollpapirer, importkostnader, leveringstid og totalpris må avklares før reservasjon eller faktura.',
          ],
        },
        {
          title: 'Angrerett, reklamasjon og retur',
          body: [
            'Engela Art følger lovpålagte regler for angrerett, reklamasjon og refusjon der de gjelder. Endelig ordlyd må kontrolleres mot faktisk virksomhetsform og salgssituasjon før lansering.',
            'Kontakt Engela Art via kontaktsiden eller på kontakt@engelaart.no før retur. Vent på returavklaring før du sender maleriet tilbake, slik at pakking, adresse, frist, dokumentasjon og eventuell fraktmåte kan avklares.',
            'Maleriet må pakkes trygt, og kjøper betaler normalt returfrakt ved angrerett med mindre loven eller den konkrete avtalen sier noe annet. Ved feil, transportskade eller vesentlig avvik fra beskrivelsen håndteres løsning, frakt og refusjon etter faktum, avtale og ufravikelige regler.',
          ],
        },
        {
          title: 'Opphavsrett, ansvar og endringer',
          body: [
            'Kjøp av et originalt maleri overfører eierskap til den fysiske gjenstanden, ikke opphavsretten til motivet, fotografier eller annet innhold. Kommersiell bruk, reproduksjon og påstand om egen opphavsrett krever skriftlig tillatelse.',
            'Farger, skjermvisning og rombilder kan avvike noe fra fysisk maleri. Ingenting på nettstedet begrenser ufravikelige forbrukerrettigheter.',
            'Engela Art kan oppdatere denne informasjonen når virksomhetsdetaljer, leverandører, salgsprosess eller juridisk gjennomgang endres. Den konkrete avtalen som ble skriftlig bekreftet for et kjøp, styrer det kjøpet.',
          ],
        },
        {
          title: 'Tilstandsbilder og dokumentasjon',
          body: [
            'Før sending dokumenterer Engela Art maleriet, detaljer, emballering og lukket pakke. Kjøper bes om å fotografere pakken før åpning og maleriet kort tid etter utpakking.',
            'Før retur bes kjøper fotografere maleriet, emballering og lukket returpakke. Etter mottatt retur dokumenterer Engela Art pakken og maleriet.',
            'Bildene støtter tilstandsvurdering og fraktkrav. Manglende eller ufullstendige bilder fjerner ikke lovpålagte rettigheter.',
            'Ettersalgsbilder, skadeinformasjon og kravsdokumentasjon sendes til kontakt@engelaart.no. Nettstedet har ingen opplastingskontroll for filer.',
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      eyebrow: 'Engela Art',
      title: 'Privacy',
      intro:
        'This page explains how Engela Art processes information when you use the website, send inquiries, or complete an off-site manual sale.',
      reviewNotice:
        'Final legal review required before production approval. This is practical publication draft copy, not final legal or accounting advice.',
      sections: [
        {
          title: 'Controller and contact',
          body: [
            'Engela Art is the controller for personal data collected through the website and the following purchase conversation. Final ENK details and organization number must be confirmed before production launch.',
            'Privacy questions and inquiries can be sent through the Contact page or to kontakt@engelaart.no. The exact private residential address and personal email address are not published on the website.',
          ],
        },
        {
          title: 'Information collected',
          body: [
            'The contact form collects name, email address, optional phone number, message text, and any painting or commission reference.',
            'The system adds language, inquiry type, and a server-generated timestamp. The form does not collect postal address, card details, accounts, login credentials, or uploaded files.',
          ],
        },
        {
          title: 'Purposes and legal bases',
          body: [
            'Information is used to answer inquiries, confirm availability, manage interest-list conversations, discuss commission inquiries, and follow up manual sales.',
            'The legal basis is normally that processing is necessary to answer your request, prepare or follow up an agreement, comply with legal obligations, or pursue a legitimate interest in secure operation, documentation, and claims handling.',
            'After a completed sale, necessary information may be used for invoicing, bookkeeping, delivery, complaints, returns, documentation, and legal claims.',
          ],
        },
        {
          title: 'Processors and language cookie',
          body: [
            'Resend is used for website transactional email, Zoho for the human-operated business mailbox, PostHog for privacy-conscious cookieless analytics, and Sentry for error monitoring with sensitive-data filtering.',
            'The website uses one necessary language-preference cookie when you choose a language. It contains only the language code, lasts one year, and helps show the right language on later visits.',
            'No non-essential cookie banner is shown because v1 uses no non-essential cookies, advertising tracking, or embedded social feeds.',
          ],
        },
        {
          title: 'Retention and rights',
          body: [
            'Unsuccessful inquiries are normally deleted or anonymized 12 months after the last contact. Interest-list entries are deleted when the painting is sold or when follow-up is no longer necessary.',
            'Completed-sale records, accounting material, and relevant sales documentation may be retained for five years when needed for bookkeeping, complaint handling, or legal claims. Active complaints or disputes are retained until resolved.',
            'You may ask for access, correction, deletion, restriction, data portability, or objection where the rules provide those rights. You may also complain to the Norwegian Data Protection Authority. Contact Engela Art through the Contact page or at kontakt@engelaart.no.',
          ],
        },
      ],
    },
    sales: {
      eyebrow: 'Engela Art',
      title: 'Sales, terms, and returns',
      intro:
        'This page combines terms, payment, delivery, returns, and practical purchase information for original paintings sold manually after direct communication.',
      reviewNotice:
        'Final legal review required before production approval. Sales, withdrawal, complaint, and accounting wording must receive professional review before launch.',
      sections: [
        {
          title: 'Structure and seller identity',
          body: [
            'Engela Art uses two public information pages in v1: Privacy and Sales, terms, and returns. Separate Terms or Payment/Delivery pages are not added until the sales model needs that extra separation.',
            'The seller is Engela Art. Final ENK details and organization number must be confirmed before production launch. The private residential address is not public; any necessary pickup location is shared privately after agreement.',
          ],
        },
        {
          title: 'Original paintings, prices, and agreement',
          body: [
            'The website presents original physical paintings from Engela Art.',
            'All available paintings show prices in NOK. Listed price excludes shipping, customs, import charges, and special packaging unless this is agreed in writing. All v1 paintings are sold unframed.',
            'There is no cart or online checkout. A purchase happens only after written communication confirms the painting, availability, price, payment, delivery, and any transaction-specific conditions.',
            'Website terms are informational guidance. Binding acceptance happens in transaction-specific written email, invoice, or commission proposal after final painting, price, delivery, and scope are known.',
          ],
        },
        {
          title: 'Payment',
          body: [
            'After availability, condition, and delivery are confirmed in writing, Engela Art sends an invoice or other manual payment agreement. Payment can normally be made by bank transfer, Vipps Business, or PayPal Business.',
            'Payment must be received before shipping or handover unless Engela Art explicitly agrees otherwise in writing. No card or payment details are collected on the website.',
          ],
        },
        {
          title: 'Pickup, tracked shipping, and market',
          body: [
            'Pickup in Nannestad by arrangement is possible. The exact pickup location is shared privately only after the buyer and time are confirmed.',
            'Norway is the standard launch market. Domestic shipping is agreed case by case, the buyer is told the shipping cost before payment, and every shipped painting uses tracked shipping with appropriate available coverage.',
            'Carrier is selected according to painting size, value, destination, available tracking, and practical insurance or coverage. Delivery time is an estimate, not a guarantee.',
            'International sales are assessed case by case. Destination, carrier, tracking, coverage, customs documents, import charges, delivery estimate, and total price must be clarified before reservation or invoice.',
          ],
        },
        {
          title: 'Withdrawal, complaints, and returns',
          body: [
            'Engela Art follows mandatory withdrawal, complaint, and refund rules where they apply. Final wording must be checked against the actual business form and sale situation before launch.',
            'Contact Engela Art through the Contact page or at kontakt@engelaart.no before returning a painting. Wait for return clarification before sending the painting back, so packaging, address, deadline, documentation, and any shipping method can be clarified.',
            'The painting must be packed safely, and the buyer normally pays withdrawal-related return shipping unless law or the specific agreement says otherwise. Faults, transit damage, or material differences from the description are handled according to the facts, agreement, and mandatory rules.',
          ],
        },
        {
          title: 'Copyright, limitations, and changes',
          body: [
            'Buying an original painting transfers ownership of the physical object, not copyright in the motif, photographs, or other content. Commercial use, reproduction, and claims of authorship require written permission.',
            'Colours, screen display, and staged room images may differ from the physical painting. Nothing on the website limits mandatory consumer rights.',
            'Engela Art may update this information when business details, providers, sales process, or legal review changes. The transaction-specific agreement confirmed in writing for a purchase controls that purchase.',
          ],
        },
        {
          title: 'Condition photos and documentation',
          body: [
            'Before dispatch, Engela Art documents the painting, details, packaging, and sealed parcel. The buyer is asked to photograph the parcel before opening and the painting soon after unpacking.',
            'Before a return, the buyer is asked to photograph the painting, packaging, and sealed return parcel. After a return arrives, Engela Art documents the parcel and painting.',
            'Photos support condition assessment and shipping claims. Missing or incomplete photos do not remove mandatory rights.',
            'Post-sale photos, damage information, and claim documentation are sent to kontakt@engelaart.no. The website has no file upload control.',
          ],
        },
      ],
    },
  },
}
