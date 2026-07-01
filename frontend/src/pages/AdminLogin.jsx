import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, LogIn, User, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../services/authService";
import { api } from "../services/api";
import logoImg from "../assets/logo.png";

const REDIRECT_BY_ROLE = { 1: "/admin", 2: "/gestor", 3: "/cliente" };

export function AdminLogin() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, user } = await apiLogin(credentials.username, credentials.password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      authLogin(user);

      toast.success("Login efetuado com sucesso!");
      // redirect based on actual role from server, not the selected tab
      const path = REDIRECT_BY_ROLE[user.role_id] ?? "/";
      navigate(path);
    } catch (err) {
      const msg = err.response?.data?.error || "Credenciais inválidas.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewClientSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/pedidos-acesso", {
        nome_empresa: newClientData.name,
        pessoa_contacto: newClientData.contact,
        email: newClientData.email,
        telefone: newClientData.phone,
        nif: newClientData.nif,
        password: newClientData.password,
      });

      toast.success(
        "Pedido enviado com sucesso! Assim que for aprovado, poderá fazer login com a sua password.",
      );
      setNewClientData({
        name: "",
        contact: "",
        email: "",
        phone: "",
        nif: "",
        password: "",
      });
      setClientMode("existing");
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      toast.error(err.response?.data?.error || "Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'linear-gradient(to bottom right, rgba(231, 229, 228, 0.3), var(--background), rgba(231, 229, 228, 0.5))' }}>
      <div className="w-100" style={{ maxWidth: '28rem' }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div className="d-inline-flex align-items-center mb-4" style={{ gap: '0.75rem' }}>
            <img src={logoImg} alt="KikiByte Logo" style={{ height: '4rem', width: '4rem' }} />
            <span className="h3 text-primary fw-bold">KikiByte</span>
          </div>
          <p className="text-muted">Portal de Autenticação</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="border border-primary border-opacity-25" style={{ backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <p className="small fw-semibold text-primary" style={{ marginBottom: '0.5rem' }}>
            💡 Credenciais de Demonstração:
          </p>
          <div className="small kb-space-y-1" style={{ color: '#1e40af' }}>
            <p>
              <strong>Admin:</strong> admin@kikibyte.pt / admin123
            </p>
            <p>
              <strong>Gestor:</strong> bruno@kikibyte.pt / kikibyte2025
            </p>
            <p>
              <strong>Clientes:</strong> Utilize o email completo (ex: diana@securibank.pt) com a senha: kikibyte2025
            </p>
          </div>
        </div>

        {/* User Type Selector */}
        <div className="bg-white shadow-lg" style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="d-grid kb-grid-3" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setUserType("admin")}
              className={`kb-transition d-flex flex-column align-items-center justify-content-center ${
                userType === "admin"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover-bg-light"
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
              <span className="small">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("gestor")}
              className={`kb-transition d-flex flex-column align-items-center justify-content-center ${
                userType === "gestor"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover-bg-light"
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
              <span className="small">Gestor</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("client")}
              className={`kb-transition d-flex flex-column align-items-center justify-content-center ${
                userType === "client"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover-bg-light"
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
              <span className="small">Cliente</span>
            </button>
          </div>
        </div>

        {/* Client Mode Selector (only show for clients) */}
        {userType === "client" && (
          <div className="bg-white shadow-lg" style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '1rem', marginBottom: '1.5rem' }}>
            <div className="d-grid kb-grid-2" style={{ gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setClientMode("existing")}
                className={`kb-transition small ${
                  clientMode === "existing"
                    ? "bg-secondary text-accent-foreground shadow-sm"
                    : "text-muted hover-bg-light"
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
                className={`kb-transition small ${
                  clientMode === "new"
                    ? "bg-secondary text-accent-foreground shadow-sm"
                    : "text-muted hover-bg-light"
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
            className="bg-white kb-space-y-6"
            style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2rem' }}
          >
            <div>
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
                Email
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
                      ? "admin@kikibyte.pt"
                      : "bruno@kikibyte.pt"
                }
              />
            </div>

            <div>
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
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
              className="w-100 bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-inline-flex align-items-center justify-content-center fw-semibold"
              style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderRadius: '0.5rem', gap: '0.5rem' }}
            >
              <LogIn size={20} />
              Entrar
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="small text-muted kb-hover-text-primary kb-transition-bg border-0 bg-transparent"
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
            className="bg-white kb-space-y-6"
            style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2rem' }}
          >
            <div>
              <h3 className="fs-5 fw-semibold text-body" style={{ marginBottom: '0.5rem' }}>
                Pedido de Acesso
              </h3>
              <p className="small text-muted">
                Preencha o formulário abaixo para solicitar acesso. Após aprovação, poderá fazer login com a sua password.
              </p>
            </div>

            <div>
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
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
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
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
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
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
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
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
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
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

            <div>
              <label className="d-block small fw-medium text-body" style={{ marginBottom: '0.5rem' }}>
                Palavra-passe *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newClientData.password}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, password: e.target.value })
                }
                className="contact-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-100 bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-inline-flex align-items-center justify-content-center fw-semibold border-0"
              style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderRadius: '0.5rem', gap: '0.5rem', opacity: isLoading ? 0.6 : 1 }}
            >
              <User size={20} />
              {isLoading ? 'A enviar...' : 'Enviar Pedido'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="small text-muted kb-hover-text-primary kb-transition-bg border-0 bg-transparent"
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
