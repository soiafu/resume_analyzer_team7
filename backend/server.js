require("dotenv").config()

const express = require("express")
const routes = require("./routes")
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use("/api", routes)

app.listen(process.env.PORT, () => {
  console.log("listening on port", process.env.PORT)
})