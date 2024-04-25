const {Course} = require('../db/tables')
const ApiError = require('../apiError')
const {Op} = require("sequelize")
const Confirm = require('prompt-confirm')
let _prompt = require('prompt')

class Courses{
    async get_all(req,res){
        try{
            const all = await Course.findAll()
            if(all.length!==0) return res.json(all)
            else res.send("Ни одной записи в таблице")
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
        if(!added || added==null) {
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
        const found = await Course.findOne({
            where:{
                id_course:req.params.id
            }
        })
        if(found || found!==null){
            const status_upd = await Course.update(
                {name,cost,period_days,lesson_count,description},{
                    where:{
                        id_course: req.params.id
                    }
                })
            const edited = Course.findOne({
                where:{id_course:req.params.id}
            })
            if(status_upd[0]){
                return res.json("Изменения успешны:"+JSON.stringify(edited))
            }
            else res.send("Не удалось обновить таблицу")
        }
        else return next(ApiError.badRequest(`Таблица по id=${req.prarams.id} не найдена`))
        }
    async del(req,res){
        const prob = await Course.findOne({
            where:{
                id_course:req.params.id
            }
        })
        if(prob || prob!==null){
            const del_status = await Course.destroy({
                where:{
                    id_course:prob.dataValues.id_course
                }
            })
            if(del_status >=1 ) res.send("Запись удалена")
            else next(ApiError.internal("Не удалось удалить запись"))
        }
        else return res.send(`Запись с id=${req.params.id} не существует`)
    }
}

module.exports = new Courses()