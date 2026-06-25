# Use privacy-filtered error monitoring

V1 will use Sentry's free tier for unexpected browser and server errors because proactive failure visibility is more reliable than manually checking hosting logs. Monitoring goes through a local interface and aggressively removes inquiry contents, direct identifiers, and sensitive query data before events leave the application.
