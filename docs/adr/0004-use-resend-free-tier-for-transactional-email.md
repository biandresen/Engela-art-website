# Use Resend free tier for transactional email

V1 will use Resend's free transactional-email tier because the inquiry flow sends only an artist notification and buyer acknowledgement, while the current free limits materially exceed expected traffic and support one authenticated custom domain. Email sending remains behind a local interface so the provider can be replaced if pricing, limits, or delivery requirements change.
