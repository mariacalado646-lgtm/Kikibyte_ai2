import { Op } from 'sequelize'
import { Artigo, CategoriaArtigo } from '../models/Artigo.js'

function slugify(text) {
    return text.toString()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export const getArtigosPublicados = async (req, res) => {
    try {
        const artigos = await Artigo.findAll({
            where: { estado: 'publicado' },
            include: [{ model: CategoriaArtigo, as: 'categoria_artigo', attributes: ['nome'] }],
            attributes: { exclude: ['conteudo'] },  // ← only exclude conteudo, keep image
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

// ── Admin CRUD ────────────────────────────────────────────────────

export const listarTodos = async (req, res) => {
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
        // ensure unique slug
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
