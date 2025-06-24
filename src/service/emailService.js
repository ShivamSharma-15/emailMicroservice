const nodemailer = require("nodemailer");
const { buildEmailOptions } = require("../utils/buildEmailOptions");
const handleError = require("../utils/errorHandler");
const { heal } = require("../utils/heal");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmail(emailParams) {
  const {
    "smtp-host": smtpHost,
    "smtp-user": smtpUser,
    "smtp-pass": smtpPass,
    "smtp-port": smtpPort,
  } = emailParams;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("Missing SMTP credentials (host, user, pass)");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = buildEmailOptions(emailParams);
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await transporter.sendMail(mailOptions);
      heal(response);
      return response;
    } catch (error) {
      lastError = error;
      handleError(`Email Attempt ${attempt} Failed`, error);

      if (attempt < MAX_RETRIES) {
        await wait(RETRY_DELAY);
      }
    }
  }

  heal({
    error: true,
    message: lastError?.message,
    data: lastError?.response?.data || null,
  });

  throw lastError;
}

module.exports = {
  sendEmail,
};
