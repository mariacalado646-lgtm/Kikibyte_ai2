import { useState, useEffect } from "react";
import { Shield, Search, CheckCircle, XCircle, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { adminClienteService, permissaoService } from "../../services/adminservice";

const FUNCIONALIDADES = [
  { key: "dashboard",   label: "Painel Principal",   desc: "Visão geral do cliente" },
  { key: "pedidos",     label: "Pedidos",             desc: "Criar e acompanhar pedidos" },
  { key: "submissoes",  label: "Submissões",          desc: "Enviar ativos, incidentes, docs, pentests" },
  { key: "documentos",  label: "Documentos",          desc: "Consultar documentos partilhados" },
  { key: "mensagens",   label: "Mensagens",           desc: "Trocar mensagens com a equipa" },
  { key: "relatorios",  label: "Relatórios",          desc: "Aceder a relatórios de conformidade" },
];

export function ClientPermissions() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [permissoes, setPermissoes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    adminClienteService.listar({ ativo: true })
      .then(setClientes)
      .catch(() => {});
  }, []);

  const loadPermissoes = async (clienteId) => {
    if (!clienteId) return;
    setLoading(true);
    try {
      const data = await permissaoService.listarPorCliente(clienteId);
      // Normalizar para array independente do formato
      const arr = Array.isArray(data) ? data : data.permissoes || [];
      setPermissoes(arr);
    } catch (err) {
      toast.error("Erro ao carregar permissões");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCliente) loadPermissoes(selectedCliente);
    else setPermissoes(null);
  }, [selectedCliente]);

  const togglePermissao = (funcionalidade) => {
    setPermissoes(prev =>
      prev.map(p =>
        p.funcionalidade === funcionalidade ? { ...p, ativo: !p.ativo } : p
      )
    );
  };

  const handleSave = async () => {
    if (!selectedCliente || !permissoes) return;
    setSaving(true);
    try {
      await permissaoService.atualizar(selectedCliente, permissoes);
      toast.success("Permissões atualizadas com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar permissões");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = (value) => {
    setPermissoes(prev => prev.map(p => ({ ...p, ativo: value })));
  };

  const filteredClientes = clientes.filter(c =>
    (c.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "rgba(194,65,12,0.1)" }}
          >
            <Shield size={24} className="kb-brand" />
          </div>
          <div>
            <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
              Permissões por Cliente
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
              Ative ou desative funcionalidades para cada cliente
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={!permissoes || saving} className="btn btn-kb-primary d-flex align-items-center" style={{ gap: "0.5rem" }}>
          <Save size={16} />
          {saving ? "A salvar..." : "Salvar Alterações"}
        </button>
      </div>

      <div className="row g-4">
        {/* Client List */}
        <div className="col-md-4">
          <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", overflow: "hidden" }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid #f0f0f0" }}>
              <div className="kb-search-wrap">
                <Search size={16} className="kb-search-icon" />
                <input
                  type="text"
                  placeholder="Pesquisar cliente..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="form-control kb-input kb-search-input"
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
            </div>
            <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
              {filteredClientes.map((c) => (
                <button
                  key={c.id_cliente}
                  onClick={() => setSelectedCliente(c.id_cliente)}
                  className={`d-block w-100 text-start border-0 kb-transition ${
                    selectedCliente === c.id_cliente ? "bg-light fw-semibold" : "bg-white"
                  }`}
                  style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #f8f8f8" }}
                >
                  <div style={{ fontSize: "0.9rem", color: "#1c1917" }}>{c.nome}</div>
                  <div className="small text-muted">{c.email || "Sem email"}</div>
                </button>
              ))}
              {filteredClientes.length === 0 && (
                <div className="text-center text-muted small" style={{ padding: "2rem" }}>
                  Nenhum cliente encontrado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="col-md-8">
          {!selectedCliente ? (
            <div className="bg-white border shadow-sm d-flex flex-column align-items-center justify-content-center text-muted" style={{ borderRadius: "0.75rem", padding: "4rem", minHeight: "400px" }}>
              <Shield size={48} className="mb-3 opacity-50" />
              <p>Selecione um cliente para gerir permissões</p>
            </div>
          ) : loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">A carregar...</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", overflow: "hidden" }}>
              <div className="d-flex align-items-center justify-content-between" style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <h3 className="fw-semibold" style={{ fontSize: "1rem", margin: 0, color: "#1c1917" }}>
                    {clientes.find(c => c.id_cliente === parseInt(selectedCliente))?.nome || "Cliente"}
                  </h3>
                  <small className="text-muted">Funcionalidades disponíveis</small>
                </div>
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button onClick={() => handleSelectAll(true)} className="btn btn-sm btn-outline-success d-flex align-items-center" style={{ gap: "0.3rem" }}>
                    <CheckCircle size={14} /> Ativar Todas
                  </button>
                  <button onClick={() => handleSelectAll(false)} className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ gap: "0.3rem" }}>
                    <XCircle size={14} /> Desativar Todas
                  </button>
                </div>
              </div>

              <div style={{ padding: "0.5rem" }}>
                {FUNCIONALIDADES.map(({ key, label, desc }) => {
                  const perms = permissoes || []
                  const permissao = perms.find(p => p.funcionalidade === key)
                  const ativo = permissao ? permissao.ativo : true

                  return (
                    <div
                      key={key}
                      className={`d-flex align-items-center justify-content-between kb-transition border-0 ${
                        ativo ? "" : "opacity-50"
                      }`}
                      style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                      onClick={() => togglePermissao(key)}
                    >
                      <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem",
                            backgroundColor: ativo ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)"
                          }}
                        >
                          {ativo
                            ? <CheckCircle size={20} style={{ color: "#16a34a" }} />
                            : <XCircle size={20} style={{ color: "#ef4444" }} />
                          }
                        </div>
                        <div>
                          <div className="fw-medium" style={{ fontSize: "0.9rem", color: "#1c1917" }}>{label}</div>
                          <div className="small text-muted">{desc}</div>
                        </div>
                      </div>
                      <div className="form-check form-switch mb-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={ativo}
                          onChange={() => togglePermissao(key)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
