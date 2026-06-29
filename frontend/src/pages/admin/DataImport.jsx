import { useState, useRef, useEffect } from "react";
import { Upload, FileSpreadsheet, Download, AlertCircle, Database, Server, Users } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { importacaoService, ativosImportService } from "../../services/adminservice";
import { adminClienteService } from "../../services/adminservice";

const TIPOS = [
  { key: "clientes", icon: Users, label: "Clientes" },
  { key: "ativos",   icon: Server, label: "Ativos Tecnológicos" },
];

export function DataImport() {
  const [tipo, setTipo] = useState("clientes");
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [importedData, setImportedData] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDownload, setHoverDownload] = useState(false);
  const [hoverDragArea, setHoverDragArea] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (tipo === "ativos") {
      adminClienteService.listar({ ativo: true }).then(setClientes).catch(() => {});
    }
  }, [tipo]);

  const handleFileUpload = (file) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error("Por favor, envie apenas ficheiros Excel ou CSV");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if (jsonData.length === 0) {
          toast.error("O ficheiro está vazio");
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const imported = {
          fileName: file.name,
          data: jsonData,
          headers,
          importedAt: new Date().toISOString(),
        };

        setImportedData(imported);
        setImportHistory(prev => [imported, ...prev].slice(0, 10));
        toast.success(`Ficheiro "${file.name}" lido com sucesso! Prima "Importar" para enviar para a base de dados.`);
      } catch (error) {
        toast.error("Erro ao processar o ficheiro");
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImportToDatabase = async () => {
    if (!importedData || importedData.data.length === 0) return;
    setImporting(true);
    try {
      if (tipo === "clientes") {
        const result = await importacaoService.importar({ clientes: importedData.data });
        const criados = result.criados?.length || 0;
        const erros = result.erros?.length || 0;
      if (erros > 0) {
        toast.warning(`${criados} clientes importados, ${erros} erros encontrados`);
        console.warn('Erros de importação:', result.erros);
      } else {
        toast.success(`${criados} clientes importados com sucesso!`);
      }
      } else {
        // Ativos
        if (!clienteId) { toast.error("Selecione um cliente"); setImporting(false); return; }
        const result = await ativosImportService.importar(parseInt(clienteId), importedData.data);
        if (result.erros > 0) {
          toast.warning(`${result.criados} ativos importados, ${result.erros} erros`);
        } else {
          toast.success(`${result.criados} ativos importados com sucesso!`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao importar para base de dados');
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const downloadTemplate = () => {
    if (tipo === "ativos") {
      const template = [
        { nome: "Servidor Web", tipo: "hardware", descricao: "Servidor principal", quantidade: 2 },
        { nome: "", tipo: "", descricao: "", quantidade: 1 },
      ];
      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ativos");
      XLSX.writeFile(wb, "template_ativos_kikibyte.xlsx");
    } else {
      const template = [
        {
          nome: "Exemplo SA",
          email: "exemplo@empresa.pt",
          telefone: "+351 912345678",
          nif: "501234567",
          setor: "Tecnologia",
          morada: "Rua Exemplo, 123, Lisboa",
        },
        { nome: "", email: "", telefone: "", nif: "", setor: "", morada: "" },
      ];
      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clientes");
      XLSX.writeFile(wb, "template_kikibyte.xlsx");
    }
    toast.success("Template descarregado com sucesso!");
  };

  const exportData = () => {
    if (!importedData) return;

    const ws = XLSX.utils.json_to_sheet(importedData.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, `export_${Date.now()}.xlsx`);
    toast.success("Dados exportados com sucesso!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="h3 fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
          Importar Dados
        </h1>
        <p className="text-muted">
          Upload e processamento de ficheiros Excel
        </p>
      </div>

      {/* Tipo Selector */}
      <div
        className="d-inline-flex flex-wrap"
        style={{
          marginBottom: "1.5rem", gap: "0.25rem",
          backgroundColor: "rgba(231, 229, 228, 0.3)",
          padding: "0.25rem", borderRadius: "0.5rem"
        }}
      >
        {TIPOS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => { setTipo(key); setImportedData(null); }}
            className={`d-inline-flex align-items-center kb-transition border-0 ${
              tipo === key
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

      {/* Template Download */}
      <div className="border d-flex align-items-start" style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem", gap: "1rem" }}>
        <AlertCircle className="flex-shrink-0" style={{ width: "1.5rem", height: "1.5rem", color: "#2563eb", marginTop: "0.25rem" }} />
        <div className="flex-grow-1">
          <h3 className="fw-bold mb-2" style={{ color: "#1e3a8a", marginBottom: "0.5rem" }}>
            Precisa de um template?
          </h3>
          <p className="small mb-3" style={{ color: "#1e40af", marginBottom: "0.75rem" }}>
            {tipo === "clientes"
              ? "Descarregue o nosso template Excel para garantir que os dados dos clientes estão no formato correto para importação."
              : "Descarregue o template para importar ativos tecnológicos. Colunas: nome, tipo, descricao, quantidade."}
          </p>
          <button
            onClick={downloadTemplate}
            onMouseEnter={() => setHoverDownload(true)}
            onMouseLeave={() => setHoverDownload(false)}
            className="text-white kb-transition-bg d-inline-flex align-items-center small border-0"
            style={{
              backgroundColor: hoverDownload ? "#1d4ed8" : "#2563eb",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              borderRadius: "0.5rem",
              gap: "0.5rem",
            }}
          >
            <Download size={16} />
            Descarregar Template
          </button>
        </div>
      </div>

      {/* Cliente selector (only for ativos) */}
      {tipo === "ativos" && (
        <div className="bg-white border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1rem 1.5rem", marginBottom: "1rem" }}>
          <div className="row align-items-center">
            <div className="col-md-4">
              <label className="form-label small fw-medium mb-0">Selecionar Cliente *</label>
            </div>
            <div className="col-md-6">
              <select className="form-select" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                <option value="">— Selecione um cliente —</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nome} {c.nif ? `(${c.nif})` : ""}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white border border shadow-sm" style={{ borderRadius: "0.75rem", padding: "2rem", marginBottom: "1.5rem" }}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onMouseEnter={() => setHoverDragArea(true)}
          onMouseLeave={() => setHoverDragArea(false)}
          className="text-center kb-transition-bg cursor-pointer"
          style={{
            border: "2px dashed",
            borderRadius: "0.75rem",
            padding: "3rem",
            borderColor: isDragging
              ? "var(--primary)"
              : hoverDragArea
                ? "rgba(120, 53, 15, 0.5)"
                : "var(--border)",
            backgroundColor: isDragging
              ? "rgba(120, 53, 15, 0.05)"
              : hoverDragArea
                ? "rgba(231, 229, 228, 0.3)"
                : "transparent",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: "4rem", height: "4rem", backgroundColor: "rgba(120, 53, 15, 0.1)", marginBottom: "1rem" }}>
            <Upload className="text-primary" style={{ width: "2rem", height: "2rem" }} />
          </div>

          <h3 className="fw-bold text-body" style={{ marginBottom: "0.5rem" }}>
            Arraste o ficheiro aqui ou clique para selecionar
          </h3>
          <p className="small text-muted" style={{ marginBottom: "1rem" }}>
            Formatos suportados: .xlsx, .xls, .csv
          </p>
          <p className="small text-muted">
            Máximo 10MB por ficheiro
          </p>
        </div>
      </div>

      {/* Imported Data Preview */}
      {importedData && (
        <div className="bg-white border border shadow-sm overflow-hidden" style={{ borderRadius: "0.75rem" }}>
          <div className="border-bottom border d-flex align-items-center justify-content-between" style={{ padding: "1.5rem" }}>
            <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
              <div className="kb-bg-green-100 d-flex align-items-center justify-content-center" style={{ width: "3rem", height: "3rem", borderRadius: "0.5rem" }}>
                <FileSpreadsheet style={{ width: "1.5rem", height: "1.5rem", color: "#16a34a" }} />
              </div>
              <div>
                <h3 className="fw-bold text-body" style={{ margin: 0 }}>
                  {importedData.fileName}
                </h3>
                <p className="small text-muted" style={{ margin: 0 }}>
                  {importedData.data.length} linhas •{" "}
                  {importedData.headers.length} colunas
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
            <button
              onClick={handleImportToDatabase}
              disabled={importing}
              className="d-inline-flex align-items-center border-0 text-white"
              style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.5rem", backgroundColor: importing ? "#6c757d" : "#15803d" }}
            >
              {importing ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <Database size={16} />
              )}
              {importing ? 'A importar...' : 'Importar para BD'}
            </button>
            <button
              onClick={exportData}
              className="bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-inline-flex align-items-center"
              style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.5rem", border: "none" }}
            >
              <Download size={16} />
              Exportar
            </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-100">
              <thead className="border-bottom border" style={{ backgroundColor: "rgba(231, 229, 228, 0.5)" }}>
                <tr>
                  <th className="text-start small fw-medium text-body" style={{ padding: "0.75rem 1.5rem" }}>
                    #
                  </th>
                  {importedData.headers.map((header, index) => (
                    <th
                      key={index}
                      className="text-start small fw-medium text-body"
                      style={{ padding: "0.75rem 1.5rem" }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="border-top-0">
                {importedData.data.slice(0, 50).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="kb-table-hover"
                  >
                    <td className="small text-muted" style={{ padding: "1rem 1.5rem" }}>
                      {rowIndex + 1}
                    </td>
                    {importedData.headers.map((header, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="small text-body"
                        style={{ padding: "1rem 1.5rem" }}
                      >
                        {row[header]?.toString() || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {importedData.data.length > 50 && (
            <div className="text-center small text-muted border-top border" style={{ padding: "1rem", backgroundColor: "rgba(231, 229, 228, 0.3)" }}>
              A mostrar 50 de {importedData.data.length} linhas
            </div>
          )}
        </div>
      )}

      {/* Import History */}
      {!importedData && (
        <div className="bg-white border border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <h3 className="fw-bold text-body" style={{ marginBottom: "1rem" }}>
            Importações Recentes
          </h3>
          <div className="kb-space-y-3">
            {importHistory
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between"
                  style={{ padding: "1rem", backgroundColor: "rgba(231, 229, 228, 0.3)", borderRadius: "0.5rem" }}
                >
                  <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                    <FileSpreadsheet className="kb-w-5 kb-h-5 text-primary" />
                    <div>
                      <p className="fw-medium text-body" style={{ margin: 0 }}>
                        {item.fileName}
                      </p>
                      <p className="small text-muted" style={{ margin: 0 }}>
                        {new Date(item.importedAt).toLocaleString("pt-PT")} •{" "}
                        {item.data.length} linhas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setImportedData(item)}
                    className="small text-primary kb-hover-underline border-0 bg-transparent"
                  >
                    Ver dados
                  </button>
                </div>
              ))}
            {importHistory.length === 0 && (
              <p className="text-center text-muted" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                Nenhuma importação nesta sessão
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
