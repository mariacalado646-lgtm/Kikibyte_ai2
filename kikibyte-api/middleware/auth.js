import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        res.status(401).json({ error: 'Invalid token' })
    }
}

export function requireRole(role_id) {
    return (req, res, next) => {
        if (req.user.role_id !== role_id)
            return res.status(403).json({ error: 'Forbidden' })
            next()
    }
}
