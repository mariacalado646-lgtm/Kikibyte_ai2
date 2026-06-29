import { useState, useEffect } from "react";
import { FileText, Download, MessageSquare, Send, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export function ClienteDocumentos() {
  const { user } = useAuth();
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");

  const clienteId = user?.cliente_id;

  useEffect(() => {
    if (clienteId) {
      loadDocumentos();
      loadMensagens();
    } else {
      setLoading(false);
    }
  }, [clienteId]);

  const loadDocumentos = async () => {
    try {
      const res = await api.get("/documentos", { params: { cliente_id: clienteId } });
      setDocumentos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMensagens = async () => {
    try {
      const res = await api.get("/documentos", { params: { cliente_id: clienteId } });
      const docs = res.data || [];
      const todasMsgs = [];
      for (const doc of docs) {
        try {
          const msgsRes = await api.get(`/documentos/${doc.id_documento}/mensagens`);
          todasMsgs.push(...msgsRes.data.map(m => ({ ...m, docTitulo: doc.titulo, docId: doc.id_documento })));
        } catch { /* no messages for this doc */ }
      }
      setMensagens(todasMsgs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
    }
  };

  const handleDownload = (doc) => {
    if (doc.ficheiro_base64) {
      const link = document.createElement("a");
      link.href = `data:${doc.mime_type || "application/octet-stream"};base64,${doc.ficheiro_base64}`;
      link.download = doc.titulo || "documento";
      link.click();
    } else {
      toast.info("Documento sem ficheiro disponível para download");
    }
  };

  const handleSendMessage = async (docId) => {
    if (!novaMensagem.trim()) return;
    try {
      await api.post(`/documentos/${docId}/mensagens`, { mensagem: novaMensagem });
      setNovaMensagem("");
      toast.success("Mensagem enviada");
      loadMensagens();
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  const getDocMessages = (docId) => mensagens.filter(m => m.docId === docId);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="h4 fw-bold" style={{ color: "#1c1917" }}>Documentos</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
          Consulte os documentos partilhados pela equipa
        </p>
      </div>

      {/* Lista de Documentos */}
      {documentos.length > 0 ? (
        <div className="kb-space-y-3">
          {documentos.map((doc) => (
            <div
              key={doc.id_documento}
              className="bg-white border shadow-sm"
              style={{ borderRadius: "0.75rem", padding: "1.25rem" }}
            >
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex" style={{ gap: "1rem" }}>
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "3rem", height: "3rem", borderRadius: "0.75rem",
                      backgroundColor: "rgba(194,65,12,0.08)"
                    }}
                  >
                    <FileText size={24} className="kb-brand" />
                  </div>
                  <div>
                    <h3 className="fw-semibold" style={{ marginBottom: "0.25rem", color: "#1c1917" }}>
                      {doc.titulo}
                    </h3>
                    <div className="small text-muted kb-space-y-1">
                      <p style={{ margin: 0 }}>Tipo: {doc.tipo_documento}</p>
                      <p style={{ margin: 0 }}>
                        Data: {doc.created_at ? new Date(doc.created_at).toLocaleDateString("pt-PT") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                {doc.ficheiro_base64 && (
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                    style={{ gap: "0.375rem" }}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                )}
              </div>

              {/* Conversa por documento */}
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e7e5e4" }}>
                <button
                  onClick={() => setSelectedDoc(selectedDoc === doc.id_documento ? null : doc.id_documento)}
                  className="d-flex align-items-center border-0 bg-transparent small fw-medium text-muted kb-hover-text-primary kb-transition"
                  style={{ gap: "0.375rem", padding: "0.25rem 0" }}
                >
                  <MessageSquare size={14} />
                  {selectedDoc === doc.id_documento ? "Ocultar conversa" : `Ver conversa (${getDocMessages(doc.id_documento).length})`}
                </button>

                {selectedDoc === doc.id_documento && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <div className="kb-space-y-2" style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "0.75rem" }}>
                      {getDocMessages(doc.id_documento).length > 0 ? (
                        getDocMessages(doc.id_documento).map((msg) => (
                          <div
                            key={msg.id_mensagem}
                            className="d-flex"
                            style={{ justifyContent: msg.remetente_id ? "flex-end" : "flex-start" }}
                          >
                            <div
                              style={{
                                maxWidth: "80%",
                                borderRadius: "0.5rem",
                                padding: "0.75rem",
                                backgroundColor: msg.remetente_id ? "rgba(194,65,12,0.08)" : "#f5f0eb"
                              }}
                            >
                              <p className="small" style={{ margin: 0, color: "#1c1917" }}>{msg.mensagem}</p>
                              <p className="small text-muted" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                                {new Date(msg.created_at).toLocaleString("pt-PT")}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="small text-muted text-center" style={{ padding: "1rem 0", margin: 0 }}>
                          Nenhuma mensagem ainda. Envie a primeira mensagem sobre este documento.
                        </p>
                      )}
                    </div>
                    <div className="d-flex" style={{ gap: "0.5rem" }}>
                      <input
                        type="text"
                        value={selectedDoc === doc.id_documento ? novaMensagem : ""}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage(doc.id_documento)}
                        placeholder="Escreva uma mensagem sobre este documento..."
                        className="form-control form-control-sm"
                      />
                      <button
                        onClick={() => handleSendMessage(doc.id_documento)}
                        disabled={!novaMensagem.trim()}
                        className="btn btn-kb-primary-sm"
                        style={{ opacity: !novaMensagem.trim() ? 0.5 : 1 }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
          <FileText className="mx-auto mb-3 opacity-50" size={48} />
          <p style={{ margin: 0 }}>Nenhum documento disponível</p>
        </div>
      )}
    </div>
  );
}
