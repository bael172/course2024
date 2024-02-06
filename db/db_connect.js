const {Sequelize} = require ('sequelize')
require('dotenv').config()

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect:"postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
)
/*
const {Sequelize , DataTypes} = require('sequelize');
const sequelize = new Sequelize('rest 2','postgres','0000',
{
    host:'localhost',
    dialect:'postgres'
})
*/