import { useState } from "react";
import { propostaCss } from "@/components/proposta";

export type ProposalPlan = {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  description: string;
  items: string[];
  featured?: boolean;
};

export type PublicProposalContent = {
  template: "youb-proposal-v1";
  companyName: string;
  recipientName?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  context: string;
  metrics: [string, string][];
  numbers: [string, string][];
  objectives: string[];
  fronts: [string, string, string][];
  methodology: [string, string, string][];
  software: [string, string, string][];
  plans: ProposalPlan[];
  enterprise: { price: string; description: string; items: string[] };
  logistics: string[];
  validity: string;
};

export function PropostaInterativa({
  content,
  onResponse,
}: {
  content: PublicProposalContent;
  onResponse: (selectedPlan: string, comment: string) => Promise<boolean>;
}) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSending(true);
    const ok = await onResponse(selectedPlan, comment.trim());
    setSending(false);
    if (ok) setSent(true);
    else setError("Não foi possível registrar sua resposta. Tente novamente.");
  }

  return (
    <div className="proposta proposta-locked proposal-dynamic">
      <div className="proposal-watermark" aria-hidden="true">{content.companyName} · {content.recipientName || "Documento confidencial"}</div>
      <header className="capa">
        <nav className="capa-nav"><strong className="proposal-brand-light">youB.</strong><span className="capa-meta">Documento confidencial</span></nav>
        <div className="capa-body">
          <span className="eyebrow eyebrow-light">{content.eyebrow}</span>
          <h1 className="capa-titulo">{content.title}</h1>
          <p className="capa-desc">{content.subtitle}</p>
          <div className="capa-empresa"><div className="capa-empresa-ico">★</div><div><div className="capa-empresa-detalhe">Apresentado para</div><div className="capa-empresa-nome">{content.companyName}</div></div></div>
        </div>
        <div className="capa-footer"><span className="capa-meta">Proposta personalizada · {content.validity}</span><span className="capa-meta">Documento confidencial</span></div>
      </header>

      <section className="sec"><span className="eyebrow">01 — Contexto</span><h2 className="sec-h">Onde a <span>{content.companyName}</span> está</h2><p className="sec-sub">Um ponto de partida claro para transformar cultura, liderança e desenvolvimento.</p><div className="ctx-box"><p>{content.context}</p><div className="ctx-pills">{content.metrics.map(([icon, label]) => <span key={label} className="pill"><span>{icon}</span>{label}</span>)}</div></div><div className="nums-grid">{content.numbers.map(([number, label]) => <div key={label} className="num-card"><div className="n">{number}</div><div className="l">{label}</div></div>)}</div></section>

      <section className="sec-soft"><div className="sec-inner"><span className="eyebrow">02 — Objetivo</span><h2 className="sec-h">O que vamos construir <span>juntos</span></h2><p className="sec-sub">Uma agenda prática para implantar o DHO e sustentar a evolução da cultura.</p><div className="obj-card"><span className="obj-tag">Objetivos do projeto</span><ul className="obj-lista">{content.objectives.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>

      <section className="sec"><span className="eyebrow">03 — Escopo</span><h2 className="sec-h">Frentes de <span>atuação</span></h2><p className="sec-sub">Estrutura modular para desenvolver lideranças, pessoas e a cultura da organização.</p><div className="escopo-grid">{content.fronts.map(([icon, title, description]) => <article key={title} className="escopo-card"><div className="escopo-ico">{icon}</div><h4>{title}</h4><p>{description}</p></article>)}</div></section>

      <section className="sec-dark"><div className="sec-inner"><span className="eyebrow eyebrow-light">04 — Metodologia</span><h2 className="sec-h is-light">Como vamos <span>trabalhar</span></h2><p className="sec-sub is-light">Consultoria aplicada, presença executiva e tecnologia para transformar plano em prática.</p><div className="met-grid">{content.methodology.map(([number, title, description]) => <div key={number} className="met-item"><div className="met-num">{number}</div><h4>{title}</h4><p>{description}</p></div>)}</div></div></section>

      <section className="sec-soft"><div className="sec-inner"><span className="eyebrow">05 — Tecnologia</span><h2 className="sec-h">Plataforma youB e <span>inteligência de pessoas</span></h2><p className="sec-sub">A tecnologia mantém o desenvolvimento vivo entre uma reunião e outra.</p><div className="sw-grid">{content.software.map(([icon, title, description]) => <article key={title} className="sw-card"><div className="sw-ico">{icon}</div><h4>{title}</h4><p>{description}</p></article>)}</div></div></section>

      <section className="sec"><span className="eyebrow">06 — Investimento</span><h2 className="sec-h">Escolha o <span>plano ideal</span></h2><p className="sec-sub">Cada opção combina profundidade de implantação, desenvolvimento e tecnologia.</p><div className="planos">{content.plans.map((plan) => <article key={plan.name} className={`plano ${plan.featured ? "is-destaque" : ""}`}><span className="plano-badge">{plan.featured ? "★ Recomendado" : "Plano de implantação"}</span><h3>{plan.name}</h3><span className="plano-sub">{plan.subtitle}</span><p className="plano-foco">{plan.description}</p><div className="plano-preco"><span className="moeda">R$</span><span className="valor">{plan.price}</span></div><span className="plano-prazo">Prazo: {plan.period}</span><ul className="plano-lista">{plan.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>

      <section className="sec"><span className="eyebrow">06 — Jornada</span><h2 className="sec-h">Uma implantação em <span>ciclos</span></h2><p className="sec-sub">O escopo cresce com a maturidade da organização e a autonomia das lideranças.</p><div className="crono">{[["1","Essencial","3 meses","Diagnóstico, prioridades e início da jornada de líderes."],["2","Estrutural","6 meses","Modelo de DHO, formação, trilhas e base de competências."],["3","Estratégico","9 meses","Cultura, carreira, indicadores e consolidação na youB."]].map(([number,title,period,description],index)=><div key={number} className={`fase ${index===2?"is-last":""}`}><div className="fase-esq"><div className="fase-dot">{number}</div><div className="fase-line" /></div><div className="fase-body"><h4>{title}</h4><span className="fase-dur">{period}</span><p>{description}</p></div></div>)}</div></section>

      <section className="sec-dark"><div className="sec-inner"><span className="eyebrow eyebrow-light">07 — Valor</span><h2 className="sec-h is-light">O investimento vira <span>capacidade</span></h2><p className="sec-sub is-light">Não é apenas treinamento: é um sistema de gestão que fica na organização.</p><div className="cv-grid">{[["01","Liderança preparada","Líderes mais seguros para conversar, direcionar e desenvolver pessoas."],["02","Cultura praticada","Princípios traduzidos em comportamentos, rituais e decisões do dia a dia."],["03","DHO sustentável","Processos, indicadores e tecnologia para a evolução continuar com autonomia."]].map(([number,title,description])=><article key={number} className="cv-card"><div className="cv-num">{number}</div><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

      <section className="sec-soft"><div className="sec-inner"><span className="eyebrow">07 — Continuidade</span><h2 className="sec-h">Plano <span>Enterprise</span></h2><p className="sec-sub">Depois da implantação, a Lagoapar pode manter o DHO ativo dentro da plataforma.</p><div className="ctx-box enterprise-box"><h3>R$ {content.enterprise.price} por mês</h3><p>{content.enterprise.description}</p><ul className="plano-lista">{content.enterprise.items.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>

      <section className="sec"><span className="eyebrow">08 — Sua decisão</span><h2 className="sec-h">Diga qual caminho faz mais <span>sentido</span></h2><p className="sec-sub">Selecione uma opção e deixe uma observação. Sua resposta será recebida pela equipe youB.</p><div className="response-card"><form onSubmit={submit}><fieldset disabled={sending || sent}><legend>Plano de maior interesse</legend>{[...content.plans.map((plan) => plan.name), "Plano Enterprise"].map((plan) => <label key={plan} className="response-option"><input type="radio" name="selectedPlan" value={plan} checked={selectedPlan === plan} onChange={() => setSelectedPlan(plan)} /><span>{plan}</span></label>)}<label className="response-comment">Comentário ou dúvida<textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreva uma observação para a youB…" maxLength={4000} /></label>{error && <div className="gate-error">{error}</div>}{sent ? <div className="response-success">Resposta registrada. A youB entrará em contato para os próximos passos.</div> : <button className="btn-violet" type="submit">{sending ? "Enviando…" : "Enviar minha preferência →"}</button>}</fieldset></form></div></section>

      <section className="sec-soft"><div className="sec-inner"><span className="eyebrow">10 — A youB</span><h2 className="sec-h">Tecnologia para dar <span>continuidade</span></h2><div className="sobre-grid"><div className="sobre-txt"><p>A youB combina consultoria, desenvolvimento humano e tecnologia para transformar decisões de pessoas em uma prática contínua.</p><p>A plataforma apoia o registro das jornadas, a visibilidade dos indicadores e a evolução dos próximos ciclos.</p></div><div className="sobre-nums"><div className="sobre-num"><strong>+50</strong><span>empresas atendidas</span></div><div className="sobre-num"><strong>+5k</strong><span>líderes desenvolvidos</span></div></div></div></div></section>

      <section className="sec-dark"><div className="sec-inner"><span className="eyebrow eyebrow-light">09 — Premissas</span><h2 className="sec-h is-light">Condições e <span>próximos passos</span></h2><ul className="obj-lista">{content.logistics.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
      <style>{propostaCss}</style>
      <style>{dynamicCss}</style>
    </div>
  );
}

const dynamicCss = `.proposal-watermark{position:fixed;inset:0;display:grid;place-items:center;transform:rotate(-26deg);font-size:clamp(34px,7vw,82px);font-weight:850;letter-spacing:4px;text-transform:uppercase;color:#6d28d9;opacity:.055;pointer-events:none;z-index:20;white-space:nowrap}.proposal-brand-light{font-size:25px;letter-spacing:-1.5px;color:#fff;font-weight:800}.proposal-dynamic .capa-nav{justify-content:space-between}.response-card{max-width:760px;margin:26px auto 0;padding:28px;border:1px solid #e8e1f2;border-radius:18px;background:#fff;box-shadow:0 16px 40px #25133612}.response-card fieldset{border:0;padding:0;margin:0}.response-card legend{font-size:15px;font-weight:800;color:#32134f;margin-bottom:15px}.response-option{display:flex;align-items:center;gap:10px;padding:13px 14px;margin:8px 0;border:1px solid #ded8eb;border-radius:10px;color:#30243c;font-weight:700;cursor:pointer}.response-option:has(input:checked){border-color:#7c3aed;background:#f5f0ff;color:#5b21b6}.response-option input{accent-color:#7c3aed}.response-comment{display:flex;flex-direction:column;gap:8px;margin:20px 0 14px;color:#5b5566;font-size:12px;font-weight:750}.response-comment textarea{min-height:120px;resize:vertical;border:1px solid #ded8eb;border-radius:10px;padding:12px;font:inherit;color:#292333}.response-success{padding:14px;border-radius:10px;background:#ecfdf5;border:1px solid #bbf7d0;color:#166534;font-weight:700}.enterprise-box h3{margin-top:0;color:#6d28d9}.enterprise-box .plano-lista{color:#30243c}.plano-badge{display:inline-block;margin-bottom:12px;color:#7c3aed;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px}@media(max-width:600px){.response-card{padding:20px}.proposal-dynamic .capa-titulo{font-size:34px}}`;
