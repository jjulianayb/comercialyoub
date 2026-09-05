import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session);
        setReady(true);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (alive) setSession(next);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!session) {
      setError("Este link de redefinição é inválido ou expirou. Solicite um novo e-mail.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError("Não foi possível definir a senha. Solicite um novo link e tente novamente.");
      return;
    }
    setPassword("");
    setConfirmation("");
    setMessage("Senha definida com sucesso. Você já pode entrar no CRM.");
    await supabase.auth.signOut();
  }

  if (!ready) return <main style={page}><section style={card}>Carregando…</section></main>;

  return (
    <main style={page}>
      <section style={card}>
        <div style={brand}>you<span>B.</span></div>
        <div style={eyebrow}>Acesso interno · CRM comercial</div>
        <h1 style={title}>Defina sua senha</h1>
        <p style={copy}>Escolha uma senha própria para acessar o CRM. Ela não é exibida nem compartilhada.</p>
        <form onSubmit={submit}>
          <label style={label}>Nova senha<input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required /></label>
          <label style={label}>Confirmar senha<input style={input} type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="new-password" minLength={8} required /></label>
          {error && <div style={errorBox}>{error}</div>}
          {message && <div style={successBox}>{message}</div>}
          <button style={button} disabled={busy || Boolean(message)}>{busy ? "Salvando…" : "Definir senha"}</button>
        </form>
        <a style={link} href="/crm">Voltar para o CRM →</a>
      </section>
    </main>
  );
}

const page: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", padding: 20, background: "radial-gradient(circle at 20% 0%, #ede9fe 0%, #faf9fc 42%, #f4effb 100%)", fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif" };
const card: React.CSSProperties = { width: "min(430px,100%)", background: "#ffffffee", borderRadius: 22, padding: "42px 38px", boxShadow: "0 22px 60px #32134f22" };
const brand: React.CSSProperties = { fontSize: 25, fontWeight: 800, color: "#221234" };
const eyebrow: React.CSSProperties = { textTransform: "uppercase", letterSpacing: 1.5, fontSize: 10, fontWeight: 800, color: "#8b5cf6", marginTop: 5 };
const title: React.CSSProperties = { fontSize: 34, lineHeight: 1.05, letterSpacing: -1.5, margin: "22px 0 12px", color: "#251336" };
const copy: React.CSSProperties = { color: "#716b7c", fontSize: 14, lineHeight: 1.6, marginBottom: 24 };
const label: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 7, color: "#5b5566", fontSize: 12, fontWeight: 750, marginBottom: 14 };
const input: React.CSSProperties = { border: "1px solid #ded8eb", borderRadius: 9, padding: "11px 12px", background: "#fff", color: "#292333", fontSize: 13 };
const button: React.CSSProperties = { width: "100%", border: 0, borderRadius: 10, background: "#7c3aed", color: "#fff", padding: "12px 18px", fontWeight: 800, cursor: "pointer", marginTop: 6 };
const link: React.CSSProperties = { display: "block", textAlign: "center", marginTop: 20, color: "#6d28d9", fontSize: 13, fontWeight: 700 };
const errorBox: React.CSSProperties = { background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: 9, padding: "10px 12px", margin: "8px 0 12px", fontSize: 12 };
const successBox: React.CSSProperties = { background: "#ecfdf5", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 9, padding: "10px 12px", margin: "8px 0 12px", fontSize: 12 };
