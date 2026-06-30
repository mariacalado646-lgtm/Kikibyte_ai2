import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { sequelize } from './config/database.js'

// ── 10 rotas agrupadas ─────────────────────────────────────────────
import authRoutes           from './routes/auth.routes.js'
import adminRoutes          from './routes/admin.routes.js'
import clientesRoutes       from './routes/clientes.routes.js'
import ativosRoutes         from './routes/ativos.routes.js'
import comunicacaoRoutes   from './routes/comunicacao.routes.js'
import relatoriosRoutes    from './routes/relatorios.routes.js'
import conteudoRoutes      from './routes/conteudo.routes.js'
import utilizadoresRoutes  from './routes/utilizadores.routes.js'
import permissoesRoutes    from './routes/permissoes.routes.js'
import pedidosAcessoRoutes from './routes/pedidos-acesso.routes.js'

// ── Model imports (to register associations) ──────────────────────
import { Cliente } from './models/Cliente.js'
import { Empresa } from './models/Empresa.js'
import { Documento } from './models/Documento.js'
import { Pedido } from './models/Pedido.js'
import { Relatorio } from './models/Relatorio.js'
import { RelatorioAnual } from './models/RelatorioAnual.js'
import { DocumentoMensagem } from './models/DocumentoMensagem.js'
import { PedidoAcesso } from './models/PedidoAcesso.js'
import { Mensagem } from './models/Mensagem.js'
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
Mensagem.belongsTo(Utilizador, { foreignKey: 'remetente_id', as: 'remetente' })
Mensagem.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' })

const app = express()

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174'
app.use(cors({ origin: corsOrigin.split(',').map(s => s.trim()) }))
app.use(express.json({ limit: '20mb' }))

// ── Rotas ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)      // auth.*
app.use('/api/admin', adminRoutes)    // admin.*
app.use('/api', clientesRoutes)       // clientes, documentos, pedidos, notificacoes
app.use('/api', ativosRoutes)         // ativos-tecnologicos, incidentes, pen-tests
app.use('/api', comunicacaoRoutes)    // mensagens, mensagens-diretas
app.use('/api', relatoriosRoutes)     // relatorios, relatorios-anuais, dashboard, logs
app.use('/api', conteudoRoutes)       // artigos, empresas, contact
app.use('/api/utilizadores', utilizadoresRoutes)
app.use('/api/permissoes', permissoesRoutes)
app.use('/api/pedidos-acesso', pedidosAcessoRoutes)

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection failed:', err))

app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
)
