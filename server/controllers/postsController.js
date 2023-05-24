const fs = require('fs');
const uuid = require('uuid')
const path = require('path')
const db = require('../models/models')
const {Posts} = require('../models/models')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')
class Controller{
    async create(req,res,next){
        //try{
            let {id,text,page,limit} = req.body
            let media = ""
            if(req.files){
                const {file} = req.files
                media = file.name
                await file.mv(path.resolve(__dirname, '..', 'static', 'media',file.name))
            }
            await Posts.create({author:req.user.id,text:text,media:media,date:new Date()})
            let count = (await Posts.findAll()).length
            let data = await Posts.findAll({order:[['createdAt','DESC']],limit:limit,offset:limit * (page - 1)})
            return res.json({data,count})
        /*}catch(e){
            console.error(e.message)
            next(ApiError.badRequest(e.message))
        }*/
    }
    async remove(req,res,next){
        try{
            const {id} = req.params
            let {page,limit} = req.body
            let one = await Posts.findOne({where:{id}})
            if(one.author === req.user.id) {
                if (one.media.length > 0) {
                    fs.unlink('../server/static/media/' + one.media, err => {
                    });
                }
                await one.destroy()
            }
            let count = (await Posts.findAll()).length
            let data = await Posts.findAll({order:[['createdAt','DESC']],limit:limit,offset:limit * (page - 1)})
            return res.json({data,count})
        }catch(e){
            console.error(e.message)
            next(ApiError.badRequest(e.message))
        }
    }
    async get(req,res,next){
        try{
            let {page,limit} = req.body
            let count = (await Posts.findAll()).length
            let data = await Posts.findAll({order:[['createdAt','DESC']],limit:limit,offset:limit * (page - 1)})
            return res.json({data,count})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req,res,next){
        try{
            let {id,text,media,page,limit} = req.body
            let one = await Posts.findOne({where:{id}})
            if(one.author === req.user.id) {
                if ((!media || media === "") && one.media.length > 0) {
                    fs.unlink('../server/static/media/' + one.media, err => {});
                }
                let filename = ""
                if (req.files) {
                    let {media} = req.files
                    filename = uuid.v4() + ".png"
                    await media.mv(path.resolve(__dirname, '..', 'static', 'media', filename))
                }
                one.text = text
                one.media = filename
                await one.save()
            }
            let count = (await Posts.findAll()).length
            let data = await Posts.findAll({order:[['createdAt','DESC']],limit:limit,offset:limit * (page - 1)})
            return res.json({data,count})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new Controller()