import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
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

// ── Model imports (registers them with Sequelize for sync) ─────────
import { Role } from './models/Role.js'
import { Utilizador } from './models/Utilizador.js'
import { Cliente } from './models/Cliente.js'
import { Empresa } from './models/Empresa.js'
import { Documento } from './models/Documento.js'
import { Pedido } from './models/Pedido.js'
import { Relatorio } from './models/Relatorio.js'
import { Mensagem } from './models/Mensagem.js'
import { Notificacao } from './models/Notificacao.js'
import { Artigo, CategoriaArtigo } from './models/Artigo.js'
import { ContactForm } from './models/ContactForm.js'

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

// ── Sync database & seed default data ─────────────────────────────
async function start() {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    await sequelize.sync()
    console.log('Tables synced')

    // ── Seed roles ──
    const roleCount = await Role.count()
    if (roleCount === 0) {
      await Role.bulkCreate([
        { nome: 'admin',  descricao: 'Administrador', ativo: true, created_at: new Date() },
        { nome: 'gestor', descricao: 'Gestor',        ativo: true, created_at: new Date() },
        { nome: 'client', descricao: 'Cliente',       ativo: true, created_at: new Date() },
      ])
      console.log('Roles seeded')
    }

    // ── Seed admin user (role_id: 1) ──
    const adminCount = await Utilizador.count({ where: { role_id: 1 } })
    if (adminCount === 0) {
      const hash = await bcrypt.hash('admin123', 10)
      await Utilizador.create({
        nome: 'Administrador',
        email: 'admin@kikibyte.pt',
        password_hash: hash,
        role_id: 1,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      console.log('Admin user seeded')
    }

    // ── Seed gestor user (role_id: 2) ──
    const gestorCount = await Utilizador.count({ where: { role_id: 2 } })
    if (gestorCount === 0) {
      const hash = await bcrypt.hash('gestor123', 10)
      await Utilizador.create({
        nome: 'Gestor Padrão',
        email: 'gestor@kikibyte.pt',
        password_hash: hash,
        role_id: 2,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      console.log('Gestor user seeded')
    }
  } catch (err) {
    console.error('Startup error:', err)
  }
}

start()

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
)
