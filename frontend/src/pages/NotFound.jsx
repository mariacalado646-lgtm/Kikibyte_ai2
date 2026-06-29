import { useNavigate } from "react-router";
import { Home, AlertTriangle } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: 'linear-gradient(to bottom right, rgba(231, 229, 228, 0.3), #ffffff)' }}>
      <div className="text-center" style={{ maxWidth: '28rem' }}>
        <div className="d-inline-flex align-items-center justify-content-center rounded-pill" style={{ width: '5rem', height: '5rem', marginBottom: '1.5rem', backgroundColor: '#fee2e2' }}>
          <AlertTriangle className="kb-text-red" style={{ width: '2.5rem', height: '2.5rem' }} />
        </div>

        <h1 className="display-4 fw-bold text-body" style={{ marginBottom: '1rem' }}>404</h1>
        <h2 className="h4 fw-bold text-body" style={{ marginBottom: '1rem' }}>
          Página Não Encontrada
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          A página que procura não existe ou foi movida.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-inline-flex align-items-center"
          style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderRadius: '0.5rem', gap: '0.5rem' }}
        >
          <Home size={20} />
          Voltar à Página Inicial
        </button>
      </div>
    </div>
  );
}
