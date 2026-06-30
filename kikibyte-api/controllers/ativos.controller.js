import { AtivoTecnologico } from '../models/AtivoTecnologico.js'
import { Incidente } from '../models/Incidente.js'
import { PenTest } from '../models/PenTest.js'

// ═════════════════════════════════════════════════════════════════
// ATIVOS TECNOLÓGICOS
// ═════════════════════════════════════════════════════════════════

export const listarAtivos = async (req, res) => {
    try {
        const { cliente_id } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id

        const ativos = await AtivoTecnologico.findAll({
            where,
            order: [['created_at', 'DESC']]
        })
        res.json(ativos)
    } catch (err) {
        console.error('Erro ao listar ativos:', err)
        res.status(500).json({ error: 'Erro ao listar ativos tecnológicos' })
    }
}

export const criarAtivo = async (req, res) => {
    try {
        const { cliente_id, nome, tipo, descricao, quantidade } = req.body
        if (!cliente_id || !nome) {
            return res.status(400).json({ error: 'cliente_id e nome são obrigatórios' })
        }

        const ativo = await AtivoTecnologico.create({
            cliente_id,
            nome,
            tipo: tipo || null,
            descricao: descricao || null,
            quantidade: quantidade || 1,
            created_at: new Date()
        })
        res.status(201).json(ativo)
    } catch (err) {
        console.error('Erro ao criar ativo:', err)
        res.status(500).json({ error: 'Erro ao criar ativo tecnológico' })
    }
}

export const removerAtivo = async (req, res) => {
    try {
        const ativo = await AtivoTecnologico.findByPk(req.params.id)
        if (!ativo) return res.status(404).json({ error: 'Ativo não encontrado' })
        await ativo.destroy()
        res.json({ message: 'Ativo removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover ativo:', err)
        res.status(500).json({ error: 'Erro ao remover ativo' })
    }
}

export const importarAtivosExcel = async (req, res) => {
    try {
        const { cliente_id, ativos } = req.body
        if (!cliente_id || !Array.isArray(ativos) || ativos.length === 0) {
            return res.status(400).json({ error: 'cliente_id e array de ativos são obrigatórios' })
        }

        const criados = []
        const erros = []

        for (let i = 0; i < ativos.length; i++) {
            const row = ativos[i]
            if (!row.nome) {
                erros.push({ linha: i + 1, motivo: 'Nome é obrigatório', dados: row })
                continue
            }
            try {
                const ativo = await AtivoTecnologico.create({
                    cliente_id,
                    nome: row.nome,
                    tipo: row.tipo || null,
                    descricao: row.descricao || null,
                    quantidade: row.quantidade || 1,
                    created_at: new Date()
                })
                criados.push(ativo)
            } catch (err) {
                erros.push({ linha: i + 1, motivo: err.message, dados: row })
            }
        }

        res.status(201).json({ criados: criados.length, erros: erros.length, detalhes_erros: erros })
    } catch (err) {
        console.error('Erro ao importar ativos:', err)
        res.status(500).json({ error: 'Erro ao importar ativos' })
    }
}

// ═════════════════════════════════════════════════════════════════
// INCIDENTES
// ═════════════════════════════════════════════════════════════════

export const listarIncidentes = async (req, res) => {
    try {
        const { cliente_id } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id

        const incidentes = await Incidente.findAll({
            where,
            order: [['created_at', 'DESC']]
        })
        res.json(incidentes)
    } catch (err) {
        console.error('Erro ao listar incidentes:', err)
        res.status(500).json({ error: 'Erro ao listar incidentes' })
    }
}

export const criarIncidente = async (req, res) => {
    try {
        const { cliente_id, titulo, descricao, gravidade, estado, data_ocorrencia } = req.body
        if (!cliente_id || !titulo) {
            return res.status(400).json({ error: 'cliente_id e titulo são obrigatórios' })
        }

        const incidente = await Incidente.create({
            cliente_id,
            titulo,
            descricao: descricao || null,
            gravidade: gravidade || 'media',
            estado: estado || 'aberto',
            data_ocorrencia: data_ocorrencia || new Date(),
            criado_por: req.user?.id || null,
            created_at: new Date()
        })
        res.status(201).json(incidente)
    } catch (err) {
        console.error('Erro ao criar incidente:', err)
        res.status(500).json({ error: 'Erro ao criar incidente' })
    }
}

export const atualizarIncidente = async (req, res) => {
    try {
        const incidente = await Incidente.findByPk(req.params.id)
        if (!incidente) return res.status(404).json({ error: 'Incidente não encontrado' })

        const updates = { ...req.body }
        if (updates.estado === 'resolvido') {
            updates.data_resolucao = new Date()
        }
        await incidente.update(updates)
        res.json(incidente)
    } catch (err) {
        console.error('Erro ao atualizar incidente:', err)
        res.status(500).json({ error: 'Erro ao atualizar incidente' })
    }
}

export const removerIncidente = async (req, res) => {
    try {
        const incidente = await Incidente.findByPk(req.params.id)
        if (!incidente) return res.status(404).json({ error: 'Incidente não encontrado' })
        await incidente.destroy()
        res.json({ message: 'Incidente removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover incidente:', err)
        res.status(500).json({ error: 'Erro ao remover incidente' })
    }
}

// ═════════════════════════════════════════════════════════════════
// PEN TESTS
// ═════════════════════════════════════════════════════════════════

export const listarPenTests = async (req, res) => {
    try {
        const { cliente_id } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id

        const tests = await PenTest.findAll({
            where,
            order: [['created_at', 'DESC']]
        })
        res.json(tests)
    } catch (err) {
        console.error('Erro ao listar pen tests:', err)
        res.status(500).json({ error: 'Erro ao listar pen tests' })
    }
}

export const criarPenTest = async (req, res) => {
    try {
        const { cliente_id, titulo, tipo, descricao, resultado, ficheiro_base64, mime_type, data_realizacao } = req.body
        if (!cliente_id || !titulo) {
            return res.status(400).json({ error: 'cliente_id e titulo são obrigatórios' })
        }

        const test = await PenTest.create({
            cliente_id,
            titulo,
            tipo: tipo || null,
            descricao: descricao || null,
            resultado: resultado || null,
            ficheiro_base64: ficheiro_base64 || null,
            mime_type: mime_type || null,
            data_realizacao: data_realizacao || null,
            criado_por: req.user?.id || null,
            created_at: new Date()
        })
        res.status(201).json(test)
    } catch (err) {
        console.error('Erro ao criar pen test:', err)
        res.status(500).json({ error: 'Erro ao criar pen test' })
    }
}

export const removerPenTest = async (req, res) => {
    try {
        const test = await PenTest.findByPk(req.params.id)
        if (!test) return res.status(404).json({ error: 'Pen test não encontrado' })
        await test.destroy()
        res.json({ message: 'Pen test removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover pen test:', err)
        res.status(500).json({ error: 'Erro ao remover pen test' })
    }
}
