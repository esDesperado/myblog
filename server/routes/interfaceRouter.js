const Router = require('express')
const router = new Router()
const controller = require('../controllers/interfaceController')
const authMiddleware = require('../middleware/authMiddleware')

router.put('/',authMiddleware,controller.update)
router.post('/',controller.setAttr)
router.get('/',controller.get)
module.exports = router