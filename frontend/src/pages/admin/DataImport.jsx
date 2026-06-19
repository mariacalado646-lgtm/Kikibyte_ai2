import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export function DataImport() {
  const [importedData, setImportedData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDownload, setHoverDownload] = useState(false);
  const [hoverDragArea, setHoverDragArea] = useState(false);
  const fileInputRef = useRef(null);

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
        // Save to localStorage
        const history = JSON.parse(
          localStorage.getItem("import_history") || "[]",
        );
        history.unshift(imported);
        localStorage.setItem(
          "import_history",
          JSON.stringify(history.slice(0, 10)),
        ); // Keep last 10
        toast.success(`Ficheiro "${file.name}" importado com sucesso!`);
      } catch (error) {
        toast.error("Erro ao processar o ficheiro");
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
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
    // Create a sample template
    const template = [
      {
        Cliente: "Exemplo SA",
        NIF: "501234567",
        Email: "exemplo@empresa.pt",
        Telefone: "+351 912345678",
        Plano: "Enterprise",
      },
      { Cliente: "", NIF: "", Email: "", Telefone: "", Plano: "" },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "template_kikibyte.xlsx");
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
        <h1 className="text-3xl fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>
          Importar Dados
        </h1>
        <p className="text-muted-foreground">
          Upload e processamento de ficheiros Excel
        </p>
      </div>

      {/* Template Download */}
      <div className="border d-flex align-items-start" style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem", gap: "1rem" }}>
        <AlertCircle className="flex-shrink-0" style={{ width: "1.5rem", height: "1.5rem", color: "#2563eb", marginTop: "0.25rem" }} />
        <div className="flex-grow-1">
          <h3 className="fw-bold mb-2" style={{ color: "#1e3a8a", marginBottom: "0.5rem" }}>
            Precisa de um template?
          </h3>
          <p className="text-sm mb-3" style={{ color: "#1e40af", marginBottom: "0.75rem" }}>
            Descarregue o nosso template Excel para garantir que os dados dos
            clientes estão no formato correto para importação.
          </p>
          <button
            onClick={downloadTemplate}
            onMouseEnter={() => setHoverDownload(true)}
            onMouseLeave={() => setHoverDownload(false)}
            className="text-white transition-colors d-inline-flex align-items-center text-sm border-0"
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

      {/* Upload Area */}
      <div className="bg-white border border-border shadow-sm" style={{ borderRadius: "0.75rem", padding: "2rem", marginBottom: "1.5rem" }}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onMouseEnter={() => setHoverDragArea(true)}
          onMouseLeave={() => setHoverDragArea(false)}
          className="text-center transition-colors cursor-pointer"
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

          <h3 className="fw-bold text-foreground" style={{ marginBottom: "0.5rem" }}>
            Arraste o ficheiro aqui ou clique para selecionar
          </h3>
          <p className="text-sm text-muted-foreground" style={{ marginBottom: "1rem" }}>
            Formatos suportados: .xlsx, .xls, .csv
          </p>
          <p className="text-xs text-muted-foreground">
            Máximo 10MB por ficheiro
          </p>
        </div>
      </div>

      {/* Imported Data Preview */}
      {importedData && (
        <div className="bg-white border border-border shadow-sm overflow-hidden" style={{ borderRadius: "0.75rem" }}>
          <div className="border-bottom border-border d-flex align-items-center justify-content-between" style={{ padding: "1.5rem" }}>
            <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
              <div className="bg-green-100 d-flex align-items-center justify-content-center" style={{ width: "3rem", height: "3rem", borderRadius: "0.5rem" }}>
                <FileSpreadsheet style={{ width: "1.5rem", height: "1.5rem", color: "#16a34a" }} />
              </div>
              <div>
                <h3 className="fw-bold text-foreground" style={{ margin: 0 }}>
                  {importedData.fileName}
                </h3>
                <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
                  {importedData.data.length} linhas •{" "}
                  {importedData.headers.length} colunas
                </p>
              </div>
            </div>
            <button
              onClick={exportData}
              className="bg-primary text-primary-foreground hover-bg-accent transition-colors d-inline-flex align-items-center"
              style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.5rem", gap: "0.5rem", border: "none" }}
            >
              <Download size={16} />
              Exportar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-100">
              <thead className="border-bottom border-border" style={{ backgroundColor: "rgba(231, 229, 228, 0.5)" }}>
                <tr>
                  <th className="text-start text-sm fw-medium text-foreground" style={{ padding: "0.75rem 1.5rem" }}>
                    #
                  </th>
                  {importedData.headers.map((header, index) => (
                    <th
                      key={index}
                      className="text-start text-sm fw-medium text-foreground"
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
                    className="tr-hover"
                  >
                    <td className="text-sm text-muted-foreground" style={{ padding: "1rem 1.5rem" }}>
                      {rowIndex + 1}
                    </td>
                    {importedData.headers.map((header, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="text-sm text-foreground"
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
            <div className="text-center text-sm text-muted-foreground border-top border-border" style={{ padding: "1rem", backgroundColor: "rgba(231, 229, 228, 0.3)" }}>
              A mostrar 50 de {importedData.data.length} linhas
            </div>
          )}
        </div>
      )}

      {/* Import History */}
      {!importedData && (
        <div className="bg-white border border-border shadow-sm" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
          <h3 className="fw-bold text-foreground" style={{ marginBottom: "1rem" }}>
            Histórico de Importações
          </h3>
          <div className="space-y-3">
            {JSON.parse(localStorage.getItem("import_history") || "[]")
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between"
                  style={{ padding: "1rem", backgroundColor: "rgba(231, 229, 228, 0.3)", borderRadius: "0.5rem" }}
                >
                  <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    <div>
                      <p className="fw-medium text-foreground" style={{ margin: 0 }}>
                        {item.fileName}
                      </p>
                      <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
                        {new Date(item.importedAt).toLocaleString("pt-PT")} •{" "}
                        {item.data.length} linhas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setImportedData(item)}
                    className="text-sm text-primary hover-underline border-0 bg-transparent"
                  >
                    Ver dados
                  </button>
                </div>
              ))}
            {JSON.parse(localStorage.getItem("import_history") || "[]")
              .length === 0 && (
              <p className="text-center text-muted-foreground" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                Nenhuma importação anterior
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
