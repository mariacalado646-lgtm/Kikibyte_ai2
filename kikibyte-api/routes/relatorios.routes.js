import { Router } from 'express'
import {
    listarRelatorios, obterRelatorio, criarRelatorio,
    listarRelatoriosAnuais, obterRelatorioAnual, criarRelatorioAnual,
    atualizarRelatorioAnual, removerRelatorioAnual,
    dashboardCompleto,
    listarLogs, obterLog, limparLogs
} from '../controllers/relatorios.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// ─── Relatórios ──────────────────────────────────────────────────
router.get('/relatorios',         requireAuth, listarRelatorios)
router.get('/relatorios/:id',     requireAuth, obterRelatorio)
router.post('/relatorios',        requireAuth, criarRelatorio)

// ─── Relatórios Anuais ───────────────────────────────────────────
router.get('/relatorios-anuais',      requireAuth, requireRole(1), listarRelatoriosAnuais)
router.get('/relatorios-anuais/:id',  requireAuth, requireRole(1), obterRelatorioAnual)
router.post('/relatorios-anuais',     requireAuth, requireRole(1), criarRelatorioAnual)
router.put('/relatorios-anuais/:id',  requireAuth, requireRole(1), atualizarRelatorioAnual)
router.delete('/relatorios-anuais/:id', requireAuth, requireRole(1), removerRelatorioAnual)

// ─── Dashboard ───────────────────────────────────────────────────
router.get('/dashboard/completo', requireAuth, dashboardCompleto)

// ─── Logs ────────────────────────────────────────────────────────
router.get('/logs',           requireAuth, listarLogs)
router.get('/logs/:id',       requireAuth, obterLog)
router.delete('/logs/limpar', requireAuth, limparLogs)

export default router
