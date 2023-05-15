require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const PORT = process.env.PORT || 7000
const app = express()
const request = require("request");

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static/componentImages')))
app.use(express.static(path.resolve(__dirname,'static/systemImages')))
app.use(express.static(path.resolve(__dirname,'static/mailImages')))
app.use(express.static(path.resolve(__dirname,'static/interfaceImages')))
app.use(express.static(path.resolve(__dirname,'static/favicon')))
app.use(express.static(path.resolve(__dirname,'static/videos')))
app.use(express.static(path.resolve(__dirname,'static/3d')))
app.use(fileUpload({}))
app.use('/api', router)

//идёт последний всегда
app.use(errorHandler)
const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))


        }catch(e){
            console.log(e)
        }

}


start()