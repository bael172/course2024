const ApiError = require('../apiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../db/tables')
const {Op} = require("sequelize")

require("dotenv").config({path:"./db/.env"})

const generateJwt = (id,name,email,phone,role) => {
    return jwt.sign(
        {id,name,email,phone,role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

class AuthController{
    async registration(req, res, next){
        const {name, email, id_course, phone, passwd, passwdAgain, role} = req.body
        if(!email && !passwd || !phone && !passwd) {
            res.status(401).json({message:'Введите эл.почту или телефон и придумайте пароль'})
            //return next(ApiError.badRequest('Введите эл.почту, телефон и придумайте пароль'))
            return
        }
        if(!passwdAgain){
            res.status(402).json({message:'Введите пароль еще раз'})
            //return next(ApiError.badRequest('Введите пароль еще раз'))
            return
        }
        if(passwd!==passwdAgain){
            res.status(403).json({message:'Пароли не совпадают'})
            //return next(ApiError.badRequest('Пароли не совпадают'))
            return
        }
        const obj = {email,phone}
        let condition = []
        console.log("Свойства объекта:",Object.entries(obj))
        condition = Object.entries(obj).reduce((accum,[key,value])=>{
            if(value){  //запись в условие значений не являющихся null или undefined
                accum[key]=value
                console.log("accum[key]=",accum[key])
                console.log("value=",value)
            }
            console.log("accum=",accum)
            return accum
        },{}) //используем объект как первичное значение accum

        const candidate = await User.findOne({
            where:{[Op.or]:condition}
        })
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с такой почтой или телефоном уже существует'))
        }
        if(!passwdAgain){
            return next(ApiError.badRequest("Повторно введите ваш пароль"))
        }
        if(passwd == passwdAgain){
            const hashpasswd = await bcrypt.hash(passwd,5)
            const user = await User.create({
                name,
                email,
                phone,
                passwd:hashpasswd,
                role})
            const token = generateJwt(user.id_user,user.name,user.email,user.phone,user.role)
            return res.status(200).json({token})
        }
        else res.status(200).json({message:"Пароли не совпадают"})
        //return next(ApiError.badRequest('Пароли не совпадают'))
        
    }

    async login(req,res,next){
        const {email,phone,passwd} = req.body
        if(!(email||phone)){
            res.status(401).json({message:'Введите эл.почту/телефон'})            
            //return next(ApiError.badRequest('Введите эл.почту / телефон и пароль'))
            return
            }
        if(!passwd){
            res.status(402).json({message:'Введите пароль'})            
            //return next(ApiError.badRequest('Введите эл.почту / телефон и пароль'))
            return
        }
        const obj={email,phone} //объект для динамического условия из-за возможности не вводить почту или телефон
        let condition = []
        condition = Object.entries(obj).reduce((accum,[key,value])=>{ //запись в accum пар [key,value]
            if(value) { //запись значений не являющихся undefined или null
                accum[key]=value
            }
            return accum
        },{}) //используем объект как первичное значение accum
        console.log(condition)
        const user = await User.findOne({
            where:{[Op.or]:condition}
        })
        if(!user){
            res.status(403).json({message:'Введен неверный email/телефон или нет учётной записи'})
            //return next(ApiError.internal('Введен неверный email/телефон или нет учётной записи'))
            return
        }

        //Сравнение незашифрованного пароля passwd с зашифрованным user.passwd (passwd:hashpasswd)
        let comparePassword = bcrypt.compareSync(passwd, user.passwd)
        if(!comparePassword){ //если пароли не совпадают
            res.status(404).json({message:'Указан неверный пароль'})
            //return next(ApiError.internal("Указан неверный пароль"))
            return
        }
        
        const token = generateJwt(user.id_user,user.name, user.email, user.phone, user.role)
        return res.status(200).json({token})
    }

    async check(req,res,next){
        const token = generateJwt(req.user.id_user,req.user.name, req.user.email, req.user.phone, req.user.role)
        if(token) res.status(200).json({message:"ALL RIGHT"})
    }
}

module.exports = new AuthController()