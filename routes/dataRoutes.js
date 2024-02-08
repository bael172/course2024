const Router = require('express')
const router = new Router()

const course = require('../queries/course')

const token = require('../security/checkToken')
const token_role = require('../security/checkToken&Role')

router.get('/all',course.all)
router.post('/add',token_role("admin","manager"),course.add)
router.post('/edit/:id',token_role("admin","manager"),course.edit)
router.delete('/del/:name',token_role("admin","manager"),course.delWarn(course.delete))

module.exports = router