import { useState, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";

export function DocumentConversation({ document, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (document) {
      loadMessages();
    }
  }, [document]);

  const loadMessages = () => {
    const all = JSON.parse(
      localStorage.getItem("document_conversations") || "[]",
    );
    setMessages(all.filter((m) => m.documentId === document.id));
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const all = JSON.parse(
      localStorage.getItem("document_conversations") || "[]",
    );
    const msg = {
      id: Date.now(),
      documentId: document.id,
      sender: "gestor",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    all.push(msg);
    localStorage.setItem("document_conversations", JSON.stringify(all));
    setMessages([...messages, msg]);
    setNewMessage("");
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
        style={{ borderRadius: "0.75rem", width: "100%", maxWidth: "32rem", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between border-bottom border-border" style={{ padding: "1rem" }}>
          <h3 className="fw-semibold text-foreground" style={{ margin: 0 }}>
            {document.name}
          </h3>
          <button
            onClick={onClose}
            className="border-0 bg-transparent text-muted-foreground hover-text-primary"
            style={{ padding: "0.25rem" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow-1 overflow-y-auto space-y-3" style={{ padding: "1rem", minHeight: "200px" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex ${msg.sender === "gestor" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={msg.sender === "gestor" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}
                style={{ maxWidth: "80%", borderRadius: "0.5rem", padding: "0.75rem" }}
              >
                <p className="text-sm" style={{ margin: 0 }}>{msg.content}</p>
                <p className="text-xs opacity-70" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                  {new Date(msg.timestamp).toLocaleString("pt-PT")}
                </p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
              <MessageSquare className="mx-auto mb-4 opacity-50" style={{ width: "2.5rem", height: "2.5rem" }} />
              <p style={{ margin: 0 }}>Nenhuma mensagem sobre este documento</p>
            </div>
          )}
        </div>

        <div className="border-top border-border d-flex" style={{ padding: "1rem", gap: "0.5rem" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escreva uma mensagem..."
            className="contact-input"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-primary text-primary-foreground hover-bg-accent transition-colors border-0 d-flex align-items-center justify-content-center"
            style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", opacity: !newMessage.trim() ? 0.5 : 1 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}