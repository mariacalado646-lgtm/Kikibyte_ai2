import { Router } from 'express'
import { listar, obter, criar, atualizar, remover } from '../controllers/utilizadores.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { logAction } from '../middleware/logMiddleware.js'

const router = Router()

router.get('/',     requireAuth, requireRole(1), listar)
router.get('/:id',  requireAuth, requireRole(1), obter)
router.post('/',    requireAuth, requireRole(1), logAction('CRIAR_UTILIZADOR'), criar)
router.put('/:id',  requireAuth, requireRole(1), logAction('ATUALIZAR_UTILIZADOR'), atualizar)
router.delete('/:id', requireAuth, requireRole(1), logAction('REMOVER_UTILIZADOR'), remover)

export default router
