const { sendEmail } = require("../service/emailService");
const transformFormData = require("../utils/transformFormData");
const handleError = require("../utils/errorHandler");

async function emailController(req, res) {
  const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15MB
  let emailPayload;

  // 1. Enforce total attachment size
  const totalSize = req.files?.reduce((acc, file) => acc + file.size, 0) || 0;
  if (totalSize > MAX_TOTAL_SIZE) {
    return res.status(413).json({
      error: true,
      message: "Total attachment size exceeds 15MB limit.",
    });
  }

  // 2. Transform
  try {
    emailPayload = transformFormData(req.body, req.files);
  } catch (transformErr) {
    handleError("Form Data Transformation Error", transformErr);
    return res.status(400).json({
      error: true,
      message: transformErr.message,
    });
  }

  // 3. Validate required fields
  const requiredFields = [
    "from",
    "to",
    "subject",
    "smtp-host",
    "smtp-user",
    "smtp-pass",
    "smtp-port",
  ];
  const missing = requiredFields.filter((f) => !emailPayload[f]);
  if (missing.length > 0) {
    return res.status(400).json({
      error: true,
      message: `Missing required field(s): ${missing.join(", ")}`,
    });
  }

  // 4. Send email
  try {
    const response = await sendEmail(emailPayload);
    clearFileBuffers(req.files); // clear memory
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: response,
    });
  } catch (err) {
    handleError("Email Sending Error", err);
    clearFileBuffers(req.files); // clear memory
    return res.status(500).json({
      error: true,
      message: "Failed to send email",
      details: err.message,
    });
  }
}

function clearFileBuffers(files) {
  if (!files) return;
  for (const file of files) {
    file.buffer = null; // dereference buffer
  }
}

module.exports = { emailController };
