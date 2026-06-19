import { Relatorio } from '../models/Relatorio.js'
import { Cliente } from '../models/Cliente.js'

export const listar = async (req, res) => {
    try {
        const relatorios = await Relatorio.findAll({
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }],
            order: [['created_at', 'DESC']]
        })
        res.json(relatorios)
    } catch (err) {
        console.error('Erro ao listar relatórios:', err)
        res.status(500).json({ error: 'Erro ao listar relatórios' })
    }
}

export const obter = async (req, res) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!relatorio) return res.status(404).json({ error: 'Relatório não encontrado' })
        res.json(relatorio)
    } catch (err) {
        console.error('Erro ao obter relatório:', err)
        res.status(500).json({ error: 'Erro ao obter relatório' })
    }
}

export const criar = async (req, res) => {
    try {
        const { cliente_id, titulo, tipo_relatorio, ficheiro_base64, mime_type, versao, publicado_cliente } = req.body
        if (!cliente_id || !titulo || !tipo_relatorio || !ficheiro_base64) {
            return res.status(400).json({ error: 'cliente_id, titulo, tipo_relatorio e ficheiro_base64 são obrigatórios' })
        }

        const relatorio = await Relatorio.create({
            cliente_id,
            criado_por: req.user?.id || null,
            titulo,
            tipo_relatorio,
            ficheiro_base64,
            mime_type: mime_type || null,
            versao: versao || null,
            publicado_cliente: publicado_cliente || false,
            created_at: new Date()
        })
        res.status(201).json(relatorio)
    } catch (err) {
        console.error('Erro ao criar relatório:', err)
        res.status(500).json({ error: 'Erro ao criar relatório' })
    }
}
