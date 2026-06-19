import { useState, useEffect } from "react";
import { Users, FileText, TrendingUp, UserCog } from "lucide-react";

export function Dashboard() {
  const [clients, setClients] = useState([]);
  const [gestors, setGestors] = useState([]);

  useEffect(() => {
    // Load clients from localStorage
    const storedClients = localStorage.getItem("clients");
    if (storedClients) {
      setClients(JSON.parse(storedClients).filter((c) => !c.isDeleted));
    }

    // Load gestors from localStorage
    const storedGestors = localStorage.getItem("gestors");
    if (storedGestors) {
      setGestors(JSON.parse(storedGestors).filter((g) => !g.isDeleted));
    }
  }, []);

  const stats = [
    {
      label: "Total Clientes",
      value: clients.length.toString(),
      icon: Users,
      bgStyle: { backgroundColor: '#3b82f6' },
    },
    {
      label: "Total Gestores",
      value: gestors.length.toString(),
      icon: UserCog,
      bgStyle: { backgroundColor: '#a855f7' },
    },
    {
      label: "Relatórios Gerados",
      value: "18",
      icon: FileText,
      bgStyle: { backgroundColor: '#22c55e' },
    },
    {
      label: "Taxa de Satisfação",
      value: "98%",
      icon: TrendingUp,
      bgStyle: { backgroundColor: 'var(--primary)' },
    },
  ];

  const recentReports = [
    {
      id: 1,
      company: "TechCorp SA",
      year: 2025,
      period: "Anual",
      date: "2026-01-15",
    },
    {
      id: 2,
      company: "DataSystems Ltd",
      year: 2025,
      period: "Anual",
      date: "2026-02-10",
    },
    {
      id: 3,
      company: "SecureBank",
      year: 2024,
      period: "Q4",
      date: "2025-12-20",
    },
  ];

  const recentClients = clients.slice(0, 3);
  const recentGestors = gestors.slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "reviewing":
        return "Em Análise";
      case "resolved":
        return "Resolvido";
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da plataforma KikiByte
        </p>
      </div>

      {/* Stats Grid */}
      <div className="d-grid md-grid-cols-2 lg-grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-border shadow-sm"
              style={{ borderRadius: '0.75rem', padding: '1.5rem' }}
            >
              <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: '1rem' }}>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ ...stat.bgStyle, width: '3rem', height: '3rem', borderRadius: '0.5rem' }}
                >
                  <Icon className="text-white" style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
              </div>
              <p className="text-3xl fw-bold text-foreground" style={{ marginBottom: '0.25rem' }}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="d-grid lg-grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Recent Reports */}
        <div className="bg-white border border-border shadow-sm" style={{ borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: '1.5rem' }}>
            <h2 className="text-xl fw-bold text-foreground">
              Reports Recentes
            </h2>
            <button className="text-sm text-primary hover-underline border-0 bg-transparent">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: 'rgba(231, 229, 228, 0.3)', padding: '1rem', borderRadius: '0.5rem' }}
                >
                  <div className="flex-grow-1">
                    <p className="fw-medium text-foreground">
                      {report.company}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.year} - {report.period}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-muted-foreground" style={{ marginTop: '0.25rem' }}>
                      {report.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                Nenhum relatório disponível
              </p>
            )}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white border border-border shadow-sm" style={{ borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: '1.5rem' }}>
            <h2 className="text-xl fw-bold text-foreground">
              Clientes Recentes
            </h2>
            <button className="text-sm text-primary hover-underline border-0 bg-transparent">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div
                  key={client.id}
                  className="d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: 'rgba(231, 229, 228, 0.3)', padding: '1rem', borderRadius: '0.5rem' }}
                >
                  <div className="flex-grow-1">
                    <p className="fw-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.contact}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="d-inline-block rounded-pill text-xs fw-medium text-primary" style={{ backgroundColor: 'rgba(120, 53, 15, 0.1)', paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                      {client.plan}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                Nenhum cliente disponível
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Gestors */}
      <div className="bg-white border border-border shadow-sm" style={{ borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="text-xl fw-bold text-foreground">
            Gestores Ativos
          </h2>
          <button className="text-sm text-primary hover-underline border-0 bg-transparent">
            Ver todos
          </button>
        </div>
        <div className="d-grid md-grid-cols-3" style={{ gap: '1rem' }}>
          {recentGestors.length > 0 ? (
            recentGestors.map((gestor) => (
              <div key={gestor.id} style={{ backgroundColor: 'rgba(231, 229, 228, 0.3)', padding: '1rem', borderRadius: '0.5rem' }}>
                <div className="d-flex align-items-center" style={{ gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div className="rounded-pill text-primary d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(120, 53, 15, 0.1)', width: '2.5rem', height: '2.5rem' }}>
                    <UserCog size={20} />
                  </div>
                  <div>
                    <p className="fw-medium text-foreground">{gestor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {gestor.email}
                    </p>
                  </div>
                </div>
                <div className="border-top border-border" style={{ marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                  <p className="text-xs text-muted-foreground">
                    Último login: {gestor.lastLogin || "Nunca"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground" style={{ gridColumn: 'span 3', paddingTop: '2rem', paddingBottom: '2rem' }}>
              Nenhum gestor disponível
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
