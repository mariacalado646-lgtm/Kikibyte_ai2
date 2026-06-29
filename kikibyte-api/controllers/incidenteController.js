import { Incidente } from '../models/Incidente.js'

export const listar = async (req, res) => {
    try {
        const { cliente_id } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id

        const incidentes = await Incidente.findAll({
            where,
            order: [['created_at', 'DESC']]
        })
        res.json(incidentes)
    } catch (err) {
        console.error('Erro ao listar incidentes:', err)
        res.status(500).json({ error: 'Erro ao listar incidentes' })
    }
}

export const criar = async (req, res) => {
    try {
        const { cliente_id, titulo, descricao, gravidade, estado, data_ocorrencia } = req.body
        if (!cliente_id || !titulo) {
            return res.status(400).json({ error: 'cliente_id e titulo são obrigatórios' })
        }

        const incidente = await Incidente.create({
            cliente_id,
            titulo,
            descricao: descricao || null,
            gravidade: gravidade || 'media',
            estado: estado || 'aberto',
            data_ocorrencia: data_ocorrencia || new Date(),
            criado_por: req.user?.id || null,
            created_at: new Date()
        })
        res.status(201).json(incidente)
    } catch (err) {
        console.error('Erro ao criar incidente:', err)
        res.status(500).json({ error: 'Erro ao criar incidente' })
    }
}

export const atualizar = async (req, res) => {
    try {
        const incidente = await Incidente.findByPk(req.params.id)
        if (!incidente) return res.status(404).json({ error: 'Incidente não encontrado' })

        const updates = { ...req.body }
        if (updates.estado === 'resolvido') {
            updates.data_resolucao = new Date()
        }
        await incidente.update(updates)
        res.json(incidente)
    } catch (err) {
        console.error('Erro ao atualizar incidente:', err)
        res.status(500).json({ error: 'Erro ao atualizar incidente' })
    }
}

export const remover = async (req, res) => {
    try {
        const incidente = await Incidente.findByPk(req.params.id)
        if (!incidente) return res.status(404).json({ error: 'Incidente não encontrado' })
        await incidente.destroy()
        res.json({ message: 'Incidente removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover incidente:', err)
        res.status(500).json({ error: 'Erro ao remover incidente' })
    }
}
