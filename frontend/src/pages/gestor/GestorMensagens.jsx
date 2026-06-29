import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, Bell, CheckCheck, Info, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { SendNotification } from "../../components/gestor/SendNotification";
import { clienteService, notificacaoService, mensagemDiretaService } from "../../services/gestorService";

function getInitials(name) {
  return name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

function getNotifIcon(type) {
  switch (type) {
    case "success": return CheckCircle2;
    case "warning": return AlertTriangle;
    case "alert":   return AlertCircle;
    default:        return Info;
  }
}

const NOTIF_BG = { info: "#eff6ff", success: "#dcfce7", warning: "#fef9c3", alert: "#fee2e2" };
const NOTIF_COLOR = { info: "#2563eb", success: "#16a34a", warning: "#ca8a04", alert: "#dc2626" };

export function GestorMensagens() {
  const [viewMode, setViewMode] = useState("messages");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [isLg, setIsLg] = useState(window.innerWidth >= 1024);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) setCurrentUserId(user.id);
      if (user?.nome) setCurrentUserName(user.nome);
    } catch {}
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const loadMessages = async (clientId) => {
    try {
      const data = await mensagemDiretaService.listarPorCliente(clientId);
      setMessages(data);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClient) return;
    try {
      const msg = await mensagemDiretaService.enviar({
        cliente_id: selectedClient.id_cliente,
        mensagem: newMessage.trim(),
      });
      setMessages([...messages, msg]);
      setNewMessage("");
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f4" }}>
      {/* Header */}
      <div style={{ padding: "1.5rem 2rem 1rem" }}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="h4 fw-bold" style={{ color: "#1c1917", margin: 0 }}>
              {viewMode === "messages" ? "Mensagens" : "Notificações"}
            </h1>
            <p className="small" style={{ color: "#57534e", margin: "0.25rem 0 0" }}>
              {viewMode === "messages"
                ? "Converse com os seus clientes"
                : "Envie notificações aos seus clientes"}
            </p>
          </div>
          {/* Mode Toggle */}
          <div className="d-inline-flex" style={{ gap: "0.25rem", backgroundColor: "#e7e5e4", padding: "0.25rem", borderRadius: "0.75rem" }}>
            <button onClick={() => setViewMode("messages")}
              className="border-0 d-inline-flex align-items-center kb-transition"
              style={{ gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: viewMode === "messages" ? 600 : 400, backgroundColor: viewMode === "messages" ? "#fff" : "transparent", color: viewMode === "messages" ? "#1c1917" : "#78716c", boxShadow: viewMode === "messages" ? "0 1px 3px rgba(0,0,0,0.08)" : "none", cursor: "pointer" }}>
              <MessageSquare size={16} /> Mensagens
            </button>
            <button onClick={() => setViewMode("notifications")}
              className="border-0 d-inline-flex align-items-center kb-transition"
              style={{ gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: viewMode === "notifications" ? 600 : 400, backgroundColor: viewMode === "notifications" ? "#fff" : "transparent", color: viewMode === "notifications" ? "#1c1917" : "#78716c", boxShadow: viewMode === "notifications" ? "0 1px 3px rgba(0,0,0,0.08)" : "none", cursor: "pointer" }}>
              <Bell size={16} /> Notificações
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-grow-1" style={{ padding: "0 2rem 2rem", overflow: "hidden" }}>
        <div className="d-grid" style={{ gap: "1.5rem", height: "100%", gridTemplateColumns: isLg ? "repeat(12, 1fr)" : "1fr" }}>
          {/* Clients Sidebar */}
          <div className="bg-white d-flex flex-column" style={{ gridColumn: isLg ? "span 4" : "span 12", borderRadius: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid #f0efee" }}>
              <h2 className="fw-semibold" style={{ fontSize: "0.95rem", color: "#1c1917", margin: 0 }}>Clientes</h2>
              <p className="small" style={{ color: "#a8a29e", margin: "0.25rem 0 0" }}>{clients.length} cliente{clients.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="overflow-y-auto flex-grow-1" style={{ scrollbarWidth: "thin" }}>
              {clients.map((client) => (
                <button key={client.id_cliente} onClick={() => setSelectedClient(client)}
                  className="w-100 text-start border-0 kb-transition"
                  style={{ padding: "0.875rem 1.25rem", backgroundColor: selectedClient?.id_cliente === client.id_cliente ? "rgba(120, 53, 15, 0.08)" : "transparent", borderBottom: "1px solid #f5f5f4", cursor: "pointer" }}>
                  <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-semibold"
                      style={{ width: "2.5rem", height: "2.5rem", fontSize: "0.8rem", backgroundColor: selectedClient?.id_cliente === client.id_cliente ? "var(--primary)" : "#e7e5e4", color: selectedClient?.id_cliente === client.id_cliente ? "#fff" : "#57534e" }}>
                      {getInitials(client.nome)}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <p className="fw-semibold text-truncate" style={{ margin: 0, fontSize: "0.9rem", color: "#1c1917" }}>{client.nome}</p>
                      <p className="small text-muted text-truncate" style={{ margin: "0.125rem 0 0" }}>{client.email}</p>
                    </div>
                  </div>
                </button>
              ))}
              {clients.length === 0 && (
                <div className="text-center text-muted" style={{ padding: "3rem 1rem" }}>
                  <User size={40} className="mb-2 opacity-30" />
                  <p className="small" style={{ margin: 0 }}>Nenhum cliente disponível</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat / Notifications Panel */}
          <div className="bg-white d-flex flex-column" style={{ gridColumn: isLg ? "span 8" : "span 12", borderRadius: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            {selectedClient ? (
              <>
                {/* Panel Header */}
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0efee", backgroundColor: "#fafaf9" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                        style={{ width: "2.75rem", height: "2.75rem", fontSize: "0.9rem", backgroundColor: "var(--primary)", color: "#fff" }}>
                        {getInitials(selectedClient.nome)}
                      </div>
                      <div>
                        <h3 className="fw-semibold" style={{ fontSize: "1rem", color: "#1c1917", margin: 0 }}>{selectedClient.nome}</h3>
                        <p className="small" style={{ color: "#a8a29e", margin: "0.125rem 0 0" }}>{selectedClient.email}</p>
                      </div>
                    </div>
                    {viewMode === "notifications" && (
                      <div style={{ width: "14rem" }}>
                        <SendNotification clientId={selectedClient.id_cliente} clientName={selectedClient.nome} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Scrollable Content */}
                <div ref={chatContainerRef} className="flex-grow-1 overflow-y-auto" style={{ padding: "1.5rem", scrollbarWidth: "thin", backgroundColor: "#fafaf9" }}>
                  {viewMode === "messages" ? (
                    <>
                      {messages.length === 0 && (
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ padding: "4rem 1rem" }}>
                          <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "#f0efee", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                            <MessageSquare size={24} style={{ color: "#a8a29e" }} />
                          </div>
                          <p className="fw-semibold" style={{ color: "#57534e", margin: 0, fontSize: "0.95rem" }}>Nenhuma mensagem ainda</p>
                          <p className="small" style={{ color: "#a8a29e", margin: "0.25rem 0 0" }}>Envie a primeira mensagem para iniciar a conversa</p>
                        </div>
                      )}
                      <div className="kb-space-y-3">
                        {messages.map((msg) => {
                          const isGestor = msg.remetente_id === currentUserId;
                          const remetenteNome = msg.remetente?.nome || (isGestor ? currentUserName || "Você" : selectedClient.nome);
                          const time = new Date(msg.created_at || msg.timestamp);
                          const timeStr = time.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "2-digit" }) === new Date().toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "2-digit" })
                            ? time.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
                            : time.toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
                          return (
                            <div key={msg.id_mensagem || msg.id} className="d-flex" style={{ justifyContent: isGestor ? "flex-end" : "flex-start" }}>
                              {!isGestor && (
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-semibold"
                                  style={{ width: "2rem", height: "2rem", fontSize: "0.7rem", marginRight: "0.5rem", marginTop: "0.25rem", backgroundColor: "#e7e5e4", color: "#57534e" }}>
                                  {getInitials(remetenteNome)}
                                </div>
                              )}
                              <div style={{ maxWidth: "70%" }}>
                                <div style={{
                                  borderRadius: isGestor ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                                  padding: "0.625rem 1rem",
                                  backgroundColor: isGestor ? "var(--primary)" : "#f0efee",
                                  color: isGestor ? "#fff" : "#1c1917",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                                }}>
                                  <p className="small" style={{ margin: 0, lineHeight: 1.45 }}>{msg.mensagem || msg.content}</p>
                                </div>
                                <div className="d-flex align-items-center" style={{ gap: "0.375rem", marginTop: "0.25rem", justifyContent: isGestor ? "flex-end" : "flex-start" }}>
                                  <span style={{ fontSize: "0.7rem", color: "#a8a29e" }}>{timeStr}</span>
                                  {isGestor && <CheckCheck size={12} style={{ color: "#a8a29e" }} />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <>
                      {notifications.length === 0 && (
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ padding: "4rem 1rem" }}>
                          <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "#f0efee", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                            <Bell size={24} style={{ color: "#a8a29e" }} />
                          </div>
                          <p className="fw-semibold" style={{ color: "#57534e", margin: 0, fontSize: "0.95rem" }}>Nenhuma notificação</p>
                          <p className="small" style={{ color: "#a8a29e", margin: "0.25rem 0 0" }}>As notificações enviadas aparecerão aqui</p>
                        </div>
                      )}
                      <div className="kb-space-y-3">
                        {notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((n) => {
                          const Icon = getNotifIcon(n.tipo);
                          return (
                            <div key={n.id_notificacao} style={{ borderRadius: "1rem", padding: "1rem 1.25rem", border: "1px solid #f0efee", backgroundColor: "#fff" }}>
                              <div className="d-flex align-items-start" style={{ gap: "0.875rem" }}>
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: "2.5rem", height: "2.5rem", backgroundColor: NOTIF_BG[n.tipo] || NOTIF_BG.info }}>
                                  <Icon size={18} style={{ color: NOTIF_COLOR[n.tipo] || NOTIF_COLOR.info }} />
                                </div>
                                <div className="flex-grow-1 min-w-0">
                                  <div className="d-flex align-items-start justify-content-between" style={{ marginBottom: "0.25rem" }}>
                                    <h4 className="small fw-semibold text-truncate" style={{ color: "#1c1917", margin: 0 }}>{n.titulo}</h4>
                                    <span className="small rounded-pill flex-shrink-0 ms-2" style={{ padding: "0.125rem 0.5rem", fontSize: "0.7rem", backgroundColor: n.lida ? "#f5f5f4" : "rgba(120,53,15,0.1)", color: n.lida ? "#a8a29e" : "var(--primary)" }}>
                                      {n.lida ? "Lida" : "Nova"}
                                    </span>
                                  </div>
                                  <p className="small" style={{ color: "#57534e", margin: "0 0 0.375rem", lineHeight: 1.4 }}>{n.mensagem}</p>
                                  <span style={{ fontSize: "0.7rem", color: "#a8a29e" }}>{new Date(n.created_at).toLocaleString("pt-PT")}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Message Input */}
                {viewMode === "messages" && (
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f0efee", backgroundColor: "#fafaf9" }}>
                    <div className="d-flex" style={{ gap: "0.625rem" }}>
                      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Escreva a sua mensagem..."
                        style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid #e7e5e4", backgroundColor: "#fff", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#e7e5e4"} />
                      <button onClick={handleSendMessage} disabled={!newMessage.trim()}
                        className="border-0 d-flex align-items-center justify-content-center kb-transition"
                        style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", backgroundColor: !newMessage.trim() ? "#e7e5e4" : "var(--primary)", color: !newMessage.trim() ? "#a8a29e" : "#fff", cursor: !newMessage.trim() ? "not-allowed" : "pointer" }}>
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <div style={{ width: "4.5rem", height: "4.5rem", borderRadius: "50%", backgroundColor: "#f0efee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <MessageSquare size={28} style={{ color: "#a8a29e" }} />
                  </div>
                  <p className="fw-semibold" style={{ color: "#57534e", margin: 0, fontSize: "0.95rem" }}>Selecione um cliente</p>
                  <p className="small" style={{ color: "#a8a29e", margin: "0.25rem 0 0" }}>Escolha um cliente da lista ao lado para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
