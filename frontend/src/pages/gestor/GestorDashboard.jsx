import { useEffect, useState } from "react";
import {
  Users, FileText, ClipboardList, MessageSquare,
  ShieldCheck, Clock, AlertTriangle,
  UserCog, LayoutDashboard
} from "lucide-react";
import { dashboardService } from "../../services/adminservice";

export function GestorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.completo()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <p className="text-muted">Erro ao carregar dados do dashboard.</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total de Clientes", value: data.stats.totalClientes, icon: Users, color: "#3b82f6" },
    { label: "Documentos", value: data.stats.totalDocumentos, icon: FileText, color: "#a855f7" },
    { label: "Pedidos de Acesso", value: data.stats.totalPedidosPendentes, icon: ClipboardList, color: "#f97316" },
    { label: "Contactos Recebidos", value: data.stats.totalContactos, icon: MessageSquare, color: "#22c55e" },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "3rem", height: "3rem", borderRadius: "0.75rem",
              background: "rgba(194,65,12,0.1)",
            }}
          >
            <LayoutDashboard size={24} className="kb-brand" />
          </div>
          <div>
            <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
              Visão Geral
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
              Visão geral da gestão de clientes e documentos
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────── */}
      <div className="d-grid kb-grid-2 kb-grid-sm-2 kb-grid-lg-4" style={{ gap: "1.25rem", marginBottom: "1.5rem" }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white border shadow-sm d-flex align-items-center"
              style={{ borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}
            >
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", backgroundColor: s.color + "15" }}
              >
                <Icon style={{ width: "1.5rem", height: "1.5rem", color: s.color }} />
              </div>
              <div style={{ marginLeft: "1rem" }}>
                <strong className="h4 fw-bold d-block" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
                  {s.value}
                </strong>
                <span className="small text-muted">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 1: Conformidade NIS2 + Top Clientes ────────────── */}
      <div className="d-grid kb-grid-lg-2" style={{ gap: "1.25rem", marginBottom: "1.5rem" }}>
        {/* Conformidade NIS2 */}
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
            <ShieldCheck size={18} className="kb-brand" />
            <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Conformidade NIS2</h2>
          </div>
          <p className="small text-muted" style={{ marginBottom: "1rem" }}>
            Distribuição dos clientes por estado de conformidade NIS2.
          </p>
          <div className="d-flex" style={{ gap: "1.5rem" }}>
            <div className="text-center flex-fill">
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle"
                style={{ width: "3.5rem", height: "3.5rem", backgroundColor: "#22c55e20", marginBottom: "0.375rem" }}
              >
                <strong className="h5 fw-bold" style={{ color: "#22c55e", margin: 0 }}>{data.conformidade.conforme}</strong>
              </div>
              <div className="small fw-medium" style={{ color: "#1c1917" }}>Conforme</div>
            </div>
            <div className="text-center flex-fill">
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle"
                style={{ width: "3.5rem", height: "3.5rem", backgroundColor: "#f9731620", marginBottom: "0.375rem" }}
              >
                <strong className="h5 fw-bold" style={{ color: "#f97316", margin: 0 }}>{data.conformidade.avaliacao}</strong>
              </div>
              <div className="small fw-medium" style={{ color: "#1c1917" }}>Avaliação</div>
            </div>
            <div className="text-center flex-fill">
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle"
                style={{ width: "3.5rem", height: "3.5rem", backgroundColor: "#ef444420", marginBottom: "0.375rem" }}
              >
                <strong className="h5 fw-bold" style={{ color: "#ef4444", margin: 0 }}>{data.conformidade.pendencias}</strong>
              </div>
              <div className="small fw-medium" style={{ color: "#1c1917" }}>Pendências</div>
            </div>
          </div>
        </div>

        {/* Top 5 Clientes */}
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
            <AlertTriangle size={18} className="kb-brand" />
            <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Top 5 Clientes com Incidentes</h2>
          </div>
          <p className="small text-muted" style={{ marginBottom: "1rem" }}>
            Clientes com maior número de incidentes de segurança registrados.
          </p>
          {data.topClientes.length > 0 ? (
            <div className="kb-space-y-2">
              {data.topClientes.map((c, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center justify-content-between"
                  style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", backgroundColor: i % 2 === 0 ? "rgba(231,229,228,0.25)" : "transparent" }}
                >
                  <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                    <span className="fw-bold small" style={{ color: "#a8a29e", minWidth: "1.25rem" }}>{i + 1}.</span>
                    <span className="small fw-medium" style={{ color: "#1c1917" }}>{c.nome}</span>
                  </div>
                  <span className="badge" style={{ backgroundColor: "#78350F15", color: "#78350F", fontSize: "0.75rem", fontWeight: 600 }}>
                    {c.total} docs
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="small text-muted text-center" style={{ padding: "1.5rem 0", margin: 0 }}>Sem incidentes registados.</p>
          )}
        </div>
      </div>

      {/* ── Row 2: Documentos por Cliente/Mês + Utilizadores/Perfil ── */}
      <div className="d-grid kb-grid-lg-2" style={{ gap: "1.25rem", marginBottom: "1.5rem" }}>
        {/* Documentos por Cliente e por Mês */}
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
            <FileText size={18} className="kb-brand" />
            <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Documentos por Cliente e por Mês</h2>
          </div>
          <p className="small text-muted" style={{ marginBottom: "1rem" }}>
            Total de documentos submetidos por cliente, agrupados por mês.
          </p>
          {data.documentosPorClienteMes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-borderless mb-0">
                <thead>
                  <tr>
                    <th className="small fw-semibold text-muted" style={{ borderBottom: "1px solid #e7e5e4" }}>Cliente</th>
                    <th className="small fw-semibold text-muted" style={{ borderBottom: "1px solid #e7e5e4" }}>Mês</th>
                    <th className="small fw-semibold text-muted text-end" style={{ borderBottom: "1px solid #e7e5e4" }}>Total de Documentos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.documentosPorClienteMes.map((d, i) => (
                    <tr key={i}>
                      <td className="small fw-medium" style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0efee" }}>
                        {d.cliente}
                      </td>
                      <td className="small text-muted" style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0efee" }}>
                        {d.mes}
                      </td>
                      <td className="small fw-semibold text-end" style={{ padding: "0.5rem 0", borderBottom: "1px solid #f0efee" }}>
                        {d.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="small text-muted text-center" style={{ padding: "1.5rem 0", margin: 0 }}>Nenhum documento encontrado.</p>
          )}
        </div>

        {/* Utilizadores por Perfil */}
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
            <UserCog size={18} className="kb-brand" />
            <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Utilizadores por Perfil</h2>
          </div>
          <p className="small text-muted" style={{ marginBottom: "1rem" }}>
            Distribuição dos utilizadores registados por tipo de perfil.
          </p>
          {data.utilizadoresPorPerfil.length > 0 ? (
            <div className="kb-space-y-2">
              {data.utilizadoresPorPerfil.map((u, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center justify-content-between"
                  style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", backgroundColor: "rgba(231,229,228,0.25)" }}
                >
                  <span className="fw-semibold small" style={{ color: "#1c1917" }}>{u.perfil}</span>
                  <span className="small text-muted">{u.total} utilizadores</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="small text-muted text-center" style={{ padding: "1.5rem 0", margin: 0 }}>Sem utilizadores registados.</p>
          )}
        </div>
      </div>

      {/* ── Row 3: Estado dos Pedidos ───────────────────────────── */}
      <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
          <ClipboardList size={18} className="kb-brand" />
          <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Estado dos Pedidos e Tempo Médio de Resolução</h2>
        </div>
        <p className="small text-muted" style={{ marginBottom: "1rem" }}>
          Resumo dos pedidos de suporte agrupados por estado.
        </p>
        <div className="d-grid kb-grid-md-2" style={{ gap: "1.5rem" }}>
          {/* Por Estado */}
          <div>
            <h3 className="small fw-semibold text-muted" style={{ marginBottom: "0.75rem" }}>Por Estado</h3>
            {data.pedidos?.porEstado?.length > 0 ? (
              <div className="kb-space-y-2">
                {data.pedidos.porEstado.map((p, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-between"
                    style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", backgroundColor: "rgba(231,229,228,0.25)" }}
                  >
                    <span className="small fw-medium" style={{ color: "#1c1917" }}>{p.estado}</span>
                    <span className="badge rounded-pill" style={{ backgroundColor: "#78350F15", color: "#78350F", fontWeight: 600 }}>
                      {p.total} pedidos
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="small text-muted text-center" style={{ padding: "1rem 0", margin: 0 }}>Nenhum pedido registado.</p>
            )}
          </div>
          {/* Tempo Médio */}
          <div>
            <h3 className="small fw-semibold text-muted" style={{ marginBottom: "0.75rem" }}>Tempo Médio de Resolução</h3>
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ padding: "1.5rem", borderRadius: "0.75rem", backgroundColor: "rgba(231,229,228,0.25)" }}
            >
              {data.pedidos?.tempoMedioResolucao ? (
                <>
                  <Clock size={32} className="kb-brand" style={{ marginBottom: "0.5rem" }} />
                  <strong className="h3 fw-bold" style={{ color: "#1c1917", margin: 0 }}>{data.pedidos.tempoMedioResolucao}</strong>
                  <span className="small text-muted">média de resolução</span>
                </>
              ) : (
                <p className="small text-muted text-center" style={{ margin: 0 }}>Sem dados suficientes.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
