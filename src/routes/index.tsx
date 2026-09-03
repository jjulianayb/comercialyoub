import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  checkProposalAccess,
  unlockProposal,
  getProposalContent,
} from "@/lib/proposal-access.functions";
import { Proposta } from "@/components/proposta";
import { PropostaInterativa, type PublicProposalContent } from "@/components/proposta-interativa";
import { getProposalMeta, submitProposalResponse } from "@/lib/crm-public.functions";
import { WHATSAPP } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proposta Estratégica | youB" },
      {
        name: "description",
        content:
          "Proposta de Desenvolvimento Humano & Organizacional da youB — diagnóstico, estrutura de cargos, remuneração e dimensionamento.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  component: Gate,
});

export function Gate({ initialToken }: { initialToken?: string } = {}) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [expired, setExpired] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [publicContent, setPublicContent] = useState<PublicProposalContent | null>(null);
  const [token] = useState<string | null>(() =>
    initialToken ??
    (typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("p")),
  );
  const check = useServerFn(checkProposalAccess);
  const getMeta = useServerFn(getProposalMeta);
  const getContent = useServerFn(getProposalContent);
  const submitResponse = useServerFn(submitProposalResponse);

  useEffect(() => {
    let alive = true;
    const metaRequest = token
      ? getMeta({ data: { token } })
      : Promise.resolve(null);

    Promise.all([check({ data: token ? { token } : undefined }), metaRequest])
      .then(([access, meta]) => {
        if (!alive) return;
        if (meta) {
          setExpired(meta.found && meta.expired);
          setNotFound(!meta.found);
          if (meta.found) {
            setSentAt(meta.sentAt);
            setValidUntil(meta.validUntil);
          }
        }
        const authorized = access.unlocked && !meta?.expired && meta?.found !== false;
        setUnlocked(authorized);
        if (authorized && token) {
          getContent({ data: { token } }).then((content) => {
            if (content.authorized && content.publicContent?.template === "youb-proposal-v1") {
              setPublicContent(content.publicContent as PublicProposalContent);
            }
          }).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setChecked(true);
      });
    return () => {
      alive = false;
    };
  }, [check, getMeta, getContent, token]);

  if (!checked) return <GateSkeleton />;
  if (expired) return <ExpiredProposal validUntil={validUntil} />;
  if (notFound) return <InvalidProposal />;
  const unlockSuccess = async () => {
    if (token) {
      const content = await getContent({ data: { token } });
      if (content.authorized && content.publicContent?.template === "youb-proposal-v1") setPublicContent(content.publicContent as PublicProposalContent);
    }
    setUnlocked(true);
  };
  if (!unlocked) return <Login token={token} onSuccess={unlockSuccess} />;
  return <ProposalContent sentAt={sentAt} validUntil={validUntil} publicContent={publicContent} onResponse={(selectedPlan, comment) => submitResponse({ data: { token: token ?? "", selectedPlan, comment } }).then((result) => result.ok)} />;
}

function ProposalContent({
  sentAt,
  validUntil,
  publicContent,
  onResponse,
}: {
  sentAt: string | null;
  validUntil: string | null;
  publicContent: PublicProposalContent | null;
  onResponse: (selectedPlan: string, comment: string) => Promise<boolean>;
}) {
  const formatDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
          new Date(value),
        )
      : null;

  return (
    <>
      {(sentAt || validUntil) && (
        <div className="proposal-validity-bar">
          <span>
            Enviada em <strong>{formatDate(sentAt)}</strong>
          </span>
          {validUntil && (
            <span>
              Válida até <strong>{formatDate(validUntil)}</strong>
            </span>
          )}
        </div>
      )}
      {publicContent ? <PropostaInterativa content={publicContent} onResponse={onResponse} /> : <Proposta />}
    </>
  );
}

function ExpiredProposal({ validUntil }: { validUntil: string | null }) {
  const date = validUntil
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
        new Date(validUntil),
      )
    : null;
  return (
    <div className="proposal-status-screen">
      <div className="proposal-status-card">
        <div className="proposal-status-icon">⏳</div>
        <div className="gate-tag">Acesso encerrado</div>
        <h1>Esta proposta expirou</h1>
        <p>
          {date
            ? `O prazo de acesso terminou em ${date}.`
            : "O prazo de acesso desta proposta terminou."}
          {" "}Fale com a youB para solicitar uma renovação ou um novo link.
        </p>
        <a href={WHATSAPP} target="_blank" rel="noreferrer">
          Falar com a youB <span>→</span>
        </a>
      </div>
      <style>{statusCss}</style>
    </div>
  );
}

function InvalidProposal() {
  return (
    <div className="proposal-status-screen">
      <div className="proposal-status-card">
        <div className="proposal-status-icon">🔒</div>
        <div className="gate-tag">Link não encontrado</div>
        <h1>Não encontramos esta proposta</h1>
        <p>Confira o link recebido ou fale com a youB para receber um novo acesso.</p>
        <a href={WHATSAPP} target="_blank" rel="noreferrer">
          Falar com a youB <span>→</span>
        </a>
      </div>
      <style>{statusCss}</style>
    </div>
  );
}

const statusCss = `
.proposal-status-screen { min-height:100vh; display:grid; place-items:center; padding:24px; color:#fff; background:radial-gradient(120% 80% at 80% 0%,#2a0f4d 0%,#15082a 45%,#0a0418 100%); font-family:Inter,system-ui,sans-serif; }
.proposal-status-card { width:min(560px,100%); padding:48px; text-align:center; border:1px solid rgba(255,255,255,.12); border-radius:28px; background:rgba(255,255,255,.06); box-shadow:0 30px 90px -35px rgba(124,58,237,.7); }
.proposal-status-icon { font-size:42px; margin-bottom:20px; }
.proposal-status-card h1 { margin:20px 0 12px; font-size:clamp(28px,5vw,42px); line-height:1.1; }
.proposal-status-card p { margin:0 auto 28px; max-width:430px; color:rgba(255,255,255,.7); line-height:1.65; }
.proposal-status-card a { display:inline-flex; gap:10px; align-items:center; padding:15px 22px; border-radius:12px; color:#fff; text-decoration:none; font-weight:700; background:linear-gradient(90deg,#7C3AED,#C084FC); }
.proposal-status-card a span { transition:transform .2s ease; }
.proposal-status-card a:hover span { transform:translateX(4px); }
.proposal-validity-bar { position:relative; z-index:10; display:flex; justify-content:center; gap:28px; flex-wrap:wrap; padding:10px 16px; color:#4c1d95; background:#f3e8ff; font:600 13px/1.4 Inter,system-ui,sans-serif; }
@media (max-width:600px) { .proposal-status-card { padding:34px 24px; } }
`;

function GateSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(120% 80% at 80% 0%, #2a0f4d 0%, #15082a 45%, #0a0418 100%)",
      }}
    />
  );
}

function Login({ token, onSuccess }: { token: string | null; onSuccess: () => void | Promise<void> }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const unlock = useServerFn(unlockProposal);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);
    try {
      const res = await unlock({ data: { password: pwd, token: token ?? undefined } });
      if (res.ok) {
        onSuccess();
      } else {
        setErr("Senha incorreta. Verifique e tente novamente.");
        setLoading(false);
      }
    } catch {
      setErr("Não foi possível validar agora. Tente novamente em instantes.");
      setLoading(false);
    }
  };

  const people = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop",
  ];

  return (
    <div className="gate">
      <div className="gate-bg">
        <div className="gate-orb gate-orb-1" />
        <div className="gate-orb gate-orb-2" />
        <div className="gate-orb gate-orb-3" />
      </div>
      <div className="gate-shell">
        <aside className="gate-side">
          <div className="gate-brand">
            you<span>B.</span>
          </div>
          <div className="gate-mosaic" aria-hidden="true">
            {people.map((src, i) => (
              <div key={i} className={`gate-face gate-face-${i + 1}`}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
            <div className="gate-mosaic-glow" />
          </div>
          <div className="gate-quote">
            <p>“Pessoas no centro. Estratégia em movimento.”</p>
            <span>— Time youB</span>
          </div>
        </aside>
        <main className="gate-main">
          <div className="gate-card">
            <div className="gate-tag">Acesso restrito · Confidencial</div>
            <h1 className="gate-title">
              Bem-vindo à <em>youB</em>
            </h1>
            <p className="gate-sub">
              Acesse sua proposta inserindo a senha fornecida abaixo. Este
              documento foi preparado sob medida e contém estratégia, escopo e
              investimento pensados para o seu momento.
            </p>
            <form onSubmit={submit} className="gate-form" noValidate>
              <label className="gate-label" htmlFor="pwd">Senha de acesso</label>
              <div className="gate-input-wrap">
                <input id="pwd" type={show ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Digite a senha" autoComplete="off" autoFocus className="gate-input" />
                <button type="button" className="gate-eye" onClick={() => setShow((v) => !v)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}>{show ? "Ocultar" : "Mostrar"}</button>
              </div>
              {err && <div className="gate-error">{err}</div>}
              <button type="submit" className="gate-btn" disabled={loading}>{loading ? "Validando…" : "Liberar proposta"}<span className="gate-btn-arrow">→</span></button>
              <div className="gate-help">Não tem a senha?{" "}<a href={WHATSAPP} target="_blank" rel="noreferrer">Falar com a youB</a></div>
            </form>
            <div className="gate-trust">
              <div className="gate-trust-item"><strong>+50</strong><span>empresas atendidas</span></div>
              <div className="gate-trust-divider" />
              <div className="gate-trust-item"><strong>+5k</strong><span>líderes desenvolvidos</span></div>
              <div className="gate-trust-divider" />
              <div className="gate-trust-item"><strong>98%</strong><span>satisfação</span></div>
            </div>
          </div>
          <footer className="gate-foot"><span>© 2026 youB · Documento confidencial</span><span>rhyoub.com.br</span></footer>
        </main>
      </div>
      <style>{gateCss}</style>
    </div>
  );
}

const gateCss = `
.gate { position: relative; min-height: 100vh; width: 100%; background: radial-gradient(120% 80% at 80% 0%, #2a0f4d 0%, #15082a 45%, #0a0418 100%); color: #fff; font-family: 'Inter', system-ui, -apple-system, sans-serif; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 32px 20px; }
.gate-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.gate-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .55; }
.gate-orb-1 { width: 520px; height: 520px; background: #7C3AED; top: -120px; left: -120px; }
.gate-orb-2 { width: 460px; height: 460px; background: #C084FC; bottom: -160px; right: -100px; opacity:.45;}
.gate-orb-3 { width: 360px; height: 360px; background: #4C1D95; top: 40%; left: 45%; opacity:.35;}
.gate-shell { position: relative; z-index: 2; width: min(1180px, 100%); display: grid; grid-template-columns: 1.05fr 1fr; gap: 0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; overflow: hidden; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); box-shadow: 0 40px 120px -40px rgba(124, 58, 237, 0.55), 0 0 0 1px rgba(255,255,255,0.04) inset; }
.gate-side { position: relative; padding: 48px 44px; background: linear-gradient(160deg, rgba(124,58,237,0.35) 0%, rgba(76,29,149,0.15) 60%, rgba(0,0,0,0) 100%), rgba(0,0,0,0.25); display: flex; flex-direction: column; justify-content: space-between; min-height: 620px; overflow: hidden; }
.gate-brand { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }
.gate-brand span { color: #C084FC; }
.gate-mosaic { position: relative; margin: 24px 0; height: 320px; }
.gate-face { position: absolute; border-radius: 22px; overflow: hidden; border: 2px solid rgba(255,255,255,0.18); box-shadow: 0 20px 50px -15px rgba(0,0,0,0.5); background: #2a0f4d; animation: floaty 6s ease-in-out infinite; }
.gate-face img { width: 100%; height: 100%; object-fit: cover; display:block; }
.gate-face-1 { width: 130px; height: 160px; top: 0; left: 0; transform: rotate(-6deg); }
.gate-face-2 { width: 110px; height: 140px; top: 20px; left: 150px; transform: rotate(4deg); animation-delay: .8s; }
.gate-face-3 { width: 120px; height: 150px; top: 0; right: 10px; transform: rotate(-3deg); animation-delay: 1.6s; }
.gate-face-4 { width: 140px; height: 170px; bottom: 0; left: 30px; transform: rotate(3deg); animation-delay: 2.4s; }
.gate-face-5 { width: 120px; height: 150px; bottom: 20px; left: 200px; transform: rotate(-5deg); animation-delay: 1.2s; }
.gate-face-6 { width: 110px; height: 140px; bottom: 10px; right: 0; transform: rotate(6deg); animation-delay: 2s; }
.gate-mosaic-glow { position: absolute; inset: -20px; background: radial-gradient(circle at 50% 50%, rgba(192,132,252,0.35), transparent 60%); pointer-events: none; z-index: -1; }
@keyframes floaty { 0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); } 50% { transform: translateY(-6px) rotate(var(--r, 0deg)); } }
.gate-quote { border-left: 2px solid #C084FC; padding-left: 16px; }
.gate-quote p { font-size: 18px; line-height: 1.5; font-weight: 500; color: rgba(255,255,255,0.92); margin: 0 0 6px; }
.gate-quote span { font-size: 13px; color: rgba(255,255,255,0.55); }
.gate-main { padding: 56px 52px; display: flex; flex-direction: column; justify-content: space-between; background: rgba(10,4,24,0.4); }
.gate-card { display: flex; flex-direction: column; }
.gate-tag { display: inline-flex; align-self: flex-start; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; background: rgba(192,132,252,0.15); color: #E9D5FF; border: 1px solid rgba(192,132,252,0.3); padding: 8px 14px; border-radius: 999px; margin-bottom: 24px; }
.gate-title { font-size: clamp(28px, 3.4vw, 40px); line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; color: #fff; }
.gate-title em { font-style: normal; background: linear-gradient(90deg, #C084FC, #fff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gate-sub { font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.7); margin: 0 0 32px; max-width: 480px; }
.gate-form { display: flex; flex-direction: column; gap: 14px; }
.gate-label { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
.gate-input-wrap { position: relative; display: flex; align-items: center; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; transition: all .2s ease; }
.gate-input-wrap:focus-within { border-color: #C084FC; background: rgba(255,255,255,0.09); box-shadow: 0 0 0 4px rgba(192,132,252,0.15); }
.gate-input { flex: 1; background: transparent; border: 0; outline: 0; padding: 18px 20px; font-size: 16px; color: #fff; font-family: inherit; letter-spacing: 0.02em; }
.gate-input::placeholder { color: rgba(255,255,255,0.35); }
.gate-eye { background: transparent; border: 0; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600; padding: 0 18px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.08em; }
.gate-eye:hover { color: #fff; }
.gate-error { font-size: 13px; color: #FCA5A5; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); padding: 10px 14px; border-radius: 10px; }
.gate-btn { margin-top: 8px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(90deg, #7C3AED, #C084FC); color: #fff; border: 0; cursor: pointer; padding: 18px 24px; border-radius: 14px; font-family: inherit; font-size: 15px; font-weight: 700; letter-spacing: 0.02em; box-shadow: 0 14px 30px -12px rgba(124,58,237,0.7); transition: transform .15s ease, box-shadow .2s ease, opacity .2s ease; }
.gate-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -12px rgba(124,58,237,0.85); }
.gate-btn:disabled { opacity: .7; cursor: wait; transform: none; }
.gate-btn-arrow { transition: transform .2s ease; }
.gate-btn:hover .gate-btn-arrow { transform: translateX(4px); }
.gate-help { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 4px; }
.gate-help a { color: #C084FC; text-decoration: none; font-weight: 600; }
.gate-help a:hover { color: #fff; }
.gate-trust { display: flex; align-items: center; gap: 18px; margin-top: 36px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); }
.gate-trust-item { display: flex; flex-direction: column; }
.gate-trust-item strong { font-size: 22px; font-weight: 800; letter-spacing: -0.01em; background: linear-gradient(90deg, #C084FC, #fff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gate-trust-item span { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }
.gate-trust-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.12); }
.gate-foot { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.06em; margin-top: 32px; text-transform: uppercase; }
@media (max-width: 900px) { .gate { padding: 16px; } .gate-shell { grid-template-columns: 1fr; } .gate-side { min-height: auto; padding: 32px 28px; } .gate-mosaic { height: 260px; } .gate-main { padding: 36px 28px; } .gate-foot { flex-direction: column; gap: 6px; } }
@media (max-width: 520px) { .gate-mosaic { height: 220px; } .gate-face-1 { width: 95px; height: 120px; } .gate-face-2 { width: 85px; height: 110px; left: 110px; } .gate-face-3 { width: 90px; height: 115px; } .gate-face-4 { width: 100px; height: 125px; left: 10px; } .gate-face-5 { width: 90px; height: 115px; left: 130px; } .gate-face-6 { width: 85px; height: 110px; } .gate-trust { gap: 12px; } .gate-trust-item strong { font-size: 18px; } }
`;
