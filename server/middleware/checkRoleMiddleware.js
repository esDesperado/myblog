const {User} = require('../models/models')
const jwt = require('jsonwebtoken')


module.exports = function(role){
    return function(req, res,next) {
        if(req.method === "OPTIONS"){
            next()
        }
        try{

            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return res.status(401).json({message:"Пользователь не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.ROLE_KEY)
            if(decoded.role < role){
                return res.status(403).json({message:"У тебя нет прав на это"})
            }
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
}





