import { useState, useEffect } from "react";
import { ClipboardList, Plus, Send, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ESTADO_BADGE = {
  pendente:  { label: "Pendente",  class: "bg-warning text-dark" },
  em_andamento: { label: "Em Andamento", class: "bg-primary text-white" },
  resolvido: { label: "Resolvido", class: "bg-success text-white" },
  fechado:   { label: "Fechado",   class: "bg-secondary text-white" },
  cancelado: { label: "Cancelado", class: "bg-danger text-white" },
};

export function ClientePedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: "", descricao: "", prioridade: "normal" });

  const clienteId = user?.cliente_id;

  useEffect(() => {
    if (clienteId) loadPedidos();
    else setLoading(false);
  }, [clienteId]);

  const loadPedidos = async () => {
    try {
      const res = await api.get("/pedidos", { params: { cliente_id: clienteId } });
      setPedidos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    try {
      await api.post("/pedidos", {
        cliente_id: clienteId,
        titulo: formData.titulo,
        descricao: formData.descricao,
        prioridade: formData.prioridade,
      });
      toast.success("Pedido criado com sucesso!");
      setFormData({ titulo: "", descricao: "", prioridade: "normal" });
      setShowForm(false);
      loadPedidos();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar pedido");
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "rgba(194,65,12,0.1)" }}
          >
            <ClipboardList size={24} className="kb-brand" />
          </div>
          <div>
            <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
              Os Meus Pedidos
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
              Crie e acompanhe os seus pedidos
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-kb-primary d-flex align-items-center"
          style={{ gap: "0.5rem" }}
        >
          <Plus size={18} />
          {showForm ? "Cancelar" : "Novo Pedido"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border shadow-sm"
          style={{ borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}
        >
          <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", fontSize: "1rem", color: "#1c1917" }}>
            <Plus size={18} className="kb-brand" />
            Novo Pedido
          </h3>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-medium">Título *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Pedido de documentação adicional"
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-medium">Descrição</label>
              <textarea
                className="form-control"
                rows={4}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o seu pedido em detalhe..."
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Prioridade</label>
              <select
                className="form-select"
                value={formData.prioridade}
                onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
              >
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-kb-primary d-flex align-items-center" style={{ gap: "0.5rem" }}>
                <Send size={16} />
                Submeter Pedido
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Pedidos List */}
      {pedidos.length > 0 ? (
        <div className="kb-space-y-3">
          {pedidos.map((pedido) => {
            const estado = ESTADO_BADGE[pedido.estado] || ESTADO_BADGE.pendente;
            return (
              <div
                key={pedido.id_pedido}
                className="bg-white border shadow-sm"
                style={{ borderRadius: "0.75rem", padding: "1.25rem" }}
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex" style={{ gap: "1rem" }}>
                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "3rem", height: "3rem", borderRadius: "0.75rem",
                        backgroundColor: "rgba(194,65,12,0.08)"
                      }}
                    >
                      <FileText size={24} className="kb-brand" />
                    </div>
                    <div>
                      <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "0.25rem" }}>
                        <h3 className="fw-semibold" style={{ margin: 0, color: "#1c1917", fontSize: "1rem" }}>
                          {pedido.titulo}
                        </h3>
                        <span className={`badge ${estado.class}`} style={{ fontSize: "0.75rem" }}>
                          {estado.label}
                        </span>
                      </div>
                      {pedido.descricao && (
                        <p className="small text-muted" style={{ margin: "0.25rem 0", whiteSpace: "pre-wrap" }}>
                          {pedido.descricao}
                        </p>
                      )}
                      <div className="d-flex align-items-center small text-muted" style={{ gap: "1rem", marginTop: "0.5rem" }}>
                        <span className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
                          <Clock size={12} />
                          {new Date(pedido.data_criacao).toLocaleDateString("pt-PT")}
                        </span>
                        <span className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
                          Prioridade: {pedido.prioridade || "normal"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted" style={{ padding: "4rem 0" }}>
          <ClipboardList className="mx-auto mb-3 opacity-50" size={64} />
          <h5 style={{ color: "#78716c" }}>Nenhum pedido ainda</h5>
          <p style={{ margin: "0.5rem 0" }}>Clique em "Novo Pedido" para criar o primeiro.</p>
        </div>
      )}
    </div>
  );
}
