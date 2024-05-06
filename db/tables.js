const {Sequelize , DataTypes, Model} = require('sequelize')
const sequelize = require('./db_connect')

/*
class User extends Model {}
User.init
*/
const User = sequelize.define('user',
{
    id_user:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type:DataTypes.STRING, allowNull:false},
    email:{type:DataTypes.STRING, allowNull:false},
    passwd:{type:DataTypes.STRING,allowNull:false},
    phone:{type:DataTypes.STRING,},
    role:{type:DataTypes.STRING, defaultValue:"client"}
})
/*{
    sequelize, 
    modelName:'User',
    tableName:'user'
})*/
/*
class Course extends Model{}
Course.init
*/
const Course = sequelize.define('course',
{
    id_course:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    name:{type:DataTypes.STRING, allowNull:false},
    cost:{type:DataTypes.DECIMAL(10,2), allowNull:false},
    period_days:{type:DataTypes.INTEGER, allowNull:false},
    lesson_count:{type:DataTypes.INTEGER, allowNull:false},
    description:{type:DataTypes.STRING, allowNull:false}
})
/*{
    sequelize,
    modelName:'Course',
    tableName:'course'
})*/

User.belongsTo(Course)
Course.hasMany(User)

module.exports = {
    User,
    Course
}