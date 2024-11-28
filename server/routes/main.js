const express = require('express')
const router = express.Router()


// Routes
router.get('/', (req, res)=> {
  const locals = {
    title: "Node Blog",
    description: "Simple blog created with Node/Express/Mongo"
  }
  res.render('index', { locals })
})

router.get('/about', (req, res)=> {
  const locals = {
    title: "Node Blog: About",
    description: "Simple blog created with Node/Express/Mongo"
  }
  res.render('about', { locals })
})

router.get('/contact', (req, res)=> {
  const locals = {
    title: "Node Blog: Contact",
    description: "Simple blog created with Node/Express/Mongo"
  }
  res.render('contact', { locals })
})

module.exports = router