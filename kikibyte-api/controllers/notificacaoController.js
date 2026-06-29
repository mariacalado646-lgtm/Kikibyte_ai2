import { Notificacao } from '../models/Notificacao.js'
import { Utilizador } from '../models/Utilizador.js'
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
        let { utilizador_id, cliente_id, titulo, mensagem, tipo } = req.body

        // If cliente_id is provided instead of utilizador_id, resolve the user
        if (!utilizador_id && cliente_id) {
            const user = await Utilizador.findOne({
                where: { cliente_id, role_id: 3, ativo: true }
            })
            if (!user) {
                return res.status(404).json({ error: 'Cliente não tem conta de utilizador associada' })
            }
            utilizador_id = user.id_utilizador
        }

        if (!utilizador_id || !titulo || !mensagem) {
            return res.status(400).json({ error: 'utilizador_id (ou cliente_id), titulo e mensagem são obrigatórios' })
        }

        const notif = await Notificacao.create({
            utilizador_id,
            titulo,
            mensagem,
            tipo: tipo || 'info',
            lida: false,
            created_at: new Date()
        })
        res.status(201).json(notif)
    } catch (err) {
        console.error('Erro ao criar notificação:', err)
        res.status(500).json({ error: 'Erro ao criar notificação' })
    }
}
