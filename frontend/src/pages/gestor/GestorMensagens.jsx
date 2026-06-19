import { useState, useEffect } from "react";
import { MessageSquare, Send, User, Bell } from "lucide-react";
import { toast } from "sonner";
import { SendNotification } from "../../components/gestor/SendNotification";
import { clienteService, notificacaoService } from "../../services/gestorService";

export function GestorMensagens() {
  const [viewMode, setViewMode] = useState("messages");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLg, setIsLg] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    loadClients();
    loadNotifications();
    const handleResize = () => setIsLg(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadMessages(selectedClient.id_cliente);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      const data = await clienteService.listar({ ativo: true });
      setClients(data);
      if (data.length > 0 && !selectedClient) {
        setSelectedClient(data[0]);
      }
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await notificacaoService.listar();
      setNotifications(data);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  const loadMessages = (clientId) => {
    // Messages are per pedido in the backend; for now keep localStorage
    // This will be improved when direct messaging API is added
    const allMessages = JSON.parse(
      localStorage.getItem("client_messages") || "[]",
    );
    const clientMessages = allMessages.filter((m) => m.clientId === clientId);
    setMessages(clientMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;

    const allMessages = JSON.parse(
      localStorage.getItem("client_messages") || "[]",
    );
    const message = {
      id: Date.now(),
      clientId: selectedClient.id_cliente,
      sender: "gestor",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    allMessages.push(message);
    localStorage.setItem("client_messages", JSON.stringify(allMessages));
    setMessages([...messages, message]);
    setNewMessage("");
    toast.success("Mensagem enviada");
  };

  const getNotificationTypeStyle = (type) => {
    switch (type) {
      case "success":
        return { backgroundColor: "#dcfce7", color: "#16a34a" };
      case "warning":
        return { backgroundColor: "#fef9c3", color: "#ca8a04" };
      case "alert":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      default:
        return { backgroundColor: "#eff6ff", color: "#2563eb" };
    }
  };

  return (
    <div style={{ padding: "2rem", height: "calc(100vh - 4rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>
          Comunicação com Clientes
        </h1>
        <p className="text-muted-foreground">
          Envie mensagens e notificações aos seus clientes
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="d-inline-flex" style={{ marginBottom: "1.5rem", gap: "0.5rem", backgroundColor: "rgba(231, 229, 228, 0.3)", padding: "0.25rem", borderRadius: "0.5rem" }}>
        <button
          onClick={() => setViewMode("messages")}
          className={`d-inline-flex align-items-center transition-all border-0 ${
            viewMode === "messages"
              ? "bg-white text-foreground shadow-sm fw-semibold"
              : "text-muted-foreground hover-text-primary bg-transparent"
          }`}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            borderRadius: "0.5rem",
            gap: "0.5rem",
          }}
        >
          <MessageSquare size={18} />
          Mensagens
        </button>
        <button
          onClick={() => setViewMode("notifications")}
          className={`d-inline-flex align-items-center transition-all border-0 ${
            viewMode === "notifications"
              ? "bg-white text-foreground shadow-sm fw-semibold"
              : "text-muted-foreground hover-text-primary bg-transparent"
          }`}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            borderRadius: "0.5rem",
            gap: "0.5rem",
          }}
        >
          <Bell size={18} />
          Notificações
        </button>
      </div>

      <div className="d-grid" style={{ gap: "1.5rem", height: "calc(100% - 8rem)", gridTemplateColumns: isLg ? "repeat(12, 1fr)" : "1fr" }}>
        {/* Clients List */}
        <div className="bg-white border border-border overflow-hidden" style={{ gridColumn: isLg ? "span 4" : "span 12", borderRadius: "0.75rem" }}>
          <div className="border-bottom border-border" style={{ padding: "1rem" }}>
            <h2 className="fw-semibold text-foreground" style={{ margin: 0 }}>Clientes</h2>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
            {clients.map((client) => (
              <button
                key={client.id_cliente}
                onClick={() => setSelectedClient(client)}
                className="w-100 text-start hover-bg-muted transition-colors border-bottom border-border"
                style={{
                  padding: "1rem",
                  backgroundColor: selectedClient?.id_cliente === client.id_cliente ? "rgba(120, 53, 15, 0.1)" : "transparent",
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(120, 53, 15, 0.2)", width: "2.5rem", height: "2.5rem", flexShrink: 0 }}>
                    <User size={20} className="text-primary" />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <p className="fw-semibold text-foreground text-truncate" style={{ margin: 0 }}>
                      {client.nome}
                    </p>
                    <p className="text-sm text-muted-foreground text-truncate" style={{ margin: 0 }}>
                      {client.email}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {clients.length === 0 && (
              <div className="text-center text-muted-foreground" style={{ padding: "2rem" }}>
                <User className="mx-auto mb-2 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                <p style={{ margin: 0 }}>Nenhum cliente disponível</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages/Notifications Area */}
        <div
          className="bg-white border border-border d-flex flex-column"
          style={{ gridColumn: isLg ? "span 8" : "span 12", borderRadius: "0.75rem" }}
        >
          {selectedClient ? (
            <>
              {/* Header */}
              <div className="border-bottom border-border" style={{ padding: "1rem" }}>
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <h2 className="fw-semibold text-foreground" style={{ margin: 0 }}>
                      {selectedClient.nome}
                    </h2>
                    <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
                      {selectedClient.email}
                    </p>
                  </div>
                  {viewMode === "notifications" && (
                    <div style={{ width: "12rem" }}>
                      <SendNotification
                        clientId={selectedClient.id_cliente}
                        clientName={selectedClient.nome}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow-1 space-y-4" style={{ padding: "1rem", overflowY: "auto", maxHeight: "450px" }}>
                {viewMode === "messages" ? (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`d-flex ${msg.sender === "gestor" ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div
                          className={`${
                            msg.sender === "gestor"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                          style={{ maxWidth: "70%", borderRadius: "0.5rem", padding: "0.75rem" }}
                        >
                          <p className="text-sm" style={{ margin: 0 }}>{msg.content}</p>
                          <p className="text-xs opacity-70" style={{ marginTop: "0.25rem", marginBottom: 0 }}>
                            {new Date(msg.timestamp).toLocaleString("pt-PT")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
                        <MessageSquare className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                        <p style={{ margin: 0 }}>Nenhuma mensagem ainda</p>
                        <p className="text-sm" style={{ margin: 0 }}>
                          Inicie a conversa enviando uma mensagem
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {notifications
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime(),
                      )
                      .map((notification) => (
                        <div
                          key={notification.id_notificacao}
                          className="border border-border tr-hover transition-colors"
                          style={{ borderRadius: "0.5rem", padding: "1rem" }}
                        >
                          <div className="d-flex align-items-start" style={{ gap: "0.75rem" }}>
                            <div
                              className="rounded-lg flex-shrink-0"
                              style={{ ...getNotificationTypeStyle(notification.tipo || "info"), padding: "0.5rem", marginTop: "0.25rem" }}
                            >
                              <Bell size={16} />
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-start justify-content-between" style={{ marginBottom: "0.25rem" }}>
                                <h4 className="text-sm fw-semibold text-foreground" style={{ margin: 0 }}>
                                  {notification.titulo}
                                </h4>
                                <span
                                  className="text-xs rounded-pill"
                                  style={{
                                    paddingLeft: "0.5rem",
                                    paddingRight: "0.5rem",
                                    paddingTop: "0.25rem",
                                    paddingBottom: "0.25rem",
                                    backgroundColor: notification.lida ? "#f3f4f6" : "rgba(120, 53, 15, 0.1)",
                                    color: notification.lida ? "#4b5563" : "var(--primary)",
                                  }}
                                >
                                  {notification.lida ? "Lida" : "Não lida"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground" style={{ marginBottom: "0.5rem" }}>
                                {notification.mensagem}
                              </p>
                              <p className="text-xs text-muted-foreground" style={{ margin: 0 }}>
                                {new Date(
                                  notification.created_at,
                                ).toLocaleString("pt-PT")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {notifications.length === 0 && (
                      <div className="text-center text-muted-foreground" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
                        <Bell className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                        <p style={{ margin: 0 }}>Nenhuma notificação enviada</p>
                        <p className="text-sm" style={{ margin: 0 }}>
                          Clique em "Enviar Notificação" para começar
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Input (only for messages) */}
              {viewMode === "messages" && (
                <div className="border-top border-border" style={{ padding: "1rem" }}>
                  <div className="d-flex" style={{ gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Escreva a sua mensagem..."
                      className="contact-input"
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary text-primary-foreground hover-bg-accent transition-colors d-flex align-items-center border-0"
                      style={{
                        paddingLeft: "1.5rem",
                        paddingRight: "1.5rem",
                        paddingTop: "0.75rem",
                        paddingBottom: "0.75rem",
                        borderRadius: "0.5rem",
                        gap: "0.5rem",
                        opacity: !newMessage.trim() ? 0.5 : 1,
                        cursor: !newMessage.trim() ? "not-allowed" : "pointer"
                      }}
                    >
                      <Send size={18} />
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 opacity-50" style={{ width: "4rem", height: "4rem" }} />
                <p style={{ margin: 0 }}>Selecione um cliente para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
