import { Cliente } from '../models/Cliente.js'
import { Empresa } from '../models/Empresa.js'
import { Documento } from '../models/Documento.js'
import { DocumentoMensagem } from '../models/DocumentoMensagem.js'
import { Pedido } from '../models/Pedido.js'
import { Notificacao } from '../models/Notificacao.js'
import { Utilizador } from '../models/Utilizador.js'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'

// ═════════════════════════════════════════════════════════════════
// CLIENTES
// ═════════════════════════════════════════════════════════════════

export const listarClientes = async (req, res) => {
    try {
        const { search, ativo } = req.query
        const where = {}
        if (ativo !== undefined) where.ativo = ativo === 'true'
        if (search) {
            where[Op.or] = [
                { nome: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { nif: { [Op.iLike]: `%${search}%` } }
            ]
        }
        const clientes = await Cliente.findAll({
            where,
            include: [{ model: Empresa, as: 'empresa', attributes: ['id_empresa', 'nome', 'nif'] }],
            order: [['nome', 'ASC']]
        })
        res.json(clientes)
    } catch (err) {
        console.error('Erro ao listar clientes:', err)
        res.status(500).json({ error: 'Erro ao listar clientes' })
    }
}

export const obterCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, {
            include: [{ model: Empresa, as: 'empresa' }]
        })
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })
        res.json(cliente)
    } catch (err) {
        console.error('Erro ao obter cliente:', err)
        res.status(500).json({ error: 'Erro ao obter cliente' })
    }
}

export const criarCliente = async (req, res) => {
    try {
        const { nome, nif, email, telefone, morada, setor, empresa_id, estado_conformidade, password } = req.body
        
        if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' })

        // 1. Criar o cliente
        const clienteData = {
            nome, nif, email, telefone, morada, setor,
            empresa_id: empresa_id || null,
            ativo: true,
            created_at: new Date(),
            updated_at: new Date()
        }
        // Só incluir estado_conformidade se foi enviado, para evitar null em coluna NOT NULL
        if (estado_conformidade !== undefined && estado_conformidade !== null) {
            clienteData.estado_conformidade = estado_conformidade
        }
        const cliente = await Cliente.create(clienteData)

        // 2. Se password for fornecida, criar também um Utilizador para login (role_id=3 -> cliente)
        if (password && email) {
            const existingUser = await Utilizador.findOne({ where: { email } })
            if (!existingUser) {
                const password_hash = await bcrypt.hash(password, 10)
                await Utilizador.create({
                    nome,
                    email,
                    password_hash,
                    role_id: 3,
                    cliente_id: cliente.id_cliente,
                    empresa_id: null,
                    ativo: true,
                    created_at: new Date(),
                    updated_at: new Date()
                })
            }
        }

        res.status(201).json(cliente)
    } catch (err) {
        console.error('Erro ao criar cliente:', err)
        // Devolver detalhe do erro para facilitar diagnóstico
        const mensagem = err?.original?.detail || err?.errors?.[0]?.message || err.message || 'Erro ao criar cliente'
        res.status(500).json({ error: mensagem })
    }
}

export const atualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })

        await cliente.update({ ...req.body, updated_at: new Date() })
        res.json(cliente)
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        res.status(500).json({ error: 'Erro ao atualizar cliente' })
    }
}

export const removerCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' })

        // Apagar o utilizador associado (se existir)
        await Utilizador.destroy({ where: { cliente_id: cliente.id_cliente } })

        // Hard delete — remove o cliente diretamente da base de dados
        await cliente.destroy()

        res.json({ success: true, message: 'Cliente eliminado permanentemente' })
    } catch (err) {
        console.error('Erro ao remover cliente:', err)
        res.status(500).json({ error: 'Erro ao remover cliente: ' + (err?.original?.detail || err.message) })
    }
}

// ═════════════════════════════════════════════════════════════════
// DOCUMENTOS
// ═════════════════════════════════════════════════════════════════

export const listarDocumentos = async (req, res) => {
    try {
        const { cliente_id, search } = req.query
        const where = {}
        if (cliente_id) where.cliente_id = cliente_id
        if (search) where.titulo = { [Op.iLike]: `%${search}%` }

        if (req.user?.role_id === 3) {
            where.visivel_cliente = true
        }

        const docs = await Documento.findAll({
            where,
            attributes: { exclude: ['ficheiro_base64'] },
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] }],
            order: [['created_at', 'DESC']]
        })
        res.json(docs)
    } catch (err) {
        console.error('Erro ao listar documentos:', err)
        res.status(500).json({ error: 'Erro ao listar documentos' })
    }
}

export const obterDocumento = async (req, res) => {
    try {
        const doc = await Documento.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })
        res.json(doc)
    } catch (err) {
        console.error('Erro ao obter documento:', err)
        res.status(500).json({ error: 'Erro ao obter documento' })
    }
}

export const criarDocumento = async (req, res) => {
    try {
        const { cliente_id, titulo, tipo_documento, ficheiro_base64, mime_type, tamanho_bytes, sensivel, visivel_cliente } = req.body
        if (!cliente_id || !titulo || !tipo_documento || !ficheiro_base64) {
            return res.status(400).json({ error: 'cliente_id, titulo, tipo_documento e ficheiro_base64 são obrigatórios' })
        }

        const doc = await Documento.create({
            cliente_id,
            titulo,
            tipo_documento,
            ficheiro_base64,
            mime_type: mime_type || null,
            tamanho_bytes: tamanho_bytes || null,
            uploaded_by: req.user?.id || null,
            sensivel: sensivel !== undefined ? sensivel : true,
            visivel_cliente: visivel_cliente || false,
            created_at: new Date()
        })
        res.status(201).json(doc)
    } catch (err) {
        console.error('Erro ao criar documento:', err)
        res.status(500).json({ error: 'Erro ao criar documento' })
    }
}

export const atualizarDocumento = async (req, res) => {
    try {
        const doc = await Documento.findByPk(req.params.id)
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })

        const { titulo, tipo_documento, ficheiro_base64, mime_type, tamanho_bytes, sensivel, visivel_cliente, cliente_id } = req.body
        const updates = {}
        if (titulo !== undefined) updates.titulo = titulo
        if (tipo_documento !== undefined) updates.tipo_documento = tipo_documento
        if (cliente_id !== undefined) updates.cliente_id = cliente_id
        if (sensivel !== undefined) updates.sensivel = sensivel
        if (visivel_cliente !== undefined) updates.visivel_cliente = visivel_cliente
        if (ficheiro_base64) {
            updates.ficheiro_base64 = ficheiro_base64
            updates.mime_type = mime_type || doc.mime_type
            updates.tamanho_bytes = tamanho_bytes || doc.tamanho_bytes
        }

        await doc.update(updates)
        const { ficheiro_base64: _omit, ...rest } = doc.toJSON()
        res.json(rest)
    } catch (err) {
        console.error('Erro ao atualizar documento:', err)
        res.status(500).json({ error: 'Erro ao atualizar documento' })
    }
}

export const removerDocumento = async (req, res) => {
    try {
        const doc = await Documento.findByPk(req.params.id)
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })
        await doc.destroy()
        res.json({ message: 'Documento removido com sucesso' })
    } catch (err) {
        console.error('Erro ao remover documento:', err)
        res.status(500).json({ error: 'Erro ao remover documento' })
    }
}

// ═════════════════════════════════════════════════════════════════
// DOCUMENTO MENSAGENS
// ═════════════════════════════════════════════════════════════════

export const listarMensagensDocumento = async (req, res) => {
    try {
        const { documento_id } = req.params
        const msgs = await DocumentoMensagem.findAll({
            where: { documento_id },
            order: [['created_at', 'ASC']]
        })
        res.json(msgs)
    } catch (err) {
        console.error('Erro ao listar mensagens do documento:', err)
        res.status(500).json({ error: 'Erro ao listar mensagens' })
    }
}

export const criarMensagemDocumento = async (req, res) => {
    try {
        const { documento_id } = req.params
        const { mensagem } = req.body

        if (!mensagem) {
            return res.status(400).json({ error: 'mensagem é obrigatório' })
        }

        const doc = await Documento.findByPk(documento_id)
        if (!doc) return res.status(404).json({ error: 'Documento não encontrado' })

        const msg = await DocumentoMensagem.create({
            documento_id,
            remetente_id: req.user?.id || null,
            mensagem,
            created_at: new Date()
        })
        res.status(201).json(msg)
    } catch (err) {
        console.error('Erro ao criar mensagem no documento:', err)
        res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
}

// ═════════════════════════════════════════════════════════════════
// PEDIDOS
// ═════════════════════════════════════════════════════════════════

export const listarPedidos = async (req, res) => {
    try {
        const { estado, cliente_id } = req.query
        const where = {}
        if (estado) where.estado = estado
        if (cliente_id) where.cliente_id = cliente_id

        const pedidos = await Pedido.findAll({
            where,
            include: [{ model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome', 'email'] }],
            order: [['data_criacao', 'DESC']]
        })
        res.json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos:', err)
        res.status(500).json({ error: 'Erro ao listar pedidos' })
    }
}

export const obterPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{ model: Cliente, as: 'cliente' }]
        })
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })
        res.json(pedido)
    } catch (err) {
        console.error('Erro ao obter pedido:', err)
        res.status(500).json({ error: 'Erro ao obter pedido' })
    }
}

export const criarPedido = async (req, res) => {
    try {
        const { cliente_id, titulo, descricao, prioridade, tipo, servico_id } = req.body
        if (!cliente_id || !titulo) {
            return res.status(400).json({ error: 'cliente_id e titulo são obrigatórios' })
        }

        const pedido = await Pedido.create({
            cliente_id,
            servico_id: servico_id || null,
            criado_por: req.user?.id || null,
            titulo,
            descricao: descricao || '',
            estado: 'pendente',
            prioridade: prioridade || 'normal',
            tipo: tipo || 'pedido',
            data_criacao: new Date()
        })
        res.status(201).json(pedido)
    } catch (err) {
        console.error('Erro ao criar pedido:', err)
        res.status(500).json({ error: 'Erro ao criar pedido' })
    }
}

export const atualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id)
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })

        const updates = { ...req.body }
        if (updates.estado === 'fecho' || updates.estado === 'cancelado') {
            updates.data_fecho = new Date()
        }
        await pedido.update(updates)
        res.json(pedido)
    } catch (err) {
        console.error('Erro ao atualizar pedido:', err)
        res.status(500).json({ error: 'Erro ao atualizar pedido' })
    }
}

// ═════════════════════════════════════════════════════════════════
// NOTIFICAÇÕES
// ═════════════════════════════════════════════════════════════════

export const listarNotificacoes = async (req, res) => {
    try {
        const notifs = await Notificacao.findAll({
            where: { utilizador_id: req.user.id },
            order: [['created_at', 'DESC']]
        })
        res.json(notifs)
    } catch (err) {
        console.error('Erro ao listar notificações:', err)
        res.status(500).json({ error: 'Erro ao listar notificações' })
    }
}

export const marcarNotificacaoLida = async (req, res) => {
    try {
        const notif = await Notificacao.findOne({
            where: { id_notificacao: req.params.id, utilizador_id: req.user.id }
        })
        if (!notif) return res.status(404).json({ error: 'Notificação não encontrada' })
        await notif.update({ lida: true })
        res.json(notif)
    } catch (err) {
        console.error('Erro ao marcar notificação:', err)
        res.status(500).json({ error: 'Erro ao marcar notificação' })
    }
}

export const criarNotificacao = async (req, res) => {
    try {
        let { utilizador_id, cliente_id, titulo, mensagem, tipo } = req.body

        if (!utilizador_id && cliente_id) {
            const user = await Utilizador.findOne({
                where: { cliente_id, role_id: 3, ativo: true }
            })
            if (!user) {
                return res.status(404).json({ error: 'Cliente não tem conta de utilizador associada' })
            }
            utilizador_id = user.id_utilizador
        }

        if (!utilizador_id || !titulo || !mensagem) {
            return res.status(400).json({ error: 'utilizador_id (ou cliente_id), titulo e mensagem são obrigatórios' })
        }

        const notif = await Notificacao.create({
            utilizador_id,
            titulo,
            mensagem,
            tipo: tipo || 'info',
            lida: false,
            created_at: new Date()
        })
        res.status(201).json(notif)
    } catch (err) {
        console.error('Erro ao criar notificação:', err)
        res.status(500).json({ error: 'Erro ao criar notificação' })
    }
}
