require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')

const connectDB = require('./server/config/dbConnect')

const app = express()
const PORT = 5000 || process.env.PORT

// DB connection
connectDB()

app.use(express.static('public'))

// Templating engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main'))

app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}...`)
})