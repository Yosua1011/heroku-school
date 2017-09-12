const express = require('express');
const router = express.Router();
const models = require('../models')

router.get('/', (req, res)=>{
  if (req.session.hasLogin) {
    res.render('index', {title: 'School Database', session: req.session});
  } else {
    res.redirect('/login')
  }
});

//Login

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login'})
})

router.post('/login', (req, res) => {
  models.User.findAll()
    .then( users => {
      users.forEach(user => {
        if(req.body.username === user.username && req.body.password === user.password){
          req.session.hasLogin = true;
          req.session.user = {
            username: user.username,
            role: user.role,
            loginTime: new Date()
          }
        console.log(req.session)
        res.redirect('/')
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
})

//Logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;