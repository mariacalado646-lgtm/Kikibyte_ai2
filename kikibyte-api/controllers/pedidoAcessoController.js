import { PedidoAcesso } from '../models/PedidoAcesso.js'
import { Cliente } from '../models/Cliente.js'
import { Utilizador } from '../models/Utilizador.js'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'

export const listar = async (req, res) => {
    try {
        const { status } = req.query
        const where = {}
        if (status) where.status = status

        const pedidos = await PedidoAcesso.findAll({
            where,
            order: [['created_at', 'DESC']]
        })
        res.json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos de acesso:', err)
        res.status(500).json({ error: 'Erro ao listar pedidos de acesso' })
    }
}

export const criar = async (req, res) => {
    try {
        const { nome_empresa, pessoa_contacto, email, telefone, nif } = req.body
        if (!nome_empresa || !pessoa_contacto || !email || !telefone) {
            return res.status(400).json({ error: 'nome_empresa, pessoa_contacto, email e telefone são obrigatórios' })
        }

        const pedido = await PedidoAcesso.create({
            nome_empresa,
            pessoa_contacto,
            email,
            telefone,
            nif: nif || null,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        })
        res.status(201).json(pedido)
    } catch (err) {
        console.error('Erro ao criar pedido de acesso:', err)
        res.status(500).json({ error: 'Erro ao criar pedido de acesso' })
    }
}

export const aprovar = async (req, res) => {
    try {
        const pedido = await PedidoAcesso.findByPk(req.params.id)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })
        if (pedido.status !== 'pending') return res.status(400).json({ error: 'Pedido já foi processado' })

        // Check for duplicate email/NIF
        const emailExists = await Utilizador.findOne({ where: { email: pedido.email } })
        if (emailExists) {
            return res.status(409).json({ error: 'Já existe um utilizador com este email' })
        }

        // 1. Create the client record
        const cliente = await Cliente.create({
            nome: pedido.nome_empresa,
            email: pedido.email,
            telefone: pedido.telefone,
            nif: pedido.nif || null,
            ativo: true,
            created_at: new Date(),
            updated_at: new Date()
        })

        // 2. Create the user account (role_id=3 for client)
        const tempPassword = Math.random().toString(36).slice(-8) // random 8-char password
        const password_hash = await bcrypt.hash(tempPassword, 10)

        const utilizador = await Utilizador.create({
            cliente_id: cliente.id_cliente,
            role_id: 3,
            nome: pedido.pessoa_contacto,
            email: pedido.email,
            password_hash,
            ativo: true,
            created_at: new Date(),
            updated_at: new Date()
        })

        // 3. Update pedido status
        await pedido.update({
            status: 'approved',
            tratado_por: req.user?.id || null,
            updated_at: new Date()
        })

        res.json({
            success: true,
            cliente,
            utilizador,
            tempPassword, // should be sent via email in production
            message: `Cliente e conta criados com sucesso. Password temporária: ${tempPassword}`
        })
    } catch (err) {
        console.error('Erro ao aprovar pedido:', err)
        res.status(500).json({ error: 'Erro ao aprovar pedido' })
    }
}

export const rejeitar = async (req, res) => {
    try {
        const pedido = await PedidoAcesso.findByPk(req.params.id)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })

        await pedido.update({
            status: 'rejected',
            tratado_por: req.user?.id || null,
            updated_at: new Date()
        })
        res.json({ success: true })
    } catch (err) {
        console.error('Erro ao rejeitar pedido:', err)
        res.status(500).json({ error: 'Erro ao rejeitar pedido' })
    }
}
