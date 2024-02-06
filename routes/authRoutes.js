const Router = require('express')
const router = new Router()

const auth = require('../queries/auth_user')

router.post('/auth_reg',auth.registration)
router.post('/auth_login',auth.login)
router.get('/check',auth.check)

module.exports = router