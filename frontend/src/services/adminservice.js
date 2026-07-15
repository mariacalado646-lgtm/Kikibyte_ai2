import { api } from './api'

// ── Utilizadores (admins, gestores, clientes) ──────────────────────
export const utilizadorService = {
    listar:   (params)    => api.get('/utilizadores', { params }).then(r => r.data),
    obter:    (id)        => api.get(`/utilizadores/${id}`).then(r => r.data),
    criar:    (data)      => api.post('/utilizadores', data).then(r => r.data),
    atualizar:(id, data)  => api.put(`/utilizadores/${id}`, data).then(r => r.data),
    remover:  (id)        => api.delete(`/utilizadores/${id}`).then(r => r.data),
}

// ── Clientes ───────────────────────────────────────────────────────
export const adminClienteService = {
    listar:   (params)    => api.get('/clientes', { params }).then(r => r.data),
    obter:    (id)        => api.get(`/clientes/${id}`).then(r => r.data),
    criar:    (data)      => api.post('/clientes', data).then(r => r.data),
    atualizar:(id, data)  => api.put(`/clientes/${id}`, data).then(r => r.data),
    remover:  (id)        => api.delete(`/clientes/${id}`).then(r => r.data),
}

// ── Relatórios Anuais (estruturados) ───────────────────────────────
export const relatorioAnualService = {
    listar:   (params)    => api.get('/relatorios-anuais', { params }).then(r => r.data),
    obter:    (id)        => api.get(`/relatorios-anuais/${id}`).then(r => r.data),
    criar:    (data)      => api.post('/relatorios-anuais', data).then(r => r.data),
    atualizar:(id, data)  => api.put(`/relatorios-anuais/${id}`, data).then(r => r.data),
    remover:  (id)        => api.delete(`/relatorios-anuais/${id}`).then(r => r.data),
}

// ── Conteúdo do Site (Homepage) ────────────────────────────────
export const siteContentService = {
    obter:    ()          => api.get('/empresas/public').then(r => r.data),
    atualizar:(id, data)  => api.put(`/empresas/${id}`, data).then(r => r.data),
}

// ── Empresas ───────────────────────────────────────────────────────
export const adminEmpresaService = {
    listar:   ()          => api.get('/empresas').then(r => r.data),
    obter:    (id)        => api.get(`/empresas/${id}`).then(r => r.data),
    criar:    (data)      => api.post('/empresas', data).then(r => r.data),
}

// ── Contact Submissions ────────────────────────────────────────────
export const adminContactService = {
    listar:   (params)    => api.get('/contact', { params }).then(r => r.data),
}

// ── Dashboard stats ────────────────────────────────────────────────
export const dashboardService = {
    stats:    ()          => api.get('/admin/stats').then(r => r.data),
    completo: ()          => api.get('/dashboard/completo').then(r => r.data),
}

// ── Importação de Clientes (Excel) ─────────────────────────────────
export const importacaoService = {
    importar: (data)      => api.post('/admin/importar-clientes', data).then(r => r.data),
}

// ── Importação de Ativos Tecnológicos (Excel) ─────────────────────
export const ativosImportService = {
    importar: (cliente_id, ativos) => api.post('/ativos-tecnologicos/importar-excel', { cliente_id, ativos }).then(r => r.data),
}

// ── Permissões por Cliente ─────────────────────────────────────────
export const permissaoService = {
    listarPorCliente: (cliente_id) => api.get(`/permissoes/cliente/${cliente_id}`).then(r => r.data),
    atualizar:        (cliente_id, permissoes) => api.put(`/permissoes/cliente/${cliente_id}`, { permissoes }).then(r => r.data),
    obterMe:          () => api.get('/permissoes/me').then(r => r.data),
}

// ── Artigos / Notícias (Admin CRUD) ────────────────────────────────
export const artigoAdminService = {
    listar:   (params)    => api.get('/artigos/admin/todos', { params }).then(r => r.data),
    obter:    (id)        => api.get(`/artigos/admin/${id}`).then(r => r.data),
    criar:    (data)      => api.post('/artigos/admin', data).then(r => r.data),
    atualizar:(id, data)  => api.put(`/artigos/admin/${id}`, data).then(r => r.data),
    remover:  (id)        => api.delete(`/artigos/admin/${id}`).then(r => r.data),
}