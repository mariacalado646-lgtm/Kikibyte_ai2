import { Artigo, CategoriaArtigo } from '../models/Artigo.js'

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
