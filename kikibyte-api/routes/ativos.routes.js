import { Router } from 'express'
import {
    listarAtivos, criarAtivo, removerAtivo, importarAtivosExcel,
    listarIncidentes, criarIncidente, atualizarIncidente, removerIncidente,
    listarPenTests, criarPenTest, removerPenTest
} from '../controllers/ativos.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ─── Ativos Tecnológicos ─────────────────────────────────────────
router.get('/ativos-tecnologicos',               requireAuth, listarAtivos)
router.post('/ativos-tecnologicos',              requireAuth, criarAtivo)
router.post('/ativos-tecnologicos/importar-excel', requireAuth, importarAtivosExcel)
router.delete('/ativos-tecnologicos/:id',        requireAuth, removerAtivo)

// ─── Incidentes ──────────────────────────────────────────────────
router.get('/incidentes',        requireAuth, listarIncidentes)
router.post('/incidentes',       requireAuth, criarIncidente)
router.put('/incidentes/:id',    requireAuth, atualizarIncidente)
router.delete('/incidentes/:id', requireAuth, removerIncidente)

// ─── Pen Tests ───────────────────────────────────────────────────
router.get('/pen-tests',        requireAuth, listarPenTests)
router.post('/pen-tests',       requireAuth, criarPenTest)
router.delete('/pen-tests/:id', requireAuth, removerPenTest)

export default router
