const ApiError = require('../apiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../db/tables')
const {Op} = require("sequelize")


const generateJwt = (id,name,email,phone,role) => {
    return jwt.sign(
        {id,name,email,phone,role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

class AuthController{
    async registration(req, res, next){
        const {s_name, s_email, s_phone, s_passwd, s_passwdAgain, s_role} = req.body
        if(!s_email || !s_phone || !s_passwd) {
            return next(ApiError.badRequest('Введите эл.почту, телефон и придумайте пароль'))
        }
        if(!s_passwdAgain){
            return next(ApiError.badRequest('Введите пароль еще раз'))
        }
        if(s_passwd!==s_passwdAgain){
            return next(ApiError.badRequest('Пароли не совпадают'))
        }
        const candidate = await User.findOne({
            where:{
                [Op.or]:[{email:s_email},{phone:s_phone}]
            }
    })
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с такой почтой или телефоном уже существует'))
        }
        if(!s_passwdAgain){
            return next(ApiError.badRequest("Повторно введите ваш пароль"))
        }
        if(s_passwd == s_passwdAgain){
            const hashpasswd = await bcrypt.hash(s_passwd,5)
            const user = await User.create({
                name:s_name,
                email:s_email,
                phone:s_phone,
                passwd:hashpasswd,
                role:s_role})
            const token = generateJwt(user.id_user,user.name,user.email,user.phone,user.role)
            return res.json({token})
        }
        else return next(ApiError.badRequest('Пароли не совпадают'))
        
    }

    async login(req,res,next){
        const {s_email,s_phone,s_passwd} = req.body
        if(!s_email && !s_passwd || !s_phone && !s_passwd){
                res.status(401).json({message:'Введите эл.почту/телефон и пароль'})            
                //return next(ApiError.badRequest('Введите эл.почту / телефон и пароль'))
                return
            }
        let condition = {}
        Object.entries(req.body).forEach(function([key,value]){
            if(value!==undefined) 
            switch(key){
                case ('s_email'): key='email'; break
                case ('s_phone'): key='phone'; break
                case ('s_passwd'): key='passwd'; break
            }
            condition[key]=value //сохранение в условие значений не являющихся undefined
        })
        console.log(condition)

        const user = await User.findOne({
            where:{[Op.or]:condition}
        })
        if(!user){
            res.status(402).json({message:'Введен неверный email/телефон или нет учётной записи'})
            //return next(ApiError.internal('Введен неверный email/телефон или нет учётной записи'))
        }

        //Сравнение незашифрованного пароля passwd с зашифрованным user.passwd (passwd:hashpasswd)
        let comparePassword = bcrypt.compareSync(s_passwd, user.passwd)
        if(!comparePassword){ //если пароли не совпадают
            res.status(403).json({message:'Указан неверный пароль'})
            //return next(ApiError.internal("Указан неверный пароль"))
        }
        const token = generateJwt(user.id_user,user.name, user.email, user.phone, user.role)
        return res.status(200).json({token})
        //res.redirect('/path/path')
    }

    async check(req,res,next){
        const token = generateJwt(req.user.id_user,req.user.name, req.user.email, req.user.phone, req.user.role)
        if(token) res.status(200).json({message:"ALL RIGHT"})
    }
}

module.exports = new AuthController()