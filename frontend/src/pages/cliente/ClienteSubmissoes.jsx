import { useState, useEffect } from "react";
import { Upload, Server, AlertOctagon, FileText, Shield, Archive, Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SUB_TABS = [
  { key: "ativos",      icon: Server,       label: "Ativos Tecnológicos" },
  { key: "incidentes",  icon: AlertOctagon,  label: "Incidentes" },
  { key: "documentos",  icon: FileText,      label: "Documentação" },
  { key: "pentests",    icon: Shield,        label: "Pen Tests" },
  { key: "outros",      icon: Archive,       label: "Outras Evidências" },
];

export function ClienteSubmissoes() {
  const { user } = useAuth();
  const [tab, setTab] = useState("ativos");
  const [loading, setLoading] = useState(true);
  const clienteId = user?.cliente_id;

  // Ativos
  const [ativos, setAtivos] = useState([]);
  const [showAtivoForm, setShowAtivoForm] = useState(false);
  const [novoAtivo, setNovoAtivo] = useState({ nome: "", tipo: "", descricao: "", quantidade: 1 });

  // Incidentes
  const [incidentes, setIncidentes] = useState([]);
  const [showIncForm, setShowIncForm] = useState(false);
  const [novoIncidente, setNovoIncidente] = useState({ titulo: "", descricao: "", gravidade: "media", data_ocorrencia: "", impacto: "", medidas: "" });

  // Documentos
  const [documentos, setDocumentos] = useState([]);
  const [showDocForm, setShowDocForm] = useState(false);
  const [novoDoc, setNovoDoc] = useState({ titulo: "", tipo_documento: "documentacao", ficheiro: null });
  const [uploading, setUploading] = useState(false);

  // Pen Tests
  const [penTests, setPenTests] = useState([]);
  const [showPenForm, setShowPenForm] = useState(false);
  const [novoPenTest, setNovoPenTest] = useState({ titulo: "", tipo: "externo", descricao: "", resultado: "", ficheiro: null });

  // Outros
  const [outrosDocs, setOutrosDocs] = useState([]);
  const [showOutroForm, setShowOutroForm] = useState(false);
  const [novoOutro, setNovoOutro] = useState({ titulo: "", descricao: "", ficheiro: null });

  useEffect(() => {
    if (clienteId) { loadAll(); }
    else setLoading(false);
  }, [clienteId]);

  const loadAll = async () => {
    try {
      await Promise.all([loadAtivos(), loadIncidentes(), loadDocumentos(), loadPenTests(), loadOutros()]);
    } finally {
      setLoading(false);
    }
  };

  const loadAtivos = async () => {
    try {
      const res = await api.get("/ativos-tecnologicos", { params: { cliente_id: clienteId } });
      setAtivos(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadIncidentes = async () => {
    try {
      const res = await api.get("/incidentes", { params: { cliente_id: clienteId } });
      setIncidentes(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadDocumentos = async () => {
    try {
      const res = await api.get("/documentos", { params: { cliente_id: clienteId } });
      setDocumentos(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadPenTests = async () => {
    try {
      const res = await api.get("/pen-tests", { params: { cliente_id: clienteId } });
      setPenTests(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadOutros = async () => {
    try {
      const res = await api.get("/documentos", { params: { cliente_id: clienteId, tipo_documento: "outros" } });
      setOutrosDocs(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (endpoint, id, loadFn) => {
    if (!confirm("Tem a certeza que deseja eliminar?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success("Eliminado com sucesso");
      loadFn();
    } catch (err) {
      toast.error("Erro ao eliminar");
    }
  };

  const handleFileSelect = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (err) => reject(err);
  });

  const handleSubmitAtivo = async (e) => {
    e.preventDefault();
    try {
      await api.post("/ativos-tecnologicos", { ...novoAtivo, cliente_id: clienteId });
      toast.success("Ativo registado com sucesso!");
      setShowAtivoForm(false);
      setNovoAtivo({ nome: "", tipo: "", descricao: "", quantidade: 1 });
      loadAtivos();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao registar ativo");
    }
  };

  const handleSubmitIncidente = async (e) => {
    e.preventDefault();
    try {
      await api.post("/incidentes", {
        ...novoIncidente,
        cliente_id: clienteId,
        data_comunicacao: novoIncidente.data_ocorrencia
      });
      toast.success("Incidente registado com sucesso!");
      setShowIncForm(false);
      setNovoIncidente({ titulo: "", descricao: "", gravidade: "media", data_ocorrencia: "", impacto: "", medidas: "" });
      loadIncidentes();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao registar incidente");
    }
  };

  const handleUploadDoc = async (e, tipo) => {
    e.preventDefault();
    if (!novoDoc.ficheiro && tipo !== "doc") return;

    try {
      setUploading(true);
      let ficheiro_base64 = null;
      let mime_type = null;
      if (novoDoc.ficheiro) {
        ficheiro_base64 = await toBase64(novoDoc.ficheiro);
        mime_type = novoDoc.ficheiro.type;
      }

      await api.post("/documentos", {
        cliente_id: clienteId,
        titulo: novoDoc.titulo,
        tipo_documento: tipo === "doc" ? novoDoc.tipo_documento : "outros",
        ficheiro_base64,
        mime_type,
      });
      toast.success("Documento enviado com sucesso!");
      setShowDocForm(false);
      setNovoDoc({ titulo: "", tipo_documento: "documentacao", ficheiro: null });
      if (tipo === "doc") loadDocumentos();
      else loadOutros();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao enviar documento");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitPenTest = async (e) => {
    e.preventDefault();
    try {
      let ficheiro_base64 = null;
      let mime_type = null;
      if (novoPenTest.ficheiro) {
        ficheiro_base64 = await toBase64(novoPenTest.ficheiro);
        mime_type = novoPenTest.ficheiro.type;
      }

      await api.post("/pen-tests", {
        ...novoPenTest,
        cliente_id: clienteId,
        ficheiro_base64,
        mime_type,
      });
      toast.success("Pen Test registado com sucesso!");
      setShowPenForm(false);
      setNovoPenTest({ titulo: "", tipo: "externo", descricao: "", resultado: "", ficheiro: null });
      loadPenTests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao registar pen test");
    }
  };

  const handleDownload = (item) => {
    if (item.ficheiro_base64) {
      const link = document.createElement("a");
      link.href = `data:${item.mime_type || "application/octet-stream"};base64,${item.ficheiro_base64}`;
      link.download = item.titulo || "ficheiro";
      link.click();
    } else {
      toast.info("Sem ficheiro disponível");
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
      <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "rgba(194,65,12,0.1)" }}
        >
          <Upload size={24} className="kb-brand" />
        </div>
        <div>
          <h1 className="h4 fw-bold" style={{ marginBottom: "0.125rem", color: "#1c1917" }}>
            Submissões
          </h1>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>
            Registe e submeta documentação, ativos, incidentes e mais
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div
        className="d-inline-flex flex-wrap"
        style={{
          marginBottom: "1.5rem", gap: "0.25rem",
          backgroundColor: "rgba(231, 229, 228, 0.3)",
          padding: "0.25rem", borderRadius: "0.5rem"
        }}
      >
        {SUB_TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`d-inline-flex align-items-center kb-transition border-0 ${
              tab === key
                ? "bg-white text-body shadow-sm fw-semibold"
                : "text-muted bg-transparent"
            }`}
            style={{ padding: "0.5rem 0.85rem", borderRadius: "0.5rem", gap: "0.4rem", fontSize: "0.875rem" }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ============ ATIVOS TECNOLÓGICOS ============ */}
      {tab === "ativos" && (
        <div>
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={() => setShowAtivoForm(!showAtivoForm)}
              className="btn btn-kb-primary d-flex align-items-center"
              style={{ gap: "0.5rem" }}
            >
              <Plus size={16} />
              {showAtivoForm ? "Cancelar" : "Novo Ativo"}
            </button>
          </div>

          {showAtivoForm && (
            <form onSubmit={handleSubmitAtivo} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", fontSize: "1rem", color: "#1c1917" }}>
                <Server size={18} className="kb-brand" />
                Registar Ativo Tecnológico
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Nome *</label>
                  <input type="text" className="form-control" required value={novoAtivo.nome} onChange={(e) => setNovoAtivo({...novoAtivo, nome: e.target.value})} placeholder="Ex: Servidor Web" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-medium">Tipo</label>
                  <select className="form-select" value={novoAtivo.tipo} onChange={(e) => setNovoAtivo({...novoAtivo, tipo: e.target.value})}>
                    <option value="">Selecionar...</option>
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="rede">Rede</option>
                    <option value="dados">Dados</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-medium">Quantidade</label>
                  <input type="number" className="form-control" min="1" value={novoAtivo.quantidade} onChange={(e) => setNovoAtivo({...novoAtivo, quantidade: parseInt(e.target.value) || 1})} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Descrição</label>
                  <textarea className="form-control" rows={3} value={novoAtivo.descricao} onChange={(e) => setNovoAtivo({...novoAtivo, descricao: e.target.value})} placeholder="Descreva o ativo..." />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-kb-primary">Registar</button>
                </div>
              </div>
            </form>
          )}

          {ativos.length > 0 ? (
            <div className="kb-space-y-2">
              {ativos.map((a) => (
                <div key={a.id_ativo} className="bg-white border shadow-sm d-flex align-items-center justify-content-between" style={{ borderRadius: "0.75rem", padding: "1rem" }}>
                  <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
                    <Server size={20} className="kb-brand" />
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{a.nome}</strong>
                      <div className="small text-muted">
                        {a.tipo && <span className="me-2">Tipo: {a.tipo}</span>}
                        {a.quantidade && <span>Qtd: {a.quantidade}</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete("/ativos-tecnologicos", a.id_ativo, loadAtivos)} className="btn btn-sm btn-outline-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <Server className="mx-auto mb-3 opacity-50" size={48} />
              <p>Nenhum ativo registado</p>
            </div>
          )}
        </div>
      )}

      {/* ============ INCIDENTES ============ */}
      {tab === "incidentes" && (
        <div>
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={() => setShowIncForm(!showIncForm)}
              className="btn btn-kb-primary d-flex align-items-center"
              style={{ gap: "0.5rem" }}
            >
              <Plus size={16} />
              {showIncForm ? "Cancelar" : "Reportar Incidente"}
            </button>
          </div>

          {showIncForm && (
            <form onSubmit={handleSubmitIncidente} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", fontSize: "1rem", color: "#1c1917" }}>
                <AlertOctagon size={18} className="kb-brand" />
                Reportar Incidente de Segurança
              </h3>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-medium">Título *</label>
                  <input type="text" className="form-control" required value={novoIncidente.titulo} onChange={(e) => setNovoIncidente({...novoIncidente, titulo: e.target.value})} placeholder="Ex: Ataque de phishing detetado" />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-medium">Gravidade</label>
                  <select className="form-select" value={novoIncidente.gravidade} onChange={(e) => setNovoIncidente({...novoIncidente, gravidade: e.target.value})}>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-medium">Data Ocorrência</label>
                  <input type="date" className="form-control" value={novoIncidente.data_ocorrencia} onChange={(e) => setNovoIncidente({...novoIncidente, data_ocorrencia: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Descrição *</label>
                  <textarea className="form-control" rows={4} required value={novoIncidente.descricao} onChange={(e) => setNovoIncidente({...novoIncidente, descricao: e.target.value})} placeholder="Descreva o incidente em detalhe..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Impacto</label>
                  <textarea className="form-control" rows={3} value={novoIncidente.impacto} onChange={(e) => setNovoIncidente({...novoIncidente, impacto: e.target.value})} placeholder="Impacto do incidente..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Medidas Tomadas</label>
                  <textarea className="form-control" rows={3} value={novoIncidente.medidas} onChange={(e) => setNovoIncidente({...novoIncidente, medidas: e.target.value})} placeholder="Medidas de mitigação..." />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-kb-primary">Registar Incidente</button>
                </div>
              </div>
            </form>
          )}

          {incidentes.length > 0 ? (
            <div className="kb-space-y-2">
              {incidentes.map((inc) => {
                const gravColor = inc.gravidade === "critica" ? "#dc3545" : inc.gravidade === "alta" ? "#fd7e14" : inc.gravidade === "media" ? "#ffc107" : "#6c757d";
                return (
                  <div key={inc.id_incidente} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1rem" }}>
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex" style={{ gap: "1rem" }}>
                        <AlertOctagon size={20} style={{ color: gravColor, flexShrink: 0, marginTop: "0.125rem" }} />
                        <div>
                          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>{inc.titulo}</strong>
                            <span className={`badge`} style={{ backgroundColor: gravColor, fontSize: "0.7rem" }}>{inc.gravidade}</span>
                          </div>
                          <p className="small text-muted mt-1 mb-0">{inc.descricao}</p>
                          <div className="small text-muted mt-1">
                            {inc.data_ocorrencia && <span className="me-3">Data: {new Date(inc.data_ocorrencia).toLocaleDateString("pt-PT")}</span>}
                            {inc.estado && <span>Estado: {inc.estado}</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleDelete("/incidentes", inc.id_incidente, loadIncidentes)} className="btn btn-sm btn-outline-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <AlertOctagon className="mx-auto mb-3 opacity-50" size={48} />
              <p>Nenhum incidente reportado</p>
            </div>
          )}
        </div>
      )}

      {/* ============ DOCUMENTAÇÃO ============ */}
      {tab === "documentos" && (
        <div>
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={() => setShowDocForm(!showDocForm)}
              className="btn btn-kb-primary d-flex align-items-center"
              style={{ gap: "0.5rem" }}
            >
              <Plus size={16} />
              {showDocForm ? "Cancelar" : "Carregar Documento"}
            </button>
          </div>

          {showDocForm && (
            <form onSubmit={(e) => handleUploadDoc(e, "doc")} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", fontSize: "1rem", color: "#1c1917" }}>
                <FileText size={18} className="kb-brand" />
                Carregar Documentação
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Título *</label>
                  <input type="text" className="form-control" required value={novoDoc.titulo} onChange={(e) => setNovoDoc({...novoDoc, titulo: e.target.value})} placeholder="Ex: Política de Segurança" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-medium">Tipo</label>
                  <select className="form-select" value={novoDoc.tipo_documento} onChange={(e) => setNovoDoc({...novoDoc, tipo_documento: e.target.value})}>
                    <option value="documentacao">Documentação Interna</option>
                    <option value="relatorio">Relatório</option>
                    <option value="contrato">Contrato</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-medium">Ficheiro</label>
                  <input type="file" className="form-control" onChange={(e) => handleFileSelect(e, (f) => setNovoDoc({...novoDoc, ficheiro: f}))} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-kb-primary" disabled={uploading}>
                    {uploading ? "A carregar..." : "Carregar Documento"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {documentos.filter(d => d.tipo_documento !== "outros").length > 0 ? (
            <div className="kb-space-y-2">
              {documentos.filter(d => d.tipo_documento !== "outros").map((doc) => (
                <div key={doc.id_documento} className="bg-white border shadow-sm d-flex align-items-center justify-content-between" style={{ borderRadius: "0.75rem", padding: "1rem" }}>
                  <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
                    <FileText size={20} className="kb-brand" />
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{doc.titulo}</strong>
                      <div className="small text-muted">
                        <span className="me-3">Tipo: {doc.tipo_documento}</span>
                        {doc.created_at && <span>{new Date(doc.created_at).toLocaleDateString("pt-PT")}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex" style={{ gap: "0.5rem" }}>
                    {doc.ficheiro_base64 && (
                      <button onClick={() => handleDownload(doc)} className="btn btn-sm btn-outline-secondary" title="Download">
                        <Download size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete("/documentos", doc.id_documento, loadDocumentos)} className="btn btn-sm btn-outline-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <FileText className="mx-auto mb-3 opacity-50" size={48} />
              <p>Nenhum documento carregado</p>
            </div>
          )}
        </div>
      )}

      {/* ============ PEN TESTS ============ */}
      {tab === "pentests" && (
        <div>
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={() => setShowPenForm(!showPenForm)}
              className="btn btn-kb-primary d-flex align-items-center"
              style={{ gap: "0.5rem" }}
            >
              <Plus size={16} />
              {showPenForm ? "Cancelar" : "Novo Pen Test"}
            </button>
          </div>

          {showPenForm && (
            <form onSubmit={handleSubmitPenTest} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", fontSize: "1rem", color: "#1c1917" }}>
                <Shield size={18} className="kb-brand" />
                Registar Pen Test
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Título *</label>
                  <input type="text" className="form-control" required value={novoPenTest.titulo} onChange={(e) => setNovoPenTest({...novoPenTest, titulo: e.target.value})} placeholder="Ex: Teste de penetração rede interna" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-medium">Tipo</label>
                  <select className="form-select" value={novoPenTest.tipo} onChange={(e) => setNovoPenTest({...novoPenTest, tipo: e.target.value})}>
                    <option value="externo">Externo</option>
                    <option value="interno">Interno</option>
                    <option value="web">Web App</option>
                    <option value="wireless">Wireless</option>
                    <option value="social">Eng. Social</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-medium">Resultado</label>
                  <select className="form-select" value={novoPenTest.resultado} onChange={(e) => setNovoPenTest({...novoPenTest, resultado: e.target.value})}>
                    <option value="">Selecionar...</option>
                    <option value="concluido">Concluído</option>
                    <option value="em_curso">Em Curso</option>
                    <option value="agendado">Agendado</option>
                    <option value="nao_realizado">Não Realizado</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Descrição</label>
                  <textarea className="form-control" rows={3} value={novoPenTest.descricao} onChange={(e) => setNovoPenTest({...novoPenTest, descricao: e.target.value})} placeholder="Descrição do teste..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Ficheiro (opcional)</label>
                  <input type="file" className="form-control" onChange={(e) => handleFileSelect(e, (f) => setNovoPenTest({...novoPenTest, ficheiro: f}))} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-kb-primary">Registar Pen Test</button>
                </div>
              </div>
            </form>
          )}

          {penTests.length > 0 ? (
            <div className="kb-space-y-2">
              {penTests.map((pt) => (
                <div key={pt.id_pen_test} className="bg-white border shadow-sm d-flex align-items-center justify-content-between" style={{ borderRadius: "0.75rem", padding: "1rem" }}>
                  <div className="d-flex" style={{ gap: "1rem" }}>
                    <Shield size={20} className="kb-brand" style={{ flexShrink: 0, marginTop: "0.125rem" }} />
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{pt.titulo}</strong>
                      <div className="small text-muted">
                        {pt.tipo && <span className="me-3">Tipo: {pt.tipo}</span>}
                        {pt.resultado && <span>Resultado: {pt.resultado}</span>}
                      </div>
                      {pt.descricao && <p className="small text-muted mt-1 mb-0">{pt.descricao}</p>}
                    </div>
                  </div>
                  <div className="d-flex" style={{ gap: "0.5rem" }}>
                    {pt.ficheiro_base64 && (
                      <button onClick={() => handleDownload(pt)} className="btn btn-sm btn-outline-secondary" title="Download">
                        <Download size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete("/pen-tests", pt.id_pen_test, loadPenTests)} className="btn btn-sm btn-outline-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <Shield className="mx-auto mb-3 opacity-50" size={48} />
              <p>Nenhum pen test registado</p>
            </div>
          )}
        </div>
      )}

      {/* ============ OUTROS ============ */}
      {tab === "outros" && (
        <div>
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={() => setShowOutroForm(!showOutroForm)}
              className="btn btn-kb-primary d-flex align-items-center"
              style={{ gap: "0.5rem" }}
            >
              <Plus size={16} />
              {showOutroForm ? "Cancelar" : "Nova Evidência"}
            </button>
          </div>

          {showOutroForm && (
            <form onSubmit={(e) => handleUploadDoc(e, "outro")} className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 className="fw-semibold d-flex align-items-center" style={{ marginBottom: "1rem", gap: "0.5rem", fontSize: "1rem", color: "#1c1917" }}>
                <Archive size={18} className="kb-brand" />
                Carregar Outra Evidência
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Título *</label>
                  <input type="text" className="form-control" required value={novoOutro.titulo} onChange={(e) => setNovoOutro({...novoOutro, titulo: e.target.value})} placeholder="Ex: Evidência de conformidade" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Ficheiro</label>
                  <input type="file" className="form-control" onChange={(e) => handleFileSelect(e, (f) => setNovoOutro({...novoOutro, ficheiro: f}))} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Descrição</label>
                  <textarea className="form-control" rows={3} value={novoOutro.descricao} onChange={(e) => setNovoOutro({...novoOutro, descricao: e.target.value})} placeholder="Descrição..." />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-kb-primary" disabled={uploading}>
                    {uploading ? "A carregar..." : "Carregar Evidência"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {outrosDocs.length > 0 ? (
            <div className="kb-space-y-2">
              {outrosDocs.map((doc) => (
                <div key={doc.id_documento} className="bg-white border shadow-sm d-flex align-items-center justify-content-between" style={{ borderRadius: "0.75rem", padding: "1rem" }}>
                  <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
                    <Archive size={20} className="kb-brand" />
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>{doc.titulo}</strong>
                      <div className="small text-muted">{doc.created_at && new Date(doc.created_at).toLocaleDateString("pt-PT")}</div>
                    </div>
                  </div>
                  <div className="d-flex" style={{ gap: "0.5rem" }}>
                    {doc.ficheiro_base64 && (
                      <button onClick={() => handleDownload(doc)} className="btn btn-sm btn-outline-secondary" title="Download">
                        <Download size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete("/documentos", doc.id_documento, loadOutros)} className="btn btn-sm btn-outline-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
              <Archive className="mx-auto mb-3 opacity-50" size={48} />
              <p>Nenhuma evidência carregada</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
