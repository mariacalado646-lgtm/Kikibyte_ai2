import { Router } from 'express'
import {
    listarRelatorios, obterRelatorio, criarRelatorio,
    listarRelatoriosAnuais, obterRelatorioAnual, criarRelatorioAnual,
    atualizarRelatorioAnual, removerRelatorioAnual,
    dashboardCompleto,
    listarLogs, obterLog, limparLogs
} from '../controllers/relatorios.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { requirePermissao } from '../middleware/permissoes.js'

const router = Router()

// ─── Middleware global: autenticação para TODAS as rotas ──────────
router.use(requireAuth)

// ─── Relatórios (com verificação de permissão) ───────────────────
router.use('/relatorios', requirePermissao('relatorios'))

router.get('/relatorios',         listarRelatorios)
router.get('/relatorios/:id',     obterRelatorio)
router.post('/relatorios',        criarRelatorio)

// ─── Relatórios Anuais (apenas admin role 1) ─────────────────────
router.use('/relatorios-anuais', requireRole(1))

router.get('/relatorios-anuais',      listarRelatoriosAnuais)
router.get('/relatorios-anuais/:id',  obterRelatorioAnual)
router.post('/relatorios-anuais',     criarRelatorioAnual)
router.put('/relatorios-anuais/:id',  atualizarRelatorioAnual)
router.delete('/relatorios-anuais/:id', removerRelatorioAnual)

// ─── Dashboard (com verificação de permissão) ────────────────────
router.get('/dashboard/completo', requirePermissao('dashboard'), dashboardCompleto)

// ─── Logs ────────────────────────────────────────────────────────
router.get('/logs',           listarLogs)
router.get('/logs/:id',       obterLog)
router.delete('/logs/limpar', limparLogs)

export default router
