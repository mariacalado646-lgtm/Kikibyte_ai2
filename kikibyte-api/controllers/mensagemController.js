import { Mensagem } from '../models/Mensagem.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const { pedido_id } = req.query
        const where = {}
        if (pedido_id) where.pedido_id = pedido_id

        const msgs = await Mensagem.findAll({
            where,
            order: [['created_at', 'ASC']]
        })
        res.json(msgs)
    } catch (err) {
        console.error('Erro ao listar mensagens:', err)
        res.status(500).json({ error: 'Erro ao listar mensagens' })
    }
}

export const criar = async (req, res) => {
    try {
        const { pedido_id, mensagem, anexo_base64, visivel_cliente } = req.body
        if (!pedido_id || !mensagem) {
            return res.status(400).json({ error: 'pedido_id e mensagem são obrigatórios' })
        }

        const msg = await Mensagem.create({
            pedido_id,
            remetente_id: req.user?.id || null,
            mensagem,
            anexo_base64: anexo_base64 || null,
            visivel_cliente: visivel_cliente !== undefined ? visivel_cliente : true,
            created_at: new Date()
        })
        res.status(201).json(msg)
    } catch (err) {
        console.error('Erro ao criar mensagem:', err)
        res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
}
