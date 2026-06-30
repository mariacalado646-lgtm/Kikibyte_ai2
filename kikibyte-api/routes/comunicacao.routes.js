import { Router } from 'express'
import {
    listarMensagens, criarMensagem,
    enviarMensagemDireta, listarMensagensDiretas
} from '../controllers/comunicacao.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ─── Mensagens (de pedidos) ──────────────────────────────────────
router.get('/mensagens',         requireAuth, listarMensagens)
router.post('/mensagens',        requireAuth, criarMensagem)

// ─── Mensagens Diretas ───────────────────────────────────────────
router.get('/mensagens-diretas',  requireAuth, listarMensagensDiretas)
router.post('/mensagens-diretas', requireAuth, enviarMensagemDireta)

export default router
