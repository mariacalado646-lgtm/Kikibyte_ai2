import { Router } from 'express'
import { listar, criar, atualizar, remover } from '../controllers/incidenteController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.post('/',   requireAuth, criar)
router.put('/:id', requireAuth, atualizar)
router.delete('/:id', requireAuth, remover)

export default router
