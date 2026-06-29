import { Log } from '../models/Log.js'

/**
 * Middleware que regista automaticamente ações no sistema.
 * Uso: router.post('/', requireAuth, logAction('CRIAR_PEDIDO'), controller)
 */
export function logAction(acao, recurso) {
    return (req, res, next) => {
        const originalJson = res.json.bind(res)

        res.json = function (body) {
            // Só regista se foi sucesso (2xx)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const recursoId = req.params.id || body?.id || body?.id_pedido || body?.id_cliente || body?.id_documento || null

                Log.create({
                    utilizador_id: req.user.id,
                    email: req.user.email,
                    role_id: req.user.role_id,
                    acao,
                    recurso: recurso || req.baseUrl,
                    recurso_id: recursoId,
                    detalhes: JSON.stringify({
                        method: req.method,
                        path: req.originalUrl,
                        body: sanitizeBody(req.body)
                    }),
                    ip: req.ip || req.socket?.remoteAddress,
                    created_at: new Date()
                }).catch(err => console.error('Erro ao registar log:', err))
            }
            return originalJson(body)
        }
        next()
    }
}

function sanitizeBody(body) {
    if (!body) return {}
    const sanitized = { ...body }
    delete sanitized.password
    delete sanitized.token
    delete sanitized.ficheiro_base64
    return sanitized
}
