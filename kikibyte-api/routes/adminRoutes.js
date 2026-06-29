import { Router } from 'express'
import { stats, importarClientes } from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/stats',            requireAuth, requireRole(1), stats)
router.post('/importar-clientes', requireAuth, requireRole(1), importarClientes)

export default router
