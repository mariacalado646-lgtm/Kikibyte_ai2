import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";

export function GestorPedidos() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [hoverApproveId, setHoverApproveId] = useState(null);
  const [hoverRejectId, setHoverRejectId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const storedRequests = JSON.parse(
      localStorage.getItem("pending_client_requests") || "[]",
    );
    setRequests(storedRequests);
  };

  const handleApprove = (requestId) => {
    const storedRequests = JSON.parse(
      localStorage.getItem("pending_client_requests") || "[]",
    );
    const request = storedRequests.find((r) => r.id === requestId);
    if (request) {
      // Update request status
      const updatedRequests = storedRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "approved",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : r,
      );
      localStorage.setItem(
        "pending_client_requests",
        JSON.stringify(updatedRequests),
      );

      // Create new client
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      const newClient = {
        id: Date.now(),
        name: request.name,
        email: request.email,
        phone: request.phone,
        nif: request.nif,
        contactPerson: request.contact,
        password: "temp123", // Temporary password
        isDeleted: false,
        createdDate: new Date().toISOString().split("T")[0],
      };
      clients.push(newClient);
      localStorage.setItem("clients", JSON.stringify(clients));

      toast.success(
        `Pedido aprovado! Cliente ${request.name} criado com sucesso.`,
      );
      loadRequests();
    }
  };

  const handleReject = (requestId) => {
    const storedRequests = JSON.parse(
      localStorage.getItem("pending_client_requests") || "[]",
    );
    const updatedRequests = storedRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: "rejected",
            rejectedDate: new Date().toISOString().split("T")[0],
          }
        : r,
    );
    localStorage.setItem(
      "pending_client_requests",
      JSON.stringify(updatedRequests),
    );
    toast.success("Pedido rejeitado");
    loadRequests();
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

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
        className="d-inline-block text-xs fw-semibold border"
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
        <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>
          Pedidos de Acesso
        </h1>
        <p className="text-muted-foreground">
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
              className={`d-flex align-items-center text-nowrap transition-all ${
                filter === f.id
                  ? "bg-primary text-primary-foreground border-0"
                  : "bg-white text-foreground hover-bg-muted border border-border"
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
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white border border-border hover-shadow-md transition-all"
            style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
          >
            <div className="d-flex flex-column lg-flex-row align-items-lg-center justify-content-between" style={{ gap: "1rem" }}>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <h3 className="text-lg fw-semibold text-foreground" style={{ margin: 0 }}>
                    {request.name}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>
                <div className="d-grid sm-grid-cols-2 text-sm text-muted-foreground" style={{ gap: "0.5rem" }}>
                  <p style={{ margin: 0 }}>👤 Contacto: {request.contact}</p>
                  <p style={{ margin: 0 }}>📧 Email: {request.email}</p>
                  <p style={{ margin: 0 }}>📱 Telefone: {request.phone}</p>
                  {request.nif && <p style={{ margin: 0 }}>🏢 NIF: {request.nif}</p>}
                  <p style={{ margin: 0 }}>📅 Data do Pedido: {request.requestDate}</p>
                  {request.approvedDate && (
                    <p style={{ margin: 0 }}>✅ Aprovado em: {request.approvedDate}</p>
                  )}
                  {request.rejectedDate && (
                    <p style={{ margin: 0 }}>❌ Rejeitado em: {request.rejectedDate}</p>
                  )}
                </div>
              </div>

              {request.status === "pending" && (
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button
                    onClick={() => handleApprove(request.id)}
                    onMouseEnter={() => setHoverApproveId(request.id)}
                    onMouseLeave={() => setHoverApproveId(null)}
                    className="text-white transition-colors d-flex align-items-center border-0"
                    style={{
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      borderRadius: "0.5rem",
                      gap: "0.5rem",
                      backgroundColor: hoverApproveId === request.id ? "#15803d" : "#16a34a",
                    }}
                  >
                    <CheckCircle size={18} />
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    onMouseEnter={() => setHoverRejectId(request.id)}
                    onMouseLeave={() => setHoverRejectId(null)}
                    className="text-white transition-colors d-flex align-items-center border-0"
                    style={{
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      borderRadius: "0.5rem",
                      gap: "0.5rem",
                      backgroundColor: hoverRejectId === request.id ? "#b91c1c" : "#dc2626",
                    }}
                  >
                    <XCircle size={18} />
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white border border-border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
            <Clock className="text-muted-foreground mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
            <h3 className="text-lg fw-semibold text-foreground" style={{ marginBottom: "0.5rem" }}>
              Nenhum pedido encontrado
            </h3>
            <p className="text-muted-foreground" style={{ margin: 0 }}>
              {filter === "pending"
                ? "Não existem pedidos pendentes no momento"
                : `Não existem pedidos ${filter === "approved" ? "aprovados" : filter === "rejected" ? "rejeitados" : ""}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
