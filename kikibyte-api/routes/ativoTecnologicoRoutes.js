import { Router } from 'express'
import { listar, criar, remover, importarExcel } from '../controllers/ativoTecnologicoController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/',        requireAuth, listar)
router.post('/',       requireAuth, criar)
router.post('/importar-excel', requireAuth, importarExcel)
router.delete('/:id',  requireAuth, remover)

export default router
