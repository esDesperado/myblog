const Router = require('express')
const router = new Router()
const controller = require('../controllers/userController')
const isAuth = require('../middleware/authMiddleware')


router.post('/sendMail',controller.sendMail)
router.post('/checkCode',controller.checkCode)
router.put('/setName',isAuth,controller.setName)
router.get('/auth',isAuth,controller.check)
router.get('/getUsers',controller.getUsers)

module.exports = router