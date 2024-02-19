const Router = require('express')
const router = new Router()

const auth = require('../queries/auth')
const user = require('../queries/user')

const token = require('../security/checkToken')
const token_role = require('../security/checkToken&Role')

router.post('/reg',auth.registration)
router.post('/login',auth.login)
router.get('/check',auth.check)

router.get('/all',token_role("admin","manager"),user.all)
router.post('/all_where',token_role("admin","manager"),user.all_where)
router.patch('/edit',token,user.edit)
router.delete('/del',token,user.del)

module.exports = router