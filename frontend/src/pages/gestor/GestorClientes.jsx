import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Eye, User } from "lucide-react";
import { clienteService } from "../../services/gestorService";

export function GestorClientes() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clienteService.listar({ ativo: true });
      setClients(data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.nif && client.nif.includes(searchTerm)),
  );

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="h3 fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
          Gestão de Clientes
        </h1>
        <p className="text-muted">
          Visualize e gerencie informações dos clientes
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="position-relative" style={{ maxWidth: "28rem" }}>
          <Search className="position-absolute top-50 translate-middle-y text-muted" style={{ left: "0.75rem" }} size={20} />
          <input
            type="text"
            placeholder="Procurar por nome, email ou NIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="contact-input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="d-grid" style={{ gap: "1.5rem" }}>
        {filteredClients.map((client) => (
          <div
            key={client.id_cliente}
            className="bg-white border border kb-hover-shadow kb-transition"
            style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
          >
            <div className="d-flex flex-column sm-flex-row align-items-sm-center justify-content-between" style={{ gap: "1rem" }}>
              <div className="d-flex align-items-start" style={{ gap: "1rem" }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(120, 53, 15, 0.1)", width: "3rem", height: "3rem", padding: "0.75rem", flexShrink: 0 }}>
                  <User className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }} />
                </div>
                <div>
                  <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.25rem", marginTop: 0 }}>
                    {client.nome}
                  </h3>
                  <div className="kb-space-y-1 small text-muted">
                    <p style={{ margin: 0 }}>📧 {client.email}</p>
                    <p style={{ margin: 0 }}>📱 {client.telefone}</p>
                    {client.nif && <p style={{ margin: 0 }}>🏢 NIF: {client.nif}</p>}
                    {client.setor && <p style={{ margin: 0 }}>🏭 Sector: {client.setor}</p>}
                  </div>
                </div>
              </div>

              <div className="d-flex" style={{ gap: "0.5rem" }}>
                <button
                  onClick={() => navigate(`/gestor/clientes/${client.id_cliente}`)}
                  className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-flex align-items-center border-0"
                  style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.5rem" }}
                >
                  <Eye size={18} />
                  Ver Detalhes
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-top border d-grid kb-grid-2 sm-kb-grid-4" style={{ marginTop: "1rem", paddingTop: "1rem", gap: "1rem" }}>
              <div className="text-center">
                <p className="small text-muted" style={{ marginBottom: "0.25rem" }}>
                  Nível de Risco
                </p>
                <p className="fw-semibold text-body" style={{ margin: 0 }}>
                  {client.estado_conformidade || "N/A"}
                </p>
              </div>
              <div className="text-center">
                <p className="small text-muted" style={{ marginBottom: "0.25rem" }}>
                  Último Acesso
                </p>
                <p className="fw-semibold text-body" style={{ margin: 0 }}>
                  {client.created_at ? new Date(client.created_at).toLocaleDateString("pt-PT") : "N/A"}
                </p>
              </div>
              <div className="text-center">
                <p className="small text-muted" style={{ marginBottom: "0.25rem" }}>Documentos</p>
                <p className="fw-semibold text-body" style={{ margin: 0 }}>0</p>
              </div>
              <div className="text-center">
                <p className="small text-muted" style={{ marginBottom: "0.25rem" }}>Estado</p>
                <span className="d-inline-block small fw-semibold kb-bg-green-100 kb-text-green" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem", paddingTop: "0.25rem", paddingBottom: "0.25rem", borderRadius: "0.25rem" }}>
                  {client.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-white border border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
            <p className="text-muted" style={{ margin: 0 }}>A carregar clientes...</p>
          </div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="bg-white border border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
            <User className="text-muted mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
            <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.5rem" }}>
              Nenhum cliente encontrado
            </h3>
            <p className="text-muted" style={{ margin: 0 }}>
              {searchTerm
                ? "Tente outro termo de pesquisa"
                : "Ainda não existem clientes registados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
