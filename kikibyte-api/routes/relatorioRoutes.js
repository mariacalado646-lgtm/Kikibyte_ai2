import { Router } from 'express'
import { listar, obter, criar } from '../controllers/relatorioController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.get('/:id', requireAuth, obter)
router.post('/',   requireAuth, criar)

export default router
