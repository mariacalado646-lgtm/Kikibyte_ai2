import { useState, useEffect } from "react";
import { History, Search, Filter, Download, Trash2, RefreshCw, Clock, User, Shield, Globe } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

export function LogsView() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ acao: "", utilizador_id: "", data_inicio: "", data_fim: "" });
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 50;

  useEffect(() => { loadLogs(); }, [page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = { limit, offset: page * limit };
      if (filters.acao) params.acao = filters.acao;
      if (filters.utilizador_id) params.utilizador_id = filters.utilizador_id;
      if (filters.data_inicio) params.data_inicio = filters.data_inicio;
      if (filters.data_fim) params.data_fim = filters.data_fim;

      const res = await api.get("/logs", { params });
      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      toast.error("Erro ao carregar logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(0);
    loadLogs();
  };

  const handleClearFilters = () => {
    setFilters({ acao: "", utilizador_id: "", data_inicio: "", data_fim: "" });
    setPage(0);
  };

  const handleCleanOld = async () => {
    if (!confirm("Tem a certeza? Isto remove logs com mais de 90 dias.")) return;
    try {
      await api.delete("/logs/limpar?dias=90");
      toast.success("Logs antigos removidos");
      loadLogs();
    } catch (err) {
      toast.error("Erro ao limpar logs");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Data", "Utilizador", "Email", "Role", "Ação", "Entidade", "IP"].join(","),
      ...logs.map(l =>
        [
          l.created_at ? new Date(l.created_at).toISOString() : "",
          l.utilizador?.nome || l.utilizador?.email || "Sistema",
          l.utilizador?.email || "",
          l.utilizador?.role_id || "",
          l.acao || "",
          l.entidade || "",
          l.ip_origem || ""
        ].map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Ficheiro exportado");
  };

  const totalPages = Math.ceil(total / limit);

  const roleLabel = (roleId) => {
    const labels = { 1: "Admin", 2: "Gestor", 3: "Cliente" };
    return labels[roleId] || `Role ${roleId}`;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "rgba(194,65,12,0.1)" }}
          >
            <History size={24} className="kb-brand" />
          </div>
          <div>
            <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
              Logs do Sistema
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
              {total} registos · consulta e monitorização de atividades
            </p>
          </div>
        </div>
        <div className="d-flex" style={{ gap: "0.5rem" }}>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline-secondary d-flex align-items-center" style={{ gap: "0.4rem" }}>
            <Filter size={16} />
            Filtros
          </button>
          <button onClick={handleExport} className="btn btn-outline-secondary d-flex align-items-center" style={{ gap: "0.4rem" }}>
            <Download size={16} />
            Exportar
          </button>
          <button onClick={handleCleanOld} className="btn btn-outline-danger d-flex align-items-center" style={{ gap: "0.4rem" }}>
            <Trash2 size={16} />
            Limpar Antigos
          </button>
          <button onClick={loadLogs} className="btn btn-outline-secondary d-flex align-items-center" style={{ gap: "0.4rem" }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <form onSubmit={handleFilter} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Ação</label>
              <input type="text" className="form-control" placeholder="Ex: LOGIN, CRIAR..." value={filters.acao} onChange={(e) => setFilters({...filters, acao: e.target.value})} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-medium">ID Utilizador</label>
              <input type="number" className="form-control" placeholder="ID" value={filters.utilizador_id} onChange={(e) => setFilters({...filters, utilizador_id: e.target.value})} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-medium">Data Início</label>
              <input type="date" className="form-control" value={filters.data_inicio} onChange={(e) => setFilters({...filters, data_inicio: e.target.value})} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-medium">Data Fim</label>
              <input type="date" className="form-control" value={filters.data_fim} onChange={(e) => setFilters({...filters, data_fim: e.target.value})} />
            </div>
            <div className="col-md-3 d-flex" style={{ gap: "0.5rem" }}>
              <button type="submit" className="btn btn-kb-primary">Aplicar</button>
              <button type="button" onClick={handleClearFilters} className="btn btn-outline-secondary">Limpar</button>
            </div>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "40vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">A carregar...</span>
          </div>
        </div>
      ) : logs.length > 0 ? (
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="table table-hover mb-0" style={{ fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafafa", borderBottom: "2px solid #e5e5e5" }}>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#78716c", whiteSpace: "nowrap" }}>Data/Hora</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#78716c", whiteSpace: "nowrap" }}>Utilizador</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#78716c", whiteSpace: "nowrap" }}>Role</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#78716c", whiteSpace: "nowrap" }}>Ação</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#78716c", whiteSpace: "nowrap" }}>Recurso</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#78716c", whiteSpace: "nowrap" }}>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id_log} style={{ borderBottom: "1px solid #f0f0f0", verticalAlign: "middle" }}>
                    <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap", color: "#78716c", fontSize: "0.8rem" }}>
                      <span className="d-flex align-items-center" style={{ gap: "0.35rem" }}>
                        <Clock size={12} />
                        {log.created_at ? new Date(log.created_at).toLocaleString("pt-PT") : "-"}
                      </span>
                    </td>
                    <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap" }}>
                      <span className="d-flex align-items-center" style={{ gap: "0.35rem" }}>
                        <User size={14} className="text-muted" />
                        {log.utilizador?.nome || "Sistema"}
                      </span>
                    </td>
                    <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap" }}>
                      <span className="d-flex align-items-center" style={{ gap: "0.35rem" }}>
                        <Shield size={14} className="text-muted" />
                        {roleLabel(log.utilizador?.role_id)}
                      </span>
                    </td>
                    <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap" }}>
                      <span className={`badge ${log.acao?.startsWith("LOGIN") ? "bg-success" : log.acao?.startsWith("CRIAR") ? "bg-primary" : log.acao?.startsWith("ATUALIZAR") || log.acao?.startsWith("EDIT") ? "bg-warning text-dark" : log.acao?.startsWith("ELIMINAR") || log.acao?.startsWith("DELETE") ? "bg-danger" : "bg-secondary"}`} style={{ fontSize: "0.75rem" }}>
                        {log.acao}
                      </span>
                    </td>
                    <td style={{ padding: "0.6rem 1rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#78716c", fontSize: "0.8rem" }}>
                      <span className="d-flex align-items-center" style={{ gap: "0.35rem" }}>
                        <Globe size={12} />
                        {log.entidade || "-"}
                        {log.entidade_id ? ` #${log.entidade_id}` : ""}
                      </span>
                    </td>
                    <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap", color: "#78716c", fontSize: "0.75rem", fontFamily: "monospace" }}>
                      {log.ip_origem || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between" style={{ padding: "0.75rem 1rem", borderTop: "1px solid #f0f0f0" }}>
              <small className="text-muted">
                Mostrando {page * limit + 1}–{Math.min((page + 1) * limit, total)} de {total}
              </small>
              <div className="d-flex" style={{ gap: "0.25rem" }}>
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Anterior
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-muted" style={{ padding: "4rem 0" }}>
          <History className="mx-auto mb-3 opacity-50" size={48} />
          <p>Nenhum log encontrado</p>
          <small>Os logs aparecerão à medida que forem registadas ações no sistema.</small>
        </div>
      )}
    </div>
  );
}
