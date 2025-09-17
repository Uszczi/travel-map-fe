import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_SDK,
  tracesSampleRate: 1,
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
