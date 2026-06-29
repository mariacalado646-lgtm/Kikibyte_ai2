import { Documento } from '../models/Documento.js'
import { Cliente } from '../models/Cliente.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const { cliente_id, search } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id
        if (search) where.titulo = { [Op.iLike]: `%${search}%` }

        // Clients (role_id=3) can only see documents marked as visible to them
        if (req.user?.role_id === 3) {
            where.visivel_cliente = true
        }

        const docs = await Documento.findAll({
            where,
            attributes: { exclude: ['ficheiro_base64'] }, // payload mais leve na listagem
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }],
            order: [['created_at', 'DESC']]
        })
        res.json(docs)
    } catch (err) {
        console.error('Erro ao listar documentos:', err)
        res.status(500).json({ error: 'Erro ao listar documentos' })
    }
}

export const obter = async (req, res) => {
    try {
        const doc = await Documento.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })
        res.json(doc)
    } catch (err) {
        console.error('Erro ao obter documento:', err)
        res.status(500).json({ error: 'Erro ao obter documento' })
    }
}

export const criar = async (req, res) => {
    try {
        const { cliente_id, titulo, tipo_documento, ficheiro_base64, mime_type, tamanho_bytes, sensivel, visivel_cliente } = req.body
        if (!cliente_id || !titulo || !tipo_documento || !ficheiro_base64) {
            return res.status(400).json({ error: 'cliente_id, titulo, tipo_documento e ficheiro_base64 são obrigatórios' })
        }

        const doc = await Documento.create({
            cliente_id,
            titulo,
            tipo_documento,
            ficheiro_base64,
            mime_type: mime_type || null,
            tamanho_bytes: tamanho_bytes || null,
            uploaded_by: req.user?.id || null,
            sensivel: sensivel !== undefined ? sensivel : true,
            visivel_cliente: visivel_cliente || false,
            created_at: new Date()
        })
        res.status(201).json(doc)
    } catch (err) {
        console.error('Erro ao criar documento:', err)
        res.status(500).json({ error: 'Erro ao criar documento' })
    }
}

export const atualizar = async (req, res) => {
    try {
        const doc = await Documento.findByPk(req.params.id)
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })

        const { titulo, tipo_documento, ficheiro_base64, mime_type, tamanho_bytes, sensivel, visivel_cliente, cliente_id } = req.body
        const updates = {}
        if (titulo !== undefined) updates.titulo = titulo
        if (tipo_documento !== undefined) updates.tipo_documento = tipo_documento
        if (cliente_id !== undefined) updates.cliente_id = cliente_id
        if (sensivel !== undefined) updates.sensivel = sensivel
        if (visivel_cliente !== undefined) updates.visivel_cliente = visivel_cliente
        // só substitui o ficheiro se for enviado um novo (re-upload)
        if (ficheiro_base64) {
            updates.ficheiro_base64 = ficheiro_base64
            updates.mime_type = mime_type || doc.mime_type
            updates.tamanho_bytes = tamanho_bytes || doc.tamanho_bytes
        }

        await doc.update(updates)
        const { ficheiro_base64: _omit, ...rest } = doc.toJSON()
        res.json(rest)
    } catch (err) {
        console.error('Erro ao atualizar documento:', err)
        res.status(500).json({ error: 'Erro ao atualizar documento' })
    }
}

export const remover = async (req, res) => {
    try {
        const doc = await Documento.findByPk(req.params.id)
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })
        await doc.destroy()
        res.json({ success: true })
    } catch (err) {
        console.error('Erro ao remover documento:', err)
        res.status(500).json({ error: 'Erro ao remover documento' })
    }
}