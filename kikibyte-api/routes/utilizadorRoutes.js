import { Router } from 'express'
import { listar, obter, criar, atualizar, remover } from '../controllers/utilizadorController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Apenas o Administrador (role_id 1) gere contas de utilizador
router.get('/',     requireAuth, requireRole(1), listar)
router.get('/:id',  requireAuth, requireRole(1), obter)
router.post('/',    requireAuth, requireRole(1), criar)
router.put('/:id',  requireAuth, requireRole(1), atualizar)
router.delete('/:id', requireAuth, requireRole(1), remover)

export default router