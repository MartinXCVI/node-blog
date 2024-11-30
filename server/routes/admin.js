const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET

// Check login - GET
const authMiddleware = (req, res, next)=> {
  const token = req.cookies.token

  if(!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.userId = decoded.userId
    next()
  } catch(error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Admin/Login page - GET
router.get('/admin', async (req, res)=> {
  try {
    const locals = {
      title: "Admin",
      description: "Simple blog created with Node/Express/Mongo"
    }

    res.render('admin/index', { locals, layout: adminLayout })
  } catch(error) {
    console.error(error)
  }
})

// Admin - Check login - POST
router.post('/admin', async (req, res)=> {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if(!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPassValid = await bcrypt.compare(password, user.password)
    if(!isPassValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret)
    res.cookie('token', token, { httpOnly: true })
    res.redirect('/dashboard')

  } catch(error) {
    console.error(error)
  }
})

// Admin - Dashboard - GET
router.get('/dashboard', authMiddleware, async (req, res)=> {
  try {
    const locals = {
      title: 'Dashboard',
      description: "Simple blog created with Node/Express/Mongo"
    }

    const data = await Post.find()
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    })
  } catch(error) {
    console.error(error)
  }
})

// Admin - Create new post - GET

router.get('/addPost', authMiddleware, async (req, res)=> {
  try {
    const locals = {
      title: 'Add Post',
      description: "Simple blog created with Node/Express/Mongo"
    }

    const data = await Post.find()
    res.render('admin/addPost', {
      locals,
      layout: adminLayout
    })
  } catch(error) {
    console.error(error)
  }
})

// Admin - Create new post - POST

router.post('/addPost', authMiddleware, async (req, res)=> {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      })
      await Post.create(newPost)
      res.redirect('/dashboard')
    } catch(error) {
      console.error(error)
    }

  } catch(error) {
    console.error(error)
  }
})

// Admin - Edit post - GET
router.get('/editPost/:id', authMiddleware, async (req, res)=> {
  try {
    const locals = {
      title: 'Add Post',
      description: "Simple blog created with Node/Express/Mongo"
    }

    const data = await Post.findOne({ _id: req.params.id })
    res.render('admin/editPost', {
      locals,
      data,
      layout: adminLayout
    })
  } catch(error) {
    console.error(error)
  }
})

// Admin - Edit post - PUT
router.put('/editPost/:id', authMiddleware, async (req, res)=> {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    })
    res.redirect(`/editPost/${req.params.id}`)
  } catch(error) {
    console.error(error)
  }
})

// Admin - Delete post - DELETE
router.delete('/deletePost/:id', authMiddleware, async (req, res)=> {
  try {
    await Post.deleteOne({ _id: req.params.id })
    res.redirect('/dashboard')
  } catch(error) {
    console.error(error)
  }
})


// Admin - logout - GET
router.get('/logout', (req, res)=> {
  res.clearCookie('token')
  res.redirect('/')
})

/*------------------------------------------*/
// Admin - Register - POST
router.post('/register', async (req, res)=> {
  try {
    const { username, password } = req.body

    const hashedPass = await bcrypt.hash(password, 10)
    try {
      const user = await User.create({ username, password: hashedPass })
      res.status(201).json({ message: 'User created', user })
    } catch(error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use' })
      }
      res.status(500).json({ message: 'Internal server error' })
    }

  } catch(error) {
    console.error(error)
  }
})


module.exports = router