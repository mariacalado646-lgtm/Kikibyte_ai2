import { Router } from 'express'
import { listar, criar } from '../controllers/mensagemController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',  requireAuth, listar)
router.post('/', requireAuth, criar)

export default router
