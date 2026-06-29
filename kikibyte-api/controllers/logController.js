import { Log } from '../models/Log.js'
import { Utilizador } from '../models/Utilizador.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
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
            include: [{ model: Utilizador, as: 'utilizador', attributes: ['id_utilizador', 'nome', 'email'] }],
            order: [['created_at', 'DESC']],
            limit: limit ? parseInt(limit) : 100,
            offset: offset ? parseInt(offset) : 0
        })

        res.json({
            total: logs.count,
            data: logs.rows
        })
    } catch (err) {
        console.error('Erro ao listar logs:', err)
        res.status(500).json({ error: 'Erro ao listar logs' })
    }
}

export const obter = async (req, res) => {
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

export const limpar = async (req, res) => {
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
