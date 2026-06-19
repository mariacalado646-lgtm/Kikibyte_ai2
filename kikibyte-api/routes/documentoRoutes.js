import { Router } from 'express'
import { listar, obter, criar, remover } from '../controllers/documentoController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.get('/:id', requireAuth, obter)
router.post('/',   requireAuth, criar)
router.delete('/:id', requireAuth, remover)

export default router
