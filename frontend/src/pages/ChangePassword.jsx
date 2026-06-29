import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";

export function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      toast.error("A nova password deve ter pelo menos 6 caracteres");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("As passwords não coincidem");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password alterada com sucesso!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Erro ao alterar password:", err);
      toast.error(err.response?.data?.error || "Erro ao alterar password");
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ label, value, onChange, show, toggleShow, placeholder }) => (
    <div>
      <label className="d-block small fw-medium text-body" style={{ marginBottom: "0.5rem" }}>
        {label}
      </label>
      <div className="position-relative">
        <input
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          className="contact-input w-100"
          style={{ paddingRight: "2.5rem" }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-muted"
          style={{ padding: "0.5rem" }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: "linear-gradient(to bottom right, rgba(231, 229, 228, 0.3), var(--background), rgba(231, 229, 228, 0.5))",
      }}
    >
      <div className="w-100" style={{ maxWidth: "28rem" }}>
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "1rem",
              backgroundColor: "rgba(194, 65, 12, 0.1)",
            }}
          >
            <Lock size={32} className="kb-brand" />
          </div>
          <h1 className="h3 fw-bold" style={{ color: "#1c1917" }}>
            Alterar Password
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Escolha uma nova password segura
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white kb-space-y-4"
          style={{
            borderRadius: "1rem",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            padding: "2rem",
          }}
        >
          <PasswordInput
            label="Password Atual"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            show={showOld}
            toggleShow={() => setShowOld(!showOld)}
            placeholder="••••••••"
          />

          <PasswordInput
            label="Nova Password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            show={showNew}
            toggleShow={() => setShowNew(!showNew)}
            placeholder="Mín. 6 caracteres"
          />

          <PasswordInput
            label="Confirmar Nova Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            show={showConfirm}
            toggleShow={() => setShowConfirm(!showConfirm)}
            placeholder="Repita a nova password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-100 bg-primary text-primary-foreground hover-bg-secondary kb-transition-bg d-inline-flex align-items-center justify-content-center fw-semibold border-0"
            style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              gap: "0.5rem",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Lock size={18} />
            {loading ? "A alterar..." : "Alterar Password"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="small text-muted kb-hover-text-primary d-inline-flex align-items-center border-0 bg-transparent"
              style={{ gap: "0.5rem" }}
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
