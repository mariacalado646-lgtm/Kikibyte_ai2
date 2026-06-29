import { Router } from 'express'
import { completo } from '../controllers/dashboardController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/completo', requireAuth, completo)

export default router
