import { useNavigate } from "react-router";
import { UserPlus, LogIn } from "lucide-react";
import logoImg from "../assets/logo.png";

export function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'linear-gradient(to bottom right, rgba(231, 229, 228, 0.3), var(--background), rgba(231, 229, 228, 0.5))' }}>
      <div className="w-100" style={{ maxWidth: '42rem' }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="d-inline-flex align-items-center mb-4" style={{ gap: '0.75rem' }}>
            <img src={logoImg} alt="KikiByte Logo" style={{ height: '5rem', width: '5rem' }} />
            <span className="text-4xl text-primary fw-bold">KikiByte</span>
          </div>
          <p className="text-muted-foreground text-lg">
            Bem-vindo ao Portal de Autenticação
          </p>
        </div>

        {/* Choice Cards */}
        <div className="d-grid md-grid-cols-2" style={{ gap: '1.5rem' }}>
          {/* Conta Existente */}
          <button
            onClick={() => navigate("/login/existing")}
            className="choice-card-group text-center"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div className="d-inline-flex align-items-center justify-content-center rounded-pill choice-card-icon-wrapper-primary transition-all" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgba(120, 53, 15, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <LogIn size={40} />
            </div>
            <h2 className="text-2xl fw-bold text-foreground" style={{ marginBottom: '0.75rem' }}>
              Conta Existente
            </h2>
            <p className="text-muted-foreground">
              Já tem credenciais de acesso? Faça login para aceder à sua área.
            </p>
          </button>

          {/* Conta Nova */}
          <button
            onClick={() => navigate("/login/new")}
            className="choice-card-group text-center"
            style={{ borderRadius: '1rem', padding: '2rem' }}
          >
            <div className="d-inline-flex align-items-center justify-content-center rounded-pill choice-card-icon-wrapper-accent transition-all" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgba(166, 124, 82, 0.1)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <UserPlus size={40} />
            </div>
            <h2 className="text-2xl fw-bold text-foreground" style={{ marginBottom: '0.75rem' }}>
              Conta Nova
            </h2>
            <p className="text-muted-foreground">
              Ainda não tem acesso? Solicite as suas credenciais aqui.
            </p>
          </button>
        </div>

        {/* Back to Site */}
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover-text-primary transition-colors border-0 bg-transparent"
          >
            ← Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
}
