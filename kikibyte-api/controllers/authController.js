import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
            res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
}

export const register = async (req, res) => {
    const { email, password, role } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashed, role: role || 'user' })
    res.status(201).json({ id: user.id, email: user.email, role: user.role })
}
