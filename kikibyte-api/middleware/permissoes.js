// ── Mapa em memória: cliente_id → { funcionalidade: ativo } ──────
// NÃO precisa de base de dados. Dados perdem-se ao reiniciar o servidor.
const permissoesStore = new Map()

const FUNCIONALIDADES = [
    'dashboard',
    'pedidos',
    'submissoes',
    'documentos',
    'mensagens',
    'relatorios'
]

// Devolve as permissões de um cliente (todas ativas por defeito)
function getPermissoes(clienteId) {
    if (!permissoesStore.has(clienteId)) {
        const defaults = new Map(FUNCIONALIDADES.map(f => [f, true]))
        permissoesStore.set(clienteId, defaults)
    }
    return permissoesStore.get(clienteId)
}

// Usado pelo controller para listar
function listar(clienteId) {
    const mapa = getPermissoes(clienteId)
    return FUNCIONALIDADES.map(f => ({
        funcionalidade: f,
        ativo: mapa.get(f) ?? true,
        cliente_id: parseInt(clienteId)
    }))
}

// Usado pelo controller para atualizar
function atualizar(clienteId, permissoes) {
    const mapa = getPermissoes(clienteId)
    const resultados = []
    for (const p of permissoes) {
        if (!FUNCIONALIDADES.includes(p.funcionalidade)) continue
        const ativo = p.ativo === true
        mapa.set(p.funcionalidade, ativo)
        resultados.push({
            cliente_id: parseInt(clienteId),
            funcionalidade: p.funcionalidade,
            ativo
        })
    }
    return resultados
}

// Usado pelo controller /me
function listarMe(clienteId) {
    const mapa = getPermissoes(clienteId)
    return FUNCIONALIDADES.map(f => ({
        funcionalidade: f,
        ativo: mapa.get(f) ?? true
    }))
}

// Middleware: verifica se o cliente tem a funcionalidade ativa
function requirePermissao(funcionalidade) {
    return (req, res, next) => {
        // Só aplica a clientes (role_id=3)
        if (Number(req.user.role_id) !== 3) return next()

        const clienteId = req.user.cliente_id
        if (!clienteId) return next()

        const mapa = getPermissoes(clienteId)
        const ativo = mapa.get(funcionalidade) ?? true

        if (!ativo) {
            return res.status(403).json({
                error: 'Acesso negado',
                message: `A funcionalidade "${funcionalidade}" está desativada para este cliente`
            })
        }
        next()
    }
}

export {
    permissoesStore,
    listar,
    atualizar,
    listarMe,
    requirePermissao,
    FUNCIONALIDADES
}
