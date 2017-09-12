let express = require('express');
let router = express.Router();
const models = require('../models')

router.use((req, res, next) => {
    if(req.session.hasLogin && req.session.user.role === 'headmaster'){
        next()
    } else {
        res.render('accessDenied', {title: 'ACCESS DENIED'})
    }
  })

router.get('/', (req, res) => {
    models.Teacher.findAll({ include: [{model: models.Subjects}], 
        order: [
            ['first_name', 'ASC']
        ] 
    })
    .then(data_teachers => {
        res.render('teacher/teachers', {data_teachers: data_teachers, title: 'Teachers'})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/add', (req,res) => {
    models.Subjects.findAll()
    .then(subjects => {
        res.render('teacher/teacher_add', {data_subjects: subjects, title: 'New Teacher'})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/add', (req, res) => {
    models.Teacher.create({
        first_name: `${req.body.first_name}`,
        last_name: `${req.body.last_name}`,
        email: `${req.body.email}`.toLowerCase(),
        SubjectId: req.body.SubjectId,
        createdAt: new Date(),
        udpatedAt: new Date()
    })
    .then(teachers => {
        res.redirect('/teachers')
    })
    .catch(err => {
        console.log(err)
    })
})

//delete
router.get('/delete/:id', (req,res) => {
    models.Teacher.destroy({
        where: {
            id: `${req.params.id}`
        }
    })
    .then((rowDeleted) => {
        res.redirect('/teachers')
    })
    .catch(err => {
        console.log(err)
    })
})

//edit
router.get('/edit/:id', (req,res) => {
    models.Teacher.findAll({
        where: {
            id: `${req.params.id}`
        }
    })
    .then(teacher => {
        models.Subjects.findAll()
        .then( subjects => {
            res.render('teacher/teacher_edit', {teacher: teacher, data_subjects: subjects, title: 'Teachers Data Edit'})
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/edit/:id',(req, res) => {
    models.Teacher.update({
        first_name: `${req.body.first_name}`,
        last_name: `${req.body.last_name}`,
        email: `${req.body.email}`.toLowerCase(),
        SubjectId: req.body.SubjectId,
        createdAt: new Date(),
        udpatedAt: new Date()
    }, {
        where: {id: `${req.params.id}`}
    })
    .then(teacher => {
        res.redirect('/teachers')
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router