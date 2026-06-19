import { Users, FileText, Clock, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function GestorDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalDocuments: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    // Load data from localStorage
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    const activeClients = clients.filter((c) => !c.isDeleted);
    const documents = JSON.parse(
      localStorage.getItem("client_documents") || "[]",
    );
    const pendingRequests = JSON.parse(
      localStorage.getItem("pending_client_requests") || "[]",
    );
    const pending = pendingRequests.filter((r) => r.status === "pending");

    setStats({
      totalClients: clients.length,
      activeClients: activeClients.length,
      totalDocuments: documents.length,
      pendingRequests: pending.length,
    });
  }, []);

  const statCards = [
    {
      title: "Total de Clientes",
      value: stats.totalClients,
      icon: Users,
      bgStyle: { backgroundColor: "#3b82f6" },
    },
    {
      title: "Clientes Ativos",
      value: stats.activeClients,
      icon: CheckCircle,
      bgStyle: { backgroundColor: "#22c55e" },
    },
    {
      title: "Documentos",
      value: stats.totalDocuments,
      icon: FileText,
      bgStyle: { backgroundColor: "#a855f7" },
    },
    {
      title: "Pedidos Pendentes",
      value: stats.pendingRequests,
      icon: Clock,
      bgStyle: { backgroundColor: "#f97316" },
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da gestão de clientes e documentos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="d-grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4" style={{ gap: "1.5rem", marginBottom: "2rem" }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-border shadow-sm hover-shadow-md transition-all"
              style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
            >
              <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "1rem" }}>
                <div className="d-flex align-items-center justify-content-center" style={{ ...stat.bgStyle, width: "3rem", height: "3rem", borderRadius: "0.5rem" }}>
                  <Icon className="text-white" style={{ width: "1.5rem", height: "1.5rem" }} />
                </div>
              </div>
              <h3 className="text-2xl fw-bold text-foreground" style={{ marginBottom: "0.25rem" }}>
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="d-grid lg-grid-cols-2" style={{ gap: "1.5rem" }}>
        {/* Recent Clients */}
        <div className="bg-white border border-border" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <h2 className="text-xl fw-semibold text-foreground" style={{ marginBottom: "1rem" }}>
            Clientes Recentes
          </h2>
          <div className="space-y-3">
            {JSON.parse(localStorage.getItem("clients") || "[]")
              .filter((c) => !c.isDeleted)
              .slice(0, 5)
              .map((client) => (
                <div
                  key={client.id}
                  className="d-flex align-items-center justify-content-between hover-bg-muted transition-colors"
                  style={{ padding: "0.75rem", borderRadius: "0.5rem" }}
                >
                  <div>
                    <p className="fw-medium text-foreground" style={{ margin: 0 }}>
                      {client.name}
                    </p>
                    <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
                      {client.email}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {client.sector || "N/A"}
                  </div>
                </div>
              ))}
            {stats.activeClients === 0 && (
              <p className="text-sm text-muted-foreground text-center" style={{ paddingTop: "1rem", paddingBottom: "1rem", margin: 0 }}>
                Nenhum cliente registado
              </p>
            )}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white border border-border" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <h2 className="text-xl fw-semibold text-foreground" style={{ marginBottom: "1rem" }}>
            Pedidos Pendentes
          </h2>
          <div className="space-y-3">
            {JSON.parse(localStorage.getItem("pending_client_requests") || "[]")
              .filter((r) => r.status === "pending")
              .slice(0, 5)
              .map((request) => (
                <div
                  key={request.id}
                  className="d-flex align-items-center justify-content-between hover-bg-muted transition-colors"
                  style={{ padding: "0.75rem", borderRadius: "0.5rem" }}
                >
                  <div>
                    <p className="fw-medium text-foreground" style={{ margin: 0 }}>
                      {request.name}
                    </p>
                    <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
                      {request.email}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {request.requestDate}
                  </div>
                </div>
              ))}
            {stats.pendingRequests === 0 && (
              <p className="text-sm text-muted-foreground text-center" style={{ paddingTop: "1rem", paddingBottom: "1rem", margin: 0 }}>
                Nenhum pedido pendente
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
