import Raven from 'raven'

export default async function (app) {
  if (!process.client && process.env.SENTRY_DNS_PRIVATE) {
    // LOGGING IS ENABLED
    console.log('SENTRY LOGGING IS ENABLED')
    Raven.config(process.env.SENTRY_DNS_PRIVATE, {
      release: app.$env.BUILD_COMMIT,
      environment: app.$env.NODE_ENV,
      tags: {
        deployed: app.$env.DEPLOY_DATE,
        client: true
      }
    }).install()

    // The request handler must be the first middleware on the app
    app.use(Raven.requestHandler())
    // The error handler must be before any other error middleware
    app.use(Raven.errorHandler())
  }
}
