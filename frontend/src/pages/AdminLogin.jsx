import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, LogIn, User, UserCog } from "lucide-react";
import { toast } from "sonner";
import logoImg from "../assets/logo.png";

export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [userType, setUserType] = useState("admin");
  const [clientMode, setClientMode] = useState("existing");
  const [newClientData, setNewClientData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    nif: "",
  });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Mock authentication - in production, this would verify with backend
//     if (userType === "admin") {
//       if (
//         credentials.username === "admin" &&
//         credentials.password === "admin123"
//       ) {
//         localStorage.setItem("user_authenticated", "true");
//         localStorage.setItem("user_type", "admin");
//         localStorage.setItem("username", credentials.username);
//         toast.success("Login efetuado com sucesso!");
//         navigate("/admin");
//       } else {
//         toast.error("Credenciais inválidas. Tente admin/admin123");
//       }
//     } else if (userType === "gestor") {
//       // Check if gestor exists in localStorage
//       const gestors = JSON.parse(localStorage.getItem("gestors") || "[]");
//       const gestor = gestors.find(
//         (g) =>
//           !g.isDeleted &&
//           g.username.toLowerCase() === credentials.username.toLowerCase() &&
//           g.password === credentials.password,
//       );
//
//       if (gestor) {
//         // Update last login
//         const updatedGestors = gestors.map((g) =>
//           g.id === gestor.id
//             ? { ...g, lastLogin: new Date().toISOString().split("T")[0] }
//             : g,
//         );
//         localStorage.setItem("gestors", JSON.stringify(updatedGestors));
//
//         localStorage.setItem("user_authenticated", "true");
//         localStorage.setItem("user_type", "gestor");
//         localStorage.setItem("username", gestor.name);
//         localStorage.setItem("gestor_id", gestor.id);
//         toast.success(`Bem-vindo, ${gestor.name}!`);
//         navigate("/gestor");
//       } else {
//         toast.error(
//           "Credenciais inválidas. Por favor, contacte o administrador.",
//         );
//       }
//     } else {
//       // Check if client exists in localStorage
//       const clients = JSON.parse(localStorage.getItem("clients") || "[]");
//       const client = clients.find(
//         (c) =>
//           !c.isDeleted &&
//           c.email.toLowerCase() === credentials.username.toLowerCase() &&
//           c.password === credentials.password,
//       );
//
//       if (client) {
//         localStorage.setItem("user_authenticated", "true");
//         localStorage.setItem("user_type", "client");
//         localStorage.setItem("username", client.name);
//         localStorage.setItem("client_id", client.id);
//         toast.success(`Bem-vindo, ${client.name}!`);
//         navigate("/");
//       } else {
//         toast.error(
//           "Credenciais inválidas. Por favor, contacte-nos para criar uma conta.",
//         );
//       }
//     }
//   };

  const handleNewClientSubmit = (e) => {
    e.preventDefault();
    // Save new client request to localStorage (pending approval)
    const pendingRequests = JSON.parse(
      localStorage.getItem("pending_client_requests") || "[]",
    );
    const newRequest = {
      id: Date.now(),
      ...newClientData,
      requestDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    pendingRequests.push(newRequest);
    localStorage.setItem(
      "pending_client_requests",
      JSON.stringify(pendingRequests),
    );
    toast.success(
      "Pedido enviado com sucesso! Entraremos em contacto em breve.",
    );
    setNewClientData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      nif: "",
    });
    setClientMode("existing");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'linear-gradient(to bottom right, rgba(231, 229, 228, 0.3), var(--background), rgba(231, 229, 228, 0.5))' }}>
      <div className="w-100" style={{ maxWidth: '28rem' }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div className="d-inline-flex align-items-center mb-4" style={{ gap: '0.75rem' }}>
            <img src={logoImg} alt="KikiByte Logo" style={{ height: '4rem', width: '4rem' }} />
            <span className="text-3xl text-primary fw-bold">KikiByte</span>
          </div>
          <p className="text-muted-foreground">Portal de Autenticação</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="border border-blue-200" style={{ backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <p className="text-sm fw-semibold text-blue-900" style={{ marginBottom: '0.5rem', color: '#1e3a8a' }}>
            💡 Credenciais de Demonstração:
          </p>
          <div className="text-xs space-y-1" style={{ color: '#1e40af' }}>
            <p>
              <strong>Admin:</strong> admin / admin123
            </p>
            <p>
              <strong>Gestor Padrão:</strong> gestor / gestor123
            </p>
            <p>
              <strong>Clientes:</strong> Utilize os emails dos clientes criados
              pelo admin (senha padrão: demo123)
            </p>
          </div>
        </div>

        {/* User Type Selector */}
        <div className="bg-white shadow-xl" style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="d-grid grid-cols-3" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setUserType("admin")}
              className={`transition-all d-flex flex-column align-items-center justify-content-center ${
                userType === "admin"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover-bg-muted"
              }`}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                gap: '0.25rem',
                backgroundColor: userType === "admin" ? 'var(--primary)' : 'rgba(231, 229, 228, 0.3)'
              }}
            >
              <Lock size={18} />
              <span className="text-xs">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("gestor")}
              className={`transition-all d-flex flex-column align-items-center justify-content-center ${
                userType === "gestor"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover-bg-muted"
              }`}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                gap: '0.25rem',
                backgroundColor: userType === "gestor" ? 'var(--primary)' : 'rgba(231, 229, 228, 0.3)'
              }}
            >
              <UserCog size={18} />
              <span className="text-xs">Gestor</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("client")}
              className={`transition-all d-flex flex-column align-items-center justify-content-center ${
                userType === "client"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover-bg-muted"
              }`}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                gap: '0.25rem',
                backgroundColor: userType === "client" ? 'var(--primary)' : 'rgba(231, 229, 228, 0.3)'
              }}
            >
              <User size={18} />
              <span className="text-xs">Cliente</span>
            </button>
          </div>
        </div>

        {/* Client Mode Selector (only show for clients) */}
        {userType === "client" && (
          <div className="bg-white shadow-xl" style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '1rem', marginBottom: '1.5rem' }}>
            <div className="d-grid grid-cols-2" style={{ gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setClientMode("existing")}
                className={`transition-all text-sm ${
                  clientMode === "existing"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover-bg-muted"
                }`}
                style={{
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: clientMode === "existing" ? 'var(--accent)' : 'rgba(231, 229, 228, 0.3)'
                }}
              >
                Cliente Existente
              </button>
              <button
                type="button"
                onClick={() => setClientMode("new")}
                className={`transition-all text-sm ${
                  clientMode === "new"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover-bg-muted"
                }`}
                style={{
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: clientMode === "new" ? 'var(--accent)' : 'rgba(231, 229, 228, 0.3)'
                }}
              >
                Novo Cliente
              </button>
            </div>
          </div>
        )}

        {/* Login Form for Admin, Gestor or Existing Client */}
        {(userType === "admin" ||
          userType === "gestor" ||
          clientMode === "existing") && (
          <form
            onSubmit={handleSubmit}
            className="bg-white space-y-6"
            style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2rem' }}
          >
            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                {userType === "client" ? "Email" : "Utilizador"}
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="contact-input"
                placeholder={
                  userType === "client"
                    ? "seu@email.pt"
                    : userType === "admin"
                      ? "admin"
                      : "gestor"
                }
              />
            </div>

            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                Palavra-passe
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="contact-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-100 bg-primary text-primary-foreground hover-bg-accent transition-colors d-inline-flex align-items-center justify-content-center fw-semibold"
              style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderRadius: '0.5rem', gap: '0.5rem' }}
            >
              <LogIn size={20} />
              Entrar
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover-text-primary transition-colors border-0 bg-transparent"
              >
                ← Voltar ao site
              </button>
            </div>
          </form>
        )}

        {/* New Client Registration Form */}
        {userType === "client" && clientMode === "new" && (
          <form
            onSubmit={handleNewClientSubmit}
            className="bg-white space-y-6"
            style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2rem' }}
          >
            <div>
              <h3 className="text-lg fw-semibold text-foreground" style={{ marginBottom: '0.5rem' }}>
                Pedido de Acesso
              </h3>
              <p className="text-sm text-muted-foreground">
                Preencha o formulário abaixo. Entraremos em contacto em breve
                para criar as suas credenciais.
              </p>
            </div>

            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={newClientData.name}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, name: e.target.value })
                }
                className="contact-input"
                placeholder="Nome da sua empresa"
              />
            </div>

            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                Pessoa de Contacto *
              </label>
              <input
                type="text"
                required
                value={newClientData.contact}
                onChange={(e) =>
                  setNewClientData({
                    ...newClientData,
                    contact: e.target.value,
                  })
                }
                className="contact-input"
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                Email *
              </label>
              <input
                type="email"
                required
                value={newClientData.email}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, email: e.target.value })
                }
                className="contact-input"
                placeholder="email@empresa.pt"
              />
            </div>

            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={newClientData.phone}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, phone: e.target.value })
                }
                className="contact-input"
                placeholder="+351 912 345 678"
              />
            </div>

            <div>
              <label className="d-block text-sm fw-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
                NIF
              </label>
              <input
                type="text"
                value={newClientData.nif}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, nif: e.target.value })
                }
                className="contact-input"
                placeholder="501234567"
              />
            </div>

            <button
              type="submit"
              className="w-100 bg-primary text-primary-foreground hover-bg-accent transition-colors d-inline-flex align-items-center justify-content-center fw-semibold"
              style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderRadius: '0.5rem', gap: '0.5rem' }}
            >
              <User size={20} />
              Enviar Pedido
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover-text-primary transition-colors border-0 bg-transparent"
              >
                ← Voltar ao site
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
