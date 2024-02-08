const {Course} = require('../db/tables')
const ApiError = require('../apiError')
const {Op} = require("sequelize")
const Confirm = require('prompt-confirm')
let _prompt = require('prompt')

function del(req,res,zapis){
    Course.destroy({
        where:{id:zapis.id}
    })
    return res.json("Таблица удалена")
}
class Courses{
    async all(req,res){
        const all =await Course.findAll()
        return res.json(all)
    }
    async add(req,res,next){
        const {name,cost,period_days,lesson_count,description} = req.body
        const added = await Course.findOne({
            where:{[Op.or]:[
                {name:name},
                {cost:cost}
            ]}
        })
        if(!added) {
            const add = await Course.create({
                name:name,
                cost:cost,
                period_days:period_days,
                lesson_count:lesson_count,
                description:description,
            })
            return res.json(add)
        }
        else{
            return next(ApiError.badRequest('Курс с таким названием или ценой уже существует'))
        }
    }
    async edit(req,res){
        const {name,cost,period_days,lesson_count,description} = req.body
        const prob = await Course.findOne({
            where:{
                id:req.params.id
            }
        })
        if(prob){
            await Course.update({
                name:name,
                cost:cost,
                period_days:period_days,
                lesson_count:lesson_count,
                description:description,
                where:{
                    id: req.params.id
                }
            })
            const edited = Course.findOne({
                where:{id:req.params.id}
            })
            return res.json("Изменения успешны"+edited)
        }
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