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
      // Save to backend (uses the current user from JWT as utilizador_id)
      await notificacaoService.criar({
        titulo: `[${clientName}] ${title}`,
        mensagem: message,
      });

      // Also keep in localStorage for client-side notification display
      const allNotifications = JSON.parse(
        localStorage.getItem("client_notifications") || "[]",
      );
      const notification = {
        id: Date.now(),
        clientId,
        type,
        title: `[${clientName}] ${title}`,
        message,
        createdAt: new Date().toISOString(),
        read: false,
      };
      allNotifications.push(notification);
      localStorage.setItem(
        "client_notifications",
        JSON.stringify(allNotifications),
      );

      toast.success(`Notificação enviada a ${clientName}`);
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
      toast.error("Erro ao enviar notificação");
    }
  };

  return (
    <div className="d-flex flex-column" style={{ gap: "0.5rem" }}>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-border focus-ring-primary"
        style={{ padding: "0.5rem", borderRadius: "0.5rem" }}
      >
        <option value="info">Informação</option>
        <option value="success">Sucesso</option>
        <option value="warning">Aviso</option>
        <option value="alert">Alerta</option>
      </select>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="contact-input"
      />
      <textarea
        placeholder="Mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="contact-input"
        style={{ resize: "none" }}
      />
      <button
        onClick={handleSend}
        className="bg-primary text-primary-foreground hover-bg-accent transition-colors d-flex align-items-center justify-content-center border-0"
        style={{ gap: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem" }}
      >
        <Send size={16} />
        Enviar Notificação
      </button>
    </div>
  );
}