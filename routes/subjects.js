let express = require('express');
let router = express.Router();
const models = require('../models')
var scoreLetter = require('../helpers/scoreLetter')

router.use((req, res, next) => {
    if(req.session.hasLogin && req.session.user.role !== 'teacher' ){
        next()
    } else {
        res.render('accessDenied', {title: 'ACCESS DENIED', session: req.session})
    }
  })

router.get('/', (req, res) => {
    models.Subjects.findAll({
        include: [{model: models.Teacher}],
        order: [
            ['id', 'ASC']
        ]
    })
    .then(data_subjects => {
        res.render('subject/subjects', {data_subjects: data_subjects, title: 'Subjects', session: req.session})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/:id/enrolledstudents', (req,res) => {
    models.Subjects.findAll({
        where: {
            id: `${req.params.id}`
        },
        include: [
            {model: models.Student}
        ]
    })
    .then(data_subjects => {
        if (data_subjects[0].Students.length > 0) {
            let count = 0
            data_subjects[0].Students.map( student => {
                student.scoreLetter = scoreLetter(student.SubjectStudent.score)
                count++
                if(count >= data_subjects[0].Students.length) {
                    res.render('subject/subject_enrolled_student', {data_subjects: data_subjects[0], title: "Student's Score", session: req.session})
                }
            })
        } else {
            res.redirect('/subjects')
        }
    })
    .catch(err => {
        console.log(err)
    })
})

// ========== give score route ==========
router.get('/:id/givescore', (req,res) => {
    models.SubjectStudent.findAll({
        where: {
            id: `${req.params.id}`
        },
        include: [
            {model: models.Student},
            {model: models.Subjects}
        ]
    })
    .then(data_conjunction => {
        res.render('subject/give_score', {data_conjunction: data_conjunction, title: 'Give Score', session: req.session})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/:id/givescore', (req,res) => {
    models.SubjectStudent.update({
        score: `${req.body.score}`
    },
    {
        where: {id: `${req.params.id}`}
    })
    .then(data_conjunction => {
        res.redirect('/subjects')
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router