const fs = require('fs');
const uuid = require('uuid')
const path = require('path')
const db = require('../models/models')
const {Interfaces,Stats} = require('../models/models')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const ApiError = require('../error/ApiError')
class CategoryController{
    async mail(req,res,next){
        try{
            let {proc} = req.params
            let {name,number,email,price,priceList,} = req.body
            const data = await Interfaces.findOne({where:{id:0}},)
            if(proc === 'sendCalc'){
                let transporter = await nodemailer.createTransport({
                    service:'mail',
                    host:'smtp.mail.ru',
                    port:465,
                    secure:true,
                    auth:{
                        user:data.mail,
                        pass:data.mailPass
                    },
                    tls:{
                        rejectUnauthorized:false,
                    }
                })
                const mailOptions ={
                    from:data.mail,
                    to:data.mailToSend,
                    subject:'Новая заявка',
                    html:`<div style="color:black;font-size:1.2em;backgroundColor:white;">
                        <div style={{textAlign:'center'}}><h3>Новая заявка.</h3><div>
                        Имя заказчика: <b>${name}</b>,<br/>
                        Номер: <b>${number}</b><br/>
                        Email: <b>${email}</b><br/>
                        <div>${priceList}</div>
                        <div><br/>Предварительная цена: <b>${price} рублей</b></div>
                    </div>`
                }
                await transporter.sendMail(mailOptions)
                return res.json(true)
            }
            return
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async callMe(req,res,next){
        try{
            let {obj,code} = req.body
            const data = await Interfaces.findOne({where:{id:0}},)
            if(code === '!s_pd%ad1fdsemffgqd!^$^@%&^fa*&Y_s--dsf--j9UJ_p-ga=aw--=+an_se-dq=ra$$b$'){
                let transporter = await nodemailer.createTransport({
                    service:'mail',
                    host:'smtp.mail.ru',
                    port:465,
                    secure:true,
                    auth:{
                        user:data.mail,
                        pass:data.mailPass
                    },
                    tls:{
                        rejectUnauthorized:false,
                    }
                })
                obj = JSON.parse(obj)
                let str1 = ''
                for(let key in obj) {
                    str1 = str1 + `${key}: <b>${obj[key]}</b><br/>`
                }
                const mailOptions ={
                    from:data.mail,
                    to:data.mailToSend,
                    subject:'Поступила заявка с сайта',
                    html:`<div style="color:black;font-size:1.3em;backgroundColor:white;">
                        Заполнена форма на сайте:<br/>
                        ${str1}
                    </div>`
                }
                await transporter.sendMail(mailOptions)
                return
            }else{next(ApiError.internal("fuck off, bastard"))}
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async sendQuiz(req,res,next){
        try{
            let {obj,code} = req.body
            const data = await Interfaces.findOne({where:{id:0}},)
            if(code === '!s_pd%ad1fdsemffgqd!^$^@%&^fa*&Y_s--dsf--j9UJ_p-ga=aw--=+an_se-dq=ra$$b$'){
                let fileName = false
                if(req.files){
                    const {img} = req.files
                    if(['png','jpg','gif','psd','pdf','eps','jpeg','tiff','ai'].includes(img.name.split('.')[img.name.split('.').length - 1])){
                        fileName = uuid.v4() + '.' + img.name.split('.')[img.name.split('.').length - 1]
                        img.mv(path.resolve(__dirname, '..', 'static', 'mailImages', fileName))
                    }
                }
                obj = JSON.parse(obj)
                let transporter = await nodemailer.createTransport({
                    service:'mail',
                    host:'smtp.mail.ru',
                    port:465,
                    secure:true,
                    auth:{
                        user:data.mail,
                        pass:data.mailPass
                    },
                    tls:{
                        rejectUnauthorized:false,
                    }
                })
                let str1 = ''
                for(let key in obj) {
                    str1 = str1 + `${key}: <b>${obj[key]}</b><br/>`
                }
                let img1 = fileName?`Фото: ${process.env.REACT_APP_API_URL + fileName}`:''
                const mailOptions ={
                    from:data.mail,
                    to:data.mailToSend,
                    subject:'Поступила заявка с сайта',
                    html:`<div style="color:black;font-size:1.3em;backgroundColor:white;">

                        <div>${str1}</div>
                        ${img1}
                    </div>`
                }
                await transporter.sendMail(mailOptions)
                return
            }else{next(ApiError.internal("fuck off"))}
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new CategoryController()