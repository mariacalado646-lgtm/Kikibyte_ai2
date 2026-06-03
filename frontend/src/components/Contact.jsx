import { useState, useRef } from "react";
import { FileText, Mail, MapPin, Phone, Send, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useContact } from "../controllers/useContact";

export function Contact() {
  const {
    formData,
    uploadedFiles,
    isSubmitted,
    isLoading,
    error,
    fileInputRef,
    handleChange,
    handleFileSelect,
    removeFile,
    handleSubmit,
    formatFileSize,
  } = useContact();

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contato@kiki.pt",
      link: "mailto:contato@kiki.pt",
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "+351 210 123 456",
      link: "tel:+351210123456",
    },
    {
      icon: MapPin,
      title: "Localização",
      content: "Viseu, Portugal",
      link: null,
    },
  ];

  const getFileIcon = () => <FileText className="w-5 h-5 text-primary" />;

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl !font-bold text-foreground mb-4">
            Entre em <span className="text-primary">Contacto</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tem alguma questão ou precisa de uma solução de cibersegurança? A
            nossa equipa está pronta para ajudar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl !font-semibold text-foreground mb-6">
              Fale connosco
            </h3>
            <p className="text-muted-foreground mb-8">
              Estamos disponíveis para esclarecer todas as suas dúvidas e
              apresentar as melhores soluções para o seu negócio.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="!font-semibold text-foreground mb-1">
                      {info.title}
                    </h4>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-accent/10 rounded-xl border border-primary/20">
              <h4 className="!font-semibold text-foreground mb-3">
                Horário de Atendimento
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Segunda a Sexta: 9h00 - 18h00</p>
                <p>Sábado e Domingo: Fechado</p>
                <p className="text-primary !font-medium mt-3">
                  Suporte 24/7 para clientes premium
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-muted/30 to-accent/5 p-8 rounded-2xl border border-border">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Send className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl !font-semibold text-foreground mb-3">
                  Mensagem Enviada!
                </h3>
                <p className="text-muted-foreground">
                  Obrigado pelo seu contacto. Responderemos brevemente.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="nome" className="block mb-2 text-foreground">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-50"
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-foreground">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-50"
                    placeholder="joao@empresa.pt"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="telefone"
                      className="block mb-2 text-foreground"
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-50"
                      placeholder="+351 912 345 678"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="empresa"
                      className="block mb-2 text-foreground"
                    >
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-50"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mensagem"
                    className="block mb-2 text-foreground"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:opacity-50"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-foreground font-medium">
                    Ficheiros (PDF, Word, Excel)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      multiple
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">
                      Clique para selecionar ficheiros
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
                    </p>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Ficheiros selecionados ({uploadedFiles.length}):
                    </p>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getFileIcon(file.name)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover ficheiro"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-accent transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? "A enviar..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
