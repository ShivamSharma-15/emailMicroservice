function buildEmailOptions({
  from,
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  replyTo,
  attachments,
  headers,
  alternatives,
  list,
} = {}) {
  if (!from || !to || !subject) {
    throw new Error(
      "Missing required fields: from, to, and subject are required."
    );
  }

  // Helper: Normalize array or string input to comma-separated string
  const normalizeRecipients = (input) => {
    if (!input) return undefined;
    return Array.isArray(input) ? input.join(", ") : input;
  };

  const mailOptions = {
    from,
    to: normalizeRecipients(to),
    subject,
  };

  // Optional fields, included only if present
  if (cc) mailOptions.cc = normalizeRecipients(cc);
  if (bcc) mailOptions.bcc = normalizeRecipients(bcc);
  if (text) mailOptions.text = text;
  if (html) mailOptions.html = html;
  if (replyTo) mailOptions.replyTo = replyTo;
  if (attachments && attachments.length > 0)
    mailOptions.attachments = attachments;
  if (alternatives && alternatives.length > 0)
    mailOptions.alternatives = alternatives;
  if (headers && Object.keys(headers).length > 0) mailOptions.headers = headers;

  // Special handling for list headers
  if (list && Object.keys(list).length > 0) {
    const normalizedList = {};
    for (const [key, value] of Object.entries(list)) {
      if (Array.isArray(value)) {
        normalizedList[key] = value.map((item) =>
          typeof item === "string" ? item : item.url
        );
      } else {
        normalizedList[key] = value;
      }
    }
    mailOptions.list = normalizedList;
  }

  return mailOptions;
}

module.exports = { buildEmailOptions };
