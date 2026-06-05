import { Router } from 'express'
import { getArtigosPublicados, getArtigoPorSlug } from '../controllers/artigoController.js'

const router = Router()

router.get('/',       getArtigosPublicados)
router.get('/:slug',  getArtigoPorSlug)

export default router
