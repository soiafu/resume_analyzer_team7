const uploadPdf = async (req, res) => {
  res.status(200).json({"hello":"world"})
}

const uploadText = async (req, res) => {
  res.status(200).json({"good":"bye"})
}

module.exports = {
  uploadPdf,
  uploadText
}