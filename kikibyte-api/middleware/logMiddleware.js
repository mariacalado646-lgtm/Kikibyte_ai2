import { Log } from '../models/Log.js'

/**
 * Middleware que regista automaticamente ações no sistema.
 * Uso: router.post('/', requireAuth, logAction('CRIAR_PEDIDO'), controller)
 */
export function logAction(acao, entidade) {
    return (req, res, next) => {
        const originalJson = res.json.bind(res)

        res.json = function (body) {
            // Só regista se foi sucesso (2xx)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const entidadeId = req.params.id || body?.id || body?.id_pedido || body?.id_cliente || body?.id_documento || null

                Log.create({
                    utilizador_id: req.user.id,
                    cliente_id: req.user.cliente_id || null,
                    acao,
                    entidade: entidade || req.baseUrl.replace('/api/', ''),
                    entidade_id: entidadeId,
                    ip_origem: req.ip || req.socket?.remoteAddress,
                    user_agent: req.headers?.['user-agent'] || null,
                    depois: Object.keys(req.body).length ? JSON.stringify(sanitizeBody(req.body)) : null,
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
