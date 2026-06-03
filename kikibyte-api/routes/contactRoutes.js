import { Router } from 'express'
import { submitContact, getSubmissions } from '../controllers/contactController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.post('/', submitContact)
router.get('/', requireAuth, requireRole(1), getSubmissions)
export default router
