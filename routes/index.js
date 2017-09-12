const express = require('express');
const router = express.Router();
const models = require('../models')
const hash = require('../helpers/hash')

router.get('/', (req, res)=>{
  if (req.session.hasLogin) {
    res.render('index', {title: 'School Database', session: req.session});
  } else {
    res.redirect('/login')
  }
});

//Login

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login', error_login: false})
})

router.post('/login', (req, res) => {
  models.User.findAll({
    where: {
      username: `${req.body.username}`
    }
  })
    .then( user => {
      // res.send(user)
      const secret = user[0].salt
      const hashData = hash(req.body.password, secret)
      if (hashData === user[0].password) {
        req.session.hasLogin = true
        req.session.user = {
          username: user[0].username,
          role: user[0].role,
          loginTime: new Date()
        }
        res.redirect('/')
      } else {
        res.render('login', {title: 'login', error_login: true})
      }
    })
    .catch(err => {
      res.render('login', {title: 'login', error_login: true})
    })
})

//Logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;

//Register
router.get('/register', (req, res) => {
  res.render('register', {title: 'Register', error_reg: false, session: req.session})
})

router.post('/addnewuser', (req, res) => {
  models.User.create({
      username: `${req.body.username}`,
      password: `${req.body.password}`,
      role: `${req.body.role}`,
      createdAt: new Date(),
      udpatedAt: new Date()
  })
  .then(user => {
      res.render('registerSuccess', {title: 'Register Success', session: req.session})
  })
  .catch(err => {
      console.log(err)
      res.render('register', {title: 'Register', error_reg: true, session: req.session})
  })
})