const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const {Visitors} = require('../models/models')

const generateJwt = (login,role) => {
    return jwt.sign(
        {login,role},
        process.env.ROLE_KEY,
        //{expiresIn:'24h'}
    )
}
class UserController{
    async logIn(req,res,next){
        try{
            let file = 'login.js'
            let ip = ((req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress).replace(/[^+\d.]/g,'')
            let visitor = await Visitors.findOne({where:{ip}})
            if(!visitor){await Visitors.create({streak:0,count:0,ip,date:new Date().toISOString().split('T')[0]});visitor = await Visitors.findOne({where:{ip}})}
            if(visitor.streak < 25 || new Date().toISOString().split('T')[0] !== visitor.date){
                if(new Date().toISOString().split('T')[0] !== visitor.date && visitor.streak > 5){
                    visitor.streak = visitor.streak - 5
                }else{
                    visitor.streak = visitor.streak + 1
                }
                visitor.count = visitor.count + 1
                visitor.date = new Date().toISOString().split('T')[0]
                await visitor.save()
                const {login, password, cond,sc} = req.body
                if(cond && sc !== '5_Ax1v_3lF51Sd_7cp8_i2s3Ml9!%@^____-PwE_0L_q_qQ'){
                    return res.json('false')
                }else{
                    let role = 3
                    if(login === process.env.AP_USER_LOGIN && bcrypt.compareSync(password,process.env.DB_DOMAIN)){
                        const token = generateJwt(login,role)
                        visitor.streak = 0
                        await visitor.save()
                        return res.json({token})
                    }
                    if(login !== process.env.AP_LOGIN){
                        return res.json('false')//next(ApiError.internal("Неверный логин или пароль"))
                    }
                    if(!bcrypt.compareSync(password,process.env.DB_API)){
                        return res.json('false')//next(ApiError.internal("Неверный логин или пароль"))
                    }else{
                        role = 4
                    }
                    fs.access(file, fs.constants.F_OK, (err) => {
                        if(!err){
                            visitor.streak = 0
                            visitor.save()
                            const token = generateJwt(login,role)
                            return res.json({token})
                        }else{
                            return res.json('false')
                        }
                    });
                }
            }else{
                return res.json('false')
            }
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async check(req,res,next){
        try{
            let token
            let file = 'login.js'
            await fs.access(file, fs.constants.F_OK, (err) => {
                if(!err){
                    token = generateJwt(req.user.login,req.user.role)
                    return res.json({token})
                }else{
                    token = 'NO TOKEN'
                    return res.json({token})
                }
            });
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

}
module.exports = new UserController()