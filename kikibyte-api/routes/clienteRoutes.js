import { Router } from 'express'
import { listar, obter, criar, atualizar, remover } from '../controllers/clienteController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.get('/:id', requireAuth, obter)
router.post('/',   requireAuth, criar)
router.put('/:id', requireAuth, atualizar)
router.delete('/:id', requireAuth, remover)

export default router
