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
