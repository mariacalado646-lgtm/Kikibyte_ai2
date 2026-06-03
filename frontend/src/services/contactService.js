import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export const submitContactForm = (data) => api.post('/contact', data)
