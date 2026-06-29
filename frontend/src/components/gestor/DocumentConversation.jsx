import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

export function DocumentConversation({ document, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) setCurrentUserId(user.id);
    } catch {}
  }, []);

  useEffect(() => {
    if (document) {
      loadMessages();
    }
  }, [document]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const docId = document.id_documento || document.id;
      const res = await api.get(`/documentos/${docId}/mensagens`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const docId = document.id_documento || document.id;
      const res = await api.post(`/documentos/${docId}/mensagens`, { mensagem: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        className="bg-white d-flex flex-column"
        style={{ borderRadius: "1rem", width: "100%", maxWidth: "36rem", height: "80vh", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0efee" }}>
          <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
            <MessageSquare size={20} style={{ color: "var(--primary)" }} />
            <h3 className="fw-semibold" style={{ margin: 0, fontSize: "1rem", color: "#1c1917" }}>
              {document.name || document.nome}
            </h3>
          </div>
          <button onClick={onClose} className="border-0 bg-transparent kb-hover-text-primary d-flex align-items-center justify-content-center"
            style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", color: "#a8a29e", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f0efee"; e.currentTarget.style.color = "#1c1917"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a8a29e"; }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-grow-1 overflow-y-auto" style={{ padding: "1.5rem", backgroundColor: "#fafaf9", scrollbarWidth: "thin" }}>
          {messages.length === 0 && (
            <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ padding: "3rem 1rem" }}>
              <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", backgroundColor: "#f0efee", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                <MessageSquare size={20} style={{ color: "#a8a29e" }} />
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#57534e" }}>Nenhuma mensagem sobre este documento</p>
            </div>
          )}
          <div className="kb-space-y-3">
            {messages.map((msg) => {
              const isFromGestor = currentUserId && msg.remetente_id === currentUserId;
              const time = new Date(msg.created_at || msg.timestamp);
              const timeStr = time.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={msg.id_mensagem || msg.id} className="d-flex" style={{ justifyContent: isFromGestor ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "80%" }}>
                    <div style={{
                      borderRadius: isFromGestor ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                      padding: "0.625rem 1rem",
                      backgroundColor: isFromGestor ? "var(--primary)" : "#f0efee",
                      color: isFromGestor ? "#fff" : "#1c1917",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                    }}>
                      <p className="small" style={{ margin: 0, lineHeight: 1.45 }}>{msg.mensagem || msg.content}</p>
                    </div>
                    <div className="d-flex align-items-center" style={{ gap: "0.375rem", marginTop: "0.25rem", justifyContent: isFromGestor ? "flex-end" : "flex-start" }}>
                      <span style={{ fontSize: "0.7rem", color: "#a8a29e" }}>{timeStr}</span>
                      {isFromGestor && <CheckCheck size={12} style={{ color: "#a8a29e" }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="d-flex" style={{ padding: "1rem 1.5rem", gap: "0.625rem", borderTop: "1px solid #f0efee", backgroundColor: "#fafaf9" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escreva uma mensagem..."
            style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid #e7e5e4", backgroundColor: "#fff", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }}
            onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
            onBlur={(e) => e.target.style.borderColor = "#e7e5e4"}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="border-0 d-flex align-items-center justify-content-center kb-transition"
            style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", backgroundColor: !newMessage.trim() ? "#e7e5e4" : "var(--primary)", color: !newMessage.trim() ? "#a8a29e" : "#fff", cursor: !newMessage.trim() ? "not-allowed" : "pointer" }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}