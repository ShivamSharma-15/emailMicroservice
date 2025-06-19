const express = require("express");
const { emailController } = require("../controller/emailController");
const router = express.Router();
const upload = require("../middleware/multer");

// Routes to handle templates and non templates
router.post("/sendEmail", upload.any(), emailController);

module.exports = router;
