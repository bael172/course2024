const express = require("express")
require('dotenv').config({path:'./db/.env'})

const Sequelize = require('sequelize')
const sequelize = require('./db/db_connect')
const tables = require('./db/tables')
const router = require('./routes/index')
const cors = require('cors')

const PORT=process.env.PORT || 5000

const app=express()
app.use(cors())
app.use(express.json())
app.use('/api',router)

app.get('/msg',(req,res) => { 
    res.status(200).json({message:"Working"})
})
    const start = async()=> {
        try{
            await sequelize.authenticate()
            await sequelize.sync({alter:true})
            console.log('Connection has been established successfully');
            app.listen(PORT,() => console.log(`Server start on ${PORT}`))
        }
        catch (error) {
            console.error('Unable to connect to the database',error);
        }
    } 
    start()