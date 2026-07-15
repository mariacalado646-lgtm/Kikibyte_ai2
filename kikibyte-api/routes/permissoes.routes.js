import { Router } from 'express'
import { listarPorCliente, atualizarPermissoes, obterPermissoesParaCliente } from '../controllers/permissoes.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/cliente/:cliente_id', requireAuth, listarPorCliente)
router.put('/cliente/:cliente_id', requireAuth, atualizarPermissoes)
router.get('/me',                  requireAuth, obterPermissoesParaCliente)

export default router
