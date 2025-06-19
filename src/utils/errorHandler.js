const Sentry = require("@sentry/node");

function handleError(context, error) {
  const timestamp = new Date().toISOString();

  // Log to console
  console.error(`[${timestamp}] [${context}]`, {
    message: error.message,
    stack: error.stack,
  });

  // Capture error in Sentry
  Sentry.captureException(error, {
    tags: { context },
    extra: {
      timestamp,
      message: error.message,
      stack: error.stack,
    },
  });
}

module.exports = handleError;
