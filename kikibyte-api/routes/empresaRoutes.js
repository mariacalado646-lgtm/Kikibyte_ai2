import { Router } from 'express'
import { listar, obter, criar, atualizar, getSiteContent } from '../controllers/empresaController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/public', getSiteContent)           // public - homepage
router.get('/',        requireAuth, listar)
router.get('/:id',     requireAuth, obter)
router.post('/',       requireAuth, criar)
router.put('/:id',     requireAuth, atualizar)

export default router
