import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Utilizador } from '../models/Utilizador.js'
import { Sequelize } from 'sequelize'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' })
        }

        // search by email - support both .com and .pt domains for compatibility
        const normalizedEmail = email.trim().toLowerCase();
        const user = await Utilizador.findOne({
            where: { 
                [Sequelize.Op.or]: [
                    { email: normalizedEmail }                ],
                ativo: true 
            }
        })

        if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })

        // 🔐 VERIFY PASSWORD - this was missing!
        const validPassword = await bcrypt.compare(password, user.password_hash)
        if (!validPassword) return res.status(401).json({ error: 'Credenciais inválidas' })

        await user.update({ ultimo_login: new Date() })
        await user.update({ ultimo_login: new Date() })

        const token = jwt.sign(
            {
                id:         user.id_utilizador,
                email:      user.email,
                role_id:    user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                id:         user.id_utilizador,
                nome:       user.nome,
                email:      user.email,
                role_id:    user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id,
                foto:       user.foto_perfil_base64
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
                ativo:      true,
                created_at: new Date(),
                                                 updated_at: new Date()
            })

            res.status(201).json({
                id:      user.id_utilizador,
                nome:    user.nome,
                email:   user.email,
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
                id:         user.id_utilizador,
                nome:       user.nome,
                email:      user.email,
                role_id:    user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id,
                foto:       user.foto_perfil_base64,
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

        // verify the existing token (even if expired, decode it)
        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            // if expired, decode without verification to get user info
            payload = jwt.decode(token)
            if (!payload)
                return res.status(401).json({ error: 'Token inválido' })
        }

        // check user still exists and is active
        const user = await Utilizador.findOne({
            where: { id_utilizador: payload.id, ativo: true }
        })
        if (!user) return res.status(401).json({ error: 'Utilizador não encontrado ou inativo' })

        // issue a fresh token
        const newToken = jwt.sign(
            {
                id:         user.id_utilizador,
                email:      user.email,
                role_id:    user.role_id,
                empresa_id: user.empresa_id,
                cliente_id: user.cliente_id
            },
            process.env.JWT_SECRET,
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
            return res.status(400).json({ error: 'Passwords são obrigatórias' })
        }

        const user = await Utilizador.findByPk(req.user.id)
        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })

            const valid = await bcrypt.compare(currentPassword, user.password_hash)
            if (!valid) return res.status(401).json({ error: 'Password atual incorreta' })

                const password_hash = await bcrypt.hash(newPassword, 10)
                await user.update({ password_hash, updated_at: new Date() })

                res.json({ success: true })
    } catch (err) {
        console.error('Change password error:', err)
        res.status(500).json({ error: 'Server error' })
    }
}
