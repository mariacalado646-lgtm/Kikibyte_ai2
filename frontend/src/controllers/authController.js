import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Utilizador } from '../models/Utilizador.js'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' })
        }

        const user = await Utilizador.findOne({
            where: { email, ativo: true }
        })

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        const valid = await bcrypt.compare(password, user.password_hash)
        if (!valid) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        // update last login
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
        res.status(500).json({ error: 'Server error' })
    }
}

export const register = async (req, res) => {
    try {
        const { nome, email, password, role_id, empresa_id, cliente_id } = req.body

        if (!nome || !email || !password || !role_id) {
            return res.status(400).json({ error: 'Nome, email, password e role_id são obrigatórios' })
        }

        const existing = await Utilizador.findOne({ where: { email } })
        if (existing) {
            return res.status(409).json({ error: 'Email já registado' })
        }

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

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Passwords são obrigatórias' })
        }

        const user = await Utilizador.findByPk(req.user.id)
        if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' })

            const valid = await bcrypt.compare(currentPassword, user.password_hash)
            if (!valid) {
                return res.status(401).json({ error: 'Password atual incorreta' })
            }

            const password_hash = await bcrypt.hash(newPassword, 10)
            await user.update({ password_hash, updated_at: new Date() })

            res.json({ success: true })
    } catch (err) {
        console.error('Change password error:', err)
        res.status(500).json({ error: 'Server error' })
    }
}
