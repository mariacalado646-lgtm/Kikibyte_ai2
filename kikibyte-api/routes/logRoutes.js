import { Router } from 'express'
import { listar, obter, limpar } from '../controllers/logController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.get('/:id', requireAuth, obter)
router.delete('/limpar', requireAuth, limpar)

export default router
