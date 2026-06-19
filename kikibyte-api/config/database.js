import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.DATABASE_SSL !== 'false'
            ? { require: true, rejectUnauthorized: false }
            : false
    },
    pool: {
        max: 5,
        min: 0,
        idle: 30000,
        acquire: 60000
    }
})
