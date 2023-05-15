const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/login',userController.logIn)
router.get('/auth',authMiddleware,userController.check)

module.exports = router