import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export const fetchArtigosPublicados = () =>
api.get('/artigos').then(res => res.data)

export const fetchArtigoPorSlug = (slug) =>
api.get(`/artigos/${slug}`).then(res => res.data)
