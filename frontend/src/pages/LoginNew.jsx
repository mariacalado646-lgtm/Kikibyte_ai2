import { useState } from "react";
import { useNavigate } from "react-router";
import { User, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import logoImg from "../assets/logo.png";

export function LoginNew() {
  const navigate = useNavigate();
  const [newClientData, setNewClientData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    nif: "",
  });

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

    // Reset form and navigate back
    setNewClientData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      nif: "",
    });

    // Show success message and redirect after a moment
    setTimeout(() => {
      navigate("/login");
    }, 2000);
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
          <p className="text-muted-foreground">Pedido de Novo Acesso</p>
        </div>

        {/* Information Banner */}
        <div className="border" style={{ backgroundColor: 'rgba(166, 124, 82, 0.1)', borderColor: 'rgba(166, 124, 82, 0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="d-flex align-items-start" style={{ gap: '0.75rem' }}>
            <div className="rounded-pill text-accent d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(166, 124, 82, 0.2)' }}>
              <User size={20} />
            </div>
            <div>
              <p className="text-sm fw-semibold text-foreground" style={{ marginBottom: '0.25rem' }}>
                Novo Cliente
              </p>
              <p className="text-xs text-muted-foreground">
                Preencha o formulário abaixo para solicitar acesso. A nossa
                equipa irá analisar o seu pedido e entrar em contacto consigo.
              </p>
            </div>
          </div>
        </div>

        {/* New Client Registration Form */}
        <form
          onSubmit={handleNewClientSubmit}
          className="bg-white space-y-6"
          style={{ borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2rem' }}
        >
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
                setNewClientData({ ...newClientData, contact: e.target.value })
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
            <UserPlus size={20} />
            Enviar Pedido
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-muted-foreground hover-text-primary transition-colors d-inline-flex align-items-center border-0 bg-transparent"
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
