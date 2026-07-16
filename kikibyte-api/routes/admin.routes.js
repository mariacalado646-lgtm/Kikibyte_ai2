import { Router } from 'express'
import { stats, importarClientes } from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { logAction } from '../middleware/logMiddleware.js'

const router = Router()

router.get('/stats',             requireAuth, requireRole(1), stats)
router.post('/importar-clientes', requireAuth, requireRole(1), logAction('IMPORTAR_CLIENTES'), importarClientes)

export default router
