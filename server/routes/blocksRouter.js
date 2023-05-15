const Router = require('express')
const router = new Router()
const controller = require('../controllers/blocksController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole(4),controller.create)
router.get('/',controller.getAll)
router.put('/:id',checkRole(4),controller.setAttr)
router.put('/obj/:id',checkRole(4),controller.setObjProperty)
router.delete('/:id',checkRole(4),controller.remove)
module.exports = router