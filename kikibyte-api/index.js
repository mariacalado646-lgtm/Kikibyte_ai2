import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './config/database.js'
import contactRoutes from './routes/contactRoutes.js'

dotenv.config()

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '20mb' }))  // base64 files can be large

app.use('/api/contact', contactRoutes)

sequelize.authenticate()
.then(() => {
    console.log('Database connected')
    app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
    )
})
.catch(err => console.error('Database connection failed:', err))
