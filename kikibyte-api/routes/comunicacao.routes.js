import { Router } from 'express'
import {
    listarMensagens, criarMensagem,
    enviarMensagemDireta, listarMensagensDiretas
} from '../controllers/comunicacao.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requirePermissao } from '../middleware/permissoes.js'

const router = Router()

// ─── Middleware global: autenticação + permissão de mensagens ────
router.use(requireAuth, requirePermissao('mensagens'))

// ─── Mensagens (de pedidos) ──────────────────────────────────────
router.get('/mensagens',         listarMensagens)
router.post('/mensagens',        criarMensagem)

// ─── Mensagens Diretas ───────────────────────────────────────────
router.get('/mensagens-diretas',  listarMensagensDiretas)
router.post('/mensagens-diretas', enviarMensagemDireta)

export default router
