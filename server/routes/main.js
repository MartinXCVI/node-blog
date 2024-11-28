const express = require('express')
const router = express.Router()
const Post = require('../models/Post')


/* ROUTES */

// Home - GET
router.get('/', async (req, res)=> {

  try{
    const locals = {
      title: "Node Blog",
      description: "Simple blog created with Node/Express/Mongo"
    }

    let perPage = 5
    let page = req.query.page || 1

    const data = await Post.aggregate([{ $sort: {createdAt: -1} }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec()

    const count = await Post.countDocuments()
    const nextPage = parseInt(page) + 1
    const hasNextPage = nextPage <= Math.ceil(count / perPage)

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null
    })

  } catch(error) {
    console.error(error)
  }
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