import { MensagemDireta } from '../models/MensagemDireta.js'
import { Utilizador } from '../models/Utilizador.js'

export const enviar = async (req, res) => {
    try {
        const { cliente_id, mensagem } = req.body

        if (!cliente_id || !mensagem?.trim()) {
            return res.status(400).json({ error: 'cliente_id e mensagem são obrigatórios' })
        }

        const nova = await MensagemDireta.create({
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

export const listarPorCliente = async (req, res) => {
    try {
        const { cliente_id } = req.query

        if (!cliente_id) {
            return res.status(400).json({ error: 'cliente_id é obrigatório' })
        }

        const mensagens = await MensagemDireta.findAll({
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
