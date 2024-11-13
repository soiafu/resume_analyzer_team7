const getThing = async (req, res) => {
  res.status(200).json({"hello":"world"})
}

module.exports = {
  getThing
}