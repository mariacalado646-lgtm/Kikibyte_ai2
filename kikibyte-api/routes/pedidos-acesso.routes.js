import { Router } from 'express'
import { listar, criar, aprovar, rejeitar } from '../controllers/pedidos-acesso.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/',     requireAuth, listar)
router.post('/',    criar)  // public
router.put('/:id/aprovar',  requireAuth, aprovar)
router.put('/:id/rejeitar', requireAuth, rejeitar)

export default router
