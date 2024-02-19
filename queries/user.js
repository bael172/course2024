const ApiError = require('../apiError') 
const {User} = require('../db/tables')
const {Op} = require('sequelize')
class User_Query{
    async all(req,res){
        const got = await User.findAll()
        return res.json(got)
    }
    async all_where(req,res,next){
        try{
            const {id,name,email,phone,role} = req.body
            const vallue = await User.findAll({
                where:{
                    [Op.or]:[
                        {id_user:id},
                        {name:name},
                        {email:email},
                        {phone:phone},
                        {role:role}
                    ]
                }
            })
            return res.json(vallue)
        }
        catch(e){
            return next(ApiError.badRequest("ошибка"))
        }

    }
    async edit(req,res,next){

        try{
            const usr = await User.findOne({
                where:{
                    email:req.user.email
                }
            })
        }
        catch(e){
            return next(ApiError.internal('ошибка'))
        }
            try{
                const {name,email,phone,password,role} = req.body
                await User.update({
                    name:name,
                    email:email,
                    password:password,
                    phone:phone,
                    role:role,
                    where:{email:req.user.email}
                })
            }
            catch(e){
                return next(ApiError.internal("Пользователь не найден"))
            } 
            const upd = await User.findOne({
                where:{
                    email:req.user.email
                }
            })
            return res.json(upd)
    }

    async del(req,res){
        const del = await User.findOne({
            where:{
                [Op.or]:[
                    {email:req.user.email},
                    {phone:req.user.phone}
                ]
            }
        })
        if(del) {
            await User.destroy({
                where:{id_user:del.id_user}
            })
        }
        else res.json('Запись не найдена')
        return res.status("Была удалена следующая запись").json(del)
    }
}
module.exports = new User_Query()