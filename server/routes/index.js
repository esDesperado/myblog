const Router = require('express')
const router = new Router()
const user = require('./userRouter')
const posts = require('./postsRouter')
router.use('/user',user)
router.use('/posts',posts)
module.exports = router