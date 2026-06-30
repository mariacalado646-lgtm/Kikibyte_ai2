import { Router } from 'express'
import {
    listarClientes, obterCliente, criarCliente, atualizarCliente, removerCliente,
    listarDocumentos, obterDocumento, criarDocumento, atualizarDocumento, removerDocumento,
    listarMensagensDocumento, criarMensagemDocumento,
    listarPedidos, obterPedido, criarPedido, atualizarPedido,
    listarNotificacoes, marcarNotificacaoLida, criarNotificacao
} from '../controllers/clientes.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ─── Clientes ────────────────────────────────────────────────────
router.get('/clientes',        requireAuth, listarClientes)
router.get('/clientes/:id',    requireAuth, obterCliente)
router.post('/clientes',       requireAuth, criarCliente)
router.put('/clientes/:id',    requireAuth, atualizarCliente)
router.delete('/clientes/:id', requireAuth, removerCliente)

// ─── Documentos ──────────────────────────────────────────────────
router.get('/documentos',        requireAuth, listarDocumentos)
router.get('/documentos/:id',    requireAuth, obterDocumento)
router.post('/documentos',       requireAuth, criarDocumento)
router.put('/documentos/:id',    requireAuth, atualizarDocumento)
router.delete('/documentos/:id', requireAuth, removerDocumento)

// ─── Mensagens de Documentos ─────────────────────────────────────
router.get('/documentos/:documentoId/mensagens',  requireAuth, listarMensagensDocumento)
router.post('/documentos/:documentoId/mensagens', requireAuth, criarMensagemDocumento)

// ─── Pedidos ─────────────────────────────────────────────────────
router.get('/pedidos',        requireAuth, listarPedidos)
router.get('/pedidos/:id',    requireAuth, obterPedido)
router.post('/pedidos',       requireAuth, criarPedido)
router.put('/pedidos/:id',    requireAuth, atualizarPedido)

// ─── Notificações ────────────────────────────────────────────────
router.get('/notificacoes',         requireAuth, listarNotificacoes)
router.post('/notificacoes',        requireAuth, criarNotificacao)
router.put('/notificacoes/:id/ler', requireAuth, marcarNotificacaoLida)

export default router
