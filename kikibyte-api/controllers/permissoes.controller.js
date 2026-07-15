import { listar, atualizar, listarMe, FUNCIONALIDADES } from '../middleware/permissoes.js'

export { FUNCIONALIDADES }

export const listarPorCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params
        const all = listar(cliente_id)
        res.json(all)
    } catch (err) {
        console.error('Erro ao listar permissões:', err)
        res.status(500).json({ error: 'Erro ao listar permissões' })
    }
}

export const atualizarPermissoes = async (req, res) => {
    try {
        const { cliente_id } = req.params
        const { permissoes } = req.body

        if (!Array.isArray(permissoes)) {
            return res.status(400).json({ error: 'permissoes deve ser um array' })
        }

        const resultados = atualizar(cliente_id, permissoes)
        res.json({ message: 'Permissões atualizadas', permissoes: resultados })
    } catch (err) {
        console.error('Erro ao atualizar permissões:', err)
        res.status(500).json({ error: 'Erro ao atualizar permissões' })
    }
}

export const obterPermissoesParaCliente = async (req, res) => {
    try {
        const clienteId = req.user.cliente_id
        if (!clienteId) return res.status(400).json({ error: 'Utilizador não é um cliente' })

        const result = listarMe(clienteId)
        res.json({ permissoes: result })
    } catch (err) {
        console.error('Erro ao obter permissões:', err)
        res.status(500).json({ error: 'Erro ao obter permissões' })
    }
}
