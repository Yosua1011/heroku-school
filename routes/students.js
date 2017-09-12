let express = require('express');
let router = express.Router();
const models = require('../models')

router.use((req, res, next) => {
    if(req.session.hasLogin){
        next()
    } else {
      res.redirect('/login')
    }
})

router.get('/', (req, res) => {
    models.Student.findAll({
        order: [
            ['first_name', 'ASC']
        ]
    })
    .then(data_students => {
        res.render('student/students', {data_students: data_students, title: 'Students', session: req.session})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/add', (req,res) => {
    let data_temporary = {
        first_name: '',
        last_name: '',
        email: '',
        createdAt: new Date(),
        udpatedAt: new Date()
    }
    res.render('student/student_add', {data: data_temporary, data_error: false, title: 'Add Student', session: req.session}) //lempar ke form
})

router.post('/add', (req, res) => {
    models.Student.create({
        first_name: `${req.body.first_name}`,
        last_name: `${req.body.last_name}`,
        email: `${req.body.email}`.toLowerCase(),
        createdAt: new Date(),
        udpatedAt: new Date()
    })
    .then(student => {
        res.redirect('/students')
    })
    .catch(err => {
        console.log(err)
        let data_temporary = {
            first_name: `${req.body.first_name}`,
            last_name: `${req.body.last_name}`,
            email: `${req.body.email}`.toLowerCase(),
            createdAt: new Date(),
            udpatedAt: new Date()
        }
        res.render('student/student_add', {data: data_temporary, data_error: true, title: 'Add Student', session: req.session}) 
    })
})

//delete
router.get('/delete/:id', (req,res) => {
    models.Student.destroy({
        where: {
            id: `${req.params.id}`
        }
    })
    .then((rowDeleted) => {
        res.redirect('/students')
    })
    .catch(err => {
        console.log(err)
    })
})

//edit
router.get('/edit/:id', (req,res) => {
    models.Student.findAll({
        where: {
            id: `${req.params.id}`
        }
    })
    .then(student => {
        res.render('student/student_edit',{student: student, data_error: false, title: 'Students Data Edit', session: req.session})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/edit/:id',(req, res) => {
    var email_lama = ''
    models.Student.findById(req.params.id)
        .then(student => {
            email_lama = student.email
            models.Student.update({
                email: null,
                udpatedAt: new Date()
            }, {
                where: {id: `${req.params.id}`}
            })
            .then(student => {
                res.redirect('/students')
            })
            .catch(err => {
                console.log('error 1 ' + err)
                models.Student.update({
                    email: email_lama.toLowerCase(),
                    udpatedAt: new Date()
                }, {
                    where: {id: `${req.params.id}`}
                })
                .then(student => {
                    let data_temporary = [{
                        id: `${req.params.id}`,
                        first_name: `${req.body.first_name}`,
                        last_name: `${req.body.last_name}`,
                        email: email_lama.toLowerCase(),
                        createdAt: new Date(),
                        udpatedAt: new Date()
                    }]
                    res.render('student/student_edit',{student: data_temporary, data_error: true, title: 'Students Data Edit', session: req.session})
                })
                .catch(err => {console.log('err 2 ' + err)})
            })
        })
        .catch(err => {
            console.log('err 3' + err)
        })
})

// ==================== route related to subject ====================
router.get('/:id/addsubject', (req,res) => {
    models.Student.findAll({
        where: {
            id: `${req.params.id}`
        }
    })
    .then(student => {
        models.Subjects.findAll()
        .then(subjects => {
            res.render('student/student_add_subject', {data_student: student, data_subjects: subjects, title: 'Add Subject To Student', session: req.session})
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {

    })
})

router.post('/:id/addsubject', (req,res) => {
    models.SubjectStudent.create({
        StudentId: `${req.params.id}`,
        SubjectId: `${req.body.SubjectId}`,
        createdAt: new Date(),
        updateAt: new Date()
    })
    .then(student => {
        res.redirect('/students')
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router