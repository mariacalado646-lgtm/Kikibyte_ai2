import { Router } from 'express'
import {
    listarClientes, obterCliente, criarCliente, atualizarCliente, removerCliente,
    listarDocumentos, obterDocumento, criarDocumento, atualizarDocumento, removerDocumento,
    listarMensagensDocumento, criarMensagemDocumento,
    listarPedidos, obterPedido, criarPedido, atualizarPedido,
    listarNotificacoes, marcarNotificacaoLida, criarNotificacao
} from '../controllers/clientes.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requirePermissao } from '../middleware/permissoes.js'

const router = Router()

// ─── Middleware global: autenticação para TODAS as rotas ──────────
router.use(requireAuth)

// ─── Clientes ────────────────────────────────────────────────────
router.get('/clientes',        listarClientes)
router.get('/clientes/:id',    obterCliente)
router.post('/clientes',       criarCliente)
router.put('/clientes/:id',    atualizarCliente)
router.delete('/clientes/:id', removerCliente)

// ─── Documentos (com verificação de permissão) ───────────────────
router.use('/documentos', requirePermissao('documentos'))

router.get('/documentos',        listarDocumentos)
router.get('/documentos/:id',    obterDocumento)
router.post('/documentos',       criarDocumento)
router.put('/documentos/:id',    atualizarDocumento)
router.delete('/documentos/:id', removerDocumento)
router.get('/documentos/:documentoId/mensagens',  listarMensagensDocumento)
router.post('/documentos/:documentoId/mensagens', criarMensagemDocumento)

// ─── Pedidos (com verificação de permissão) ──────────────────────
router.use('/pedidos', requirePermissao('pedidos'))

router.get('/pedidos',        listarPedidos)
router.get('/pedidos/:id',    obterPedido)
router.post('/pedidos',       criarPedido)
router.put('/pedidos/:id',    atualizarPedido)

// ─── Notificações ────────────────────────────────────────────────
router.get('/notificacoes',         listarNotificacoes)
router.post('/notificacoes',        criarNotificacao)
router.put('/notificacoes/:id/ler', marcarNotificacaoLida)

export default router
