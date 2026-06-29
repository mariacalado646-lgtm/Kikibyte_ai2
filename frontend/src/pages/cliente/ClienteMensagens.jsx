import { useState, useEffect } from "react";
import { MessageSquare, Send, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export function ClienteMensagens() {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState([]);
  const [mensagensDiretas, setMensagensDiretas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("documentos");
  const [novaMsgDireta, setNovaMsgDireta] = useState("");

  const clienteId = user?.cliente_id;

  useEffect(() => {
    if (clienteId) {
      loadMensagens();
      loadMensagensDiretas();
    } else {
      setLoading(false);
    }
  }, [clienteId]);

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
    } finally {
      setLoading(false);
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
        <h1 className="h4 fw-bold" style={{ color: "#1c1917" }}>Mensagens</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
          Troque mensagens com a equipa
        </p>
      </div>

      {/* Sub-tabs */}
      <div
        className="d-inline-flex flex-wrap"
        style={{
          marginBottom: "1.5rem", gap: "0.25rem",
          backgroundColor: "rgba(231, 229, 228, 0.3)",
          padding: "0.25rem", borderRadius: "0.5rem"
        }}
      >
        {[
          { key: "documentos", icon: MessageSquare, label: `Sobre Documentos (${mensagens.length})` },
          { key: "diretas", icon: Send, label: `Chat Direto (${mensagensDiretas.length})` },
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

      {/* ============ TAB: MENSAGENS SOBRE DOCUMENTOS ============ */}
      {tab === "documentos" && (
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

      {/* ============ TAB: CHAT DIRETO ============ */}
      {tab === "diretas" && (
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
