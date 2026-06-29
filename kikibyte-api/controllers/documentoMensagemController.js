import { DocumentoMensagem } from '../models/DocumentoMensagem.js'
import { Documento } from '../models/Documento.js'
import { Op } from 'sequelize'

// GET /api/documentos/:documento_id/mensagens
export const listar = async (req, res) => {
    try {
        const { documento_id } = req.params
        const msgs = await DocumentoMensagem.findAll({
            where: { documento_id },
            order: [['created_at', 'ASC']]
        })
        res.json(msgs)
    } catch (err) {
        console.error('Erro ao listar mensagens do documento:', err)
        res.status(500).json({ error: 'Erro ao listar mensagens' })
    }
}

// POST /api/documentos/:documento_id/mensagens
export const criar = async (req, res) => {
    try {
        const { documento_id } = req.params
        const { mensagem } = req.body

        if (!mensagem) {
            return res.status(400).json({ error: 'mensagem é obrigatório' })
        }

        // Verify document exists
        const doc = await Documento.findByPk(documento_id)
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })

        const msg = await DocumentoMensagem.create({
            documento_id,
            remetente_id: req.user?.id || null,
            mensagem,
            created_at: new Date()
        })
        res.status(201).json(msg)
    } catch (err) {
        console.error('Erro ao criar mensagem no documento:', err)
        res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
}
