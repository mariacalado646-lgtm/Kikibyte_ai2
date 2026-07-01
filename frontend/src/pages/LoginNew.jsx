import { useState } from "react";
import { useNavigate } from "react-router";
import { User, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";
import logoImg from "../assets/logo.png";

export function LoginNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    nif: "",
    password: "",
  });

  const handleNewClientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      toast.error(err.response?.data?.error || "Erro ao enviar pedido. Tente novamente.");
    } finally {
      setLoading(false);
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
          <p className="text-muted">Pedido de Novo Acesso</p>
        </div>

        {/* Information Banner */}
        <div className="border" style={{ backgroundColor: 'rgba(166, 124, 82, 0.1)', borderColor: 'rgba(166, 124, 82, 0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="d-flex align-items-start" style={{ gap: '0.75rem' }}>
            <div className="rounded-pill text-accent d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(166, 124, 82, 0.2)' }}>
              <User size={20} />
            </div>
            <div>
              <p className="small fw-semibold text-body" style={{ marginBottom: '0.25rem' }}>
                Novo Cliente
              </p>
              <p className="small text-muted">
                Preencha o formulário abaixo para solicitar acesso. A nossa
                equipa irá analisar o seu pedido e entrar em contacto consigo.
              </p>
            </div>
          </div>
        </div>

        {/* New Client Registration Form */}
        <form
          onSubmit={handleNewClientSubmit}
          className="bg-white kb-space-y-6"
          style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2rem' }}
        >
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
                setNewClientData({ ...newClientData, contact: e.target.value })
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
            disabled={loading}
            className="w-100 bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-inline-flex align-items-center justify-content-center fw-semibold border-0"
            style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderRadius: '0.5rem', gap: '0.5rem', opacity: loading ? 0.6 : 1 }}
          >
            <UserPlus size={20} />
            {loading ? 'A enviar...' : 'Enviar Pedido'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="small text-muted kb-hover-text-primary kb-transition-bg d-inline-flex align-items-center border-0 bg-transparent"
              style={{ gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
