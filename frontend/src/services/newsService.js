import { api } from './api'

export const fetchArtigosPublicados = ()     => api.get('/artigos').then(r => r.data)
export const fetchArtigoPorSlug     = (slug) => api.get(`/artigos/${slug}`).then(r => r.data)
export const fetchCategorias        = ()     => api.get('/artigos/categorias').then(r => r.data)
