const Router = require('express')
const router = new Router()
const controller = require('../controllers/siteController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/:proc',checkRole(4),controller.change)
module.exports = router