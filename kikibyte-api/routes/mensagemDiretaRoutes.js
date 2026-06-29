import { Router } from 'express'
import { enviar, listarPorCliente } from '../controllers/mensagemDiretaController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/',  requireAuth, listarPorCliente)
router.post('/', requireAuth, enviar)

export default router
