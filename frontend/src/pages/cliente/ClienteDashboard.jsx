import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileText, MessageSquare, Send, Download, LayoutDashboard, User, Clock,
  Bell, BookText, ChevronRight, LogOut, Eye, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export function ClienteDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("documentos");
  const [documentos, setDocumentos] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [mensagensDiretas, setMensagensDiretas] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [novaMsgDireta, setNovaMsgDireta] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const clienteId = user?.cliente_id;

  useEffect(() => {
    if (clienteId) {
      loadDocumentos();
      loadMensagens();
      loadNotificacoes();
      loadRelatorios();
      loadMensagensDiretas();
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

  const loadNotificacoes = async () => {
    try {
      const res = await api.get("/notificacoes");
      setNotificacoes(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  const loadRelatorios = async () => {
    try {
      const res = await api.get("/relatorios", {
        params: { cliente_id: clienteId, publicado_cliente: true }
      });
      setRelatorios(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err);
    }
  };

  const loadMensagensDiretas = async () => {
    try {
      const res = await api.get("/mensagens-diretas", { params: { cliente_id: clienteId } });
      setMensagensDiretas(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar mensagens diretas:", err);
    }
  };

  const marcarNotificacaoLida = async (id) => {
    try {
      await api.put(`/notificacoes/${id}/ler`);
      setNotificacoes(prev =>
        prev.map(n => n.id_notificacao === id ? { ...n, lida: true } : n)
      );
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
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

  const handleSendDireta = async () => {
    if (!novaMsgDireta.trim()) return;
    try {
      await api.post("/mensagens-diretas", {
        cliente_id: clienteId,
        mensagem: novaMsgDireta
      });
      setNovaMsgDireta("");
      toast.success("Mensagem enviada");
      loadMensagensDiretas();
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  const getDocMessages = (docId) => mensagens.filter(m => m.docId === docId);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

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
      <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "rgba(194,65,12,0.1)" }}
          >
            <LayoutDashboard size={24} className="kb-brand" />
          </div>
          <div>
            <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
              Área de Cliente
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
              {user?.nome || "Cliente"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/change-password")}
          className="btn btn-outline-secondary btn-sm d-flex align-items-center"
          style={{ gap: "0.375rem" }}
        >
          <LogOut size={14} />
          Alterar Password
        </button>
      </div>

      {/* Tabs */}
      <div
        className="d-inline-flex flex-wrap"
        style={{
          marginBottom: "1.5rem", gap: "0.25rem",
          backgroundColor: "rgba(231, 229, 228, 0.3)",
          padding: "0.25rem", borderRadius: "0.5rem"
        }}
      >
        {[
          { key: "documentos", icon: FileText, label: "Documentos" },
          { key: "mensagens", icon: MessageSquare, label: `Mensagens (${mensagens.length})` },
          { key: "notificacoes", icon: Bell, label: `Notificações${naoLidas > 0 ? ` (${naoLidas})` : ""}` },
          { key: "relatorios", icon: BookText, label: "Relatórios" },
          { key: "mensagens-diretas", icon: Send, label: "Chat Direto" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`d-inline-flex align-items-center kb-transition border-0 ${
              tab === key
                ? "bg-white text-body shadow-sm fw-semibold"
                : "text-muted bg-transparent"
            }`}
            style={{ padding: "0.5rem 0.85rem", borderRadius: "0.5rem", gap: "0.4rem", fontSize: "0.875rem" }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ============ TAB: DOCUMENTOS ============ */}
      {tab === "documentos" && (
        <div className="kb-space-y-3">
          {documentos.length > 0 ? (
            documentos.map((doc) => (
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

                {/* Conversation per document */}
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
            ))
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <FileText className="mx-auto mb-3 opacity-50" size={48} />
              <p style={{ margin: 0 }}>Nenhum documento disponível</p>
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: MENSAGENS ============ */}
      {tab === "mensagens" && (
        <div className="kb-space-y-3">
          {mensagens.length > 0 ? (
            mensagens.map((msg) => (
              <div
                key={msg.id_mensagem}
                className="bg-white border shadow-sm"
                style={{ borderRadius: "0.75rem", padding: "1rem" }}
              >
                <div className="d-flex align-items-start" style={{ gap: "0.75rem" }}>
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle"
                    style={{
                      width: "2.5rem", height: "2.5rem",
                      backgroundColor: msg.remetente_id ? "rgba(194,65,12,0.08)" : "#f5f0eb"
                    }}
                  >
                    <User size={18} className={msg.remetente_id ? "kb-brand" : "text-muted"} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="small">
                        {msg.remetente_id ? "Gestor" : "Sistema"}
                      </strong>
                      <small className="text-muted">
                        <Clock size={12} className="me-1" />
                        {new Date(msg.created_at).toLocaleString("pt-PT")}
                      </small>
                    </div>
                    <p className="small text-muted" style={{ margin: "0.125rem 0 0 0" }}>
                      Sobre: {msg.docTitulo}
                    </p>
                    <p className="small" style={{ margin: "0.5rem 0 0 0", color: "#1c1917" }}>
                      {msg.mensagem}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <MessageSquare className="mx-auto mb-3 opacity-50" size={48} />
              <p style={{ margin: 0 }}>Nenhuma mensagem recebida</p>
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: NOTIFICAÇÕES ============ */}
      {tab === "notificacoes" && (
        <div className="kb-space-y-3">
          {notificacoes.length > 0 ? (
            notificacoes.map((notif) => (
              <div
                key={notif.id_notificacao}
                className={`bg-white border shadow-sm d-flex align-items-start justify-content-between ${
                  !notif.lida ? "border-primary border-opacity-25" : ""
                }`}
                style={{ borderRadius: "0.75rem", padding: "1rem" }}
              >
                <div className="d-flex" style={{ gap: "0.75rem" }}>
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem",
                      backgroundColor: notif.lida ? "#f5f0eb" : "rgba(194,65,12,0.1)"
                    }}
                  >
                    <Bell size={18} className={notif.lida ? "text-muted" : "kb-brand"} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                      <strong className="small">{notif.titulo}</strong>
                      {!notif.lida && (
                        <span className="badge bg-primary" style={{ fontSize: "0.625rem" }}>Nova</span>
                      )}
                    </div>
                    <p className="small text-muted" style={{ margin: "0.25rem 0 0 0" }}>
                      {notif.mensagem}
                    </p>
                    <small className="text-muted" style={{ marginTop: "0.25rem", display: "block" }}>
                      {new Date(notif.created_at).toLocaleString("pt-PT")}
                    </small>
                  </div>
                </div>
                {!notif.lida && (
                  <button
                    onClick={() => marcarNotificacaoLida(notif.id_notificacao)}
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                    style={{ gap: "0.25rem", flexShrink: 0 }}
                    title="Marcar como lida"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <Bell className="mx-auto mb-3 opacity-50" size={48} />
              <p style={{ margin: 0 }}>Nenhuma notificação</p>
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: RELATÓRIOS ============ */}
      {tab === "relatorios" && (
        <div className="kb-space-y-3">
          {relatorios.length > 0 ? (
            relatorios.map((rel) => (
              <div
                key={rel.id_relatorio}
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
                      <BookText size={24} className="kb-brand" />
                    </div>
                    <div>
                      <h3 className="fw-semibold" style={{ marginBottom: "0.25rem", color: "#1c1917" }}>
                        {rel.titulo}
                      </h3>
                      <div className="small text-muted kb-space-y-1">
                        <p style={{ margin: 0 }}>Tipo: {rel.tipo_relatorio}</p>
                        {rel.versao && <p style={{ margin: 0 }}>Versão: {rel.versao}</p>}
                        <p style={{ margin: 0 }}>
                          Data: {rel.created_at ? new Date(rel.created_at).toLocaleDateString("pt-PT") : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {rel.ficheiro_base64 && (
                    <button
                      onClick={() => handleDownload(rel)}
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      style={{ gap: "0.375rem" }}
                      title="Download"
                    >
                      <Download size={16} />
                      <span className="d-none d-md-inline">Download</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <BookText className="mx-auto mb-3 opacity-50" size={48} />
              <p style={{ margin: 0 }}>Nenhum relatório disponível</p>
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: MENSAGENS DIRETAS (CHAT) ============ */}
      {tab === "mensagens-diretas" && (
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.25rem" }}>
          <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", color: "#1c1917", fontSize: "1rem" }}>
            <Send size={18} className="kb-brand" />
            Conversa com a Equipa
          </h3>

          <div className="kb-space-y-2" style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "1rem" }}>
            {mensagensDiretas.length > 0 ? (
              mensagensDiretas.map((msg) => (
                <div
                  key={msg.id_mensagem}
                  className="d-flex"
                  style={{ justifyContent: msg.remetente_id ? "flex-start" : "flex-end" }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      backgroundColor: msg.remetente_id ? "#f5f0eb" : "rgba(194,65,12,0.08)"
                    }}
                  >
                    {msg.remetente?.nome && (
                      <p className="small fw-semibold text-muted" style={{ marginBottom: "0.25rem" }}>
                        {msg.remetente.nome}
                      </p>
                    )}
                    <p className="small" style={{ margin: 0, color: "#1c1917" }}>{msg.mensagem}</p>
                    <p className="small text-muted" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                      {new Date(msg.created_at).toLocaleString("pt-PT")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="small text-muted text-center" style={{ padding: "2rem 0", margin: 0 }}>
                Nenhuma mensagem ainda. Envie uma mensagem para a equipa.
              </p>
            )}
          </div>

          <div className="d-flex" style={{ gap: "0.5rem" }}>
            <input
              type="text"
              value={novaMsgDireta}
              onChange={(e) => setNovaMsgDireta(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendDireta()}
              placeholder="Escreva a sua mensagem..."
              className="form-control"
            />
            <button
              onClick={handleSendDireta}
              disabled={!novaMsgDireta.trim()}
              className="btn btn-kb-primary"
              style={{ opacity: !novaMsgDireta.trim() ? 0.5 : 1, whiteSpace: "nowrap" }}
            >
              <Send size={16} className="me-1" />
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
