import { Router } from 'express'
import { getArtigosPublicados, getArtigoPorSlug, getCategorias } from '../controllers/artigoController.js'

const router = Router()

router.get('/categorias',   getCategorias)
router.get('/',             getArtigosPublicados)
router.get('/:slug',        getArtigoPorSlug)

export default router
