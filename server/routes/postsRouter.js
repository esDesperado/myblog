const Router = require('express')
const router = new Router()
const controller = require('../controllers/postsController')
const isAuth = require('../middleware/authMiddleware')

router.post('/',isAuth,controller.create)
router.post('/get',controller.get)
router.put('/',isAuth,controller.update)
router.post('/delete/:id',isAuth,controller.remove)
module.exports = router