const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const fs = require('fs');
const {Users} = require('../models/models')

const generateJwt = (id,email,username) => {
    return jwt.sign(
        {id,email,username},
        process.env.ROLE_KEY,
        //{expiresIn:'24h'}
    )
}
//bcrypt.compareSync(password,process.env.DB_DOMAIN)
class UserController{
    async sendMail(req,res,next){
        try{
            const {email} = req.body
            let user = await Users.findOne({where:{email}})
            if(!user){
                user = await Users.create({email:email,name:""})
            }
            let code = Math.floor(Math.random() * (9999 - 1000)) + 1000 + ''
            user.code = await bcrypt.hash(code,5)
            await user.save()
            let transporter = await nodemailer.createTransport({
                service:'mail',
                host:'smtp.mail.ru',
                port:465,
                secure:true,
                auth:{
                    user:process.env.MAIL_ADDRESS,
                    pass:process.env.APP_P
                },
                tls:{
                    rejectUnauthorized:false,
                }
            })
            const mailOptions ={
                from:process.env.MAIL_ADDRESS,
                to:email,
                subject:'Код подтверждения',
                html:`<div style="color:black;font-size:2.5em;backgroundColor:white;">
                        ${code} Ваш код подтверждения
                    </div>`
            }
            await transporter.sendMail(mailOptions)
            return res.json(true)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async checkCode(req,res,next){
        try{
            const {email, code} = req.body
            let user = await Users.findOne({where:{email}})
            if(bcrypt.compareSync(code, user.code)){
                const token = generateJwt(user.id,email,user.username)
                return res.json({token})
            }
            return res.json(false)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async setName(req,res,next){
        try{
            const {username} = req.body
            let user = await Users.findOne({where:{id:req.user.id}})
            user.username = username
            await user.save()
            let token = generateJwt(req.user.id,req.user.email,username)
            return res.json({token})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async check(req,res,next){
        try{
            let token = generateJwt(req.user.id,req.user.email,req.user.username)
            return res.json({token})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getUsers(req,res,next){
        try{
            let data = await Users.findAll()
            data = data.map(({id,username})=>{return {id,username}})
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

}
module.exports = new UserController()