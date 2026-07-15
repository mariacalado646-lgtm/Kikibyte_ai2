import { Router } from 'express'
import {
    listarAtivos, criarAtivo, removerAtivo, importarAtivosExcel,
    listarIncidentes, criarIncidente, atualizarIncidente, removerIncidente,
    listarPenTests, criarPenTest, removerPenTest
} from '../controllers/ativos.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requirePermissao } from '../middleware/permissoes.js'

const router = Router()

// ─── Middleware global: autenticação + permissão de submissões ───
router.use(requireAuth, requirePermissao('submissoes'))

// ─── Ativos Tecnológicos ─────────────────────────────────────────
router.get('/ativos-tecnologicos',               listarAtivos)
router.post('/ativos-tecnologicos',              criarAtivo)
router.post('/ativos-tecnologicos/importar-excel', importarAtivosExcel)
router.delete('/ativos-tecnologicos/:id',        removerAtivo)

// ─── Incidentes ──────────────────────────────────────────────────
router.get('/incidentes',        listarIncidentes)
router.post('/incidentes',       criarIncidente)
router.put('/incidentes/:id',    atualizarIncidente)
router.delete('/incidentes/:id', removerIncidente)

// ─── Pen Tests ───────────────────────────────────────────────────
router.get('/pen-tests',        listarPenTests)
router.post('/pen-tests',       criarPenTest)
router.delete('/pen-tests/:id', removerPenTest)

export default router
