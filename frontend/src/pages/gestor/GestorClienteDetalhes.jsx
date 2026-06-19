import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Server,
  AlertOctagon,
  FileText,
  Shield,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { SendNotification } from "../../components/gestor/SendNotification";

export function GestorClienteDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [activeTab, setActiveTab] = useState("geral");

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    const foundClient = clients.find((c) => c.id === parseInt(id || "0"));
    if (!foundClient || foundClient.isDeleted) {
      toast.error("Cliente não encontrado");
      navigate("/gestor/clientes");
    } else {
      setClient(foundClient);
    }
  }, [id, navigate]);

  if (!client) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-screen" style={{ padding: "2rem" }}>
        <p className="text-muted-foreground">A carregar...</p>
      </div>
    );
  }

  const tabs = [
    { id: "geral", label: "Dados Gerais", icon: User },
    { id: "risco", label: "Avaliação de Risco", icon: AlertTriangle },
    { id: "ativos", label: "Ativos Tecnológicos", icon: Server },
    { id: "incidentes", label: "Incidentes", icon: AlertOctagon },
    { id: "documentacao", label: "Documentação", icon: FileText },
    { id: "pentests", label: "Pen Tests", icon: Shield },
    { id: "outros", label: "Outros", icon: Archive },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => navigate("/gestor/clientes")}
          className="d-flex align-items-center text-muted-foreground border-0 bg-transparent hover-text-primary"
          style={{ gap: "0.5rem", marginBottom: "1rem", transition: "color 0.15s" }}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="d-flex flex-column md-flex-row align-items-md-start justify-content-md-between" style={{ gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>
              {client.name}
            </h1>
            <p className="text-muted-foreground" style={{ margin: 0 }}>{client.email}</p>
          </div>
          <div style={{ width: "100%", maxWidth: "16rem" }}>
            <SendNotification clientId={client.id} clientName={client.name} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex border-bottom border-border" style={{ gap: "0.5rem", minWidth: "max-content" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`d-flex align-items-center text-nowrap transition-colors bg-transparent border-0 ${
                  activeTab === tab.id
                    ? "text-primary fw-semibold"
                    : "text-muted-foreground hover-text-primary"
                }`}
                style={{
                  gap: "0.5rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-border" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
        {activeTab === "geral" && (
          <div className="space-y-6">
            <h2 className="text-xl fw-semibold text-foreground" style={{ marginBottom: "1rem" }}>
              Informação Geral
            </h2>
            <div className="d-grid md-grid-cols-2" style={{ gap: "1.5rem" }}>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Nome da Empresa
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.name}</p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Email
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.email}</p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Telefone
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.phone}</p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  NIF
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.nif || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Morada
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                  {client.address || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Sector
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.sector || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Pessoa de Contacto
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                  {client.contactPerson || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Código Postal
                </label>
                <p className="text-foreground" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                  {client.postalCode || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "risco" && (
          <div className="space-y-6">
            <h2 className="text-xl fw-semibold text-foreground" style={{ marginBottom: "1rem" }}>
              Avaliação de Risco
            </h2>
            <div className="d-grid md-grid-cols-3" style={{ gap: "1.5rem" }}>
              <div className="border rounded-lg" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", padding: "1rem" }}>
                <p className="text-sm fw-medium text-red-700" style={{ marginBottom: "0.5rem" }}>
                  Nível de Risco
                </p>
                <p className="text-2xl fw-bold text-red-600" style={{ margin: 0 }}>
                  {client.riskLevel || "Médio"}
                </p>
              </div>
              <div className="border rounded-lg" style={{ backgroundColor: "#fff7ed", borderColor: "#fed7aa", padding: "1rem" }}>
                <p className="text-sm fw-medium" style={{ color: "#c2410c", marginBottom: "0.5rem" }}>
                  Vulnerabilidades
                </p>
                <p className="text-2xl fw-bold" style={{ color: "#ea580c", margin: 0 }}>
                  {client.vulnerabilities || "3"}
                </p>
              </div>
              <div className="border rounded-lg" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", padding: "1rem" }}>
                <p className="text-sm fw-medium" style={{ color: "#15803d", marginBottom: "0.5rem" }}>
                  Conformidade
                </p>
                <p className="text-2xl fw-bold" style={{ color: "#16a34a", margin: 0 }}>
                  {client.compliance || "85%"}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <h3 className="fw-semibold text-foreground" style={{ marginBottom: "0.75rem" }}>
                Observações
              </h3>
              <p className="text-muted-foreground" style={{ margin: 0 }}>
                {client.riskNotes || "Nenhuma observação de risco registada."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "ativos" && (
          <div className="space-y-6">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-xl fw-semibold text-foreground" style={{ margin: 0 }}>
                Ativos Tecnológicos
              </h2>
              <button
                className="bg-primary text-primary-foreground hover-bg-accent transition-colors border-0"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem" }}
              >
                + Adicionar Ativo
              </button>
            </div>
            <div className="text-center text-muted-foreground" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
              <Server className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
              <p style={{ margin: 0 }}>Nenhum ativo tecnológico registado</p>
            </div>
          </div>
        )}

        {activeTab === "incidentes" && (
          <div className="space-y-6">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-xl fw-semibold text-foreground" style={{ margin: 0 }}>
                Incidentes de Segurança
              </h2>
              <button
                className="bg-primary text-primary-foreground hover-bg-accent transition-colors border-0"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem" }}
              >
                + Registar Incidente
              </button>
            </div>
            <div className="text-center text-muted-foreground" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
              <AlertOctagon className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
              <p style={{ margin: 0 }}>Nenhum incidente registado</p>
            </div>
          </div>
        )}

        {activeTab === "documentacao" && (
          <div className="space-y-6">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-xl fw-semibold text-foreground" style={{ margin: 0 }}>
                Documentação
              </h2>
              <button
                className="bg-primary text-primary-foreground hover-bg-accent transition-colors border-0"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem" }}
              >
                + Upload Documento
              </button>
            </div>
            <div className="text-center text-muted-foreground" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
              <FileText className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
              <p style={{ margin: 0 }}>Nenhum documento disponível</p>
            </div>
          </div>
        )}

        {activeTab === "pentests" && (
          <div className="space-y-6">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-xl fw-semibold text-foreground" style={{ margin: 0 }}>
                Testes de Penetração
              </h2>
              <button
                className="bg-primary text-primary-foreground hover-bg-accent transition-colors border-0"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem" }}
              >
                + Novo Pen Test
              </button>
            </div>
            <div className="text-center text-muted-foreground" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
              <Shield className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
              <p style={{ margin: 0 }}>Nenhum teste de penetração realizado</p>
            </div>
          </div>
        )}

        {activeTab === "outros" && (
          <div className="space-y-6">
            <h2 className="text-xl fw-semibold text-foreground" style={{ marginBottom: "1.5rem" }}>
              Outras Informações
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm fw-medium text-muted-foreground" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Notas Adicionais
                </label>
                <textarea
                  className="w-100 border border-border focus-ring-primary"
                  style={{ marginTop: "0.5rem", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", borderRadius: "0.5rem" }}
                  rows={4}
                  placeholder="Adicione notas ou informações relevantes..."
                  defaultValue={client.notes || ""}
                />
              </div>
              <button
                className="bg-primary text-primary-foreground hover-bg-accent transition-colors border-0"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem" }}
              >
                Guardar Notas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
