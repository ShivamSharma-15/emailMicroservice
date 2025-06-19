const nodemailer = require("nodemailer");
require("dotenv").config();
const { buildEmailOptions } = require("../utils/buildEmailOptions");
const handleError = require("../utils/errorHandler");
const { heal } = require("../utils/heal");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmail(emailParams) {
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
