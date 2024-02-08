const {User} = require('../db/tables')
const {Op} = require('sequelize')
class User_Query{
    async all(req,res){
        const all = User.findAll()
        return res.json(all)
    }
    async all_where(req,res){
        const vallue = User.findOne({
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
    /*
    async add(req,res){
        const {name,email,password,phone,role} = req.body
        const user1 =  User.build({
            name:name,
            email:email,
            password:password,
            phone:phone,
            role:role
        })
        await user1.save()
        const added = await User.findOne({
            where:{name:name}
        })
        return res.json(added)
    }
    */
    async edit(req,res){
        const {name,email,password,phone,role} = req.body
        const user = await User.findOne({
            where:{
                [Op.or]:[
                    [Op.and],[
                        {id:req.user.id},
                        {email:email}
                    ],
                    [Op.and],[
                        {id:req.user.id},
                        {phone:phone}
                    ]
                ]

            }
        })
        if(user==null||undefined) res.json('Таблица не найдена')
        await User.update({
            name:name,
            email:email,
            password:password,
            phone:phone,
            role:role,
            where:{id:user.id}
        })
        const result = await User.findOne({
            where:{
                id:user.id
            }
        })
        return res.json(result)
    }

    async del(req,res){
        const del = await User.findOne({
            where:{id:req.user.id}
        })
        if(del==null||undefined) res.json('Запись не найдена')
        await User.destroy({
            where:{id:req.user.id}
        })

        return res.json("Была удалена следующая запись",del)
    }
}
module.exports = new User_Query()