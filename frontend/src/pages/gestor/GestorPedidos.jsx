import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Clock, CheckCircle, XCircle, User, ClipboardList, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

const ESTADO_BADGE = {
  pendente:     { class: "bg-warning text-dark", label: "Pendente" },
  em_andamento: { class: "bg-primary text-white", label: "Em Andamento" },
  resolvido:    { class: "bg-success text-white", label: "Resolvido" },
  fechado:      { class: "bg-secondary text-white", label: "Fechado" },
  cancelado:    { class: "bg-danger text-white", label: "Cancelado" },
};

export function GestorPedidos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("acesso"); // "acesso" | "clientes"
  const [requests, setRequests] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [pedidoFilter, setPedidoFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (activeTab === "acesso") loadRequests();
    else loadPedidos();
  }, [activeTab, filter, pedidoFilter]);

  // ── Pedidos de Acesso (novos clientes) ──
  const loadRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") params.status = filter;
      const res = await api.get("/pedidos-acesso", { params });
      setRequests(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos de acesso:", err);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setProcessing(requestId);
    try {
      const res = await api.put(`/pedidos-acesso/${requestId}/aprovar`);
      toast.success(res.data.message || "Pedido aprovado com sucesso!");
      loadRequests();
    } catch (err) {
      console.error("Erro ao aprovar pedido:", err);
      toast.error(err.response?.data?.error || "Erro ao aprovar pedido");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessing(requestId);
    try {
      await api.put(`/pedidos-acesso/${requestId}/rejeitar`);
      toast.success("Pedido rejeitado");
      loadRequests();
    } catch (err) {
      console.error("Erro ao rejeitar pedido:", err);
      toast.error("Erro ao rejeitar pedido");
    } finally {
      setProcessing(null);
    }
  };

  // ── Pedidos dos Clientes ──
  const loadPedidos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (pedidoFilter !== "all") params.estado = pedidoFilter;
      const res = await api.get("/pedidos", { params });
      setPedidos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handlePedidoStatus = async (pedidoId, novoEstado) => {
    setProcessing(pedidoId);
    try {
      await api.put(`/pedidos/${pedidoId}`, { estado: novoEstado });
      toast.success(`Pedido atualizado para ${novoEstado}`);
      loadPedidos();
    } catch (err) {
      toast.error("Erro ao atualizar pedido");
    } finally {
      setProcessing(null);
    }
  };

  const getAcessoBadge = (status) => {
    const badges = {
      pending:  { bg: "#ffedd5", borderColor: "#fed7aa", text: "#c2410c", label: "Pendente" },
      approved: { bg: "#dcfce7", borderColor: "#bbf7d0", text: "#15803d", label: "Aprovado" },
      rejected: { bg: "#fee2e2", borderColor: "#fecaca", text: "#b91c1c", label: "Rejeitado" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className="d-inline-block small fw-semibold border" style={{ padding: "0.25rem 0.75rem", borderRadius: "50rem", backgroundColor: badge.bg, borderColor: badge.borderColor, color: badge.text }}>
        {badge.label}
      </span>
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="h3 fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
          Pedidos
        </h1>
        <p className="text-muted">
          {activeTab === "acesso"
            ? "Valide e aprove pedidos de novos clientes"
            : "Acompanhe os pedidos submetidos pelos clientes"}
        </p>
      </div>

      {/* Tabs: Acesso vs Clientes */}
      <div className="d-flex border-bottom" style={{ marginBottom: "1.5rem", gap: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("acesso")}
          className={`d-flex align-items-center text-nowrap bg-transparent border-0 pb-2 ${
            activeTab === "acesso" ? "text-primary fw-semibold" : "text-muted"
          }`}
          style={{
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            borderBottom: activeTab === "acesso" ? "2px solid var(--primary)" : "2px solid transparent",
          }}
        >
          <User size={18} />
          Pedidos de Acesso
        </button>
        <button
          onClick={() => setActiveTab("clientes")}
          className={`d-flex align-items-center text-nowrap bg-transparent border-0 pb-2 ${
            activeTab === "clientes" ? "text-primary fw-semibold" : "text-muted"
          }`}
          style={{
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            borderBottom: activeTab === "clientes" ? "2px solid var(--primary)" : "2px solid transparent",
          }}
        >
          <ClipboardList size={18} />
          Pedidos de Clientes
        </button>
      </div>

      {/* Filters */}
      {activeTab === "acesso" ? (
        <div className="overflow-x-auto d-flex" style={{ marginBottom: "1.5rem", gap: "0.5rem" }}>
          {[
            { id: "pending", label: "Pendentes", icon: Clock },
            { id: "approved", label: "Aprovados", icon: CheckCircle },
            { id: "rejected", label: "Rejeitados", icon: XCircle },
            { id: "all", label: "Todos", icon: User },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`d-flex align-items-center text-nowrap kb-transition ${
                  filter === f.id
                    ? "bg-primary text-primary-foreground border-0"
                    : "bg-white text-body hover-bg-light border"
                }`}
                style={{ gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}
              >
                <Icon size={18} />
                {f.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto d-flex" style={{ marginBottom: "1.5rem", gap: "0.5rem" }}>
          {[
            { id: "all", label: "Todos", icon: ClipboardList },
            { id: "pendente", label: "Pendentes", icon: Clock },
            { id: "em_andamento", label: "Em Andamento", icon: CheckCircle },
            { id: "resolvido", label: "Resolvidos", icon: CheckCircle },
            { id: "cancelado", label: "Cancelados", icon: XCircle },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setPedidoFilter(f.id)}
                className={`d-flex align-items-center text-nowrap kb-transition ${
                  pedidoFilter === f.id
                    ? "bg-primary text-primary-foreground border-0"
                    : "bg-white text-body hover-bg-light border"
                }`}
                style={{ gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}
              >
                <Icon size={18} />
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      {/* List */}
      <div className="kb-space-y-4">
        {loading ? (
          <div className="text-center text-muted" style={{ padding: "3rem" }}>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">A carregar...</span>
            </div>
            <p style={{ margin: 0 }}>A carregar...</p>
          </div>
        ) : activeTab === "acesso" ? (
          /* ── Pedidos de Acesso ── */
          requests.length === 0 ? (
            <div className="bg-white border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
              <User className="text-muted mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
              <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.5rem" }}>Nenhum pedido de acesso encontrado</h3>
              <p className="text-muted" style={{ margin: 0 }}>
                {filter === "pending" ? "Não existem pedidos pendentes" : `Não existem pedidos ${filter}`}
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id_pedido} className="bg-white border kb-hover-shadow kb-transition" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div className="d-flex flex-column lg-flex-row align-items-lg-center justify-content-between" style={{ gap: "1rem" }}>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <h3 className="fs-5 fw-semibold text-body" style={{ margin: 0 }}>{request.nome_empresa}</h3>
                      {getAcessoBadge(request.status)}
                    </div>
                    <div className="d-grid sm-kb-grid-2 small text-muted" style={{ gap: "0.5rem" }}>
                      <p style={{ margin: 0 }}>👤 Contacto: {request.pessoa_contacto}</p>
                      <p style={{ margin: 0 }}>📧 Email: {request.email}</p>
                      <p style={{ margin: 0 }}>📱 Telefone: {request.telefone}</p>
                      {request.nif && <p style={{ margin: 0 }}>🏢 NIF: {request.nif}</p>}
                      <p style={{ margin: 0 }}>📅 Data: {request.created_at ? new Date(request.created_at).toLocaleDateString("pt-PT") : "N/A"}</p>
                    </div>
                  </div>
                  {request.status === "pending" && (
                    <div className="d-flex" style={{ gap: "0.5rem" }}>
                      <button onClick={() => handleApprove(request.id_pedido)} disabled={processing === request.id_pedido}
                        className="text-white d-flex align-items-center border-0"
                        style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", gap: "0.5rem", opacity: processing === request.id_pedido ? 0.6 : 1, backgroundColor: "#16a34a" }}>
                        <CheckCircle size={18} /> {processing === request.id_pedido ? "..." : "Aprovar"}
                      </button>
                      <button onClick={() => handleReject(request.id_pedido)} disabled={processing === request.id_pedido}
                        className="text-white d-flex align-items-center border-0"
                        style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", gap: "0.5rem", opacity: processing === request.id_pedido ? 0.6 : 1, backgroundColor: "#dc2626" }}>
                        <XCircle size={18} /> Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          /* ── Pedidos dos Clientes ── */
          pedidos.length === 0 ? (
            <div className="bg-white border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
              <ClipboardList className="text-muted mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
              <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.5rem" }}>Nenhum pedido de cliente encontrado</h3>
              <p className="text-muted" style={{ margin: 0 }}>Os clientes ainda não submeteram pedidos</p>
            </div>
          ) : (
            pedidos.map((pedido) => {
              const badge = ESTADO_BADGE[pedido.estado] || ESTADO_BADGE.pendente;
              return (
                <div key={pedido.id_pedido} className="bg-white border kb-hover-shadow kb-transition" style={{ borderRadius: "0.75rem", padding: "1.25rem" }}>
                  <div className="d-flex align-items-start justify-content-between">
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <ClipboardList size={18} className="kb-brand" />
                        <strong>{pedido.titulo}</strong>
                        <span className={`badge ${badge.class}`}>{badge.label}</span>
                        {pedido.prioridade && (
                          <span className={`badge ${pedido.prioridade === 'urgente' || pedido.prioridade === 'alta' ? 'bg-danger' : pedido.prioridade === 'normal' ? 'bg-info' : 'bg-secondary'}`}>
                            {pedido.prioridade}
                          </span>
                        )}
                      </div>
                      {pedido.cliente && (
                        <p className="small text-muted" style={{ margin: "0.25rem 0" }}>
                          <User size={12} style={{ marginRight: "0.25rem" }} />
                          {pedido.cliente.nome} ({pedido.cliente.email})
                        </p>
                      )}
                      {pedido.descricao && (
                        <p className="small text-muted" style={{ margin: "0.25rem 0", whiteSpace: "pre-wrap" }}>{pedido.descricao}</p>
                      )}
                      <div className="d-flex align-items-center small text-muted" style={{ gap: "1rem", marginTop: "0.5rem" }}>
                        <span className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
                          <Clock size={12} />
                          {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleDateString("pt-PT") : "N/A"}
                        </span>
                        <button
                          onClick={() => navigate(`/gestor/clientes/${pedido.cliente_id}`)}
                          className="d-flex align-items-center text-primary bg-transparent border-0 p-0 small"
                          style={{ gap: "0.25rem" }}
                        >
                          <ArrowRight size={12} />
                          Ver cliente
                        </button>
                      </div>
                    </div>

                    <div className="d-flex" style={{ gap: "0.5rem", marginLeft: "1rem", flexShrink: 0 }}>
                      {pedido.estado === "pendente" && (
                        <>
                          <button onClick={() => handlePedidoStatus(pedido.id_pedido, "em_andamento")}
                            disabled={processing === pedido.id_pedido}
                            className="btn btn-sm btn-primary d-flex align-items-center" style={{ gap: "0.25rem" }}>
                            <CheckCircle size={14} /> {processing === pedido.id_pedido ? "..." : "Aceitar"}
                          </button>
                          <button onClick={() => handlePedidoStatus(pedido.id_pedido, "cancelado")}
                            disabled={processing === pedido.id_pedido}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center" style={{ gap: "0.25rem" }}>
                            <XCircle size={14} /> Rejeitar
                          </button>
                        </>
                      )}
                      {pedido.estado === "em_andamento" && (
                        <button onClick={() => handlePedidoStatus(pedido.id_pedido, "resolvido")}
                          disabled={processing === pedido.id_pedido}
                          className="btn btn-sm btn-outline-success d-flex align-items-center" style={{ gap: "0.25rem" }}>
                          <CheckCircle size={14} /> {processing === pedido.id_pedido ? "..." : "Concluir"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}
