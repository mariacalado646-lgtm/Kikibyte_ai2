import { Router } from 'express'
import {
    getArtigosPublicados, getArtigoPorSlug, getCategorias,
    listarTodos, obterArtigo, criarArtigo, atualizarArtigo, removerArtigo
} from '../controllers/artigoController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// ── Public ────────────────────────────────────────────────────────
router.get('/categorias',   getCategorias)
router.get('/',             getArtigosPublicados)
router.get('/:slug',        getArtigoPorSlug)

// ── Admin ─────────────────────────────────────────────────────────
router.get('/admin/todos',      requireAuth, requireRole(1), listarTodos)
router.get('/admin/:id',        requireAuth, requireRole(1), obterArtigo)
router.post('/admin',           requireAuth, requireRole(1), criarArtigo)
router.put('/admin/:id',        requireAuth, requireRole(1), atualizarArtigo)
router.delete('/admin/:id',     requireAuth, requireRole(1), removerArtigo)

export default router
