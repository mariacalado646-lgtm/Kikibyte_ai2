import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { notificacaoService } from "../../services/gestorService";

export function SendNotification({ clientId, clientName }) {
  const [type, setType] = useState("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Preencha o título e a mensagem");
      return;
    }

    try {
      // Send to the client's user (backend resolves cliente_id → utilizador_id)
      await notificacaoService.criar({
        cliente_id: clientId,
        titulo: `[${clientName}] ${title}`,
        mensagem: message,
        tipo: type,
      });

      toast.success(`Notificação enviada a ${clientName}`);
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
      toast.error(err.response?.data?.error || "Erro ao enviar notificação");
    }
  };

  const notifTypes = [
    { value: "info",    label: "Informação", color: "#2563eb", bg: "#eff6ff" },
    { value: "success", label: "Sucesso",    color: "#16a34a", bg: "#dcfce7" },
    { value: "warning", label: "Aviso",      color: "#ca8a04", bg: "#fef9c3" },
    { value: "alert",   label: "Alerta",     color: "#dc2626", bg: "#fee2e2" },
  ];

  return (
    <div className="d-flex flex-column" style={{ gap: "0.5rem" }}>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ padding: "0.5rem 0.75rem", borderRadius: "0.625rem", border: "1px solid #e7e5e4", fontSize: "0.8rem", backgroundColor: "#fff", color: "#1c1917", outline: "none", cursor: "pointer" }}
      >
        {notifTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "0.5rem 0.75rem", borderRadius: "0.625rem", border: "1px solid #e7e5e4", fontSize: "0.8rem", backgroundColor: "#fff", outline: "none" }}
      />
      <textarea
        placeholder="Mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        style={{ padding: "0.5rem 0.75rem", borderRadius: "0.625rem", border: "1px solid #e7e5e4", fontSize: "0.8rem", backgroundColor: "#fff", outline: "none", resize: "none" }}
      />
      <button
        onClick={handleSend}
        className="border-0 d-flex align-items-center justify-content-center kb-transition fw-semibold"
        style={{ gap: "0.375rem", padding: "0.5rem", borderRadius: "0.625rem", fontSize: "0.8rem", backgroundColor: "var(--primary)", color: "#fff", cursor: "pointer" }}
      >
        <Send size={14} />
        Enviar
      </button>
    </div>
  );
}