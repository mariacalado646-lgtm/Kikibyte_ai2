import { api } from './api'

export const clienteService = {
    listar:   (params)           => api.get('/clientes', { params }).then(r => r.data),
    obter:    (id)               => api.get(`/clientes/${id}`).then(r => r.data),
    criar:    (data)             => api.post('/clientes', data).then(r => r.data),
    atualizar:(id, data)         => api.put(`/clientes/${id}`, data).then(r => r.data),
    remover:  (id)               => api.delete(`/clientes/${id}`).then(r => r.data),
}

export const documentoService = {
    listar:   (params)           => api.get('/documentos', { params }).then(r => r.data),
    obter:    (id)               => api.get(`/documentos/${id}`).then(r => r.data),
    criar:    (data)             => api.post('/documentos', data).then(r => r.data),
    remover:  (id)               => api.delete(`/documentos/${id}`).then(r => r.data),
}

export const pedidoService = {
    listar:   (params)           => api.get('/pedidos', { params }).then(r => r.data),
    obter:    (id)               => api.get(`/pedidos/${id}`).then(r => r.data),
    criar:    (data)             => api.post('/pedidos', data).then(r => r.data),
    atualizar:(id, data)         => api.put(`/pedidos/${id}`, data).then(r => r.data),
}

export const mensagemService = {
    listar:   (params)           => api.get('/mensagens', { params }).then(r => r.data),
    criar:    (data)             => api.post('/mensagens', data).then(r => r.data),
}

export const notificacaoService = {
    listar:   ()                 => api.get('/notificacoes').then(r => r.data),
    criar:    (data)             => api.post('/notificacoes', data).then(r => r.data),
    marcarLida:(id)              => api.put(`/notificacoes/${id}/ler`).then(r => r.data),
}

export const empresaService = {
    listar:   ()                 => api.get('/empresas').then(r => r.data),
    obter:    (id)               => api.get(`/empresas/${id}`).then(r => r.data),
}

export const relatorioService = {
    listar:   (params)           => api.get('/relatorios', { params }).then(r => r.data),
    obter:    (id)               => api.get(`/relatorios/${id}`).then(r => r.data),
    criar:    (data)             => api.post('/relatorios', data).then(r => r.data),
}
