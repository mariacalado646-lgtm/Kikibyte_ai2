import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

export function GestorPedidos() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") params.status = filter;
      const res = await api.get("/pedidos-acesso", { params });
      setRequests(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
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

  const filteredRequests = requests;

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "#ffedd5",
        borderColor: "#fed7aa",
        text: "#c2410c",
        label: "Pendente",
      },
      approved: {
        bg: "#dcfce7",
        borderColor: "#bbf7d0",
        text: "#15803d",
        label: "Aprovado",
      },
      rejected: {
        bg: "#fee2e2",
        borderColor: "#fecaca",
        text: "#b91c1c",
        label: "Rejeitado",
      },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        className="d-inline-block small fw-semibold border"
        style={{
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          borderRadius: "50rem",
          backgroundColor: badge.bg,
          borderColor: badge.borderColor,
          color: badge.text,
        }}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="h3 fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
          Pedidos de Acesso
        </h1>
        <p className="text-muted">
          Valide e aprove pedidos de novos clientes
        </p>
      </div>

      {/* Filters */}
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
                  : "bg-white text-body hover-bg-light border border"
              }`}
              style={{
                gap: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <Icon size={18} />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="kb-space-y-4">
        {loading ? (
          <div className="text-center text-muted" style={{ padding: "3rem" }}>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">A carregar...</span>
            </div>
            <p style={{ margin: 0 }}>A carregar pedidos...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white border border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
            <Clock className="text-muted mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
            <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.5rem" }}>
              Nenhum pedido encontrado
            </h3>
            <p className="text-muted" style={{ margin: 0 }}>
              {filter === "pending"
                ? "Não existem pedidos pendentes no momento"
                : `Não existem pedidos ${filter === "approved" ? "aprovados" : filter === "rejected" ? "rejeitados" : ""}`}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id_pedido}
              className="bg-white border border kb-hover-shadow kb-transition"
              style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
            >
              <div className="d-flex flex-column lg-flex-row align-items-lg-center justify-content-between" style={{ gap: "1rem" }}>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <h3 className="fs-5 fw-semibold text-body" style={{ margin: 0 }}>
                      {request.nome_empresa}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="d-grid sm-kb-grid-2 small text-muted" style={{ gap: "0.5rem" }}>
                    <p style={{ margin: 0 }}>👤 Contacto: {request.pessoa_contacto}</p>
                    <p style={{ margin: 0 }}>📧 Email: {request.email}</p>
                    <p style={{ margin: 0 }}>📱 Telefone: {request.telefone}</p>
                    {request.nif && <p style={{ margin: 0 }}>🏢 NIF: {request.nif}</p>}
                    <p style={{ margin: 0 }}>📅 Data do Pedido: {request.created_at ? new Date(request.created_at).toLocaleDateString("pt-PT") : "N/A"}</p>
                  </div>
                </div>

                {request.status === "pending" && (
                  <div className="d-flex" style={{ gap: "0.5rem" }}>
                    <button
                      onClick={() => handleApprove(request.id_pedido)}
                      disabled={processing === request.id_pedido}
                      className="text-white kb-transition-bg d-flex align-items-center border-0"
                      style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        borderRadius: "0.5rem",
                        gap: "0.5rem",
                        opacity: processing === request.id_pedido ? 0.6 : 1,
                        backgroundColor: "#16a34a",
                      }}
                    >
                      <CheckCircle size={18} />
                      {processing === request.id_pedido ? "A processar..." : "Aprovar"}
                    </button>
                    <button
                      onClick={() => handleReject(request.id_pedido)}
                      disabled={processing === request.id_pedido}
                      className="text-white kb-transition-bg d-flex align-items-center border-0"
                      style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        borderRadius: "0.5rem",
                        gap: "0.5rem",
                        opacity: processing === request.id_pedido ? 0.6 : 1,
                        backgroundColor: "#dc2626",
                      }}
                    >
                      <XCircle size={18} />
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
