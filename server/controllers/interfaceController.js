const uuid = require('uuid')
const path = require('path')
const fs = require('fs');
const {Interfaces} = require('../models/models')
const ApiError = require('../error/ApiError')
class InterfaceController{
    async setAttr(req,res,next){
        try{
            const {attr,name} = req.body
            const data = await Interfaces.findOne({where:{id:0}})
            function getNewValue(){
                if(name === 'favicon'){
                    if(attr !== data.favicon && data.favicon !== 'null' && data.favicon){
                        fs.unlink('../server/static/favicon/' + data.favicon, err => {});
                        if(req.files){
                            const {attr} = req.files
                            attr.mv(path.resolve(__dirname, '..', 'static', 'favicon', attr.name))
                            return attr.name
                        }else if(attr){
                            return attr
                        }else if(!attr){
                            return ''
                        }
                    }else{
                        if(req.files){
                            const {attr} = req.files
                            attr.mv(path.resolve(__dirname, '..', 'static', 'favicon', attr.name))
                            return attr.name
                        }else if(attr){
                            return attr
                        }else if(!attr){
                            return ''
                        }
                    }
                }else{
                    return attr
                }
            }
            data[name] = await getNewValue()
            await data.save()

            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req,res,next){
        try{
            const {mainImage,favicon,title,logo,telegram,vk,instagram,youtube,mail,mailPass,number} = req.body
            const data = await Interfaces.findOne({where:{id:0}})
            function setMain(){
                if(mainImage !== data.mainImage && data.mainImage !== 'null' && data.mainImage){
                    fs.unlink('../server/static/interfaceImages/' + data.mainImage, err => {
                       /*if(err) throw err;*/ // не удалось удалить файл
                    });
                    if(req.files){
                        if(req.files.mainImage){
                            const {mainImage} = req.files
                            let fileName = uuid.v4() + ".png"
                            mainImage.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                            return fileName
                        }else if(mainImage && mainImage !== 'null'){
                            return mainImage
                        }else{
                            return ''
                        }
                    }else if(mainImage && mainImage !== 'null'){
                        return mainImage
                    }else{
                        return ''
                    }
                }else{
                    if(req.files){
                        if(req.files.mainImage){
                            const {mainImage} = req.files
                            let fileName = uuid.v4() + ".png"
                            mainImage.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                            return fileName
                        }else if(mainImage && mainImage !== 'null'){
                            return mainImage
                        }else{
                            return ''
                        }
                    }else if(mainImage && mainImage !== 'null'){
                        return mainImage
                    }else{
                        return ''
                    }
                }
            }
            function setLogo(){
                if(logo !== data.logo && data.logo !== 'null' && data.logo){
                    fs.unlink('../server/static/interfaceImages/' + data.logo, err => {
                       //if(err) throw err;// не удалось удалить файл
                    });
                    if(req.files){
                        if(req.files.logo){
                            const {logo} = req.files
                            let fileName = uuid.v4() + ".png"
                            logo.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                            return fileName
                        }else if(logo){
                            return logo
                        }else{
                            return ''
                        }
                    }else if(logo){
                        return logo
                    }else if(!logo){
                        return ''
                    }
                }else{
                    if(req.files){
                        if(req.files.logo){
                            const {logo} = req.files
                            let fileName = uuid.v4() + ".png"
                            logo.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                            return fileName
                        }else if(logo){
                            return logo
                        }else{
                            return ''
                        }
                    }else if(logo){
                        return logo
                    }else if(!logo){
                        return ''
                    }
                }
            }
            function setFavicon(){
                if(favicon !== data.favicon && data.favicon !== 'null' && data.favicon){
                    fs.unlink('../server/static/favicon/' + data.favicon, err => {
                       //if(err) throw err;// не удалось удалить файл
                    });
                    if(req.files){
                        if(req.files.favicon){
                            const {favicon} = req.files
                            let fileName
                            if(favicon.name.substr(favicon.name.length - 4) === '.svg'){fileName = uuid.v4() + ".svg"}
                            else{fileName = uuid.v4() + ".png"}

                            favicon.mv(path.resolve(__dirname, '..', 'static', 'favicon', fileName))
                            return fileName
                        }else if(favicon){
                            return favicon
                        }else{
                            return ''
                        }
                    }else if(favicon){
                        return favicon
                    }else if(!favicon){
                        return ''
                    }
                }else{
                    if(req.files){
                        if(req.files.favicon){
                            const {favicon} = req.files
                            let fileName = uuid.v4() + ".png"
                            favicon.mv(path.resolve(__dirname, '..', 'static', 'favicon', fileName))
                            return fileName
                        }else if(favicon){
                            return favicon
                        }else{
                            return ''
                        }
                    }else if(favicon){
                        return favicon
                    }else if(!favicon){
                        return ''
                    }
                }
            }
            data.mainImage = setMain()
            data.favicon = setFavicon()
            data.logo = setLogo()
            data.number = number
            data.telegram = telegram  ? telegram : ''
            data.vk = vk  ? vk : ''
            data.mail = mail  ? mail : ''
            data.title = title  ? title : ''
            data.mailPass = mailPass  ? mailPass : ''
            data.instagram = instagram  ? instagram : ''
            data.youtube = youtube  ? youtube : ''
            await data.save()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async get(req,res,next){
        try{
            let datas = await Interfaces.findAll()
            if(datas.length === 0){await Interfaces.create({id:0})}
            let data = JSON.parse(JSON.stringify(await Interfaces.findOne({where:{id:0}},)))
            let file = 'login.js'
            data.login = false
            await fs.access(file, fs.constants.F_OK, (err) => {
                if(!err){
                    data.login = true
                    return res.json(data)
                }else{
                    return res.json(data)
                }
            });
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new InterfaceController()