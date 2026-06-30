import { Utilizador } from '../models/Utilizador.js'
import { Cliente } from '../models/Cliente.js'
import { Relatorio } from '../models/Relatorio.js'
import { Documento } from '../models/Documento.js'
import { Pedido } from '../models/Pedido.js'
import { Op } from 'sequelize'

export const stats = async (req, res) => {
    try {
        const [totalUtilizadores, totalClientes, totalGestores, totalRelatorios, totalDocumentos, totalPedidos] = await Promise.all([
            Utilizador.count(),
            Cliente.count({ where: { ativo: true } }),
            Utilizador.count({ where: { role_id: 2, ativo: true } }),
            Relatorio.count(),
            Documento.count(),
            Pedido.count(),
        ])

        const ultimosClientes = await Cliente.findAll({
            where: { ativo: true },
            order: [['created_at', 'DESC']],
            limit: 5,
        })

        const ultimosGestores = await Utilizador.findAll({
            where: { role_id: 2, ativo: true },
            attributes: { exclude: ['password_hash'] },
            order: [['created_at', 'DESC']],
            limit: 5,
        })

        const ultimosRelatorios = await Relatorio.findAll({
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }],
            order: [['created_at', 'DESC']],
            limit: 5,
        })

        res.json({
            stats: {
                totalClientes,
                totalGestores,
                totalRelatorios,
                totalUtilizadores,
                totalDocumentos,
                totalPedidos,
            },
            ultimosClientes,
            ultimosGestores,
            ultimosRelatorios,
        })
    } catch (err) {
        console.error('Erro ao obter stats:', err)
        res.status(500).json({ error: 'Erro ao obter estatísticas' })
    }
}

export const importarClientes = async (req, res) => {
    try {
        const { clientes } = req.body
        if (!clientes || !Array.isArray(clientes) || clientes.length === 0) {
            return res.status(400).json({ error: 'Envie um array de clientes' })
        }

        const resultados = { criados: 0, erros: [] }

        for (const item of clientes) {
            try {
                if (!item.nome) {
                    resultados.erros.push({ linha: item, erro: 'Nome é obrigatório' })
                    continue
                }

                if (item.email || item.nif) {
                    const existing = await Cliente.findOne({
                        where: { [Op.or]: [
                            item.email ? { email: item.email } : {},
                            item.nif ? { nif: item.nif } : {},
                        ].filter(Boolean) }
                    })
                    if (existing) {
                        resultados.erros.push({ linha: item, erro: 'Cliente já existe' })
                        continue
                    }
                }

                await Cliente.create({
                    nome: item.nome,
                    nif: item.nif || null,
                    email: item.email || null,
                    telefone: item.telefone || null,
                    setor: item.setor || null,
                    morada: item.morada || null,
                    ativo: true,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                resultados.criados++
            } catch (err) {
                resultados.erros.push({ linha: item, erro: err.message })
            }
        }

        res.json({
            message: `${resultados.criados} clientes importados com sucesso, ${resultados.erros.length} erros`,
            ...resultados
        })
    } catch (err) {
        console.error('Erro ao importar clientes:', err)
        res.status(500).json({ error: 'Erro ao importar clientes' })
    }
}
