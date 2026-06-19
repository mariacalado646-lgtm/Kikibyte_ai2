import { Router } from 'express'
import { listar, obter } from '../controllers/empresaController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.get('/:id', requireAuth, obter)

export default router
