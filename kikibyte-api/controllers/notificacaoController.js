import { Notificacao } from '../models/Notificacao.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const notifs = await Notificacao.findAll({
            where: { utilizador_id: req.user.id },
            order: [['created_at', 'DESC']]
        })
        res.json(notifs)
    } catch (err) {
        console.error('Erro ao listar notificações:', err)
        res.status(500).json({ error: 'Erro ao listar notificações' })
    }
}

export const marcarLida = async (req, res) => {
    try {
        const notif = await Notificacao.findOne({
            where: { id_notificacao: req.params.id, utilizador_id: req.user.id }
        })
        if (!notif) return res.status(404).json({ error: 'Notificação não encontrada' })
        await notif.update({ lida: true })
        res.json(notif)
    } catch (err) {
        console.error('Erro ao marcar notificação:', err)
        res.status(500).json({ error: 'Erro ao marcar notificação' })
    }
}

export const criar = async (req, res) => {
    try {
        const { utilizador_id, titulo, mensagem } = req.body
        if (!utilizador_id || !titulo || !mensagem) {
            return res.status(400).json({ error: 'utilizador_id, titulo e mensagem são obrigatórios' })
        }
        const notif = await Notificacao.create({
            utilizador_id,
            titulo,
            mensagem,
            lida: false,
            created_at: new Date()
        })
        res.status(201).json(notif)
    } catch (err) {
        console.error('Erro ao criar notificação:', err)
        res.status(500).json({ error: 'Erro ao criar notificação' })
    }
}
