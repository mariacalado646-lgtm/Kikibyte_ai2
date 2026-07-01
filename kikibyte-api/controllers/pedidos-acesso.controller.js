import { Cliente } from '../models/Cliente.js'
import { Utilizador } from '../models/Utilizador.js'
import bcrypt from 'bcryptjs'
import { QueryTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const listar = async (req, res) => {
    try {
        const { status } = req.query

        let clientes
        if (status === 'approved') {
            clientes = await sequelize.query(`
                SELECT c.* FROM cliente c
                INNER JOIN utilizador u ON u.cliente_id = c.id_cliente
                WHERE c.ativo = true AND c.setor IS NOT NULL
                ORDER BY c.updated_at DESC
            `, { type: QueryTypes.SELECT })
        } else {
            // Pendentes: ativo=false, utilizador existe mas também inativo
            clientes = await sequelize.query(`
                SELECT c.* FROM cliente c
                INNER JOIN utilizador u ON u.cliente_id = c.id_cliente
                WHERE c.ativo = false AND u.ativo = false AND c.setor IS NOT NULL
                ORDER BY c.created_at DESC
            `, { type: QueryTypes.SELECT })
        }

        // Mapear para formato compatível com o frontend (GestorPedidos usa id_pedido, nome_empresa, etc.)
        const pedidos = clientes.map(c => ({
            id_pedido: c.id_cliente,
            nome_empresa: c.nome,
            pessoa_contacto: c.setor || c.nome,
            email: c.email,
            telefone: c.telefone,
            nif: c.nif,
            status: c.ativo ? 'approved' : 'pending',
            created_at: c.created_at,
            updated_at: c.updated_at
        }))

        res.json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos de acesso:', err)
        res.status(500).json({ error: 'Erro ao listar pedidos de acesso' })
    }
}

export const criar = async (req, res) => {
    try {
        const { nome_empresa, pessoa_contacto, email, telefone, nif, password } = req.body
        if (!nome_empresa || !pessoa_contacto || !email || !telefone || !password) {
            return res.status(400).json({ error: 'nome_empresa, pessoa_contacto, email, telefone e password são obrigatórios' })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password deve ter pelo menos 6 caracteres' })
        }

        // Verificar se email já está em uso
        const emailExists = await Utilizador.findOne({ where: { email } })
        if (emailExists) {
            return res.status(409).json({ error: 'Já existe um utilizador com este email' })
        }

        // Criar cliente como pendente
        const cliente = await Cliente.create({
            nome: nome_empresa,
            email,
            telefone,
            nif: nif || null,
            ativo: false,
            setor: pessoa_contacto,
            created_at: new Date(),
            updated_at: new Date()
        })

        // Criar utilizador com a password escolhida, mas inativo (só ativa após aprovação)
        const password_hash = await bcrypt.hash(password, 10)
        await Utilizador.create({
            cliente_id: cliente.id_cliente,
            role_id: 3,
            nome: pessoa_contacto,
            email,
            password_hash,
            ativo: false,
            created_at: new Date(),
            updated_at: new Date()
        })

        res.status(201).json({
            id_pedido: cliente.id_cliente,
            nome_empresa: cliente.nome,
            pessoa_contacto,
            email: cliente.email,
            telefone: cliente.telefone,
            nif: cliente.nif,
            status: 'pending',
            created_at: cliente.created_at,
            updated_at: cliente.updated_at
        })
    } catch (err) {
        console.error('Erro ao criar pedido de acesso:', err)
        res.status(500).json({ error: 'Erro ao criar pedido de acesso' })
    }
}

export const aprovar = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })
        if (cliente.ativo) return res.status(400).json({ error: 'Cliente já está ativo' })

        // Ativar cliente
        await cliente.update({ ativo: true, updated_at: new Date() })

        // Ativar utilizador (já foi criado com a password escolhida pelo cliente)
        const utilizador = await Utilizador.findOne({ where: { cliente_id: cliente.id_cliente } })
        if (utilizador) {
            await utilizador.update({ ativo: true, updated_at: new Date() })
        }

        res.json({
            success: true,
            message: 'Pedido aprovado com sucesso! O cliente pode agora fazer login com a password que definiu.'
        })
    } catch (err) {
        console.error('Erro ao aprovar pedido:', err)
        res.status(500).json({ error: 'Erro ao aprovar pedido' })
    }
}

export const rejeitar = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })
        if (cliente.ativo) return res.status(400).json({ error: 'Não é possível rejeitar um cliente ativo' })

        // Remover o cliente (nunca foi ativo, não tem utilizador associado)
        await cliente.destroy()
        res.json({ success: true, message: 'Pedido rejeitado e removido' })
    } catch (err) {
        console.error('Erro ao rejeitar pedido:', err)
        res.status(500).json({ error: 'Erro ao rejeitar pedido' })
    }
}
