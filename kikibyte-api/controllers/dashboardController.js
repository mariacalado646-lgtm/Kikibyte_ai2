import { Utilizador } from '../models/Utilizador.js'
import { Cliente } from '../models/Cliente.js'
import { Documento } from '../models/Documento.js'
import { Pedido } from '../models/Pedido.js'
import { ContactForm } from '../models/ContactForm.js'
import { Role } from '../models/Role.js'
import { Op } from 'sequelize'
import { sequelize } from '../config/database.js'

// ─────────────────────────────────────────────────────────────
// GET /api/dashboard/completo
// Dados completos para o painel de visão geral (Admin / Gestor)
// ─────────────────────────────────────────────────────────────
export const completo = async (req, res) => {
    try {
        // ─── 1. Stats Cards ───────────────────────────────────────
        const [totalClientes, totalDocumentos, totalPedidosPendentes, totalContactos] = await Promise.all([
            Cliente.count({ where: { ativo: true } }),
            Documento.count(),
            Pedido.count({ where: { estado: 'pendente' } }),
            ContactForm.count(),
        ])

        // ─── 2. Conformidade NIS2 ─────────────────────────────────
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

        // ─── 3. Top 5 Clientes com mais documentos ────────────────
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

        // ─── 4. Documentos por Cliente e por Mês ──────────────────
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

        // ─── 5. Utilizadores por Perfil ───────────────────────────
        const usersByRole = await Utilizador.findAll({
            attributes: [
                'role_id',
                [sequelize.fn('COUNT', sequelize.col('id_utilizador')), 'count'],
            ],
            group: ['role_id'],
            raw: true,
        })

        const roleIds = usersByRole.map((r) => r.role_id).filter(Boolean)
        const roles =
            roleIds.length > 0
                ? await Role.findAll({ where: { id_role: { [Op.in]: roleIds } }, raw: true })
                : []
        const roleMap = {}
        for (const r of roles) roleMap[r.id_role] = r.nome

        const utilizadoresPorPerfil = usersByRole.map((r) => ({
            perfil: roleMap[r.role_id] || `Role #${r.role_id}`,
            total: parseInt(r.count, 10) || 0,
        }))

        // ─── 6. Estado dos Pedidos ────────────────────────────────
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

        // ─── 7. Tempo Médio de Resolução ──────────────────────────
        const pedidosResolvidos = await Pedido.findAll({
            attributes: ['data_criacao', 'data_fecho'],
            where: {
                data_fecho: { [Op.ne]: null },
                data_criacao: { [Op.ne]: null },
            },
            raw: true,
        })

        let totalHoras = 0
        for (const p of pedidosResolvidos) {
            const inicio = new Date(p.data_criacao).getTime()
            const fim = new Date(p.data_fecho).getTime()
            if (!isNaN(inicio) && !isNaN(fim)) {
                totalHoras += (fim - inicio) / (1000 * 60 * 60)
            }
        }
        const tempoMedioResolucao =
            pedidosResolvidos.length > 0
                ? (totalHoras / pedidosResolvidos.length).toFixed(1) + 'h'
                : null

        // ─── Response ─────────────────────────────────────────────
        res.json({
            stats: {
                totalClientes,
                totalDocumentos,
                totalPedidosPendentes,
                totalContactos,
            },
            conformidade,
            topClientes,
            documentosPorClienteMes,
            utilizadoresPorPerfil,
            pedidos: {
                porEstado: pedidosPorEstado,
                tempoMedioResolucao,
            },
        })
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
        res.status(500).json({ error: 'Erro ao carregar dados do dashboard' })
    }
}
