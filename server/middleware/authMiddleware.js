const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

module.exports = function(req, res,next) {
    if(req.method === "OPTIONS"){
        next()
    }
    try{

        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(401).json({message:"Пользователь не авторизован"})
        }
        const decoded = jwt.verify(token,process.env.ROLE_KEY,)
        req.user = decoded
        next()
        /*
        async function foo(){
            const user = await User.findOne({where:{id:decoded.id}})
            if(user && !user === 'undefined'){
                next()
            }else{

                return res.status(401).json({message:"Пользователь не авторизован"})
            }
        }
        foo()
        */
    }catch(a){
        res.status(401).json({message:"Пользователь не авторизован"})
    }
};