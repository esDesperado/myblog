const sequelize = require('../db')
const {DataTypes} = require('sequelize')



const Visitors = sequelize.define('visitors',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    ip:{type:DataTypes.STRING},
    date:{type:DataTypes.STRING},
    streak:{type:DataTypes.INTEGER},
    count:{type:DataTypes.INTEGER},
})
const Pages = sequelize.define('pages',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    title:{type:DataTypes.STRING},
    path:{type:DataTypes.STRING},
    description:{type:DataTypes.STRING},
    obj:{type: DataTypes.STRING(10485760)},
})
const Blocks = sequelize.define('blocks',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    type:{type:DataTypes.STRING},
    parent:{type:DataTypes.STRING},
    priority:{type: DataTypes.INTEGER},
    obj:{type: DataTypes.STRING(10485760)},
})
const Images = sequelize.define('image',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    path:{type:DataTypes.STRING,},
})
const Patterns = sequelize.define('pattern',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    title:{type:DataTypes.STRING,},
    obj:{type: DataTypes.STRING(10485760)},
})
const Components = sequelize.define('component',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    priority:{type: DataTypes.INTEGER},
    img:{type:DataTypes.STRING,},
    type:{type:DataTypes.STRING,},
    title:{type:DataTypes.STRING,},
    price:{type:DataTypes.STRING(999999),},
    description:{type: DataTypes.STRING(999999)},
    content:{type: DataTypes.STRING(999999)},
    obj:{type: DataTypes.STRING(999999)},
})
const Interfaces = sequelize.define('interfaces',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    title:{type:DataTypes.STRING},
    description:{type:DataTypes.STRING},
    number:{type:DataTypes.STRING},
    color:{type:DataTypes.STRING},
    background:{type:DataTypes.STRING},
    main:{type:DataTypes.STRING},
    favicon:{type:DataTypes.STRING},
    mail:{type:DataTypes.STRING},
    mailPass:{type:DataTypes.STRING},
    mailToSend:{type:DataTypes.STRING},
    googleMT:{type:DataTypes.STRING},
    yandexMT:{type:DataTypes.STRING},
    bingMT:{type:DataTypes.STRING},
    pinterestMT:{type:DataTypes.STRING},
    css:{type: DataTypes.STRING(999999)},
    js:{type: DataTypes.STRING(999999)},
    obj:{type: DataTypes.STRING(999999)},
})
module.exports = {
    Components,
    Interfaces,
    Blocks,
    Visitors,
    Pages,
    Images,
    Patterns,

}