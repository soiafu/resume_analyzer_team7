const express = require("express")

const {
  uploadPdf,
  uploadText
} = require("./controller")

const router = express.Router()

router.post("/resume-upload", uploadPdf)
router.post("/job-description", uploadText)

module.exports = router