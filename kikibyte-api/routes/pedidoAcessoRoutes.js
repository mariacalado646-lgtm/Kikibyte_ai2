import { Router } from 'express'
import { listar, criar, aprovar, rejeitar } from '../controllers/pedidoAcessoController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/',   requireAuth, listar)
router.post('/',  criar) // public — anyone can request access
router.put('/:id/aprovar',  requireAuth, aprovar)
router.put('/:id/rejeitar', requireAuth, rejeitar)

export default router
