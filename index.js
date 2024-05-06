const express = require("express")
require('dotenv').config({path:'./db/.env'})

const Sequelize = require('sequelize')
const sequelize = require('./db/db_connect')
const tables = require('./db/tables')
const router = require('./routes/index')
const cors = require('cors')

const PORT=process.env.PORT || 5000

const flash = require('connect-flash')

const app=express()
app.use(cors())
app.use(express.json())

app.use('/api',router)

app.get('/msg',(req,res) => { 
    res.status(200).json({message:"Working"})


/*
app.configure(function(){
    app.use(express.cookieParser('keyboard cat'))
    app.use(express.session({cookie: {maxAge:60000}}))
    app.use(flash())
})
*/
})
    const start = async()=> {
        try{
            await sequelize.authenticate()
            await sequelize.sync()
            console.log('Connection has been established successfully');
            app.listen(PORT,() => console.log(`Server start on ${PORT}`))
        }
        catch (error) {
            console.error('Unable to connect to the database',error);
        }
    } 
    start()