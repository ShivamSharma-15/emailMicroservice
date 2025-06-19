require("./sentry/instruments.js");

const Sentry = require("@sentry/node");
const express = require("express");
const app = express();
app.use(express.json());

const sendEmail = require("./routes/emailRoute.js");
app.use("/api/email/v1", sendEmail);
Sentry.setupExpressErrorHandler(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
