import bcrypt from 'bcryptjs'
import { Utilizador } from '../models/Utilizador.js'
import { Op } from 'sequelize'

// GET /api/utilizadores/:id — obter um utilizador pelo ID
export const obter = async (req, res) => {
    try {
        const user = await Utilizador.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] }
        })
        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })
        res.json(user)
    } catch (err) {
        console.error('Erro ao obter utilizador:', err)
        res.status(500).json({ error: 'Erro ao obter utilizador' })
    }
}

// GET /api/utilizadores?role_id=2&search=...
export const listar = async (req, res) => {
    try {
        const { role_id, search, ativo } = req.query
        const where = {}
        if (role_id !== undefined) where.role_id = role_id
        if (ativo !== undefined) where.ativo = ativo === 'true'
        if (search) {
            where[Op.or] = [
                { nome:  { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ]
        }

        const utilizadores = await Utilizador.findAll({
            where,
            attributes: { exclude: ['password_hash'] },
            order: [['nome', 'ASC']]
        })
        res.json(utilizadores)
    } catch (err) {
        console.error('Erro ao listar utilizadores:', err)
        res.status(500).json({ error: 'Erro ao listar utilizadores' })
    }
}

// POST /api/utilizadores  { nome, email, password, role_id, empresa_id?, cliente_id? }
export const criar = async (req, res) => {
    try {
        const { nome, email, password, role_id, empresa_id, cliente_id } = req.body

        if (!nome || !email || !password || !role_id) {
            return res.status(400).json({ error: 'Nome, email, password e role_id são obrigatórios' })
        }

        const existing = await Utilizador.findOne({ where: { email } })
        if (existing) return res.status(409).json({ error: 'Já existe um utilizador com este email' })

        const password_hash = await bcrypt.hash(password, 10)

        const user = await Utilizador.create({
            nome,
            email,
            password_hash,
            role_id,
            empresa_id: empresa_id || null,
            cliente_id: cliente_id || null,
            ativo: true,
            created_at: new Date(),
            updated_at: new Date()
        })

        const { password_hash: _omit, ...rest } = user.toJSON()
        res.status(201).json(rest)
    } catch (err) {
        console.error('Erro ao criar utilizador:', err)
        res.status(500).json({ error: 'Erro ao criar utilizador' })
    }
}

// PUT /api/utilizadores/:id  { nome?, email?, ativo?, password? (opcional, redefine) }
export const atualizar = async (req, res) => {
    try {
        const user = await Utilizador.findByPk(req.params.id)
        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })

        const { nome, email, ativo, password } = req.body

        if (email && email !== user.email) {
            const existing = await Utilizador.findOne({ where: { email } })
            if (existing) return res.status(409).json({ error: 'Já existe um utilizador com este email' })
        }

        const updates = { updated_at: new Date() }
        if (nome !== undefined)  updates.nome = nome
        if (email !== undefined) updates.email = email
        if (ativo !== undefined) updates.ativo = ativo
        if (password) updates.password_hash = await bcrypt.hash(password, 10)

        await user.update(updates)
        const { password_hash: _omit, ...rest } = user.toJSON()
        res.json(rest)
    } catch (err) {
        console.error('Erro ao atualizar utilizador:', err)
        res.status(500).json({ error: 'Erro ao atualizar utilizador' })
    }
}

// DELETE /api/utilizadores/:id  → revoga o acesso (soft delete, não apaga o registo)
export const remover = async (req, res) => {
    try {
        const user = await Utilizador.findByPk(req.params.id)
        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })

        await user.update({ ativo: false, updated_at: new Date() })
        res.json({ success: true })
    } catch (err) {
        console.error('Erro ao revogar utilizador:', err)
        res.status(500).json({ error: 'Erro ao revogar utilizador' })
    }
}