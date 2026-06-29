import { Empresa } from '../models/Empresa.js'

export const listar = async (req, res) => {
    try {
        const empresas = await Empresa.findAll({ where: { ativo: true }, order: [['nome', 'ASC']] })
        res.json(empresas)
    } catch (err) {
        console.error('Erro ao listar empresas:', err)
        res.status(500).json({ error: 'Erro ao listar empresas' })
    }
}

export const obter = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id)
        if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })
        res.json(empresa)
    } catch (err) {
        console.error('Erro ao obter empresa:', err)
        res.status(500).json({ error: 'Erro ao obter empresa' })
    }
}

export const criar = async (req, res) => {
    try {
        const { nome, nif, email, telefone, website, descricao, missao, visao, valores, logo_base64 } = req.body
        if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' })

        const empresa = await Empresa.create({
            nome, nif, email, telefone, website, descricao, missao, visao, valores, logo_base64,
            ativo: true,
            created_at: new Date(),
            updated_at: new Date()
        })
        res.status(201).json(empresa)
    } catch (err) {
        console.error('Erro ao criar empresa:', err)
        res.status(500).json({ error: 'Erro ao criar empresa' })
    }
}

export const atualizar = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id)
        if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })

        await empresa.update({ ...req.body, updated_at: new Date() })
        res.json(empresa)
    } catch (err) {
        console.error('Erro ao atualizar empresa:', err)
        res.status(500).json({ error: 'Erro ao atualizar empresa' })
    }
}

export const getSiteContent = async (req, res) => {
    try {
        // returns the first active company with homepage-relevant fields
        const empresa = await Empresa.findOne({
            where: { ativo: true },
            attributes: ['id_empresa', 'nome', 'descricao', 'missao', 'visao', 'valores', 'logo_base64']
        })
        if (!empresa) return res.json({
            nome: 'KikiByte',
            missao: '',
            visao: '',
            valores: '',
            descricao: ''
        })
        res.json(empresa)
    } catch (err) {
        console.error('Erro ao obter conteúdo do site:', err)
        res.status(500).json({ error: 'Erro ao obter conteúdo do site' })
    }
}
