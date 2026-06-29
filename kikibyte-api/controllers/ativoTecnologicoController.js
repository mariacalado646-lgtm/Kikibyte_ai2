import { AtivoTecnologico } from '../models/AtivoTecnologico.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const { cliente_id } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id

        const ativos = await AtivoTecnologico.findAll({
            where,
            order: [['created_at', 'DESC']]
        })
        res.json(ativos)
    } catch (err) {
        console.error('Erro ao listar ativos:', err)
        res.status(500).json({ error: 'Erro ao listar ativos tecnológicos' })
    }
}

export const criar = async (req, res) => {
    try {
        const { cliente_id, nome, tipo, descricao, quantidade } = req.body
        if (!cliente_id || !nome) {
            return res.status(400).json({ error: 'cliente_id e nome são obrigatórios' })
        }

        const ativo = await AtivoTecnologico.create({
            cliente_id,
            nome,
            tipo: tipo || null,
            descricao: descricao || null,
            quantidade: quantidade || 1,
            created_at: new Date()
        })
        res.status(201).json(ativo)
    } catch (err) {
        console.error('Erro ao criar ativo:', err)
        res.status(500).json({ error: 'Erro ao criar ativo tecnológico' })
    }
}

export const remover = async (req, res) => {
    try {
        const ativo = await AtivoTecnologico.findByPk(req.params.id)
        if (!ativo) return res.status(404).json({ error: 'Ativo não encontrado' })
        await ativo.destroy()
        res.json({ message: 'Ativo removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover ativo:', err)
        res.status(500).json({ error: 'Erro ao remover ativo' })
    }
}

export const importarExcel = async (req, res) => {
    try {
        const { cliente_id, ativos } = req.body
        if (!cliente_id || !Array.isArray(ativos) || ativos.length === 0) {
            return res.status(400).json({ error: 'cliente_id e array de ativos são obrigatórios' })
        }

        const criados = []
        const erros = []

        for (let i = 0; i < ativos.length; i++) {
            const row = ativos[i]
            if (!row.nome) {
                erros.push({ linha: i + 1, motivo: 'Nome é obrigatório', dados: row })
                continue
            }
            try {
                const ativo = await AtivoTecnologico.create({
                    cliente_id,
                    nome: row.nome,
                    tipo: row.tipo || null,
                    descricao: row.descricao || null,
                    quantidade: row.quantidade || 1,
                    created_at: new Date()
                })
                criados.push(ativo)
            } catch (err) {
                erros.push({ linha: i + 1, motivo: err.message, dados: row })
            }
        }

        res.status(201).json({ criados: criados.length, erros: erros.length, detalhes_erros: erros })
    } catch (err) {
        console.error('Erro ao importar ativos:', err)
        res.status(500).json({ error: 'Erro ao importar ativos' })
    }
}
