import { Router } from 'express'
import { listar, criar } from '../controllers/documentoMensagemController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/:documento_id/mensagens',  requireAuth, listar)
router.post('/:documento_id/mensagens', requireAuth, criar)

export default router
