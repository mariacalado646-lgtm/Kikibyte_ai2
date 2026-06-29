import { Router } from 'express'
import { login, register, me, refresh, changePassword } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login',    login)
router.post('/register', register)
router.post('/refresh',        refresh)
router.get('/me',              requireAuth, me)
router.put('/change-password', requireAuth, changePassword)

export default router
