const express = require("express")
const multer = require('multer');

const {
  uploadPdf,
  uploadText
} = require("./controller")

const router = express.Router()
const upload = multer();

router.post("/resume-upload", upload.single('resume_file'), uploadPdf)

router.post("/job-description", uploadText)

module.exports = router