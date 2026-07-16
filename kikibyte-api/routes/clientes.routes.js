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
import { logAction } from '../middleware/logMiddleware.js'

const router = Router()

// ─── Middleware global: autenticação para TODAS as rotas ──────────
router.use(requireAuth)

// ─── Clientes ────────────────────────────────────────────────────
router.get('/clientes',        listarClientes)
router.get('/clientes/:id',    obterCliente)
router.post('/clientes',       logAction('CRIAR_CLIENTE'),       criarCliente)
router.put('/clientes/:id',    logAction('ATUALIZAR_CLIENTE'),   atualizarCliente)
router.delete('/clientes/:id', logAction('REMOVER_CLIENTE'),     removerCliente)

// ─── Documentos (com verificação de permissão) ───────────────────
router.use('/documentos', requirePermissao('documentos'))

router.get('/documentos',        listarDocumentos)
router.get('/documentos/:id',    obterDocumento)
router.post('/documentos',       logAction('CRIAR_DOCUMENTO'),       criarDocumento)
router.put('/documentos/:id',    logAction('ATUALIZAR_DOCUMENTO'),   atualizarDocumento)
router.delete('/documentos/:id', logAction('REMOVER_DOCUMENTO'),     removerDocumento)
router.get('/documentos/:documentoId/mensagens',  listarMensagensDocumento)
router.post('/documentos/:documentoId/mensagens', logAction('CRIAR_MENSAGEM_DOCUMENTO'), criarMensagemDocumento)

// ─── Pedidos (com verificação de permissão) ──────────────────────
router.use('/pedidos', requirePermissao('pedidos'))

router.get('/pedidos',        listarPedidos)
router.get('/pedidos/:id',    obterPedido)
router.post('/pedidos',       logAction('CRIAR_PEDIDO'),     criarPedido)
router.put('/pedidos/:id',    logAction('ATUALIZAR_PEDIDO'), atualizarPedido)

// ─── Notificações ────────────────────────────────────────────────
router.get('/notificacoes',         listarNotificacoes)
router.post('/notificacoes',        logAction('CRIAR_NOTIFICACAO'),     criarNotificacao)
router.put('/notificacoes/:id/ler', logAction('MARCAR_NOTIFICACAO_LIDA'), marcarNotificacaoLida)

export default router
