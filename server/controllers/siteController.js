const fs = require('fs');
const uuid = require('uuid')
const path = require('path')
const db = require('../models/models')
const {Blocks,Components,Pages,Images,Patterns} = require('../models/models')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')
class Controller{
    async change(req,res,next){
        try{
            let {proc} = req.params
            let {title,pathname,id,property,value} = req.body
            if(proc === 'savePattern'){
                let one = await Blocks.findOne({where:{id}})
                let arr1 = [one]
                let idArr = [parseInt(id)]
                let data = await Blocks.findAll()
                data.slice().sort((a,b)=>a.id - b.id).map(el=>{
                    if(el.parent.includes('block')){
                        if(idArr.includes(parseInt(el.parent.replace('block','')))){
                            arr1.push(el);idArr.push(el.id)
                        }
                    }
                })
                await Patterns.create({title,obj:JSON.stringify(arr1)})
                data = await Patterns.findAll()
                return res.json(data)
            }
            if(proc === 'addImage'){
                if(req.files){
                    const {file} = req.files
                    file.mv(path.resolve(__dirname, '..', 'static', 'interfaceImages',file.name))
                    await Images.create({path:file.name})
                }
                let images = await Images.findAll()
                return res.json(images)
            }
            if(proc === 'removeImage'){
                let d = await Images.findOne({where:{id}})
                if(d.path !== 'null' && d.path){
                    fs.unlink('../server/static/interfaceImages/' + d.path, err => {});
                }
                await d.destroy()
                let images = await Images.findAll()
                let blocks = await Blocks.findAll()
                return res.json({images,blocks})
            }
            if(proc === 'removePage'){
                let one = await Blocks.findOne({where:{parent:'page'+id}})
                let arr1 = JSON.stringify(one || {}).length > 2?[one]:[]
                let idArr = one && one.id?[parseInt(one.id)]:[]
                let data = await Blocks.findAll()
                if(idArr.length){
                    data.slice().sort((a,b)=>a.id - b.id).map(el=>{
                        if(el.parent.includes('block')){
                            console.log(idArr,parseInt(el.parent.replace('block','')))
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
                }
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
                let page = await Pages.findOne({where:{id}})
                await page.destroy()
                data = await Pages.findAll()
                return res.json(data)
            }
            if(proc === 'addPage'){
                let pages = await Pages.findAll()
                let arr2 = []
                let arr3 = []
                pages.map(d=>{if(d.path.includes('newPath')){arr3.push(parseInt(d.path.match(/\d+/g).join('')))}if(d.title.includes('newPage')){arr2.push(parseInt(d.title.match(/\d+/g).join('')))}})
                let name = (arr2.concat(arr3).sort((a,b)=>a-b).reverse()[0] || 0) + 1
                await Pages.create({title:'newPage' + name,path:'newPath' + name})
                pages = await Pages.findAll()
                return res.json({pages,path:'newPath'+name})
            }

            if(proc === 'setPageProperty'){
                let page = await Pages.findOne({where:{id}})
                page[property] = value
                await page.save();
                let data = await Pages.findAll()
                return res.json(data)
            }
            if(proc === 'getHash'){
                return res.json(await bcrypt.hash(title,5))
            }
            return res.json(true)
        }catch(e){
            console.error(e.message)
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new Controller()