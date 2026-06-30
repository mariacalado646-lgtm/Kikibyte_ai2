import { Cliente } from '../models/Cliente.js'
import { Empresa } from '../models/Empresa.js'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const { search, ativo } = req.query
        const where = {}
        if (ativo !== undefined) where.ativo = ativo === 'true'
        if (search) {
            where[Op.or] = [
                { nome: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { nif: { [Op.iLike]: `%${search}%` } }
            ]
        }
        const clientes = await Cliente.findAll({
            where,
            include: [{ model: Empresa, as: 'empresa', attributes: ['id_empresa', 'nome', 'nif'] }],
            order: [['nome', 'ASC']]
        })
        res.json(clientes)
    } catch (err) {
        console.error('Erro ao listar clientes:', err)
        res.status(500).json({ error: 'Erro ao listar clientes' })
    }
}

export const obter = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, {
            include: [{ model: Empresa, as: 'empresa' }]
        })
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })
        res.json(cliente)
    } catch (err) {
        console.error('Erro ao obter cliente:', err)
        res.status(500).json({ error: 'Erro ao obter cliente' })
    }
}

export const criar = async (req, res) => {
    try {
        const { nome, nif, email, telefone, morada, setor, empresa_id, estado_conformidade } = req.body
        
        if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' })

        const cliente = await Cliente.create({
            nome, nif, email, telefone, morada, setor,
            estado_conformidade: estado_conformidade || null,
            empresa_id: empresa_id || null,
            ativo: true,
            created_at: new Date(),
            updated_at: new Date()
        })
        res.status(201).json(cliente)
    } catch (err) {
        console.error('Erro ao criar cliente:', err)
        res.status(500).json({ error: 'Erro ao criar cliente' })
    }
}

export const atualizar = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })

        await cliente.update({ ...req.body, updated_at: new Date() })
        res.json(cliente)
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        res.status(500).json({ error: 'Erro ao atualizar cliente' })
    }
}

export const remover = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })

        await cliente.update({ ativo: false, updated_at: new Date() })
        res.json({ success: true })
    } catch (err) {
        console.error('Erro ao remover cliente:', err)
        res.status(500).json({ error: 'Erro ao remover cliente' })
    }
}
