import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  MessageSquare,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DocumentConversation } from "../../components/gestor/DocumentConversation";
import { documentoService, clienteService } from "../../services/gestorService";
import { api } from "../../services/api";

export function GestorDocumentos() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [clients, setClients] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    cliente_id: "",
    titulo: "",
    tipo_documento: "relatorio",
    ficheiro: null,
    visivel_cliente: false,
  });

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ficheiro demasiado grande. Máximo 20MB.");
      e.target.value = "";
      return;
    }
    setUploadData({ ...uploadData, ficheiro: file });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.cliente_id || !uploadData.titulo || !uploadData.ficheiro) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(uploadData.ficheiro);
      });

      await documentoService.criar({
        cliente_id: parseInt(uploadData.cliente_id),
        titulo: uploadData.titulo,
        tipo_documento: uploadData.tipo_documento,
        ficheiro_base64: base64,
        mime_type: uploadData.ficheiro.type,
        tamanho_bytes: uploadData.ficheiro.size,
        visivel_cliente: uploadData.visivel_cliente,
      });

      toast.success("Documento carregado com sucesso!");
      setShowUpload(false);
      setUploadData({
        cliente_id: "",
        titulo: "",
        tipo_documento: "relatorio",
        ficheiro: null,
        visivel_cliente: false,
      });
      loadDocuments();
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
      toast.error(err.response?.data?.error || "Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      // Fetch full document data (including base64)
      const fullDoc = await documentoService.obter(doc.id_documento);
      if (fullDoc.ficheiro_base64) {
        const link = document.createElement("a");
        link.href = `data:${fullDoc.mime_type || "application/octet-stream"};base64,${fullDoc.ficheiro_base64}`;
        link.download = fullDoc.titulo || "documento";
        link.click();
      } else {
        toast.info("Documento sem ficheiro disponível");
      }
    } catch (err) {
      console.error("Erro ao fazer download:", err);
      toast.error("Erro ao fazer download");
    }
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

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="h3 fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
          Gestão de Documentos
        </h1>
        <p className="text-muted">
          Centralize e organize todos os documentos dos clientes
        </p>
      </div>

      {/* Filters and Search */}
      <div className="d-grid md-kb-grid-2" style={{ marginBottom: "1.5rem", gap: "1rem" }}>
        <div className="position-relative">
          <Search className="position-absolute top-50 translate-middle-y text-muted" style={{ left: "0.75rem" }} size={20} />
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
            className="flex-grow-1 border border kb-focus-ring"
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
            onClick={() => setShowUpload(true)}
            className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-flex align-items-center text-nowrap border-0"
            style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.5rem" }}
          >
            <Upload size={18} />
            Upload
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}
        >
          <div className="bg-white" style={{ borderRadius: "0.75rem", padding: "1.5rem", width: "100%", maxWidth: "28rem" }}>
            <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "1rem" }}>
              <h3 className="h5 fw-semibold text-body" style={{ margin: 0 }}>Upload de Documento</h3>
              <button onClick={() => setShowUpload(false)} className="border-0 bg-transparent text-muted">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="kb-space-y-3">
              <div>
                <label className="small fw-medium text-body d-block" style={{ marginBottom: "0.25rem" }}>Cliente *</label>
                <select
                  required
                  value={uploadData.cliente_id}
                  onChange={(e) => setUploadData({ ...uploadData, cliente_id: e.target.value })}
                  className="w-100 border border kb-focus-ring"
                  style={{ padding: "0.5rem", borderRadius: "0.5rem" }}
                >
                  <option value="">Selecionar cliente</option>
                  {clients.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small fw-medium text-body d-block" style={{ marginBottom: "0.25rem" }}>Título *</label>
                <input
                  required
                  type="text"
                  value={uploadData.titulo}
                  onChange={(e) => setUploadData({ ...uploadData, titulo: e.target.value })}
                  className="w-100 contact-input"
                  placeholder="Nome do documento"
                />
              </div>
              <div>
                <label className="small fw-medium text-body d-block" style={{ marginBottom: "0.25rem" }}>Tipo</label>
                <select
                  value={uploadData.tipo_documento}
                  onChange={(e) => setUploadData({ ...uploadData, tipo_documento: e.target.value })}
                  className="w-100 border border kb-focus-ring"
                  style={{ padding: "0.5rem", borderRadius: "0.5rem" }}
                >
                  <option value="relatorio">Relatório</option>
                  <option value="contrato">Contrato</option>
                  <option value="fatura">Fatura</option>
                  <option value="certificado">Certificado</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="small fw-medium text-body d-block" style={{ marginBottom: "0.25rem" }}>Ficheiro * (máx 20MB)</label>
                <input
                  required
                  type="file"
                  onChange={handleFileChange}
                  className="w-100"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="visivel_cliente"
                  checked={uploadData.visivel_cliente}
                  onChange={(e) => setUploadData({ ...uploadData, visivel_cliente: e.target.checked })}
                />
                <label htmlFor="visivel_cliente" className="small text-muted" style={{ margin: 0 }}>
                  Visível para o cliente
                </label>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-100 bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-flex align-items-center justify-content-center fw-semibold border-0"
                style={{ padding: "0.75rem", borderRadius: "0.5rem", gap: "0.5rem", opacity: uploading ? 0.6 : 1 }}
              >
                <Upload size={18} />
                {uploading ? "A carregar..." : "Carregar Documento"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="d-grid" style={{ gap: "1rem" }}>
        {loading ? (
          <div className="text-center text-muted" style={{ padding: "3rem" }}>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">A carregar...</span>
            </div>
            <p style={{ margin: 0 }}>A carregar documentos...</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id_documento}
              className="bg-white border border kb-hover-shadow kb-transition"
              style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
            >
              <div className="d-flex align-items-start justify-content-between" style={{ gap: "1rem" }}>
                <div className="d-flex align-items-start flex-grow-1" style={{ gap: "1rem" }}>
                  <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(120, 53, 15, 0.1)", padding: "0.75rem", borderRadius: "0.5rem", width: "3rem", height: "3rem", flexShrink: 0 }}>
                    <FileText className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }} />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.25rem", marginTop: 0 }}>
                      {doc.titulo}
                      {doc.visivel_cliente && (
                        <span className="badge bg-success-subtle text-success ms-2" style={{ fontSize: "0.7rem" }}>Visível p/ cliente</span>
                      )}
                    </h3>
                    <div className="kb-space-y-1 small text-muted">
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
                    className="position-relative border-0 bg-transparent"
                    style={{ padding: "0.5rem", color: "#2563eb" }}
                    title="Conversa"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="border-0 bg-transparent"
                    style={{ padding: "0.5rem", color: "var(--primary)" }}
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id_documento)}
                    className="border-0 bg-transparent"
                    style={{ padding: "0.5rem", color: "#dc2626" }}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && filteredDocuments.length === 0 && (
          <div className="bg-white border border text-center" style={{ borderRadius: "0.75rem", padding: "3rem" }}>
            <FileText className="text-muted mx-auto mb-4" style={{ width: "3rem", height: "3rem" }} />
            <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: "0.5rem" }}>
              Nenhum documento encontrado
            </h3>
            <p className="text-muted" style={{ margin: 0 }}>
              {searchTerm || filterClient !== "all"
                ? "Tente ajustar os filtros de pesquisa"
                : "Clique em 'Upload' para carregar o primeiro documento"}
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
