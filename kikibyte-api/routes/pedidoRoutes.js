import { Router } from 'express'
import { listar, obter, criar, atualizar } from '../controllers/pedidoController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.get('/:id', requireAuth, obter)
router.post('/',   requireAuth, criar)
router.put('/:id', requireAuth, atualizar)

export default router
