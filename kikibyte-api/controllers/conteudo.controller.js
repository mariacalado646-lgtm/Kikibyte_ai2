import { Op } from 'sequelize'
import { Artigo, CategoriaArtigo } from '../models/Artigo.js'
import { Empresa } from '../models/Empresa.js'
import { ContactForm } from '../models/ContactForm.js'

// ─── Slug helper ─────────────────────────────────────────────────
function slugify(text) {
    return text.toString()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// ═════════════════════════════════════════════════════════════════
// ARTIGOS (públicos + admin CRUD)
// ═════════════════════════════════════════════════════════════════

export const getArtigosPublicados = async (req, res) => {
    try {
        const artigos = await Artigo.findAll({
            where: { estado: 'publicado' },
            include: [{ model: CategoriaArtigo, as: 'categoria_artigo', attributes: ['nome'] }],
            attributes: { exclude: ['conteudo'] },
            order: [['published_at', 'DESC']]
        })
        res.json(artigos)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const getArtigoPorSlug = async (req, res) => {
    try {
        const artigo = await Artigo.findOne({
            where: { slug: req.params.slug, estado: 'publicado' },
            include: [{ model: CategoriaArtigo, as: 'categoria_artigo', attributes: ['nome'] }]
        })
        if (!artigo) return res.status(404).json({ error: 'Artigo não encontrado' })
        res.json(artigo)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const getCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaArtigo.findAll({
            attributes: ['id_categoria', 'nome'],
            order: [['nome', 'ASC']]
        })
        res.json(categorias)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const listarTodosArtigos = async (req, res) => {
    try {
        const { estado, categoria_id } = req.query
        const where = {}
        if (estado) where.estado = estado
        if (categoria_id) where.id_categoria = categoria_id

        const artigos = await Artigo.findAll({
            where,
            include: [{ model: CategoriaArtigo, as: 'categoria_artigo', attributes: ['nome'] }],
            order: [['created_at', 'DESC']]
        })
        res.json(artigos)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao listar artigos' })
    }
}

export const obterArtigo = async (req, res) => {
    try {
        const artigo = await Artigo.findByPk(req.params.id, {
            include: [{ model: CategoriaArtigo, as: 'categoria_artigo', attributes: ['nome'] }]
        })
        if (!artigo) return res.status(404).json({ error: 'Artigo não encontrado' })
        res.json(artigo)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao obter artigo' })
    }
}

export const criarArtigo = async (req, res) => {
    try {
        const { titulo, resumo, conteudo, id_categoria, imagem_capa_base64, estado } = req.body
        if (!titulo || !conteudo) {
            return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' })
        }

        let slug = slugify(titulo)
        const existing = await Artigo.findOne({ where: { slug } })
        if (existing) slug = slug + '-' + Date.now()

        const artigo = await Artigo.create({
            titulo,
            slug,
            resumo: resumo || null,
            conteudo,
            id_categoria: id_categoria || null,
            imagem_capa_base64: imagem_capa_base64 || null,
            estado: estado || 'rascunho',
            autor_id: req.user.id,
            published_at: estado === 'publicado' ? new Date() : null,
            created_at: new Date(),
            updated_at: new Date()
        })
        res.status(201).json(artigo)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao criar artigo' })
    }
}

export const atualizarArtigo = async (req, res) => {
    try {
        const artigo = await Artigo.findByPk(req.params.id)
        if (!artigo) return res.status(404).json({ error: 'Artigo não encontrado' })

        const { titulo, resumo, conteudo, id_categoria, imagem_capa_base64, estado } = req.body

        const updateData = {}
        if (titulo !== undefined) {
            updateData.titulo = titulo
            let slug = slugify(titulo)
            const existing = await Artigo.findOne({ where: { slug, id_artigo: { [Op.ne]: req.params.id } } })
            if (existing) slug = slug + '-' + Date.now()
            updateData.slug = slug
        }
        if (resumo !== undefined) updateData.resumo = resumo
        if (conteudo !== undefined) updateData.conteudo = conteudo
        if (id_categoria !== undefined) updateData.id_categoria = id_categoria
        if (imagem_capa_base64 !== undefined) updateData.imagem_capa_base64 = imagem_capa_base64
        if (estado !== undefined) {
            updateData.estado = estado
            if (estado === 'publicado' && !artigo.published_at) {
                updateData.published_at = new Date()
            }
        }
        updateData.updated_at = new Date()

        await artigo.update(updateData)
        res.json(artigo)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao atualizar artigo' })
    }
}

export const removerArtigo = async (req, res) => {
    try {
        const artigo = await Artigo.findByPk(req.params.id)
        if (!artigo) return res.status(404).json({ error: 'Artigo não encontrado' })
        await artigo.destroy()
        res.json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao remover artigo' })
    }
}

// ═════════════════════════════════════════════════════════════════
// EMPRESAS / SITE CONTENT
// ═════════════════════════════════════════════════════════════════

export const listarEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.findAll({ where: { ativo: true }, order: [['nome', 'ASC']] })
        res.json(empresas)
    } catch (err) {
        console.error('Erro ao listar empresas:', err)
        res.status(500).json({ error: 'Erro ao listar empresas' })
    }
}

export const obterEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id)
        if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' })
        res.json(empresa)
    } catch (err) {
        console.error('Erro ao obter empresa:', err)
        res.status(500).json({ error: 'Erro ao obter empresa' })
    }
}

export const criarEmpresa = async (req, res) => {
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

export const atualizarEmpresa = async (req, res) => {
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

// ═════════════════════════════════════════════════════════════════
// CONTACT FORM
// ═════════════════════════════════════════════════════════════════

export const submitContact = async (req, res) => {
    try {
        const { nome, email, telefone, empresa, mensagem, doc_base64 } = req.body
        if (!nome || !email || !empresa || !mensagem)
            return res.status(400).json({ error: 'É obrigatorio preencher o formulario com nome, e-mail, empresa a ser representada e uma mensagem.' })

        const submission = await ContactForm.create({
            nome,
            email,
            telefone: telefone || null,
            empresa,
            mensagem,
            estate: 'pending',
            date_sent: new Date(),
            doc_base64: doc_base64 || null,
        })
        res.status(201).json({ success: true, id: submission.id_contact_form })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const getContactSubmissions = async (req, res) => {
    try {
        const submissions = await ContactForm.findAll({
            order: [['date_sent', 'DESC']],
            attributes: { exclude: ['doc_base64'] }
        })
        res.json(submissions)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}
