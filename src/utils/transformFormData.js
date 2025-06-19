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
    } = formData;

    // Normalize recipient fields (from comma-separated strings)
    const normalizeRecipients = (field) =>
      field ? field.split(",").map((s) => s.trim()) : undefined;

    // Parse JSON-like fields if passed as strings
    const safeJsonParse = (value) => {
      try {
        return value ? JSON.parse(value) : undefined;
      } catch {
        return undefined;
      }
    };

    // Handle file attachments
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
    };
  } catch (error) {
    throw new Error("Failed to transform form data: " + error.message);
  }
}

module.exports = transformFormData;
