import { Router } from 'express'
import { listar, marcarLida, criar } from '../controllers/notificacaoController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',    requireAuth, listar)
router.post('/',   requireAuth, criar)
router.put('/:id/ler', requireAuth, marcarLida)

export default router
