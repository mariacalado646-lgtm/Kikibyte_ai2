import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
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
import relatorioAnualRoutes from './routes/relatorioAnualRoutes.js'
import utilizadorRoutes from './routes/utilizadorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import documentoMensagemRoutes from './routes/documentoMensagemRoutes.js'
import pedidoAcessoRoutes from './routes/pedidoAcessoRoutes.js'
import mensagemDiretaRoutes from './routes/mensagemDiretaRoutes.js'
import ativoTecnologicoRoutes from './routes/ativoTecnologicoRoutes.js'
import incidenteRoutes from './routes/incidenteRoutes.js'
import penTestRoutes from './routes/penTestRoutes.js'
import logRoutes from './routes/logRoutes.js'
import permissaoClienteRoutes from './routes/permissaoClienteRoutes.js'

// ── Model imports (to register associations) ──────────────────────
import { Cliente } from './models/Cliente.js'
import { Empresa } from './models/Empresa.js'
import { Documento } from './models/Documento.js'
import { Pedido } from './models/Pedido.js'
import { Relatorio } from './models/Relatorio.js'
import { RelatorioAnual } from './models/RelatorioAnual.js'
import { DocumentoMensagem } from './models/DocumentoMensagem.js'
import { PedidoAcesso } from './models/PedidoAcesso.js'
import { MensagemDireta } from './models/MensagemDireta.js'
import { AtivoTecnologico } from './models/AtivoTecnologico.js'
import { Incidente } from './models/Incidente.js'
import { PenTest } from './models/PenTest.js'
import { Log } from './models/Log.js'
import { PermissaoCliente } from './models/PermissaoCliente.js'
import { Utilizador } from './models/Utilizador.js'

// ── Associations ──────────────────────────────────────────────────
Cliente.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' })
Documento.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
Relatorio.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
RelatorioAnual.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
DocumentoMensagem.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' })
Log.belongsTo(Utilizador, { foreignKey: 'utilizador_id', as: 'utilizador' })
PermissaoCliente.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
MensagemDireta.belongsTo(Utilizador, { foreignKey: 'remetente_id', as: 'remetente' })

dotenv.config()

const app = express()

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174'
app.use(cors({ origin: corsOrigin.split(',').map(s => s.trim()) }))
app.use(express.json({ limit: '20mb' }))  // base64 files can be large

app.use('/api/contact',    contactRoutes)
app.use('/api/artigos',    artigoRoutes)
app.use('/api/auth',       authRoutes)
app.use('/api/clientes',   clienteRoutes)
app.use('/api/documentos', documentoRoutes)
app.use('/api/documentos/:documentoId/mensagens', documentoMensagemRoutes)
app.use('/api/pedidos',    pedidoRoutes)
app.use('/api/mensagens',  mensagemRoutes)
app.use('/api/notificacoes', notificacaoRoutes)
app.use('/api/empresas',   empresaRoutes)
app.use('/api/relatorios', relatorioRoutes)
app.use('/api/relatorios-anuais', relatorioAnualRoutes)
app.use('/api/utilizadores', utilizadorRoutes)
app.use('/api/admin',        adminRoutes)
app.use('/api/pedidos-acesso', pedidoAcessoRoutes)
app.use('/api/mensagens-diretas', mensagemDiretaRoutes)
app.use('/api/ativos-tecnologicos', ativoTecnologicoRoutes)
app.use('/api/incidentes', incidenteRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/permissoes', permissaoClienteRoutes)
app.use('/api/pen-tests', penTestRoutes)
app.use('/api/dashboard',      dashboardRoutes)

sequelize.authenticate()
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection failed:', err))

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
)
