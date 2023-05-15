const Router = require('express')
const router = new Router()
const controller = require('../controllers/componentController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole(3),controller.create)
router.get('/',controller.getAll)
router.get('/one/:id',checkRole(3),controller.getOne)
router.put('/:id',checkRole(3),controller.setAttribute)
router.delete('/:id',checkRole(3),controller.remove)
module.exports = router