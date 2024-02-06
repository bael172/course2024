const {User} = require('../db/tables')
class User_Query{
    async edit_user(req,res){
        const {name,email,password,phone,role} = req.body
        await User.update({
            name:name,
            email:email,
            password:password,
            phone:phone,
            role:role
        },
        { 
            where:{id:req.params.id1}
        })
    }
    async new_user(req,res){
        const {name,email,password,phone,role} = req.body
        const user1 = await User.build({
            name:name,
            email:email,
            password:password,
            phone:phone,
            role:role
        })
        user1.save()
    }
    async del_user(req,res){
        await User.destroy({
            where:{id:req.params.id1}
        })
    }
}