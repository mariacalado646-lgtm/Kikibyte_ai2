import { Router } from 'express'
import {
    getArtigosPublicados, getArtigoPorSlug, getCategorias,
    listarTodosArtigos, obterArtigo, criarArtigo, atualizarArtigo, removerArtigo,
    listarEmpresas, obterEmpresa, criarEmpresa, atualizarEmpresa, getSiteContent,
    submitContact, getContactSubmissions
} from '../controllers/conteudo.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// ─── Artigos (públicos) ──────────────────────────────────────────
router.get('/artigos/categorias', getCategorias)
router.get('/artigos',            getArtigosPublicados)
router.get('/artigos/:slug',      getArtigoPorSlug)

// ─── Artigos (admin CRUD) ────────────────────────────────────────
router.get('/artigos/admin/todos',  requireAuth, requireRole(1), listarTodosArtigos)
router.get('/artigos/admin/:id',    requireAuth, requireRole(1), obterArtigo)
router.post('/artigos/admin',       requireAuth, requireRole(1), criarArtigo)
router.put('/artigos/admin/:id',    requireAuth, requireRole(1), atualizarArtigo)
router.delete('/artigos/admin/:id', requireAuth, requireRole(1), removerArtigo)

// ─── Empresas ────────────────────────────────────────────────────
router.get('/empresas/public', getSiteContent)
router.get('/empresas',        requireAuth, listarEmpresas)
router.get('/empresas/:id',    requireAuth, obterEmpresa)
router.post('/empresas',       requireAuth, criarEmpresa)
router.put('/empresas/:id',    requireAuth, atualizarEmpresa)

// ─── Contact Form ────────────────────────────────────────────────
router.post('/contact', submitContact)
router.get('/contact',  requireAuth, requireRole(1), getContactSubmissions)

export default router
