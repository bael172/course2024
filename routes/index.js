const Router = require('express')
const router = new Router()

const auth = require('./authRoutes')
const course = require('./dataRoutes')

router.use('/user',auth)
router.use('/data',course)

module.exports = router