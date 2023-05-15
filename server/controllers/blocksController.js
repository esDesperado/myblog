const fs = require('fs');
const uuid = require('uuid')
const path = require('path')
const db = require('../models/models')
const {Blocks,Components,Pages,Images,Patterns} = require('../models/models')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')
class Controller{
    async create(req,res,next){
        try{
            let {priority,type,obj,parent} = req.body
            let data = await Blocks.findAll({where:{parent}})
            if(type.includes('pattern')){
                let pattern = await Patterns.findOne({where:{id:parseInt(type.replace('pattern',''))}})
                let arr1 = JSON.parse(pattern.obj)
                let idObj = {}
                let one
                if(data.length === parseInt(priority)){one = await Blocks.create({priority:parseInt(priority),type:arr1[0].type,parent,obj:arr1[0].obj})}
                else{
                    data.map(d=>{
                        if(d.priority >= parseInt(priority)){d.priority = d.priority;d.save();return}
                    })
                    one = await Blocks.create({priority:parseInt(priority),type:arr1[0].type,parent,obj:arr1[0].obj})
                }
                idObj[arr1[0].id] = one.id
                /*function setNewId(oldId,newId){
                    return arr1.filter(d=>{
                        if(d.id === oldId){d.id = newId}
                        if(d.parent === oldId){d.parent = newId}
                        return d
                    })
                }*/
                arr1.shift()
                async function addPatternElement(d){
                    try{
                        let newEl = await Blocks.create({priority:1,type:d.type,parent:'block'+idObj[parseInt(d.parent.replace('block',''))],obj:d.obj})
                        idObj[d.id] = newEl.id
                    }catch(e){
                        console.error(e.message)
                        next(ApiError.badRequest(e.message))
                    }
                }
                await Promise.all(arr1.map(async d=>await addPatternElement(d)))
            }else{
                if(data.length === parseInt(priority)){await Blocks.create({priority:parseInt(priority),type,parent,obj})}
                else{
                    data.map(d=>{
                        if(d.priority >= parseInt(priority)){d.priority = d.priority;d.save();return}
                    })
                    await Blocks.create({priority:parseInt(priority),type,parent,obj})
                }
            }
            data = await Blocks.findAll()
            return res.json(data)
        }catch(e){
            console.error(e.message)
            next(ApiError.badRequest(e.message))
        }
    }
    async remove(req,res,next){
        try{
            const {id} = req.params
            let one = await Blocks.findOne({where:{id}})
            let arr1 = [one]
            let idArr = [parseInt(id)]
            let data = await Blocks.findAll()
            let data2 = await Blocks.findAll({where:{parent:id}})
            data2.slice().sort((a,b)=>a.id - b.id).map(d=>{
                if(d.priority >= one.priority){
                    d.priority = d.priority - 1
                    d.save()
                }
            })
            data.slice().sort((a,b)=>a.id - b.id).map(el=>{
                if(el.parent.includes('block')){
                    //console.log(idArr,parseInt(el.parent.replace('block','')))
                    if(idArr.includes(parseInt(el.parent.replace('block','')))){
                        arr1.push(el);idArr.push(el.id)
                    }
                }
            })
            let components = await Components.findAll()
            /*components.map(d=>{
                if(d.type === (one.id+'')){
                    if(d.img !== 'null' && d.img){
                        fs.unlink('../server/static/componentImages/' + d.img, err => {});
                    }
                    d.destroy()
                }
            })*/
            async function destroyElement(el){
                try{
                    /*if(JSON.parse(el.obj || '{}').background !== 'null' && JSON.parse(el.obj || '{}').background){
                        fs.unlink('../server/static/interfaceImages/' + JSON.parse(el.obj || '{}').background, err => {});
                    }*/
                    let brothers = data.filter(d=>d.parent === el.parent)
                    if(el.priority < brothers.length - 1){
                        brothers.map(d=>{
                            if(d.priority > one.priority){
                                d.priority = d.priority - 1
                                d.save()
                            }
                        })
                    }
                    await el.destroy()
                }catch(e){
                    console.error(e.message)
                    next(ApiError.badRequest(e.message))
                }
            }
            await Promise.all(arr1.map(async el=>await destroyElement(el)))
            data = await Blocks.findAll()
            return res.json(data)
        }catch(e){
            console.error(e.message)
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req,res,next){
        try{
            let pages = await Pages.findAll()
            if(pages.length === 0){await Pages.create({title:'Главная',path:'',description:''});pages = await Pages.findAll()}
            const data = await Blocks.findAll()
            let images = await Images.findAll()
            let patterns = await Patterns.findAll()
            return res.json({blocks:data,pages,images,patterns})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async setObjProperty(req,res,next){
        try{
            const {name,attr} = req.body
            const {id} = req.params
            const block = await Blocks.findOne({where:{id}})
            let blockObj = JSON.parse(block.obj || '{}')
            blockObj[name] = attr
            block.obj = JSON.stringify(blockObj)
            await block.save()
            let data = await Blocks.findAll()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async setAttr(req,res,next){
        try{
            const {name,attr} = req.body
            const {id} = req.params
            const block = await Blocks.findOne({where:{id}})
            let data = await Blocks.findAll({where:{parent:'block'+id}})
            function kek(){
                if(name === 'obj' && JSON.parse(attr).background !== JSON.parse(block.obj || '{}').background){
                    let newObj = JSON.parse(attr)
                    /*if(newObj.background !== JSON.parse(block.obj || '{}').background){
                        if(newObj.background && JSON.parse(block.obj || '{}').background !== 'null' && JSON.parse(block.obj || '{}').background){
                            fs.unlink('../server/static/interfaceImages/' + JSON.parse(block.obj || '{}').background, err => {});
                            if(newObj.background !== ''){
                                let fileName = uuid.v4() + ".png"
                                newObj.background.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                newObj.background = fileName
                            }
                            return JSON.stringify(newObj)
                        }
                    }*/
                    /*if(name === 'img'){
                        if(attr !== block.img && block.img !== 'null' && block.img){
                            fs.unlink('../server/static/interfaceImages/' + block.img, err => {});
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".png"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }else{
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".png"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }
                    }else if(name === 'img3'){
                        if(attr !== block.img3 && block.img3 !== 'null' && block.img3){
                            fs.unlink('../server/static/interfaceImages/' + block.img3, err => {});
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".png"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }else{
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".png"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }
                    }else if(name === 'img2'){
                        if(attr !== block.img2 && block.img2 !== 'null' && block.img2){
                            fs.unlink('../server/static/interfaceImages/' + block.img2, err => {});
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".png"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }else{
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".png"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }
                    }else if(name === 'video'){
                        if(attr !== block.video && block.video !== 'null' && block.video){
                            fs.unlink('../server/static/videos/' + block.video, err => {});
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".mp4"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'videos', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }else{
                            if(req.files){
                                const {attr} = req.files
                                let fileName = uuid.v4() + ".mp4"
                                attr.mv(path.resolve(__dirname, '..', 'static', 'videos', fileName))
                                return fileName
                            }else if(attr){
                                return attr
                            }else if(!attr){
                                return ''
                            }
                        }
                    }*/
                }else{
                    if(name === 'priority'){
                        if(attr === '+'){
                            data.map(d=>{
                                if(d.priority === parseInt(block.priority) + 1){
                                    d.priority = d.priority - 1
                                    d.save()
                                }
                            })
                            return parseInt(block.priority) + 1
                        }else{
                            data.map(d=>{
                                if(d.priority === parseInt(block.priority) - 1){
                                    d.priority = d.priority + 1
                                    d.save()
                                }
                            })
                            return parseInt(block.priority) - 1
                        }
                    }else{
                        return attr
                    }
                }
            }

            block[name] = kek()

            await block.save()
            data = await Blocks.findAll()
            return res.json(data)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

}
module.exports = new Controller()