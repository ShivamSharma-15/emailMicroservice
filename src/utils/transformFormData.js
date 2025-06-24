function transformFormData(formData, files) {
  try {
    const {
      from,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      replyTo,
      headers,
      alternatives,
      list,

      "smtp-host": smtpHost,
      "smtp-user": smtpUser,
      "smtp-pass": smtpPass,
      "smtp-port": smtpPort,
    } = formData;

    const normalizeRecipients = (field) =>
      field ? field.split(",").map((s) => s.trim()) : undefined;

    const safeJsonParse = (value) => {
      try {
        return value ? JSON.parse(value) : undefined;
      } catch {
        return undefined;
      }
    };

    const attachments = Array.isArray(files)
      ? files.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        }))
      : [];

    return {
      from,
      to: normalizeRecipients(to),
      cc: normalizeRecipients(cc),
      bcc: normalizeRecipients(bcc),
      subject,
      text,
      html,
      replyTo,
      attachments,
      headers: safeJsonParse(headers),
      alternatives: safeJsonParse(alternatives),
      list: safeJsonParse(list),

      "smtp-host": smtpHost,
      "smtp-user": smtpUser,
      "smtp-pass": smtpPass,
      "smtp-port": smtpPort,
    };
  } catch (error) {
    throw new Error("Failed to transform form data: " + error.message);
  }
}

module.exports = transformFormData;
