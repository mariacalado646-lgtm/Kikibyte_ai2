import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './config/database.js'
import contactRoutes from './routes/contactRoutes.js'
import artigoRoutes from './routes/artigoRoutes.js'
import authRoutes from './routes/authRoutes.js'
import clienteRoutes from './routes/clienteRoutes.js'
import documentoRoutes from './routes/documentoRoutes.js'
import pedidoRoutes from './routes/pedidoRoutes.js'
import mensagemRoutes from './routes/mensagemRoutes.js'
import notificacaoRoutes from './routes/notificacaoRoutes.js'
import empresaRoutes from './routes/empresaRoutes.js'
import relatorioRoutes from './routes/relatorioRoutes.js'

// ── Model imports (to register associations) ──────────────────────
import { Cliente } from './models/Cliente.js'
import { Empresa } from './models/Empresa.js'
import { Documento } from './models/Documento.js'
import { Pedido } from './models/Pedido.js'
import { Relatorio } from './models/Relatorio.js'

// ── Associations ──────────────────────────────────────────────────
Cliente.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' })
Documento.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
Relatorio.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })

dotenv.config()

const app = express()

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: corsOrigin.split(',').map(s => s.trim()) }))
app.use(express.json({ limit: '20mb' }))  // base64 files can be large

app.use('/api/contact',    contactRoutes)
app.use('/api/artigos',    artigoRoutes)
app.use('/api/auth',       authRoutes)
app.use('/api/clientes',   clienteRoutes)
app.use('/api/documentos', documentoRoutes)
app.use('/api/pedidos',    pedidoRoutes)
app.use('/api/mensagens',  mensagemRoutes)
app.use('/api/notificacoes', notificacaoRoutes)
app.use('/api/empresas',   empresaRoutes)
app.use('/api/relatorios', relatorioRoutes)

sequelize.authenticate()
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection failed:', err))

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
)
