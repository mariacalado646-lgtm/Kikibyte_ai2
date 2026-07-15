import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '../.env') })

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
