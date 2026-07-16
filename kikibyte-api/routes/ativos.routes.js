import { Router } from 'express'
import {
    listarAtivos, criarAtivo, removerAtivo, importarAtivosExcel,
    listarIncidentes, criarIncidente, atualizarIncidente, removerIncidente,
    listarPenTests, criarPenTest, removerPenTest
} from '../controllers/ativos.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requirePermissao } from '../middleware/permissoes.js'
import { logAction } from '../middleware/logMiddleware.js'

const router = Router()

// ─── Middleware global: autenticação + permissão de submissões ───
router.use(requireAuth, requirePermissao('submissoes'))

// ─── Ativos Tecnológicos ─────────────────────────────────────────
router.get('/ativos-tecnologicos',               listarAtivos)
router.post('/ativos-tecnologicos',              logAction('CRIAR_ATIVO'),   criarAtivo)
router.post('/ativos-tecnologicos/importar-excel', logAction('IMPORTAR_ATIVOS_EXCEL'), importarAtivosExcel)
router.delete('/ativos-tecnologicos/:id',        logAction('REMOVER_ATIVO'), removerAtivo)

// ─── Incidentes ──────────────────────────────────────────────────
router.get('/incidentes',        listarIncidentes)
router.post('/incidentes',       logAction('CRIAR_INCIDENTE'),   criarIncidente)
router.put('/incidentes/:id',    logAction('ATUALIZAR_INCIDENTE'), atualizarIncidente)
router.delete('/incidentes/:id', logAction('REMOVER_INCIDENTE'), removerIncidente)

// ─── Pen Tests ───────────────────────────────────────────────────
router.get('/pen-tests',        listarPenTests)
router.post('/pen-tests',       logAction('CRIAR_PENTEST'),     criarPenTest)
router.delete('/pen-tests/:id', logAction('REMOVER_PENTEST'),   removerPenTest)

export default router
