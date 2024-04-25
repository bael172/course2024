const ApiError = require('../apiError') 
const {User} = require('../db/tables')
const {Op} = require('sequelize')

class User_Query{
    async get_all(req,res,next){
        try{
            const all = await User.findAll()
            if(all.length!==0) return res.json(all)
            else res.send("Ни одного пользователя в таблице")
        }
        catch(e){
            return next(ApiError.internal("Не удалось выполнить запрос"))
        }
    }

    async get_all_where(req,res,next){
        const vallue = await User.findOne({
            where:{
                [Op.or]:[
                    {id:req.body.id},
                    {name:req.body.name},
                    {email:req.body.email},
                    {phone:req.body.phone},
                    {role:req.body.role}
                ]
            }
        })
        return res.json(vallue)
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
        const {name,email,password,phone} = req.body
        const search = await User.findOne({
            where:{
                id_user : req.user.id
            }
        })
        if(search || search!=null){
            const check_possib = await User.findOne({
                where:{
                    email:email,
                    phone:phone
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
                                id:req.user.id
                            }
                        })
                        return res.json(result)
                    }
                    else {
                        res.send("Ошибка при обновлении данных")
                    }

            }
            else res.send("Почта и пароль уже зарегистрированы другими пользователями")
        }
        else res.send("Создайте учётную запись")
    }

    async del(req,res){
        const found = await User.findOne({
            where:{id:req.user.id}
        })
        if(found || found!=null){
            const status_del = await User.destroy({
                where:{id:req.user.id}
            })
            if(status_del[0] === 1){
                res.send("Запись удалена")
            }
            else res.send("Не удалось удалить запись")
        }
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