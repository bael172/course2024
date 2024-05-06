const ApiError = require('../apiError') 
const {User} = require('../db/tables')
const {Op} = require('sequelize')

class User_Query{
    async get_all(req,res){
        const got = await User.findAll()
        return res.json(got)
    }
    async get_all_where(req,res,next){
        console.log(null==undefined)
        const {id,name,email,phone,role} = req.body
        const new_obj = {id,name,email,phone,role}
        Object.entries(new_obj).forEach(([key,value])=>{
            new_obj[key] = value !==undefined? value : null
        }) //присвоение неопределённым полям значение null
        let condition = {} //динамическое условие включающее только поля со значениями
        Object.entries(new_obj).forEach(([key,value])=>{
            if(key=="id") key="id_user"
            if(value!==null || value!==undefined) condition[key]=value})
        try{
            let vallue = await User.findAll({
                where:{
                    [Op.or]:condition
                }
            })
            return res.json(vallue)
        }
        catch(e){
            return next(ApiError.badRequest("ошибка"))
        }
    }
        async get_by_id(req,res,next){
            const found = await User.findOne({
                where:{
                    id_user : req.params.id
                }
            })
            const found_id = found.dataValues.id_user
            if(found || found!=null){
                const makaka = await User.findOne({
                    where:{
                        id_user : found_id
                    }
                })
                res.send(makaka)
            }
            else res.send(`Пользователя id = ${req.params.id} нет`)
        }
    
        async edit(req,res){
            const search = await User.findOne({
                where:{
                    id_user : req.user.id
                }
            })
            const {name,email,password,phone} = req.body
            if(search || search!=null){
                const check_possib = await User.findOne({
                    where:{
                        [Op.or]:[
                            {email:email},
                            {phone:phone}
                        ]

                    }
                })
                if(!check_possib || check_possib==null){
                    const status_upd = await User.update({
                        name:name,
                        email:email,
                        phone:phone,
                        password:password},{
                        where:{
                                id_user : req.user.id
                            }
                        })
                        if (status_upd [0] === 1){
                            console.log("Данные успешно обновлены")
                            const result = await User.findOne({
                                where:{
                                    id_user:req.user.id
                                }
                            })
                            return res.json(result)
                        }
                        else {
                            res.send("Ошибка при обновлении данных")
                        }
    
                }
                else res.send("Введённый вами телефон или пароль уже зарегистрированы другими пользователями")
            }
            else res.send("Создайте учётную запись")
        }
    
        async del(req,res){
            const found = await User.findOne({
                where:{id_user:req.user.id}
            })
            if(found || found!=null){
                const status_del = await User.destroy({
                    where:{id_user:req.user.id}
                })
                if(status_del === 1){
                    res.send("Запись удалена")
                }
                else res.send("Не удалось удалить запись")
            }
            else res.send("У вас нет учётной записи")
        }
    
        async del_all(req,res,next){
            const dest = await User.destroy({
                truncate:true
            })
            if (dest >=1) return res.send("Таблица опустошена")
            else return next(ApiError.internal("Не удалось удалить записи"))
        }
    }
    module.exports = new User_Query()