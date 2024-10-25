const {Sequelize , DataTypes, Model} = require('sequelize')
const sequelize = require('./db_connect')

const User = sequelize.define('user',
{
    id_user:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type:DataTypes.STRING, allowNull:false},
    email:{type:DataTypes.STRING, allowNull:false},
    passwd:{type:DataTypes.STRING,allowNull:false},
    phone:{type:DataTypes.STRING,},
    role:{type:DataTypes.STRING, defaultValue:"client"},
    id_course:{type:DataTypes.INTEGER, references:{model:'courses', key:"id_course"}}
})

const Course = sequelize.define('course',
{
    id_course:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type:DataTypes.STRING, allowNull:false},
    cost:{type:DataTypes.DECIMAL(10,2), allowNull:false},
    period_days:{type:DataTypes.INTEGER, allowNull:false},
    lesson_count:{type:DataTypes.INTEGER, allowNull:false},
    description:{type:DataTypes.STRING, allowNull:false}
})

Course.hasMany(User,{foreignKey:'id_course'})

module.exports = {
    User,
    Course
}
/*
class User extends Model {}
User.init
*/
/*{
    sequelize, 
    modelName:'User',
    tableName:'user'
})*/
/*
class Course extends Model{}
Course.init
*/