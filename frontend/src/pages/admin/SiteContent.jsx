import { useState, useEffect } from "react";
import { Save, Globe, Target, Eye, Award, FileText } from "lucide-react";
import { toast } from "sonner";
import { siteContentService, adminEmpresaService } from "../../services/adminservice";

export function SiteContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    id_empresa: null,
    nome: "KikiByte",
    descricao: "",
    missao: "",
    visao: "",
    valores: "",
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await siteContentService.obter();
      if (!data.id_empresa) {
        // Nenhuma empresa na BD — criar uma automaticamente
        const nova = await adminEmpresaService.criar({ nome: "KikiByte" });
        setContent((prev) => ({ ...prev, id_empresa: nova.id_empresa, nome: nova.nome }));
      } else {
        setContent((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Erro ao carregar conteúdo:", err);
      toast.error("Erro ao carregar conteúdo do site");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.id_empresa) {
      toast.error("Nenhum registo de empresa encontrado. Crie uma empresa primeiro.");
      return;
    }
    setSaving(true);
    try {
      await siteContentService.atualizar(content.id_empresa, {
        missao: content.missao,
        visao: content.visao,
        valores: content.valores,
        descricao: content.descricao,
        nome: content.nome,
      });
      toast.success("Conteúdo do site atualizado com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao guardar");
    } finally {
      setSaving(false);
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
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "rgba(194,65,12,0.1)" }}
          >
            <Globe size={24} className="kb-brand" />
          </div>
          <div>
            <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
              Conteúdo do Site
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
              Gerir conteúdos da página inicial institucional
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-kb-primary d-flex align-items-center" style={{ gap: "0.5rem" }}>
          <Save size={18} />
          {saving ? "A guardar..." : "Guardar Alterações"}
        </button>
      </div>

      {/* Form */}
      <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
        <div className="kb-space-y-6">
          {/* Empresa Info */}
          <div>
            <h2 className="h6 fw-bold" style={{ marginBottom: "0.75rem", color: "#1c1917" }}>
              Informação da Empresa
            </h2>
            <div className="mb-3">
              <label className="form-label small fw-medium">Nome da Empresa</label>
              <input
                type="text"
                value={content.nome}
                onChange={(e) => setContent({ ...content, nome: e.target.value })}
                className="form-control kb-input"
                placeholder="KikiByte"
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-medium">Descrição (slogan/secção hero)</label>
              <textarea
                value={content.descricao}
                onChange={(e) => setContent({ ...content, descricao: e.target.value })}
                className="form-control kb-input"
                rows={3}
                placeholder="Descrição da empresa exibida na página inicial"
              />
            </div>
          </div>

          <hr />

          {/* Missão */}
          <div>
            <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Target size={20} className="kb-brand" />
              <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Missão</h2>
            </div>
            <textarea
              value={content.missao}
              onChange={(e) => setContent({ ...content, missao: e.target.value })}
              className="form-control kb-input"
              rows={4}
              placeholder="Descreva a missão da empresa..."
            />
          </div>

          {/* Visão */}
          <div>
            <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Eye size={20} className="kb-brand" />
              <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Visão</h2>
            </div>
            <textarea
              value={content.visao}
              onChange={(e) => setContent({ ...content, visao: e.target.value })}
              className="form-control kb-input"
              rows={4}
              placeholder="Descreva a visão da empresa..."
            />
          </div>

          {/* Valores */}
          <div>
            <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Award size={20} className="kb-brand" />
              <h2 className="h6 fw-bold" style={{ margin: 0, color: "#1c1917" }}>Valores</h2>
            </div>
            <textarea
              value={content.valores}
              onChange={(e) => setContent({ ...content, valores: e.target.value })}
              className="form-control kb-input"
              rows={4}
              placeholder="Descreva os valores da empresa..."
            />
          </div>

          <hr />

          <div className="small text-muted">
            <FileText size={14} style={{ marginRight: "0.375rem" }} />
            As secções <strong>About (Missão/Visão/Valores)</strong> e <strong>Hero</strong> da página inicial serão atualizadas dinamicamente com este conteúdo.
          </div>
        </div>
      </div>
    </div>
  );
}
