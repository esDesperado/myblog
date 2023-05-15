const Router = require('express')
const router = new Router()
const controller = require('../controllers/mailController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/mail/:proc',controller.mail)
router.post('/quiz',controller.sendQuiz)
router.post('/callMe',controller.callMe)
module.exports = router