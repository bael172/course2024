const Router = require('express')
const router = new Router()

const auth = require('./authRoutes')
const course = require('./dataRoutes')

router.use('/user',auth)
router.use('/course',course)

module.exports = router