import { Pedido } from '../models/Pedido.js'
import { Cliente } from '../models/Cliente.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const { estado, cliente_id } = req.query
        const where = {}
        if (estado) where.estado = estado
        if (cliente_id) where.cliente_id = cliente_id

        const pedidos = await Pedido.findAll({
            where,
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome', 'email'] }],
            order: [['data_criacao', 'DESC']]
        })
        res.json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos:', err)
        res.status(500).json({ error: 'Erro ao listar pedidos' })
    }
}

export const obter = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })
        res.json(pedido)
    } catch (err) {
        console.error('Erro ao obter pedido:', err)
        res.status(500).json({ error: 'Erro ao obter pedido' })
    }
}

export const criar = async (req, res) => {
    try {
        const { cliente_id, titulo, descricao, prioridade, tipo, servico_id } = req.body
        if (!cliente_id || !titulo) {
            return res.status(400).json({ error: 'cliente_id e titulo são obrigatórios' })
        }

        const pedido = await Pedido.create({
            cliente_id,
            servico_id: servico_id || null,
            criado_por: req.user?.id || null,
            titulo,
            descricao: descricao || '',
            estado: 'pendente',
            prioridade: prioridade || 'normal',
            tipo: tipo || 'pedido',
            data_criacao: new Date()
        })
        res.status(201).json(pedido)
    } catch (err) {
        console.error('Erro ao criar pedido:', err)
        res.status(500).json({ error: 'Erro ao criar pedido' })
    }
}

export const atualizar = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })

        const updates = { ...req.body }
        if (updates.estado === 'fecho' || updates.estado === 'cancelado') {
            updates.data_fecho = new Date()
        }
        await pedido.update(updates)
        res.json(pedido)
    } catch (err) {
        console.error('Erro ao atualizar pedido:', err)
        res.status(500).json({ error: 'Erro ao atualizar pedido' })
    }
}
