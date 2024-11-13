const pdfParse = require('pdf-parse');

const uploadPdf = async (req, res) => {
  let file = req.file
  console.log(file)

  if (!file) {
    return res.status(400).json({
      "error": "File not found",
      "status": "error"
    })
  }

  if (file.mimetype != "application/pdf") {
    return res.status(400).json({
      "error": "Invalid file type. Only PDF files are allowed.",
      "status": "error"
    })
  }
  
  if (file.size > 2000000) {
    return res.status(400).json({
      "error": "File is too big",
      "status": "error"
    })
  }

  try {
    const resume = await pdfParse(file.buffer)

    // send resume to NLP

  } catch {
    res.status(500).json({
      "message": "Error parsing PDF",
      "status": "error"
    })
  }

  res.status(200).json({
    "message": "Resume uploaded successfully.",
    "status": "success"
  })
}

const uploadText = async (req, res) => {
  let resume = req.body["job-description"]

  if (!resume) {
    return res.status(400).json({
      "error": "Job description not provided.",
      "status": "error"
    })
  }

  resume = resume.trim();
  
  if (resume.length > 5000) {
    return res.status(400).json({
      "error": "Job description exceeds character limit.",
      "status": "error"
    })
  }

  // send resume to NLP

  res.status(200).json({
    "message": "Job description submitted successfully.",
    "status": "success"
  })
}

module.exports = {
  uploadPdf,
  uploadText
}