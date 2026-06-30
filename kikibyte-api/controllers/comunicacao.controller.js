import { Mensagem } from '../models/Mensagem.js'
import { Utilizador } from '../models/Utilizador.js'
import { Cliente } from '../models/Cliente.js'

// ═════════════════════════════════════════════════════════════════
// MENSAGENS (associadas a pedidos)
// ═════════════════════════════════════════════════════════════════

export const listarMensagens = async (req, res) => {
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

export const criarMensagem = async (req, res) => {
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

// ═════════════════════════════════════════════════════════════════
// MENSAGENS DIRETAS
// ═════════════════════════════════════════════════════════════════

export const enviarMensagemDireta = async (req, res) => {
    try {
        const { cliente_id, mensagem } = req.body

        if (!cliente_id || !mensagem?.trim()) {
            return res.status(400).json({ error: 'cliente_id e mensagem são obrigatórios' })
        }

        const nova = await Mensagem.create({
            cliente_id,
            remetente_id: req.user.id,
            mensagem: mensagem.trim()
        })

        return res.status(201).json(nova)
    } catch (error) {
        console.error('Erro ao enviar mensagem direta:', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

export const listarMensagensDiretas = async (req, res) => {
    try {
        const { cliente_id } = req.query

        if (!cliente_id) {
            return res.status(400).json({ error: 'cliente_id é obrigatório' })
        }

        const mensagens = await Mensagem.findAll({
            where: { cliente_id },
            include: [{
                model: Utilizador,
                as: 'remetente',
                attributes: ['id_utilizador', 'nome']
            }],
            order: [['created_at', 'ASC']]
        })

        return res.json(mensagens)
    } catch (error) {
        console.error('Erro ao listar mensagens diretas:', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}
