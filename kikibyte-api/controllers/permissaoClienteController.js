import { PermissaoCliente } from '../models/PermissaoCliente.js'
import { Cliente } from '../models/Cliente.js'

const FUNCIONALIDADES = [
    'dashboard',
    'pedidos',
    'submissoes',
    'documentos',
    'mensagens',
    'relatorios'
]

export const listarPorCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params
        const permissoes = await PermissaoCliente.findAll({
            where: { cliente_id },
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }]
        })

        // Se não existirem permissões, devolver defaults (tudo ativo)
        if (permissoes.length === 0) {
            const defaults = FUNCIONALIDADES.map(f => ({
                funcionalidade: f,
                ativo: true,
                cliente_id: parseInt(cliente_id)
            }))
            return res.json(defaults)
        }

        // Garantir que todas as funcionalidades estão representadas
        const existing = new Set(permissoes.map(p => p.funcionalidade))
        const all = FUNCIONALIDADES.map(f => {
            if (existing.has(f)) return permissoes.find(p => p.funcionalidade === f)
            return { funcionalidade: f, ativo: true, cliente_id: parseInt(cliente_id) }
        })

        res.json(all)
    } catch (err) {
        console.error('Erro ao listar permissões:', err)
        res.status(500).json({ error: 'Erro ao listar permissões' })
    }
}

export const atualizar = async (req, res) => {
    try {
        const { cliente_id } = req.params
        const { permissoes } = req.body

        if (!Array.isArray(permissoes)) {
            return res.status(400).json({ error: 'permissoes deve ser um array' })
        }

        const resultados = []
        for (const p of permissoes) {
            if (!FUNCIONALIDADES.includes(p.funcionalidade)) continue

            const [permissao, created] = await PermissaoCliente.findOrCreate({
                where: { cliente_id, funcionalidade: p.funcionalidade },
                defaults: {
                    cliente_id: parseInt(cliente_id),
                    funcionalidade: p.funcionalidade,
                    ativo: p.ativo !== false,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            })

            if (!created) {
                await permissao.update({ ativo: p.ativo !== false, updated_at: new Date() })
            }
            resultados.push(permissao)
        }

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

        const permissoes = await PermissaoCliente.findAll({ where: { cliente_id: clienteId } })
        const active = new Set(permissoes.filter(p => p.ativo).map(p => p.funcionalidade))

        // Se não houver permissões configuradas, todas ativas
        if (permissoes.length === 0) {
            return res.json({ permissoes: FUNCIONALIDADES.map(f => ({ funcionalidade: f, ativo: true })) })
        }

        const result = FUNCIONALIDADES.map(f => ({
            funcionalidade: f,
            ativo: active.has(f)
        }))

        res.json({ permissoes: result })
    } catch (err) {
        console.error('Erro ao obter permissões:', err)
        res.status(500).json({ error: 'Erro ao obter permissões' })
    }
}
