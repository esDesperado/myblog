const sequelize = require('../db')
const {DataTypes} = require('sequelize')



const Users = sequelize.define('users',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    username:{type:DataTypes.STRING},
    email:{type:DataTypes.STRING},
    code:{type:DataTypes.STRING},
})
const Posts = sequelize.define('posts',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    text:{type:DataTypes.STRING(9999999)},
    author:{type:DataTypes.INTEGER},
    media:{type:DataTypes.STRING},
    date:{type: DataTypes.DATE},
})

module.exports = {
    Users,
    Posts,

}