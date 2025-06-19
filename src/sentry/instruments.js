const Sentry = require("@sentry/node");
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
    environment: "production",
  });
} else {
  Sentry.init({
    dsn: "",
    enabled: false,
    environment: process.env.NODE_ENV || "development",
  });
}
