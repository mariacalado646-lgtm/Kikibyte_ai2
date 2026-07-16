import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Utilizador } from '../models/Utilizador.js'
import { Log } from '../models/Log.js'
import { Sequelize } from 'sequelize'

const JWT_SECRET = process.env.JWT_SECRET || 'kikibyte_jwt_secret_key_2024'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const user = await Utilizador.findOne({
            where: {
                [Sequelize.Op.or]: [{ email: normalizedEmail }],
                ativo: true
            }
        })

        if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })

        const validPassword = await bcrypt.compare(password, user.password_hash)
        if (!validPassword) return res.status(401).json({ error: 'Credenciais inválidas' })

        await user.update({ ultimo_login: new Date() })

        // Registar log de login
        Log.create({
            utilizador_id: user.id_utilizador,
            cliente_id: user.cliente_id || null,
            acao: 'LOGIN',
            entidade: 'auth',
            entidade_id: user.id_utilizador,
            ip_origem: req.ip || req.socket?.remoteAddress,
            user_agent: req.headers?.['user-agent'] || null,
            created_at: new Date()
        }).catch(err => console.error('Erro ao registar log:', err))

        const token = jwt.sign(
            {
                id: user.id_utilizador,
                email: user.email,
                role_id: user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                id: user.id_utilizador,
                nome: user.nome,
                email: user.email,
                role_id: user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id,
                foto: user.foto_perfil_base64
            }
        })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

export const register = async (req, res) => {
    try {
        const { nome, email, password, role_id, empresa_id, cliente_id } = req.body
        if (!nome || !email || !password || !role_id) {
            return res.status(400).json({ error: 'Nome, email, password e role_id são obrigatórios' })
        }

        const existing = await Utilizador.findOne({ where: { email } })
        if (existing) return res.status(409).json({ error: 'Email já registado' })

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

        res.status(201).json({
            id: user.id_utilizador,
            nome: user.nome,
            email: user.email,
            role_id: user.role_id
        })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const me = async (req, res) => {
    try {
        const user = await Utilizador.findOne({
            where: { id_utilizador: req.user.id, ativo: true },
            attributes: { exclude: ['password_hash'] }
        })
        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })

        res.json({
            id: user.id_utilizador,
            nome: user.nome,
            email: user.email,
            role_id: user.role_id,
            empresa_id: user.empresa_id,
            cliente_id: user.cliente_id,
            foto: user.foto_perfil_base64,
            ultimo_login: user.ultimo_login
        })
    } catch (err) {
        console.error('Me error:', err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const refresh = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) return res.status(400).json({ error: 'Token é obrigatório' })

        let payload
        try {
            payload = jwt.verify(token, JWT_SECRET)
        } catch {
            payload = jwt.decode(token)
            if (!payload) return res.status(401).json({ error: 'Token inválido' })
        }

        const user = await Utilizador.findOne({
            where: { id_utilizador: payload.id, ativo: true }
        })
        if (!user) return res.status(401).json({ error: 'Utilizador não encontrado ou inativo' })

        const newToken = jwt.sign(
            {
                id: user.id_utilizador,
                email: user.email,
                role_id: user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({ token: newToken })
    } catch (err) {
        console.error('Refresh error:', err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password e new password são obrigatórios' })
        }

        const utilizador = await Utilizador.findByPk(req.user.id)
        if (!utilizador) return res.status(404).json({ error: 'Utilizador não encontrado' })

        const match = await bcrypt.compare(currentPassword, utilizador.password_hash)
        if (!match) return res.status(401).json({ error: 'Password atual incorreta' })

        const password_hash = await bcrypt.hash(newPassword, 10)
        await utilizador.update({ password_hash, updated_at: new Date() })

        res.json({ message: 'Password alterada com sucesso' })
    } catch (err) {
        console.error('Erro ao alterar password:', err)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
}
