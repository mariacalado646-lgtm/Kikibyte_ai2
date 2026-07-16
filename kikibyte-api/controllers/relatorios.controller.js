import { Relatorio } from '../models/Relatorio.js'
import { RelatorioAnual } from '../models/RelatorioAnual.js'
import { Cliente } from '../models/Cliente.js'
import { Log } from '../models/Log.js'
import { Utilizador } from '../models/Utilizador.js'
import { Documento } from '../models/Documento.js'
import { Pedido } from '../models/Pedido.js'
import { ContactForm } from '../models/ContactForm.js'
import { Role } from '../models/Role.js'
import { Op } from 'sequelize'
import { sequelize } from '../config/database.js'

// ═════════════════════════════════════════════════════════════════
// RELATÓRIOS
// ═════════════════════════════════════════════════════════════════

export const listarRelatorios = async (req, res) => {
    try {
        const { cliente_id, publicado_cliente } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id
        if (publicado_cliente !== undefined) where.publicado_cliente = publicado_cliente === 'true'

        const relatorios = await Relatorio.findAll({
            where,
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }],
            order: [['created_at', 'DESC']]
        })
        res.json(relatorios)
    } catch (err) {
        console.error('Erro ao listar relatórios:', err)
        res.status(500).json({ error: 'Erro ao listar relatórios' })
    }
}

export const obterRelatorio = async (req, res) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!relatorio) return res.status(404).json({ error: 'Relatório não encontrado' })
        res.json(relatorio)
    } catch (err) {
        console.error('Erro ao obter relatório:', err)
        res.status(500).json({ error: 'Erro ao obter relatório' })
    }
}

export const criarRelatorio = async (req, res) => {
    try {
        const { cliente_id, titulo, tipo_relatorio, ficheiro_base64, mime_type, versao, publicado_cliente } = req.body
        if (!cliente_id || !titulo || !tipo_relatorio || !ficheiro_base64) {
            return res.status(400).json({ error: 'cliente_id, titulo, tipo_relatorio e ficheiro_base64 são obrigatórios' })
        }

        const relatorio = await Relatorio.create({
            cliente_id,
            criado_por: req.user?.id || null,
            titulo,
            tipo_relatorio,
            ficheiro_base64,
            mime_type: mime_type || null,
            versao: versao || null,
            publicado_cliente: publicado_cliente || false,
            created_at: new Date()
        })
        res.status(201).json(relatorio)
    } catch (err) {
        console.error('Erro ao criar relatório:', err)
        res.status(500).json({ error: 'Erro ao criar relatório' })
    }
}

// ═════════════════════════════════════════════════════════════════
// RELATÓRIOS ANUAIS
// ═════════════════════════════════════════════════════════════════

export const listarRelatoriosAnuais = async (req, res) => {
    try {
        const relatorios = await RelatorioAnual.findAll({
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }],
            order: [['created_at', 'DESC']]
        })
        res.json(relatorios)
    } catch (err) {
        console.error('Erro ao listar relatórios anuais:', err)
        res.status(500).json({ error: 'Erro ao listar relatórios anuais' })
    }
}

export const obterRelatorioAnual = async (req, res) => {
    try {
        const relatorio = await RelatorioAnual.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!relatorio) return res.status(404).json({ error: 'Relatório não encontrado' })
        res.json(relatorio)
    } catch (err) {
        console.error('Erro ao obter relatório anual:', err)
        res.status(500).json({ error: 'Erro ao obter relatório anual' })
    }
}

export const criarRelatorioAnual = async (req, res) => {
    try {
        const { cliente_id, ano, periodo, resumo, auditorias, problemas_encontrados, problemas_resolvidos, ficheiros_processados, recomendacoes } = req.body
        if (!cliente_id || !ano) {
            return res.status(400).json({ error: 'cliente_id e ano são obrigatórios' })
        }

        const relatorio = await RelatorioAnual.create({
            cliente_id,
            ano,
            periodo: periodo || 'annual',
            resumo: resumo || null,
            auditorias: auditorias || 0,
            problemas_encontrados: problemas_encontrados || 0,
            problemas_resolvidos: problemas_resolvidos || 0,
            ficheiros_processados: ficheiros_processados || 0,
            recomendacoes: recomendacoes || null,
            criado_por: req.user?.id || null,
            created_at: new Date()
        })
        res.status(201).json(relatorio)
    } catch (err) {
        console.error('Erro ao criar relatório anual:', err)
        res.status(500).json({ error: 'Erro ao criar relatório anual' })
    }
}

export const atualizarRelatorioAnual = async (req, res) => {
    try {
        const relatorio = await RelatorioAnual.findByPk(req.params.id)
        if (!relatorio) return res.status(404).json({ error: 'Relatório não encontrado' })

        await relatorio.update({ ...req.body })
        res.json(relatorio)
    } catch (err) {
        console.error('Erro ao atualizar relatório anual:', err)
        res.status(500).json({ error: 'Erro ao atualizar relatório anual' })
    }
}

export const removerRelatorioAnual = async (req, res) => {
    try {
        const relatorio = await RelatorioAnual.findByPk(req.params.id)
        if (!relatorio) return res.status(404).json({ error: 'Relatório não encontrado' })
        await relatorio.destroy()
        res.json({ success: true })
    } catch (err) {
        console.error('Erro ao remover relatório anual:', err)
        res.status(500).json({ error: 'Erro ao remover relatório anual' })
    }
}

// ═════════════════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════════════════

export const dashboardCompleto = async (req, res) => {
    try {
        const [totalClientes, totalDocumentos, totalPedidosPendentes, totalContactos] = await Promise.all([
            Cliente.count({ where: { ativo: true } }),
            Documento.count(),
            Pedido.count({ where: { estado: 'pendente' } }),
            ContactForm.count(),
        ])

        const conformidadeRows = await Cliente.findAll({
            attributes: [
                'estado_conformidade',
                [sequelize.fn('COUNT', sequelize.col('id_cliente')), 'count'],
            ],
            where: { estado_conformidade: { [Op.ne]: null } },
            group: ['estado_conformidade'],
            raw: true,
        })

        const conformidade = { conforme: 0, avaliacao: 0, pendencias: 0 }
        for (const row of conformidadeRows) {
            const label = (row.estado_conformidade || '').toLowerCase()
            const qty = parseInt(row.count, 10) || 0
            if (label.includes('conform')) conformidade.conforme += qty
            else if (label.includes('avali') || label.includes('análise') || label.includes('analise'))
                conformidade.avaliacao += qty
            else conformidade.pendencias += qty
        }

        const docsRaw = await Documento.findAll({
            include: [{ model: Cliente, as: 'cliente', attributes: ['nome'] }],
            raw: true,
        })
        const docCountMap = {}
        for (const d of docsRaw) {
            const nome = d['cliente.nome'] || 'Desconhecido'
            docCountMap[nome] = (docCountMap[nome] || 0) + 1
        }
        const topClientes = Object.entries(docCountMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([nome, total]) => ({ nome, total }))

        const docsComClientes = await Documento.findAll({
            include: [{ model: Cliente, as: 'cliente', attributes: ['nome'] }],
            order: [['created_at', 'DESC']],
        })

        const docsAgrupados = {}
        for (const doc of docsComClientes) {
            if (!doc.created_at) continue
            const nome = doc.cliente?.nome || 'Desconhecido'
            const data = new Date(doc.created_at)
            const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
            const key = `${nome}|${mes}`
            if (!docsAgrupados[key]) {
                docsAgrupados[key] = { cliente: nome, mes, total: 0 }
            }
            docsAgrupados[key].total++
        }
        const documentosPorClienteMes = Object.values(docsAgrupados)
            .sort((a, b) => b.mes.localeCompare(a.mes))
            .slice(0, 20)

        const usersByRole = await Utilizador.findAll({
            attributes: [
                'role_id',
                [sequelize.fn('COUNT', sequelize.col('id_utilizador')), 'count'],
            ],
            group: ['role_id'],
            raw: true,
        })

        const roleIds = usersByRole.map((r) => r.role_id).filter(Boolean)
        const roles = roleIds.length > 0
            ? await Role.findAll({ where: { id_role: { [Op.in]: roleIds } }, raw: true })
            : []
        const roleMap = {}
        for (const r of roles) roleMap[r.id_role] = r.nome

        const utilizadoresPorPerfil = usersByRole.map((r) => ({
            perfil: roleMap[r.role_id] || `Role #${r.role_id}`,
            total: parseInt(r.count, 10) || 0,
        }))

        const pedidosByEstado = await Pedido.findAll({
            attributes: [
                'estado',
                [sequelize.fn('COUNT', sequelize.col('id_pedido')), 'count'],
            ],
            group: ['estado'],
            raw: true,
        })

        const pedidosPorEstado = pedidosByEstado.map((r) => ({
            estado: r.estado || 'desconhecido',
            total: parseInt(r.count, 10) || 0,
        }))

        res.json({
            stats: { totalClientes, totalDocumentos, totalPedidosPendentes, totalContactos },
            conformidade,
            topClientes,
            documentosPorClienteMes,
            utilizadoresPorPerfil,
            pedidosPorEstado,
        })
    } catch (err) {
        console.error('Erro ao obter dashboard completo:', err)
        res.status(500).json({ error: 'Erro ao obter dados do dashboard' })
    }
}

// ═════════════════════════════════════════════════════════════════
// LOGS
// ═════════════════════════════════════════════════════════════════

export const listarLogs = async (req, res) => {
    try {
        const { limit, offset, acao, utilizador_id, data_inicio, data_fim } = req.query
        const where = {}

        if (acao) where.acao = { [Op.iLike]: `%${acao}%` }
        if (utilizador_id) where.utilizador_id = utilizador_id
        if (data_inicio || data_fim) {
            where.created_at = {}
            if (data_inicio) where.created_at[Op.gte] = new Date(data_inicio)
            if (data_fim) where.created_at[Op.lte] = new Date(data_fim)
        }

        const logs = await Log.findAndCountAll({
            where,
            order: [['created_at', 'DESC']],
            limit: limit ? parseInt(limit) : 100,
            offset: offset ? parseInt(offset) : 0,
            include: [{ model: Utilizador, as: 'utilizador', attributes: ['id_utilizador', 'nome', 'email', 'role_id'] }]
        })

        res.json({ total: logs.count, data: logs.rows })
    } catch (err) {
        console.error('Erro ao listar logs:', err)
        res.status(500).json({ error: 'Erro ao listar logs' })
    }
}

export const obterLog = async (req, res) => {
    try {
        const log = await Log.findByPk(req.params.id, {
            include: [{ model: Utilizador, as: 'utilizador' }]
        })
        if (!log) return res.status(404).json({ error: 'Log não encontrado' })
        res.json(log)
    } catch (err) {
        console.error('Erro ao obter log:', err)
        res.status(500).json({ error: 'Erro ao obter log' })
    }
}

export const limparLogs = async (req, res) => {
    try {
        const { dias } = req.query
        const dataLimite = new Date()
        dataLimite.setDate(dataLimite.getDate() - (dias ? parseInt(dias) : 90))

        const removidos = await Log.destroy({
            where: { created_at: { [Op.lt]: dataLimite } }
        })
        res.json({ message: `Logs anteriores a ${dataLimite.toISOString().split('T')[0]} removidos (${removidos} registos)` })
    } catch (err) {
        console.error('Erro ao limpar logs:', err)
        res.status(500).json({ error: 'Erro ao limpar logs' })
    }
}
