import { api } from './api'

export const submitContactForm = (data) => api.post('/contact', data)
export const fetchSubmissions  = ()     => api.get('/contact').then(r => r.data)
