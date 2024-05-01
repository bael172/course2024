const Router = require('express')
const router = new Router()

const course = require('../queries/course')

const token = require('../security/checkToken')
const token_role = require('../security/checkToken&Role')

router.get('/all',course.get_all)
router.post('/add',token_role("admin","manager"),course.add)
router.post('/edit/:id',token_role("admin","manager"),course.edit)
router.delete('/delete/:id',token_role("admin","manager"),course.del)

module.exports = router