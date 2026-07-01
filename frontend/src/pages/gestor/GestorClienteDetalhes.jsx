import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Server,
  AlertOctagon,
  FileText,
  Shield,
  Archive,
  ClipboardList,
  Plus,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { clienteService } from "../../services/gestorService";
import { SendNotification } from "../../components/gestor/SendNotification";

export function GestorClienteDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [activeTab, setActiveTab] = useState("geral");

  // Ativos Tecnológicos
  const [ativos, setAtivos] = useState([]);
  const [showAtivoForm, setShowAtivoForm] = useState(false);
  const [novoAtivo, setNovoAtivo] = useState({ nome: "", tipo: "", descricao: "", quantidade: 1 });

  // Incidentes
  const [incidentes, setIncidentes] = useState([]);
  const [showIncidenteForm, setShowIncidenteForm] = useState(false);
  const [novoIncidente, setNovoIncidente] = useState({ titulo: "", descricao: "", gravidade: "media", data_ocorrencia: "" });

  // Documentos
  const [documentos, setDocumentos] = useState([]);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [novoDoc, setNovoDoc] = useState({ titulo: "", tipo_documento: "", ficheiro: null });

  // Pen Tests
  const [penTests, setPenTests] = useState([]);
  const [showPenTestForm, setShowPenTestForm] = useState(false);
  const [novoPenTest, setNovoPenTest] = useState({ titulo: "", tipo: "", descricao: "", resultado: "", ficheiro: null });

  // Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [processingPedido, setProcessingPedido] = useState(null);

  // Outros
  const [notas, setNotas] = useState("");

  useEffect(() => {
    loadClient();
  }, [id, navigate]);

  const loadClient = async () => {
    try {
      const data = await clienteService.obter(id);
      if (!data) {
        toast.error("Cliente não encontrado");
        navigate("/gestor/clientes");
      } else {
        setClient(data);
        setNotas(data.notes || "");
        loadAtivos();
        loadIncidentes();
        loadDocumentos();
        loadPenTests();
        loadPedidos();
      }
    } catch (err) {
      console.error("Erro ao carregar cliente:", err);
      toast.error("Erro ao carregar dados do cliente");
      navigate("/gestor/clientes");
    }
  };

  // ── Ativos Tecnológicos ──
  const loadAtivos = async () => {
    try {
      const res = await api.get("/ativos-tecnologicos", { params: { cliente_id: id } });
      setAtivos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar ativos:", err);
    }
  };

  const handleAddAtivo = async (e) => {
    e.preventDefault();
    try {
      await api.post("/ativos-tecnologicos", { cliente_id: Number(id), ...novoAtivo });
      toast.success("Ativo adicionado");
      setShowAtivoForm(false);
      setNovoAtivo({ nome: "", tipo: "", descricao: "", quantidade: 1 });
      loadAtivos();
    } catch (err) {
      toast.error("Erro ao adicionar ativo");
    }
  };

  const handleRemoveAtivo = async (ativoId) => {
    try {
      await api.delete(`/ativos-tecnologicos/${ativoId}`);
      toast.success("Ativo removido");
      loadAtivos();
    } catch (err) {
      toast.error("Erro ao remover ativo");
    }
  };

  // ── Incidentes ──
  const loadIncidentes = async () => {
    try {
      const res = await api.get("/incidentes", { params: { cliente_id: id } });
      setIncidentes(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar incidentes:", err);
    }
  };

  const handleAddIncidente = async (e) => {
    e.preventDefault();
    try {
      await api.post("/incidentes", {
        cliente_id: Number(id),
        ...novoIncidente,
        data_ocorrencia: novoIncidente.data_ocorrencia || undefined
      });
      toast.success("Incidente registado");
      setShowIncidenteForm(false);
      setNovoIncidente({ titulo: "", descricao: "", gravidade: "media", data_ocorrencia: "" });
      loadIncidentes();
    } catch (err) {
      toast.error("Erro ao registar incidente");
    }
  };

  const handleFecharIncidente = async (incidenteId) => {
    try {
      await api.put(`/incidentes/${incidenteId}`, { estado: "resolvido" });
      toast.success("Incidente fechado");
      loadIncidentes();
    } catch (err) {
      toast.error("Erro ao fechar incidente");
    }
  };

  // ── Documentos ──
  const loadDocumentos = async () => {
    try {
      const res = await api.get("/documentos", { params: { cliente_id: id } });
      setDocumentos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!novoDoc.ficheiro) {
      toast.error("Selecione um ficheiro");
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        await api.post("/documentos", {
          cliente_id: Number(id),
          titulo: novoDoc.titulo,
          tipo_documento: novoDoc.tipo_documento,
          ficheiro_base64: base64,
          mime_type: novoDoc.ficheiro.type,
        });
        toast.success("Documento enviado");
        setShowDocUpload(false);
        setNovoDoc({ titulo: "", tipo_documento: "", ficheiro: null });
        loadDocumentos();
      };
      reader.readAsDataURL(novoDoc.ficheiro);
    } catch (err) {
      toast.error("Erro ao fazer upload");
    }
  };

  const handleDownload = async (doc) => {
    try {
      // listing excludes ficheiro_base64, so fetch the full record
      const res = await api.get(`/documentos/${doc.id_documento}`);
      const full = res.data;
      if (full.ficheiro_base64) {
        const link = document.createElement("a");
        link.href = `data:${full.mime_type || "application/octet-stream"};base64,${full.ficheiro_base64}`;
        link.download = full.titulo || "documento";
        link.click();
      }
    } catch (err) {
      toast.error("Erro ao descarregar documento");
    }
  };

  // ── Pen Tests ──
  const loadPenTests = async () => {
    try {
      const res = await api.get("/pen-tests", { params: { cliente_id: id } });
      setPenTests(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pen tests:", err);
    }
  };

  const handleAddPenTest = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        cliente_id: Number(id),
        titulo: novoPenTest.titulo,
        tipo: novoPenTest.tipo,
        descricao: novoPenTest.descricao,
        resultado: novoPenTest.resultado,
      };

      if (novoPenTest.ficheiro) {
        const reader = new FileReader();
        reader.onload = async () => {
          payload.ficheiro_base64 = reader.result.split(",")[1];
          payload.mime_type = novoPenTest.ficheiro.type;
          await api.post("/pen-tests", payload);
          toast.success("Pen test registado");
          setShowPenTestForm(false);
          setNovoPenTest({ titulo: "", tipo: "", descricao: "", resultado: "", ficheiro: null });
          loadPenTests();
        };
        reader.readAsDataURL(novoPenTest.ficheiro);
      } else {
        await api.post("/pen-tests", payload);
        toast.success("Pen test registado");
        setShowPenTestForm(false);
        setNovoPenTest({ titulo: "", tipo: "", descricao: "", resultado: "", ficheiro: null });
        loadPenTests();
      }
    } catch (err) {
      toast.error("Erro ao registar pen test");
    }
  };

  // ── Pedidos ──
  const loadPedidos = async () => {
    try {
      const res = await api.get("/pedidos", { params: { cliente_id: id } });
      setPedidos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
  };

  const handlePedidoStatus = async (pedidoId, novoEstado) => {
    setProcessingPedido(pedidoId);
    try {
      await api.put(`/pedidos/${pedidoId}`, { estado: novoEstado });
      toast.success(`Pedido ${novoEstado === 'em_andamento' ? 'em andamento' : novoEstado} com sucesso!`);
      loadPedidos();
    } catch (err) {
      toast.error("Erro ao atualizar pedido");
    } finally {
      setProcessingPedido(null);
    }
  };

  // ── Notas ──
  const handleSaveNotas = async () => {
    try {
      await api.put(`/clientes/${id}`, { notes: notas });
      toast.success("Notas guardadas");
    } catch (err) {
      toast.error("Erro ao guardar notas");
    }
  };

  if (!client) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-screen" style={{ padding: "2rem" }}>
        <p className="text-muted">A carregar...</p>
      </div>
    );
  }

  const tabs = [
    { id: "geral", label: "Dados Gerais", icon: User },
    { id: "risco", label: "Avaliação de Risco", icon: AlertTriangle },
    { id: "ativos", label: `Ativos (${ativos.length})`, icon: Server },
    { id: "incidentes", label: `Incidentes (${incidentes.length})`, icon: AlertOctagon },
    { id: "pedidos", label: `Pedidos (${pedidos.length})`, icon: ClipboardList },
    { id: "documentacao", label: `Docs (${documentos.length})`, icon: FileText },
    { id: "pentests", label: `Pen Tests (${penTests.length})`, icon: Shield },
    { id: "outros", label: "Outros", icon: Archive },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => navigate("/gestor/clientes")}
          className="d-flex align-items-center text-muted border-0 bg-transparent kb-hover-text-primary"
          style={{ gap: "0.5rem", marginBottom: "1rem", transition: "color 0.15s" }}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="d-flex flex-column md-flex-row align-items-md-start justify-content-md-between" style={{ gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <h1 className="h3 fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
              {client.nome}
            </h1>
            <p className="text-muted" style={{ margin: 0 }}>{client.email}</p>
          </div>
          <div style={{ width: "100%", maxWidth: "16rem" }}>
            <SendNotification clientId={client.id_cliente} clientName={client.nome} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto" style={{ marginBottom: "1.5rem" }}>
        <div className="d-flex border-bottom border" style={{ gap: "0.5rem", minWidth: "max-content" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`d-flex align-items-center text-nowrap kb-transition-bg bg-transparent border-0 ${
                  activeTab === tab.id
                    ? "text-primary fw-semibold"
                    : "text-muted kb-hover-text-primary"
                }`}
                style={{
                  gap: "0.5rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
        {activeTab === "geral" && (
          <div className="kb-space-y-6">
            <h2 className="h5 fw-semibold text-body" style={{ marginBottom: "1rem" }}>
              Informação Geral
            </h2>
            <div className="d-grid md-kb-grid-2" style={{ gap: "1.5rem" }}>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Nome da Empresa</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.nome}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Email</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.email}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Telefone</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.telefone}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>NIF</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.nif || "N/A"}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Morada</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.morada || "N/A"}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Sector</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.setor || "N/A"}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Pessoa de Contacto</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.contactPerson || "N/A"}</p>
              </div>
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>Código Postal</label>
                <p className="text-body" style={{ marginTop: "0.25rem", marginBottom: 0 }}>{client.postalCode || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "risco" && (
          <div className="kb-space-y-6">
            <h2 className="h5 fw-semibold text-body" style={{ marginBottom: "1rem" }}>
              Avaliação de Risco
            </h2>
            <div className="d-grid md-kb-grid-3" style={{ gap: "1.5rem" }}>
              <div className="border rounded-lg" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", padding: "1rem" }}>
                <p className="small fw-medium kb-text-red-dark" style={{ marginBottom: "0.5rem" }}>Nível de Risco</p>
                <p className="h4 fw-bold kb-text-red" style={{ margin: 0 }}>{client.estado_conformidade || "Médio"}</p>
              </div>
              <div className="border rounded-lg" style={{ backgroundColor: "#fff7ed", borderColor: "#fed7aa", padding: "1rem" }}>
                <p className="small fw-medium" style={{ color: "#c2410c", marginBottom: "0.5rem" }}>Vulnerabilidades</p>
                <p className="h4 fw-bold" style={{ color: "#ea580c", margin: 0 }}>{client.vulnerabilities || "3"}</p>
              </div>
              <div className="border rounded-lg" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", padding: "1rem" }}>
                <p className="small fw-medium" style={{ color: "#15803d", marginBottom: "0.5rem" }}>Conformidade</p>
                <p className="h4 fw-bold" style={{ color: "#16a34a", margin: 0 }}>{client.compliance || "85%"}</p>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <h3 className="fw-semibold text-body" style={{ marginBottom: "0.75rem" }}>Observações</h3>
              <p className="text-muted" style={{ margin: 0 }}>{client.riskNotes || "Nenhuma observação de risco registada."}</p>
            </div>
          </div>
        )}

        {activeTab === "ativos" && (
          <div className="kb-space-y-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-semibold text-body" style={{ margin: 0 }}>Ativos Tecnológicos</h2>
              <button
                onClick={() => setShowAtivoForm(!showAtivoForm)}
                className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg border-0 d-flex align-items-center"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.375rem" }}
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>

            {showAtivoForm && (
              <form onSubmit={handleAddAtivo} className="border rounded" style={{ padding: "1rem", backgroundColor: "#fafaf9" }}>
                <div className="d-grid md-kb-grid-2" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input required placeholder="Nome do ativo" value={novoAtivo.nome} onChange={e => setNovoAtivo({...novoAtivo, nome: e.target.value})} className="form-control form-control-sm" />
                  <input placeholder="Tipo (ex: Servidor, Router)" value={novoAtivo.tipo} onChange={e => setNovoAtivo({...novoAtivo, tipo: e.target.value})} className="form-control form-control-sm" />
                  <input placeholder="Quantidade" type="number" min="1" value={novoAtivo.quantidade} onChange={e => setNovoAtivo({...novoAtivo, quantidade: Number(e.target.value)})} className="form-control form-control-sm" />
                </div>
                <textarea placeholder="Descrição (opcional)" value={novoAtivo.descricao} onChange={e => setNovoAtivo({...novoAtivo, descricao: e.target.value})} className="form-control form-control-sm" style={{ marginBottom: "0.75rem" }} rows={2} />
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button type="submit" className="btn btn-kb-primary-sm">Guardar</button>
                  <button type="button" onClick={() => setShowAtivoForm(false)} className="btn btn-sm btn-outline-secondary">Cancelar</button>
                </div>
              </form>
            )}

            {ativos.length > 0 ? (
              <div className="kb-space-y-2">
                {ativos.map(ativo => (
                  <div key={ativo.id_ativo} className="d-flex align-items-center justify-content-between border rounded" style={{ padding: "0.75rem 1rem" }}>
                    <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                      <Server size={18} className="text-muted" />
                      <div>
                        <p className="small fw-semibold" style={{ margin: 0 }}>{ativo.nome}</p>
                        <p className="small text-muted" style={{ margin: 0 }}>
                          {ativo.tipo && `${ativo.tipo} — `}Qtd: {ativo.quantidade}
                          {ativo.descricao && ` — ${ativo.descricao}`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveAtivo(ativo.id_ativo)} className="btn btn-sm btn-outline-danger" title="Remover">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
                <Server className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                <p style={{ margin: 0 }}>Nenhum ativo tecnológico registado</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "incidentes" && (
          <div className="kb-space-y-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-semibold text-body" style={{ margin: 0 }}>Incidentes de Segurança</h2>
              <button
                onClick={() => setShowIncidenteForm(!showIncidenteForm)}
                className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg border-0 d-flex align-items-center"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.375rem" }}
              >
                <Plus size={16} />
                Registar
              </button>
            </div>

            {showIncidenteForm && (
              <form onSubmit={handleAddIncidente} className="border rounded" style={{ padding: "1rem", backgroundColor: "#fafaf9" }}>
                <div className="d-grid md-kb-grid-2" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input required placeholder="Título do incidente" value={novoIncidente.titulo} onChange={e => setNovoIncidente({...novoIncidente, titulo: e.target.value})} className="form-control form-control-sm" />
                  <select value={novoIncidente.gravidade} onChange={e => setNovoIncidente({...novoIncidente, gravidade: e.target.value})} className="form-control form-control-sm">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                  <input type="date" value={novoIncidente.data_ocorrencia} onChange={e => setNovoIncidente({...novoIncidente, data_ocorrencia: e.target.value})} className="form-control form-control-sm" />
                </div>
                <textarea placeholder="Descrição" value={novoIncidente.descricao} onChange={e => setNovoIncidente({...novoIncidente, descricao: e.target.value})} className="form-control form-control-sm" style={{ marginBottom: "0.75rem" }} rows={2} />
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button type="submit" className="btn btn-kb-primary-sm">Guardar</button>
                  <button type="button" onClick={() => setShowIncidenteForm(false)} className="btn btn-sm btn-outline-secondary">Cancelar</button>
                </div>
              </form>
            )}

            {incidentes.length > 0 ? (
              <div className="kb-space-y-2">
                {incidentes.map(inc => (
                  <div key={inc.id_incidente} className="d-flex align-items-start justify-content-between border rounded" style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span className={`badge ${inc.estado === "resolvido" ? "bg-success" : inc.estado === "em_andamento" ? "bg-warning" : "bg-danger"}`}>
                          {inc.estado}
                        </span>
                        <strong className="small">{inc.titulo}</strong>
                        {inc.gravidade && (
                          <span className={`badge ${inc.gravidade === "critica" || inc.gravidade === "alta" ? "bg-danger" : inc.gravidade === "media" ? "bg-warning" : "bg-info"}`}>
                            {inc.gravidade}
                          </span>
                        )}
                      </div>
                      {inc.descricao && <p className="small text-muted" style={{ margin: "0.25rem 0" }}>{inc.descricao}</p>}
                      <small className="text-muted">
                        {inc.data_ocorrencia && `Data: ${new Date(inc.data_ocorrencia).toLocaleDateString("pt-PT")} — `}
                        {new Date(inc.created_at).toLocaleString("pt-PT")}
                      </small>
                    </div>
                    {inc.estado !== "resolvido" && (
                      <button onClick={() => handleFecharIncidente(inc.id_incidente)} className="btn btn-sm btn-outline-success" title="Fechar incidente">
                        <CheckCircle size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
                <AlertOctagon className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                <p style={{ margin: 0 }}>Nenhum incidente registado</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "pedidos" && (
          <div className="kb-space-y-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-semibold text-body" style={{ margin: 0 }}>Pedidos do Cliente</h2>
            </div>

            {pedidos.length > 0 ? (
              <div className="kb-space-y-2">
                {pedidos.map(pedido => {
                  const estadoBadge = {
                    pendente: { class: "bg-warning text-dark", label: "Pendente" },
                    em_andamento: { class: "bg-primary text-white", label: "Em Andamento" },
                    resolvido: { class: "bg-success text-white", label: "Resolvido" },
                    fechado: { class: "bg-secondary text-white", label: "Fechado" },
                    cancelado: { class: "bg-danger text-white", label: "Cancelado" },
                  };
                  const badge = estadoBadge[pedido.estado] || estadoBadge.pendente;
                  return (
                    <div key={pedido.id_pedido} className="border rounded" style={{ padding: "1rem" }}>
                      <div className="d-flex align-items-start justify-content-between">
                        <div style={{ flex: 1 }}>
                          <div className="d-flex align-items-center" style={{ gap: "0.75rem", marginBottom: "0.5rem" }}>
                            <ClipboardList size={18} className="kb-brand" />
                            <strong>{pedido.titulo}</strong>
                            <span className={`badge ${badge.class}`}>{badge.label}</span>
                            {pedido.prioridade && (
                              <span className={`badge ${pedido.prioridade === 'urgente' || pedido.prioridade === 'alta' ? 'bg-danger' : pedido.prioridade === 'normal' ? 'bg-info' : 'bg-secondary'}`}>
                                {pedido.prioridade}
                              </span>
                            )}
                          </div>
                          {pedido.descricao && (
                            <p className="small text-muted" style={{ margin: "0.25rem 0", whiteSpace: "pre-wrap" }}>{pedido.descricao}</p>
                          )}
                          <div className="d-flex align-items-center small text-muted" style={{ gap: "1rem", marginTop: "0.5rem" }}>
                            <span className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
                              <Clock size={12} />
                              {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleDateString("pt-PT") : "N/A"}
                            </span>
                            {pedido.data_fecho && (
                              <span className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
                                <CheckCircle size={12} />
                                Fecho: {new Date(pedido.data_fecho).toLocaleDateString("pt-PT")}
                              </span>
                            )}
                          </div>
                        </div>

                        {pedido.estado === "pendente" && (
                          <div className="d-flex" style={{ gap: "0.5rem", marginLeft: "1rem" }}>
                            <button
                              onClick={() => handlePedidoStatus(pedido.id_pedido, "em_andamento")}
                              disabled={processingPedido === pedido.id_pedido}
                              className="btn btn-sm btn-primary d-flex align-items-center"
                              style={{ gap: "0.25rem" }}
                            >
                              <CheckCircle size={14} />
                              {processingPedido === pedido.id_pedido ? "..." : "Aceitar"}
                            </button>
                            <button
                              onClick={() => handlePedidoStatus(pedido.id_pedido, "cancelado")}
                              disabled={processingPedido === pedido.id_pedido}
                              className="btn btn-sm btn-outline-danger d-flex align-items-center"
                              style={{ gap: "0.25rem" }}
                            >
                              <XCircle size={14} />
                              Rejeitar
                            </button>
                          </div>
                        )}

                        {pedido.estado === "em_andamento" && (
                          <div style={{ marginLeft: "1rem" }}>
                            <button
                              onClick={() => handlePedidoStatus(pedido.id_pedido, "resolvido")}
                              disabled={processingPedido === pedido.id_pedido}
                              className="btn btn-sm btn-outline-success d-flex align-items-center"
                              style={{ gap: "0.25rem" }}
                            >
                              <CheckCircle size={14} />
                              {processingPedido === pedido.id_pedido ? "..." : "Concluir"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
                <ClipboardList className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                <p style={{ margin: 0 }}>Nenhum pedido registado por este cliente</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "documentacao" && (
          <div className="kb-space-y-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-semibold text-body" style={{ margin: 0 }}>Documentação</h2>
              <button
                onClick={() => setShowDocUpload(!showDocUpload)}
                className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg border-0 d-flex align-items-center"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.375rem" }}
              >
                <Plus size={16} />
                Upload
              </button>
            </div>

            {showDocUpload && (
              <form onSubmit={handleUploadDoc} className="border rounded" style={{ padding: "1rem", backgroundColor: "#fafaf9" }}>
                <div className="d-grid md-kb-grid-2" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input required placeholder="Título do documento" value={novoDoc.titulo} onChange={e => setNovoDoc({...novoDoc, titulo: e.target.value})} className="form-control form-control-sm" />
                  <input required placeholder="Tipo (ex: Relatório, Contrato)" value={novoDoc.tipo_documento} onChange={e => setNovoDoc({...novoDoc, tipo_documento: e.target.value})} className="form-control form-control-sm" />
                </div>
                <input type="file" required onChange={e => setNovoDoc({...novoDoc, ficheiro: e.target.files[0]})} className="form-control form-control-sm" style={{ marginBottom: "0.75rem" }} />
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button type="submit" className="btn btn-kb-primary-sm">Enviar</button>
                  <button type="button" onClick={() => setShowDocUpload(false)} className="btn btn-sm btn-outline-secondary">Cancelar</button>
                </div>
              </form>
            )}

            {documentos.length > 0 ? (
              <div className="kb-space-y-2">
                {documentos.map(doc => (
                  <div key={doc.id_documento} className="d-flex align-items-center justify-content-between border rounded" style={{ padding: "0.75rem 1rem" }}>
                    <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                      <FileText size={18} className="text-muted" />
                      <div>
                        <p className="small fw-semibold" style={{ margin: 0 }}>{doc.titulo}</p>
                        <p className="small text-muted" style={{ margin: 0 }}>
                          {doc.tipo_documento} — {doc.created_at ? new Date(doc.created_at).toLocaleDateString("pt-PT") : ""}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(doc)} className="btn btn-sm btn-outline-secondary" title="Download">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
                <FileText className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                <p style={{ margin: 0 }}>Nenhum documento disponível</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "pentests" && (
          <div className="kb-space-y-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-semibold text-body" style={{ margin: 0 }}>Testes de Penetração</h2>
              <button
                onClick={() => setShowPenTestForm(!showPenTestForm)}
                className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg border-0 d-flex align-items-center"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.375rem" }}
              >
                <Plus size={16} />
                Novo
              </button>
            </div>

            {showPenTestForm && (
              <form onSubmit={handleAddPenTest} className="border rounded" style={{ padding: "1rem", backgroundColor: "#fafaf9" }}>
                <div className="d-grid md-kb-grid-2" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input required placeholder="Título" value={novoPenTest.titulo} onChange={e => setNovoPenTest({...novoPenTest, titulo: e.target.value})} className="form-control form-control-sm" />
                  <input placeholder="Tipo (ex: Interno, Externo)" value={novoPenTest.tipo} onChange={e => setNovoPenTest({...novoPenTest, tipo: e.target.value})} className="form-control form-control-sm" />
                  <select value={novoPenTest.resultado} onChange={e => setNovoPenTest({...novoPenTest, resultado: e.target.value})} className="form-control form-control-sm">
                    <option value="">Resultado...</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="reprovado">Reprovado</option>
                    <option value="parcial">Parcial</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                <textarea placeholder="Descrição" value={novoPenTest.descricao} onChange={e => setNovoPenTest({...novoPenTest, descricao: e.target.value})} className="form-control form-control-sm" style={{ marginBottom: "0.75rem" }} rows={2} />
                <input type="file" onChange={e => setNovoPenTest({...novoPenTest, ficheiro: e.target.files[0]})} className="form-control form-control-sm" style={{ marginBottom: "0.75rem" }} />
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button type="submit" className="btn btn-kb-primary-sm">Guardar</button>
                  <button type="button" onClick={() => setShowPenTestForm(false)} className="btn btn-sm btn-outline-secondary">Cancelar</button>
                </div>
              </form>
            )}

            {penTests.length > 0 ? (
              <div className="kb-space-y-2">
                {penTests.map(pt => (
                  <div key={pt.id_pentest} className="d-flex align-items-start justify-content-between border rounded" style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <strong className="small">{pt.titulo}</strong>
                        {pt.resultado && (
                          <span className={`badge ${pt.resultado === "aprovado" ? "bg-success" : pt.resultado === "reprovado" ? "bg-danger" : pt.resultado === "parcial" ? "bg-warning" : "bg-secondary"}`}>
                            {pt.resultado}
                          </span>
                        )}
                      </div>
                      {pt.tipo && <p className="small text-muted" style={{ margin: 0 }}>Tipo: {pt.tipo}</p>}
                      {pt.descricao && <p className="small text-muted" style={{ margin: "0.25rem 0" }}>{pt.descricao}</p>}
                      <small className="text-muted">
                        {pt.data_realizacao && `Realizado: ${new Date(pt.data_realizacao).toLocaleDateString("pt-PT")} — `}
                        {new Date(pt.created_at).toLocaleString("pt-PT")}
                      </small>
                    </div>
                    <div className="d-flex" style={{ gap: "0.25rem" }}>
                      {pt.ficheiro_base64 && (
                        <button onClick={() => { const a = document.createElement("a"); a.href = `data:${pt.mime_type || "application/octet-stream"};base64,${pt.ficheiro_base64}`; a.download = pt.titulo; a.click(); }} className="btn btn-sm btn-outline-secondary" title="Download">
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: "3rem 0" }}>
                <Shield className="mx-auto mb-4 opacity-50" style={{ width: "3rem", height: "3rem" }} />
                <p style={{ margin: 0 }}>Nenhum teste de penetração realizado</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "outros" && (
          <div className="kb-space-y-6">
            <h2 className="h5 fw-semibold text-body" style={{ marginBottom: "1.5rem" }}>
              Outras Informações
            </h2>
            <div className="kb-space-y-4">
              <div>
                <label className="small fw-medium text-muted" style={{ display: "block", marginBottom: "0.25rem" }}>
                  Notas Adicionais
                </label>
                <textarea
                  className="w-100 border border kb-focus-ring"
                  style={{ marginTop: "0.5rem", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", borderRadius: "0.5rem" }}
                  rows={4}
                  placeholder="Adicione notas ou informações relevantes..."
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                />
              </div>
              <button
                onClick={handleSaveNotas}
                className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg border-0"
                style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem" }}
              >
                Guardar Notas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
