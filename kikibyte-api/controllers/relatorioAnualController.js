import { RelatorioAnual } from '../models/RelatorioAnual.js'
import { Cliente } from '../models/Cliente.js'

export const listar = async (req, res) => {
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

export const obter = async (req, res) => {
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

export const criar = async (req, res) => {
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

export const atualizar = async (req, res) => {
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

export const remover = async (req, res) => {
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
