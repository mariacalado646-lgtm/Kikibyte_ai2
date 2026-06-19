import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { DocumentConversation } from "../../components/gestor/DocumentConversation";
import { documentoService, clienteService } from "../../services/gestorService";

export function GestorDocumentos() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [clients, setClients] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
    loadClients();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentoService.listar();
      setDocuments(data);
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clienteService.listar({ ativo: true });
      setClients(data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  const handleUpload = () => {
    toast.info("Funcionalidade de upload será implementada");
  };

  const handleDelete = async (docId) => {
    try {
      await documentoService.remover(docId);
      setDocuments((prev) => prev.filter((doc) => doc.id_documento !== docId));
      toast.success("Documento removido com sucesso");
    } catch (err) {
      console.error("Erro ao remover documento:", err);
      toast.error("Erro ao remover documento");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tipo_documento || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient =
      filterClient === "all" || doc.cliente_id === parseInt(filterClient);
    return matchesSearch && matchesClient;
  });

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id_cliente === clientId);
    return client ? client.nome : "Cliente Desconhecido";
  };

  const openConversation = (doc) => {
    setSelectedDocument(doc);
    setIsConversationOpen(true);
  };

  const getMessageCount = (docId) => {
    const allMessages = JSON.parse(
      localStorage.getItem("document_conversations") || "[]",
    );
    return allMessages.filter((m) => m.documentId === docId).length;
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>
          Gestão de Documentos
        </h1>
        <p className="text-muted-foreground">
          Centralize e organize todos os documentos dos clientes
        </p>
      </div>

      {/* Filters and Search */}
      <div className="d-grid md-grid-cols-2" style={{ marginBottom: "1.5rem", gap: "1rem" }}>
        <div className="position-relative">
          <Search className="position-absolute top-50 translate-middle-y text-muted-foreground" style={{ left: "0.75rem" }} size={20} />
          <input
            type="text"
            placeholder="Procurar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="contact-input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        <div className="d-flex" style={{ gap: "0.5rem" }}>
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="flex-grow-1 border border-border focus-ring-primary"
            style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", borderRadius: "0.5rem", backgroundColor: "#ffffff" }}
          >
            <option value="all">Todos os Clientes</option>
            {clients.map((client) => (
              <option key={client.id_cliente} value={client.id_cliente}>
                {client.nome}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpload}
            className="bg-primary text-primary-foreground hover-bg-accent transition-colors d-flex align-items-center text-nowrap border-0"
            style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.5rem" }}
          >
            <Upload size={18} />
            Upload
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="d-grid" style={{ gap: "1rem" }}>
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id_documento}
            className="bg-white border border-border hover-shadow-md transition-all"
            style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
          >
            <div className="d-flex align-items-start justify-content-between" style={{ gap: "1rem" }}>
              <div className="d-flex align-items-start flex-grow-1" style={{ gap: "1rem" }}>
                <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(120, 53, 15, 0.1)", padding: "0.75rem", borderRadius: "0.5rem", width: "3rem", height: "3rem", flexShrink: 0 }}>
                  <FileText className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }} />
                </div>
                <div className="flex-grow-1">
                  <h3 className="text-lg fw-semibold text-foreground" style={{ marginBottom: "0.25rem", marginTop: 0 }}>
                    {doc.titulo}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p style={{ margin: 0 }}>📁 Tipo: {doc.tipo_documento}</p>
                    <p style={{ margin: 0 }}>👤 Cliente: {getClientName(doc.cliente_id)}</p>
                    <p style={{ margin: 0 }}>📅 Data: {doc.created_at ? new Date(doc.created_at).toLocaleDateString("pt-PT") : "N/A"}</p>
                    {doc.tamanho_bytes && <p style={{ margin: 0 }}>📊 Tamanho: {Math.round(doc.tamanho_bytes / 1024)} KB</p>}
                  </div>
                </div>
              </div>

              <div className="d-flex" style={{ gap: "0.5rem" }}>
                <button
                  onClick={() => openConversation(doc)}
                  className="position-relative hover-bg-blue-50 rounded-3 transition-colors border-0 bg-transparent"
                  style={{ padding: "0.5rem", color: "#2563eb" }}
                  title="Conversa"
                >
                  <MessageSquare size={18} />
                  {getMessageCount(doc.id_documento) > 0 && (
                    <span
                      className="position-absolute text-white text-xs rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        top: "-0.25rem",
                        right: "-0.25rem",
                        width: "1.25rem",
                        height: "1.25rem",
                        backgroundColor: "#2563eb",
                      }}
                    >
                      {getMessageCount(doc.id_documento)}
                    </span>
                  )}
                </button>
                <button
                  className="hover-bg-primary-opacity text-primary rounded-3 transition-colors border-0 bg-transparent"
                  style={{ padding: "0.5rem" }}
                  title="Download"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleDelete(doc.id_documento)}
                  className="hover-bg-red-50 rounded-3 transition-colors border-0 bg-transparent"
                  style={{ padding: "0.5rem", color: "#dc2626" }}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="bg-white border border-border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
            <FileText className="text-muted-foreground mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
            <h3 className="text-lg fw-semibold text-foreground" style={{ marginBottom: "0.5rem" }}>
              Nenhum documento encontrado
            </h3>
            <p className="text-muted-foreground" style={{ margin: 0 }}>
              {searchTerm || filterClient !== "all"
                ? "Tente ajustar os filtros de pesquisa"
                : "Ainda não existem documentos carregados"}
            </p>
          </div>
        )}
      </div>

      {/* Document Conversation Dialog */}
      {selectedDocument && (
        <DocumentConversation
          document={selectedDocument}
          isOpen={isConversationOpen}
          onClose={() => {
            setIsConversationOpen(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}
