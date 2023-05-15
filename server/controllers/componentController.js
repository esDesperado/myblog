const fs = require('fs');
const uuid = require('uuid')
const path = require('path')
const db = require('../models/models')
const {Components} = require('../models/models')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')
class Controller{
    async create(req,res,next){
        try{
            let {type,priority} = req.body
            let data = await Components.findAll({where:{type}})
            if(data.length === parseInt(priority)){await Components.create({priority:parseInt(priority),type})}
            else{
                data.map(d=>{
                    if(d.priority >= priority){d.priority = d.priority + 1;d.save();return}
                })
                await Components.create({priority:parseInt(priority),type})
            }
            data = await Components.findAll()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req,res,next){
        try{
            const data = await Components.findAll()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async setAttribute(req,res,next){
        try{
            const {name,attr,type} = req.body
            const {id} = req.params
            const one = await Components.findOne({where:{id}})
            let data = await Components.findAll({where:{type}})
            function getNewValue(){
                if(name === 'img'){
                    if(one.img !== 'null' && one.img){
                        if(one.type !== 'priority'){
                            fs.unlink('../server/static/componentImages/' + one.img, err => {});
                        }
                        if(req.files){
                            const {attr} = req.files
                            let fileName = uuid.v4() + ".png"
                            attr.mv(path.resolve(__dirname, '..', 'static', 'componentImages', fileName))
                            if(one.type === 'prod'){
                                let arr = JSON.parse(one.img)
                                arr.unshift(fileName)
                                return JSON.stringify(arr)
                            }else{
                                return fileName
                            }
                        }else if(attr){
                            return attr
                        }
                    }else{
                        if(req.files){
                            const {attr} = req.files
                            let fileName = uuid.v4() + ".png"
                            attr.mv(path.resolve(__dirname, '..', 'static', 'componentImages', fileName))
                            if(one.type === 'prod'){
                                let arr = []
                                arr.unshift(fileName)
                                return JSON.stringify(arr)
                            }else{
                                return fileName
                            }
                        }else if(attr){
                            return attr
                        }
                    }
                }if(name === 'imgRm'){
                    fs.unlink('../server/static/componentImages/' + attr, err => {});
                    if(one.type === 'prod'){
                        let arr = JSON.parse(one.img)
                        arr.splice(arr.indexOf(attr), 1)
                        return JSON.stringify(arr)
                    }else{
                         return ''
                    }
                }else{
                    if(name === 'priority'){
                        if(attr === '+'){
                            data.map(d=>{
                                if(d.priority === parseInt(one.priority) + 1){
                                    d.priority = d.priority - 1
                                    d.save()
                                }
                            })
                            return parseInt(one.priority) + 1
                        }else{
                            data.map(d=>{
                                if(d.priority === parseInt(one.priority) - 1){
                                    d.priority = d.priority + 1
                                    d.save()
                                }
                            })
                            return parseInt(one.priority) - 1
                        }
                    }else{
                        return attr
                    }
                }
            }
            if(name === 'imgRm'){
                one.img = getNewValue()
            }else{
                one[name] = getNewValue()
            }
            await one.save()
            data = await Components.findAll()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async remove(req,res,next){
        try{
            const {id} = req.params
            const one = await Components.findOne({where:{id}})
            let data = await Components.findAll()
            if(one.type === 'prod'){
                if(one.img !== 'null' && one.img && JSON.parse(one.img)){
                    JSON.parse(one.img).map(d=>{
                        fs.unlink('../server/static/componentImages/' + d, err => {});
                    })
                }
            }else{
                if(one.img !== 'null' && one.img){
                    fs.unlink('../server/static/componentImages/' + one.img, err => {});
                }
            }
            if(one.priority < data.length - 1){
                data.map(d=>{
                    if(d.priority > one.priority && d.type === one.type){
                        d.priority = d.priority - 1
                        d.save()
                    }
                })
            }
            if(!one.type.includes('blockLink')){
                let components = await Components.findAll()
                components.map(d=>{
                    if(d.type.includes('blockLink') && d.type.includes('c' + one.id)){
                        if(d.img !== 'null' && d.img){
                            fs.unlink('../server/static/componentImages/' + d.img, err => {});
                        }
                        d.destroy()
                    }
                })
            }
            await one.destroy()
            data = await Components.findAll()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req,res,next){
        try{
            const {id} = req.params
            const data = await bcrypt.hash(id, 5)
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new Controller()