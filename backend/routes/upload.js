const express = require("express")

const {
  getThing
} = require("../controllers/uploadController")

const router = express.Router()

router.get("/", getThing)

module.exports = router