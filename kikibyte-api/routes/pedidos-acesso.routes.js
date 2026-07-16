import { Router } from 'express'
import { listar, criar, aprovar, rejeitar } from '../controllers/pedidos-acesso.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { logAction } from '../middleware/logMiddleware.js'

const router = Router()

router.get('/',     requireAuth, listar)
router.post('/',    criar)  // public (sem log porque não há req.user)
router.put('/:id/aprovar',  requireAuth, logAction('APROVAR_PEDIDO_ACESSO'), aprovar)
router.put('/:id/rejeitar', requireAuth, logAction('REJEITAR_PEDIDO_ACESSO'), rejeitar)

export default router
