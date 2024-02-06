const {Sequelize , DataTypes, Model} = require('sequelize')
const sequelize = import('./db_connect')

class User extends Model {}
User.init({
    id_user:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type:DataTypes.STRING, allowNull:false},
    email:{type:DataTypes.STRING, allowNull:false},
    passwd:{type:DataTypes.INTEGER,allowNull:false},
    phone:{type:DataTypes.STRING,},
    role:{type:DataTypes.STRING, defaultValue:"user"}
},{
    sequelize, 
    modelName:'user',
    tableName:'user'
})

class Course extends Model{}
Course.init({
    id_course:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type:DataTypes.STRING, allowNull:false},
    cost:{type:DataTypes.REAL(11,12), allowNull:false},
    period_days:{type:DataTypes.INTEGER, allowNull:false},
    lesson_count:{type:DataTypes.INTEGER, allowNull:false},
    description:{type:DataTypes.STRING, allowNull:false}
})

module.exports = {
    User
}

