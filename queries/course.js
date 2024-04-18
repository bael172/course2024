const {Course} = require('../db/tables')
const ApiError = require('../apiError')
const {Op} = require("sequelize")
const Confirm = require('prompt-confirm')
let _prompt = require('prompt')

class Courses{
    async all(req,res){
        try{
            const all = await Course.findAll()
            if(all.length!==0) return res.json(all)
            else res.send("Ни одного пользователя в таблице")
        }
        catch(e){
            return next(ApiError.internal("Не удалось выполнить запрос"))
        }
    }
    async add(req,res,next){
        const {name,cost,period_days,lesson_count,description} = req.body
        const added = await Course.findOne({
            where:{[Op.or]:[
                {name:name},
                {cost:cost}
            ]}
        })
        if(Object.keys(added).length==0) {
            try{
                const add = await Course.create({
                    name:name,
                    cost:cost,
                    period_days:period_days,
                    lesson_count:lesson_count,
                    description:description,
                })
                return res.json(add)
            }
            catch(error){
                return next(ApiError.badRequest("Не удалось создать запись"))
            }
        }
        else{
            return next(ApiError.badRequest('Курс с таким названием или ценой уже существует'))
        }
    }
    async edit(req,res){
        const {name,cost,period_days,lesson_count,description} = req.body
            const status_upd = await Course.update(
                {name,cost,period_days,lesson_count,description},{
                    where:{
                        id: req.params.id
                    }
                })
            const edited = Course.findOne({
                where:{id:req.params.id}
            })
            if(status_upd[0]){
                return res.json("Изменения успешны:"+JSON.stringify(edited))
            }
            else res.send("Не удалось обновить таблицу")
            return next(ApiError.badRequest('Таблица по id не найдена'))
        }
    async delWarn(req,res){
        const prob = await Course.findOne({
            where:{
                name:req.params.name
            }
        })
        res.json(prob)
        const prompt = new Confirm('Are u sure to delete this zapis')
        prompt.run()
        .then(del(req,res,prob))
    }
}

module.exports = new Courses()