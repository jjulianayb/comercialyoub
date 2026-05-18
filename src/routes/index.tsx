import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  checkProposalAccess,
  unlockProposal,
} from "@/lib/proposal-access.functions";

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

const WHATSAPP =
  "https://wa.me/5521991417327?text=Ol%C3%A1%2C%20vim%20pela%20proposta%20youB%20e%20gostaria%20de%20falar%20com%20o%20time.";

function Gate() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const check = useServerFn(checkProposalAccess);

  useEffect(() => {
    let alive = true;
    check()
      .then((r) => {
        if (alive) setUnlocked(r.unlocked);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setChecked(true);
      });
    return () => {
      alive = false;
    };
  }, [check]);

  if (!checked) return <GateSkeleton />;
  if (!unlocked) return <Login onSuccess={() => setUnlocked(true)} />;
  return <Proposta />;
}

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

function Login({ onSuccess }: { onSuccess: () => void }) {
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
      const res = await unlock({ data: { password: pwd } });
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
              <label className="gate-label" htmlFor="pwd">
                Senha de acesso
              </label>
              <div className="gate-input-wrap">
                <input
                  id="pwd"
                  type={show ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Digite a senha"
                  autoComplete="off"
                  autoFocus
                  className="gate-input"
                />
                <button
                  type="button"
                  className="gate-eye"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                >
                  {show ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {err && <div className="gate-error">{err}</div>}

              <button type="submit" className="gate-btn" disabled={loading}>
                {loading ? "Validando…" : "Liberar proposta"}
                <span className="gate-btn-arrow">→</span>
              </button>

              <div className="gate-help">
                Não tem a senha?{" "}
                <a href={WHATSAPP} target="_blank" rel="noreferrer">
                  Falar com a youB
                </a>
              </div>
            </form>

            <div className="gate-trust">
              <div className="gate-trust-item">
                <strong>+50</strong>
                <span>empresas atendidas</span>
              </div>
              <div className="gate-trust-divider" />
              <div className="gate-trust-item">
                <strong>+5k</strong>
                <span>líderes desenvolvidos</span>
              </div>
              <div className="gate-trust-divider" />
              <div className="gate-trust-item">
                <strong>98%</strong>
                <span>satisfação</span>
              </div>
            </div>
          </div>

          <footer className="gate-foot">
            <span>© 2026 youB · Documento confidencial</span>
            <span>rhyoub.com.br</span>
          </footer>
        </main>
      </div>

      <style>{gateCss}</style>
    </div>
  );
}

function Proposta() {
  useEffect(() => {
    const block = (e: Event) => {
      e.preventDefault();
      return false;
    };
    const blockKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      // Bloqueia: copiar, salvar, imprimir, selecionar tudo, ver fonte
      if (mod && ["c", "s", "p", "a", "u", "x"].includes(k)) {
        e.preventDefault();
        return false;
      }
      // Bloqueia F12 / DevTools
      if (k === "f12") {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("selectstart", block);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("selectstart", block);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return (
    <div className="proposta proposta-locked">
      <Capa />
      <Contexto />
      <Objetivo />
      <Escopo />
      <Metodologia />
      <SoftwareIA />
      <Cronograma />
      <ConexaoValor />
      <Investimento />
      <Canais />
      <Sobre />
      <ProximosPassos />
      <Rodape />
      <style>{css}</style>
      <style>{lockCss}</style>
    </div>
  );
}

const lockCss = `
.proposta-locked,
.proposta-locked * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
.proposta-locked input,
.proposta-locked textarea {
  -webkit-user-select: text;
  user-select: text;
}
.proposta-locked img {
  -webkit-user-drag: none;
  user-drag: none;
  pointer-events: none;
}
.proposta-locked a img { pointer-events: auto; }
@media print {
  body:not(.printing) .proposta-locked { display: none !important; }
  body:not(.printing)::before {
    content: "Documento confidencial — impressão desabilitada.";
    display: block; padding: 40px; font-family: sans-serif;
    font-size: 18px; color: #333;
  }
  body.printing { background: #fff !important; }
  body.printing .no-print { display: none !important; }
  body.printing .proposta-locked,
  body.printing .proposta-locked * {
    -webkit-user-select: auto !important;
    user-select: auto !important;
  }
  body.printing .proposta-locked img { pointer-events: auto !important; }
  body.printing .sec,
  body.printing .sec-soft,
  body.printing .capa,
  body.printing .plano,
  body.printing section,
  body.printing article {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  body.printing h1, body.printing h2, body.printing h3 {
    break-after: avoid;
    page-break-after: avoid;
  }
  body.printing .capa { min-height: auto !important; page-break-after: always; }
  body.printing .planos { display: block !important; }
  body.printing .plano { margin-bottom: 16px !important; }
  @page { margin: 14mm; size: A4; }
}
`;


/* ───────── Componentes ───────── */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`yb-logo ${light ? "is-light" : ""}`}>
      you<span>B.</span>
    </div>
  );
}

function exportarPDF() {
  if (typeof window === "undefined") return;
  document.body.classList.add("printing");
  const cleanup = () => {
    document.body.classList.remove("printing");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(() => window.print(), 50);
}

function Capa() {
  return (
    <header className="capa">
      <nav className="capa-nav">
        <Logo light />
        <div className="capa-nav-actions">
          <button type="button" onClick={exportarPDF} className="btn-ghost-light btn-sm no-print">
            ↓ Exportar PDF
          </button>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-violet btn-sm no-print">
            Agendar Conversa
          </a>
        </div>
      </nav>

      <div className="capa-body">
        <span className="eyebrow eyebrow-light">Ecossistema em DHO e Inteligência de pessoas</span>
        <h1 className="capa-titulo">
          Consultoria em RH com <em>software próprio</em>
          <br />
          e IA para clima, cargos & salários.
        </h1>
        <p className="capa-desc">
          Projeto integrado para uma operação de ~500 colaboradores, com unidades
          em Minas Gerais e Ponta Grossa/PR — unindo diagnóstico profundo,
          estruturação técnica e dashboards executivos com inteligência artificial.
        </p>

        <div className="capa-cta-row">
          <a href="#investimento" className="btn-violet">
            Ver planos de investimento
          </a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-ghost-light">
            Falar com a youB →
          </a>
        </div>

        <div className="capa-empresa">
          <div className="capa-empresa-ico">★</div>
          <div>
            <div className="capa-empresa-detalhe">Apresentado para</div>
            <div className="capa-empresa-nome">Grupo SA</div>
          </div>
        </div>
      </div>

      <div className="capa-footer">
        <span className="capa-meta">Maio de 2026 · Versão 1.0</span>
        <span className="capa-meta">Documento Confidencial</span>
      </div>
    </header>
  );
}

function Contexto() {
  return (
    <section className="sec">
      <span className="eyebrow">01 — Contexto</span>
      <h2 className="sec-h">
        Mapeamento <span>inicial</span>
      </h2>
      <p className="sec-sub">
        Antes de qualquer proposta, mapeamos o ambiente, os desafios e as
        oportunidades reais da operação.
      </p>

      <div className="ctx-box">
        <p>
          O Grupo SA opera com aproximadamente{" "}
          <strong>500 colaboradores</strong>, distribuídos entre as unidades de{" "}
          <strong>Minas Gerais</strong> e <strong>Ponta Grossa/PR</strong>, com
          alta diversidade de cargos e funções. Esse contexto exige uma base
          sólida de RH — clima, estrutura de cargos, remuneração e
          dimensionamento — para sustentar o crescimento com consistência,
          equidade interna e competitividade externa.
        </p>
        <div className="ctx-pills">
          {[
            ["👥", "~500 colaboradores"],
            ["🏢", "Unidades MG e Ponta Grossa/PR"],
            ["📊", "~150 cargos mapeados"],
            ["🚀", "Decisão prevista em 30 dias"],
          ].map(([i, t]) => (
            <span key={t} className="pill">
              <span>{i}</span>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="nums-grid">
        {[
          ["3", "Planos comerciais estruturados"],
          ["9", "Meses no escopo mais completo"],
          ["1", "Software próprio com IA integrada"],
        ].map(([n, l]) => (
          <div key={l} className="num-card">
            <div className="n">{n}</div>
            <div className="l">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Objetivo() {
  return (
    <section className="sec-soft">
      <div className="sec-inner">
        <span className="eyebrow">02 — Objetivo</span>
        <h2 className="sec-h">
          O que vamos construir <span>juntos</span>
        </h2>
        <p className="sec-sub">
          Um norte claro para orientar cada decisão e entrega ao longo do projeto.
        </p>

        <div className="obj-card">
          <span className="obj-tag">Objetivos do Projeto</span>
          <ul className="obj-lista">
            <li>Mapear de forma estruturada a percepção dos colaboradores sobre clima, liderança e ambiente de trabalho.</li>
            <li>Avaliar a maturidade e o desenho atual da área de RH, identificando riscos, gargalos e oportunidades de evolução.</li>
            <li>Comparar práticas internas de salários, benefícios e remuneração com o mercado de referência.</li>
            <li>Estruturar uma tabela salarial com hierarquização de cargos, garantindo consistência interna e competitividade externa.</li>
            <li>Apoiar decisões de dimensionamento qualiquantitativo do quadro, por unidade e área, com base em dashboards consolidados.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const FRENTES = [
  ["🌡️", "Pesquisa de Clima Organizacional", "Diagnóstico do ambiente interno com análise de engajamento, satisfação e fatores críticos de retenção."],
  ["🔍", "Diagnóstico da Função de RH", "Mapeamento dos processos atuais, identificação de gaps e oportunidades de evolução estrutural da área."],
  ["📊", "Estrutura de Cargos e Salários", "Construção de grade salarial hierarquizada com equidade interna e alinhamento ao mercado."],
  ["💰", "Pesquisa de Remuneração", "Benchmarking de remuneração, benefícios e práticas de mercado por segmento e porte."],
  ["📋", "Descrição de Cargos", "Descritivos detalhados por função com requisitos, responsabilidades e perfil comportamental esperado."],
  ["👥", "Dimensionamento de Equipe", "Análise qualiquantitativa do quadro de pessoal com recomendações de eficiência e redesenho organizacional."],
];

function Escopo() {
  return (
    <section className="sec">
      <span className="eyebrow">03 — Escopo</span>
      <h2 className="sec-h">
        Seis frentes de <span>atuação</span>
      </h2>
      <p className="sec-sub">
        Estrutura modular que permite priorizar as frentes de maior impacto para
        a realidade da empresa.
      </p>
      <div className="escopo-grid">
        {FRENTES.map(([i, t, d]) => (
          <article key={t} className="escopo-card">
            <div className="escopo-ico">{i}</div>
            <h4>{t}</h4>
            <p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metodologia() {
  const items = [
    ["01", "Análise de dados e documentos", "Leitura de relatórios, indicadores de pessoas e materiais de RH disponíveis."],
    ["02", "Escuta qualificada", "Entrevistas estruturadas com RH, liderança e áreas-chave quando necessário."],
    ["03", "Instrumentos de pesquisa", "Pesquisas quantitativas e qualitativas adaptadas à operação de ~500 colaboradores."],
    ["04", "Modelagem técnica", "Modelos próprios para cargos, faixas salariais, dimensionamento e priorização de ações."],
    ["05", "Integração no software youB", "Consolidação dos resultados em sistema próprio, com relatórios executivos e dashboards com IA."],
    ["06", "Validação conjunta", "Alinhamento das recomendações com RH e diretoria, garantindo aderência e viabilidade."],
  ];
  return (
    <section className="sec-dark">
      <div className="sec-inner">
        <span className="eyebrow eyebrow-light">04 — Metodologia</span>
        <h2 className="sec-h is-light">
          Metodologia de <span>trabalho</span>
        </h2>
        <p className="sec-sub is-light">
          Conduzimos o projeto com metodologia própria da youB para diagnóstico
          e estruturação de Recursos Humanos.
        </p>

        <div className="met-grid">
          {items.map(([n, t, d]) => (
            <div key={n} className="met-item">
              <div className="met-num">{n}</div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="met-desc">
          <p>
            Os instrumentos, modelos e algoritmos utilizados são de{" "}
            <strong>uso exclusivo da consultoria</strong> e serão personalizados
            conforme o contexto da empresa.
          </p>
        </div>
      </div>
    </section>
  );
}

function SoftwareIA() {
  const feats = [
    ["🗂️", "Base única de dados", "Visão consolidada de ~500 colaboradores e ~150 cargos por unidade (MG e PR), área e nível hierárquico."],
    ["⚙️", "Consolidação automática", "Pesquisas de clima, salários e dimensionamento integradas, reduzindo retrabalho e risco de erro manual."],
    ["📑", "Relatórios executivos", "HTML único com linguagem objetiva, riscos, tendências e recomendações priorizadas."],
    ["🤖", "Dashboards com IA", "Filtros por unidade e área, insights automáticos e respostas a perguntas como “onde estão os maiores riscos de rotatividade?”."],
  ];
  return (
    <section className="sec-soft">
      <div className="sec-inner">
        <span className="eyebrow">05 — Software & IA</span>
        <h2 className="sec-h">
          Software próprio e <span>dashboards com IA</span>
        </h2>
        <p className="sec-sub">
          Todo o projeto será operacionalizado em nosso software proprietário,
          desenvolvido para suportar diagnósticos de RH, gestão de liderança e
          projetos de cargos e salários.
        </p>
        <div className="sw-grid">
          {feats.map(([i, t, d]) => (
            <article key={t} className="sw-card">
              <div className="sw-ico">{i}</div>
              <h4>{t}</h4>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <div className="sw-nota">
          <p>
            Mais velocidade de análise, transparência nas decisões e facilidade
            de apresentação para diretoria e conselho.
          </p>
        </div>
      </div>
    </section>
  );
}

function Cronograma() {
  const fases = [
    ["1", "Plano Essencial", "3 meses", "Pesquisa de clima, diagnóstico da função de RH e pesquisa de salários, benefícios e remuneração."],
    ["2", "Plano Estrutural", "6 meses", "Inclui desenvolvimento da estrutura de cargos, tabela salarial e descrições de cargos."],
    ["3", "Plano Estratégico", "9 meses", "Abrange também o dimensionamento qualiquantitativo do quadro e a consolidação integrada dos resultados."],
  ];
  return (
    <section className="sec">
      <span className="eyebrow">06 — Prazos</span>
      <h2 className="sec-h">
        Prazos estimados de <span>execução</span>
      </h2>
      <p className="sec-sub">
        Considerando disponibilidade de informações internas, agenda das
        lideranças e aprovação das etapas intermediárias.
      </p>
      <div className="crono">
        {fases.map(([n, t, d, p], idx) => (
          <div key={n} className={`fase ${idx === fases.length - 1 ? "is-last" : ""}`}>
            <div className="fase-esq">
              <div className="fase-dot">{n}</div>
              <div className="fase-line" />
            </div>
            <div className="fase-body">
              <h4>{t}</h4>
              <span className="fase-dur">{d}</span>
              <p>{p}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="crono-nota">
        O cronograma detalhado será alinhado na reunião de kick-off,
        considerando o calendário interno e marcos relevantes do negócio.
      </p>
    </section>
  );
}

const PLANOS = [
  {
    nome: "Plano Essencial",
    subtitulo: "Diagnóstico Integrado",
    foco: "Cobre os 4 escopos iniciais do briefing: clima, diagnóstico de RH e pesquisa de remuneração, com tabela salarial estruturada.",
    valor: "55.000",
    prazo: "3 meses",
    pagamento: "À vista com 5% de desconto, ou em até 3 parcelas mensais (1ª na assinatura).",
    itens: [
      "Pesquisa de clima organizacional para ~500 colaboradores",
      "Diagnóstico da função de RH com plano de ação macro",
      "Pesquisa de salários, benefícios e práticas de remuneração",
      "Consolidação dos resultados no software youB com dashboards de IA",
    ],
    entregaveis: [
      "Relatório executivo de clima por unidade, área e nível hierárquico",
      "Diagnóstico de RH com prioridades de evolução",
      "Comparativo de remuneração com o mercado de referência",
    ],
    beneficios: [
      "Decisões de RH baseadas em dados, não em percepção",
      "Redução de turnover ao agir sobre os reais ofensores de clima",
      "Política de remuneração competitiva e justa, evitando perda de talentos",
      "Ganho de tempo da liderança com diagnóstico pronto e priorizado",
    ],
    diferencial: "Visão clara do clima, da maturidade de RH e do posicionamento de remuneração — base confiável para decisões de curto prazo.",
    cta: "Solicitar proposta",
  },
  {
    nome: "Plano Estrutural",
    subtitulo: "Cargos, Salários e Descrições",
    foco: "Inclui tudo do Plano Essencial e adiciona estrutura de cargos, tabela salarial hierarquizada e descrições de cargo para os ~150 cargos.",
    valor: "162.000",
    prazo: "6 meses",
    pagamento: "À vista com 8% de desconto, ou em até 6 parcelas mensais (1ª na assinatura).",
    destaque: true,
    itens: [
      "Tudo do Plano Essencial",
      "Tabela salarial com hierarquização de cargos (~150 cargos)",
      "Organização em famílias e níveis (operacional, administrativo, liderança)",
      "Descrição de cargos: missão, responsabilidades, requisitos e relacionamentos",
      "Parametrização da estrutura no software youB com dashboards consolidados",
      "Business Partner youB presente na empresa 2x por semana acompanhando o projeto",
    ],
    entregaveis: [
      "Estrutura de cargos e salários consistente e tecnicamente fundamentada",
      "Catálogo completo de descrições de cargo",
      "Dashboards de cargos e salários no App youB",
    ],
    beneficios: [
      "Equidade interna e fim das decisões salariais casuísticas",
      "Plano de carreira claro, aumentando engajamento e retenção",
      "Processos seletivos mais ágeis com descrições de cargo prontas",
      "Base sólida para promoções, méritos e enquadramentos defensáveis juridicamente",
      "Redução de passivo trabalhista por desvio de função",
    ],
    diferencial: "Reduz decisões casuísticas de remuneração e promoções, ampliando a percepção de justiça interna e transparência.",
    cta: "Escolher este plano",
  },
  {
    nome: "Plano Estratégico",
    subtitulo: "Estrutura e Dimensionamento de Pessoal",
    foco: "Inclui tudo do Plano Estrutural e adiciona o dimensionamento qualiquantitativo do quadro nas unidades MG e Ponta Grossa/PR.",
    valor: "180.000",
    prazo: "9 meses",
    pagamento: "À vista com 10% de desconto, ou em até 9 parcelas mensais (1ª na assinatura).",
    itens: [
      "Tudo do Plano Estrutural",
      "Dimensionamento qualiquantitativo por unidade, área e tipo de função",
      "Identificação de gaps de equipe e propostas de ajuste",
      "Mapa de prioridades para otimização de headcount",
      "Cenários de dimensionamento integrados aos dashboards com IA",
    ],
    entregaveis: [
      "Modelo de dimensionamento por unidade com simulações de cenário",
      "Mapa de adequação quadro vs. estratégia",
      "Visão completa da arquitetura de pessoas pronta para suportar crescimento",
    ],
    beneficios: [
      "Otimização de headcount e redução de custo de folha sem perder produtividade",
      "Capacidade de escalar unidades novas com previsibilidade de quadro",
      "Decisões de contratação e remanejamento sustentadas por dados",
      "Maior produtividade por colaborador com a equipe certa em cada função",
      "Arquitetura de pessoas preparada para fusões, expansão ou novas operações",
    ],
    diferencial: "Decisões de contratação, remanejamento e ajuste de quadro baseadas em dados — não em percepções isoladas.",
    cta: "Solicitar proposta",
  },
];

function Investimento() {
  return (
    <section id="investimento" className="sec-soft">
      <div className="sec-inner">
        <span className="eyebrow">08 — Investimento</span>
        <h2 className="sec-h">
          Escolha o <span>plano ideal</span>
        </h2>
        <p className="sec-sub">
          Três opções estruturadas de acordo com o nível de profundidade e
          escopo desejado.
        </p>

        <div className="planos">
          {PLANOS.map((p) => (
            <article key={p.nome} className={`plano ${p.destaque ? "is-destaque" : ""}`}>
              {p.destaque && <span className="plano-badge">★ Recomendado</span>}
              <h3>{p.nome}</h3>
              <span className="plano-sub">{p.subtitulo}</span>
              <p className="plano-foco">{p.foco}</p>
              <div className="plano-preco">
                <span className="moeda">R$</span>
                <span className="valor">{p.valor}</span>
              </div>
              <span className="plano-prazo">Prazo estimado: {p.prazo}</span>
              <div className="plano-pgto">{p.pagamento}</div>
              <ul className="plano-lista">
                {p.itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <div className="plano-entregaveis">
                <span className="etit">Entregáveis</span>
                <ul>
                  {p.entregaveis.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div className="plano-diferencial">
                <span className="etit">Diferencial</span>
                <p>{p.diferencial}</p>
              </div>
              <div className="plano-beneficios">
                <span className="etit">Como esse investimento se transforma em benefícios</span>
                <ul>
                  {p.beneficios.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className={`btn-plan ${p.destaque ? "btn-violet" : "btn-outline"}`}
              >
                {p.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="conds">
          {[
            ["Investimento incluso", "Os valores contemplam todas as atividades de consultoria, uso do software youB e acesso aos dashboards com IA durante o período do projeto."],
            ["Validade da proposta", "30 dias a partir da data de emissão, sujeita à disponibilidade de agenda."],
            ["Início do projeto", "Em até 5 dias úteis após assinatura do contrato e confirmação do pagamento inicial."],
          ].map(([t, d]) => (
            <div key={t} className="cond-item">
              <div className="ct">{t}</div>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="logistica">
          <span className="etit">Condições logísticas e premissas gerais</span>
          <ul>
            <li>Atividades presenciais nas unidades de MG e Ponta Grossa/PR serão planejadas previamente, otimizando agendas para reduzir custos logísticos.</li>
            <li>Custos de deslocamento, hospedagem, alimentação e traslados locais da equipe de consultoria não estão inclusos nos honorários e serão de responsabilidade da contratante, conforme política interna da empresa.</li>
            <li>Sempre que aplicável, as atividades poderão ser conduzidas em formato remoto, mantendo a qualidade técnica das entregas.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ConexaoValor() {
  const blocos = [
    {
      n: "01",
      t: "Diagnóstico vira decisão",
      d: "Pesquisa de Clima + DHO 360 conectam dados de engajamento, processos e cultura — transformando percepção em mapa acionável de prioridades.",
    },
    {
      n: "02",
      t: "Estrutura sustenta crescimento",
      d: "Grade Salarial, Job Description Matrix e Survey de Remuneração criam a coluna vertebral de equidade interna e competitividade externa.",
    },
    {
      n: "03",
      t: "Dimensionamento gera eficiência",
      d: "Headcount Planning identifica sub e sobrecarga e libera margem operacional — pagando o investimento com a própria reorganização do quadro.",
    },
    {
      n: "04",
      t: "Ecossistema mantém o ganho",
      d: "LMS youB e mentoria de board garantem que a transformação não pare no relatório — vira prática contínua dentro da plataforma.",
    },
  ];
  return (
    <section className="sec">
      <span className="eyebrow">07 — Lógica do investimento</span>
      <h2 className="sec-h">
        Benefícios do <span>investimento</span>
      </h2>
      <p className="sec-sub">
        Cada entrega conecta a próxima. Não é uma soma de produtos avulsos —
        é uma cadeia de valor desenhada para gerar retorno financeiro,
        cultural e estratégico mensurável.
      </p>

      <div className="cv-grid">
        {blocos.map((b) => (
          <article key={b.n} className="cv-card">
            <div className="cv-num">{b.n}</div>
            <h4>{b.t}</h4>
            <p>{b.d}</p>
          </article>
        ))}
      </div>

      <div className="cv-roi">
        <div className="cv-roi-tag">Robustez do trabalho</div>
        <p>
          Metodologia proprietária aplicada em <strong>+50 empresas</strong>,
          desenvolvendo <strong>+5 mil líderes</strong> com{" "}
          <strong>98% de satisfação</strong>. Entregamos consultoria com a
          profundidade de uma boutique e a escala de uma plataforma — apoiados
          por dados, IA e um time multidisciplinar de especialistas em DHO.
        </p>
      </div>
    </section>
  );
}

function Canais() {
  return (
    <section className="canais">
      <div className="canais-inner">
        <span className="eyebrow eyebrow-light">Continue a conversa</span>
        <h3>Vamos avançar quando fizer sentido para você.</h3>
        <p>
          Conheça mais sobre nosso ecossistema ou fale diretamente com um
          consultor youB para ajustar o escopo ao seu momento.
        </p>
        <div className="canais-row">
          <a
            href="https://www.rhyoub.com.br"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-light"
          >
            Visitar rhyoub.com.br →
          </a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-violet">
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section className="sec">
      <span className="eyebrow">09 — Quem somos</span>
      <h2 className="sec-h">
        A empresa por trás do <span>projeto</span>
      </h2>
      <p className="sec-sub">
        Ecossistema completo de DHO — mais do que consultoria, somos parceiros
        de transformação.
      </p>

      <div className="sobre-grid">
        <div className="sobre-txt">
          <p>
            A <strong>youB</strong> é uma empresa de educação corporativa e
            desenvolvimento humano e organizacional que integra inteligência
            artificial, comportamento humano e liderança estratégica para gerar
            transformações reais nas organizações.
          </p>
          <p>
            Nossa atuação vai além do diagnóstico. Apoiamos empresas na
            construção de estruturas de RH que funcionam como{" "}
            <strong>verdadeiras alavancas de crescimento</strong> — com
            metodologia proprietária, foco em dados e entregas que movem o
            negócio.
          </p>
          <p>
            Conectamos desenvolvimento humano, cultura e liderança em
            experiências contínuas, profundas e práticas.
          </p>
        </div>
        <div className="sobre-nums">
          {[
            ["+50", "Empresas atendidas"],
            ["+5k", "Líderes desenvolvidos"],
            ["98%", "Índice de satisfação"],
            ["IA+", "Metodologia integrada com tecnologia"],
          ].map(([n, l]) => (
            <div key={l} className="sobre-num">
              <div className="sn">{n}</div>
              <div className="sl">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProximosPassos() {
  const steps = [
    ["01", "Alinhamento", "Conversa estratégica para ajustar escopo, tirar dúvidas e confirmar a melhor abordagem — sem compromisso."],
    ["02", "Contrato & Kick-off", "Assinatura do contrato, pagamento inicial e reunião de kick-off com as equipes envolvidas."],
    ["03", "Execução", "Início do projeto com acompanhamento semanal, pontos de validação e entrega nas datas acordadas."],
  ];
  return (
    <section className="sec-dark">
      <div className="sec-inner">
        <span className="eyebrow eyebrow-light">10 — Próximos passos</span>
        <h2 className="sec-h is-light">
          Como avançar <span>a partir daqui</span>
        </h2>
        <p className="sec-sub is-light">
          Três etapas simples para colocar o projeto em movimento.
        </p>

        <div className="steps">
          {steps.map(([n, t, d], i) => (
            <div key={n} className={`step ${i === 0 ? "is-active" : ""}`}>
              <div className="step-n">{n}</div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="cta-box">
          <h3>Pronto para transformar a gestão de pessoas?</h3>
          <p>
            Agende uma conversa estratégica e descubra qual solução se encaixa
            no momento da sua empresa.
          </p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="cta-btn">
            Agendar conversa estratégica →
          </a>
        </div>
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer>
      <div className="ft-brand">
        <Logo light />
        <span className="ft-tag">Desenvolvimento Humano · Cultura · Liderança</span>
      </div>
      <div className="ft-info">
        <p>
          <a href="https://www.rhyoub.com.br" target="_blank" rel="noreferrer">
            www.rhyoub.com.br
          </a>
        </p>
        <p>
          <a href="mailto:contato@rhyoub.com.br">contato@rhyoub.com.br</a>
        </p>
        <p>(21) 99141-7327</p>
      </div>
      <div className="ft-copy">
        © 2026 youB. Todos os direitos reservados. · Documento confidencial
        elaborado exclusivamente para o cliente indicado na capa.
      </div>
    </footer>
  );
}

/* ───────── CSS ───────── */

const css = `
.proposta {
  --v: var(--youb-violet);
  --vs: var(--youb-violet-strong);
  --vsoft: var(--youb-violet-soft);
  --vglow: var(--youb-violet-glow);
  --ink: var(--youb-ink);
  --ink-soft: var(--youb-ink-soft);
  --line: var(--youb-line);
  --surface: var(--youb-surface);

  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: var(--ink);
  background: #fff;
  -webkit-font-smoothing: antialiased;
}
.proposta * { box-sizing: border-box; }

/* logo */
.yb-logo {
  font-size: 26px; font-weight: 800; letter-spacing: -0.02em;
  color: var(--ink); line-height: 1;
}
.yb-logo span { color: var(--v); }
.yb-logo.is-light { color: #fff; }

/* eyebrow */
.eyebrow {
  display: inline-block;
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--v); margin-bottom: 14px;
}
.eyebrow-light { color: var(--vglow); }

/* botões */
.btn-violet {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--v); color: #fff;
  padding: 14px 28px; border-radius: 999px;
  font-size: 14px; font-weight: 600; letter-spacing: 0.01em;
  text-decoration: none; border: none;
  box-shadow: var(--youb-shadow);
  transition: transform .18s ease, background .18s ease;
}
.btn-violet:hover { background: var(--vs); transform: translateY(-1px); }
.btn-sm { padding: 10px 22px; font-size: 13px; box-shadow: none; }
.btn-ghost-light {
  display: inline-flex; align-items: center;
  color: rgba(255,255,255,.85); text-decoration: none;
  font-size: 14px; font-weight: 500; padding: 14px 4px;
  transition: color .18s;
}
.btn-ghost-light:hover { color: #fff; }
.btn-outline {
  border: 1.5px solid var(--line); color: var(--ink);
  background: transparent; box-shadow: none;
}
.btn-outline:hover { border-color: var(--v); color: var(--v); background: var(--vsoft); transform: none; }

/* CAPA */
.capa {
  background: linear-gradient(160deg, #0d0716 0%, #1a0f2e 60%, #2a1450 100%);
  min-height: 100vh;
  display: grid; grid-template-rows: auto 1fr auto;
  padding: 40px 72px 56px;
  position: relative; overflow: hidden;
  color: #fff;
}
.capa::before {
  content: ''; position: absolute;
  top: -240px; right: -180px;
  width: 640px; height: 640px; border-radius: 50%;
  background: radial-gradient(circle, oklch(0.55 0.24 295 / 0.45) 0%, transparent 70%);
  pointer-events: none;
}
.capa::after {
  content: ''; position: absolute;
  bottom: -160px; left: -140px;
  width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, oklch(0.65 0.22 295 / 0.25) 0%, transparent 70%);
  pointer-events: none;
}
.capa-nav { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 3; gap: 12px; }
.capa-nav-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
.capa-body { display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 3; max-width: 1080px; margin: 0 auto; width: 100%; padding: 60px 0; }
.capa-titulo {
  font-size: clamp(40px, 6vw, 76px);
  font-weight: 800; line-height: 1.05; letter-spacing: -0.025em;
  max-width: 900px; margin-bottom: 28px;
}
.capa-titulo em { font-style: normal; color: var(--vglow); }
.capa-desc {
  font-size: 18px; color: rgba(255,255,255,.7);
  max-width: 600px; line-height: 1.65; margin-bottom: 40px;
}
.capa-cta-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 56px; }
.capa-empresa {
  display: inline-flex; align-items: center; gap: 18px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 16px; padding: 18px 26px; width: fit-content;
  backdrop-filter: blur(8px);
}
.capa-empresa-ico {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--v); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.capa-empresa-detalhe { font-size: 11px; color: rgba(255,255,255,.75); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
.capa-empresa-nome { font-size: 18px; font-weight: 700; color: #fff; }
.capa-footer { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 3; max-width: 1080px; margin: 0 auto; width: 100%; }
.capa-meta { font-size: 11px; color: rgba(255,255,255,.65); letter-spacing: 0.1em; text-transform: uppercase; }

/* sections base */
.sec { padding: 110px 72px; max-width: 1080px; margin: 0 auto; }
.sec-soft { background: var(--surface); padding: 110px 72px; }
.sec-dark { background: #0d0716; padding: 110px 72px; position: relative; overflow: hidden; }
.sec-dark::before {
  content: ''; position: absolute; top: -200px; right: -200px;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, oklch(0.55 0.24 295 / 0.25) 0%, transparent 70%);
  pointer-events: none;
}
.sec-inner { max-width: 1080px; margin: 0 auto; position: relative; z-index: 2; }
.sec-h {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
  color: var(--ink); margin-bottom: 16px;
}
.sec-h span { color: var(--v); }
.sec-h.is-light { color: #fff; }
.sec-h.is-light span { color: var(--vglow); }
.sec-sub {
  font-size: 17px; color: var(--ink-soft);
  max-width: 620px; margin-bottom: 64px; line-height: 1.65;
}
.sec-sub.is-light { color: rgba(255,255,255,.6); }

/* contexto */
.ctx-box {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--v);
  border-radius: 0 18px 18px 0;
  padding: 44px 48px; margin-bottom: 32px;
}
.ctx-box p { font-size: 17px; color: var(--ink); line-height: 1.8; }
.ctx-box strong { color: var(--v); font-weight: 700; }
.ctx-pills { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.pill {
  background: #fff; border: 1px solid var(--line);
  border-radius: 999px; padding: 10px 20px;
  font-size: 13px; color: var(--ink-soft);
  display: inline-flex; align-items: center; gap: 8px;
}
.pill > span { font-size: 16px; }

.nums-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 40px; }
.num-card {
  background: #fff; border: 1px solid var(--line);
  border-radius: 18px; padding: 36px 28px; text-align: center;
  transition: border-color .18s, transform .18s, box-shadow .18s;
}
.num-card:hover { border-color: var(--v); transform: translateY(-3px); box-shadow: var(--youb-shadow); }
.num-card .n { font-size: 48px; font-weight: 800; color: var(--v); line-height: 1; letter-spacing: -0.03em; margin-bottom: 12px; }
.num-card .l { font-size: 13px; color: var(--ink-soft); line-height: 1.5; }

/* objetivo */
.obj-card {
  background: linear-gradient(135deg, var(--v) 0%, var(--vs) 100%);
  border-radius: 24px; padding: 64px;
  position: relative; overflow: hidden; color: #fff;
  box-shadow: var(--youb-shadow);
}
.obj-card::before {
  content: ''; position: absolute; top: -120px; right: -120px;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.1) 0%, transparent 70%);
}
.obj-tag {
  display: inline-block; position: relative; z-index: 2;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  color: #fff; padding: 6px 16px; border-radius: 999px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
  margin-bottom: 28px; backdrop-filter: blur(8px);
}
.obj-card p { font-size: 22px; font-weight: 400; line-height: 1.55; max-width: 760px; position: relative; z-index: 2; }
.obj-card strong { font-weight: 700; }

/* escopo */
.escopo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.escopo-card {
  background: #fff; border: 1px solid var(--line);
  border-radius: 20px; padding: 36px 32px;
  position: relative; overflow: hidden;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.escopo-card:hover { border-color: var(--v); transform: translateY(-3px); box-shadow: var(--youb-shadow); }
.escopo-ico {
  width: 56px; height: 56px;
  background: var(--vsoft); border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 22px;
}
.escopo-card h4 { font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.escopo-card p { font-size: 14px; color: var(--ink-soft); line-height: 1.65; }

/* metodologia */
.met-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
.met-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 18px; padding: 32px 24px; text-align: center;
  transition: border-color .2s, background .2s;
}
.met-item:hover { border-color: var(--vglow); background: rgba(255,255,255,.06); }
.met-num { font-size: 40px; font-weight: 800; color: var(--vglow); opacity: .35; margin-bottom: 14px; line-height: 1; }
.met-item h4 { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.met-item p { font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.6; }
.met-desc {
  background: linear-gradient(135deg, rgba(124,58,237,.15) 0%, rgba(124,58,237,.05) 100%);
  border: 1px solid rgba(124,58,237,.25);
  border-radius: 18px; padding: 36px 44px;
}
.met-desc p { font-size: 16px; color: rgba(255,255,255,.78); line-height: 1.75; }
.met-desc strong { color: #fff; font-weight: 700; }

/* cronograma */
.crono { display: flex; flex-direction: column; }
.fase { display: flex; gap: 32px; }
.fase-esq { display: flex; flex-direction: column; align-items: center; width: 52px; flex-shrink: 0; }
.fase-dot {
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--v); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700;
  flex-shrink: 0; z-index: 2;
  box-shadow: var(--youb-shadow);
}
.fase-line { width: 2px; flex: 1; background: linear-gradient(to bottom, var(--v), var(--line)); }
.fase.is-last .fase-line { display: none; }
.fase-body { padding-bottom: 48px; flex: 1; padding-top: 8px; }
.fase-body h4 { font-size: 19px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.fase-dur {
  display: inline-block; font-size: 11px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--v); background: var(--vsoft);
  padding: 5px 14px; border-radius: 999px; margin-bottom: 14px;
}
.fase-body p { font-size: 15px; color: var(--ink-soft); line-height: 1.7; }

/* planos */
.planos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; align-items: stretch; }
.plano {
  background: #fff; border: 1px solid var(--line);
  border-radius: 24px; padding: 40px 32px;
  position: relative; display: flex; flex-direction: column;
  transition: transform .2s, box-shadow .2s;
}
.plano:hover { transform: translateY(-4px); box-shadow: var(--youb-shadow); }
.plano.is-destaque {
  background: linear-gradient(160deg, #1a0f2e 0%, #0d0716 100%);
  border-color: transparent; color: #fff;
  transform: scale(1.04); box-shadow: var(--youb-shadow);
}
.plano.is-destaque:hover { transform: scale(1.04) translateY(-4px); }
.plano-badge {
  position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(90deg, var(--v), var(--vglow));
  color: #fff; font-size: 10px; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 7px 22px; border-radius: 999px; white-space: nowrap;
  box-shadow: var(--youb-shadow);
}
.plano h3 { font-size: 19px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.plano.is-destaque h3 { color: #fff; }
.plano-foco { font-size: 13px; color: var(--ink-soft); line-height: 1.55; margin-bottom: 26px; }
.plano.is-destaque .plano-foco { color: rgba(255,255,255,.55); }
.plano-preco { padding: 22px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin-bottom: 26px; }
.plano.is-destaque .plano-preco { border-color: rgba(255,255,255,.1); }
.plano-preco .moeda { font-size: 16px; font-weight: 600; vertical-align: super; margin-right: 4px; color: var(--v); }
.plano.is-destaque .plano-preco .moeda { color: var(--vglow); }
.plano-preco .valor { font-size: 40px; font-weight: 800; color: var(--ink); letter-spacing: -0.025em; }
.plano.is-destaque .plano-preco .valor { color: #fff; }
.plano-lista { list-style: none; margin: 0 0 26px; padding: 0; }
.plano-lista li {
  font-size: 13px; color: var(--ink); padding: 10px 0;
  border-bottom: 1px solid var(--surface);
  display: flex; gap: 10px; align-items: flex-start; line-height: 1.5;
}
.plano.is-destaque .plano-lista li { color: rgba(255,255,255,.78); border-color: rgba(255,255,255,.06); }
.plano-lista li::before { content: '✓'; color: var(--v); font-weight: 800; flex-shrink: 0; }
.plano.is-destaque .plano-lista li::before { color: var(--vglow); }
.plano-entregaveis { background: var(--surface); border-radius: 14px; padding: 18px 20px; margin-bottom: 26px; }
.plano.is-destaque .plano-entregaveis { background: rgba(255,255,255,.05); }
.plano-entregaveis .etit {
  font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--v); display: block; margin-bottom: 10px;
}
.plano.is-destaque .plano-entregaveis .etit { color: var(--vglow); }
.plano-entregaveis ul { list-style: none; margin: 0; padding: 0; }
.plano-entregaveis ul li {
  font-size: 12px; color: var(--ink-soft); padding: 4px 0;
  display: flex; gap: 8px; align-items: flex-start; line-height: 1.55;
}
.plano.is-destaque .plano-entregaveis ul li { color: rgba(255,255,255,.5); }
.plano-entregaveis ul li::before { content: '→'; color: var(--v); flex-shrink: 0; font-weight: 700; }
.plano.is-destaque .plano-entregaveis ul li::before { color: var(--vglow); }
.btn-plan { margin-top: auto; }

/* condições */
.conds {
  margin-top: 48px; background: #fff; border: 1px solid var(--line);
  border-radius: 20px; padding: 40px 44px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px;
}
.cond-item .ct { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--v); margin-bottom: 12px; }
.cond-item p { font-size: 14px; color: var(--ink-soft); line-height: 1.7; }

/* sobre */
.sobre-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: center; }
.sobre-txt p { font-size: 16px; color: var(--ink-soft); line-height: 1.8; margin-bottom: 18px; }
.sobre-txt strong { color: var(--ink); font-weight: 700; }
.sobre-nums { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.sobre-num { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 32px 24px; text-align: center; transition: border-color .2s, transform .2s; }
.sobre-num:hover { border-color: var(--v); transform: translateY(-2px); }
.sobre-num .sn { font-size: 38px; font-weight: 800; color: var(--v); letter-spacing: -0.02em; }
.sobre-num .sl { font-size: 12px; color: var(--ink-soft); margin-top: 6px; line-height: 1.4; }

/* steps */
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 56px; }
.step {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 18px; padding: 36px 28px;
  transition: all .2s;
}
.step:hover { border-color: var(--vglow); transform: translateY(-2px); }
.step.is-active { background: linear-gradient(135deg, rgba(124,58,237,.2), rgba(124,58,237,.08)); border-color: rgba(155,77,202,.4); }
.step-n { font-size: 38px; font-weight: 800; color: var(--vglow); opacity: .4; margin-bottom: 18px; line-height: 1; }
.step h4 { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; }
.step p { font-size: 14px; color: rgba(255,255,255,.55); line-height: 1.7; }

.cta-box {
  background: linear-gradient(135deg, var(--v) 0%, #4c1d95 100%);
  border-radius: 24px; padding: 64px 56px; text-align: center;
  position: relative; overflow: hidden;
  box-shadow: var(--youb-shadow);
}
.cta-box::before {
  content: ''; position: absolute; top: -100px; right: -100px;
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 70%);
}
.cta-box h3 { font-size: clamp(24px, 3vw, 32px); font-weight: 800; color: #fff; letter-spacing: -0.015em; margin-bottom: 12px; position: relative; z-index: 2; }
.cta-box p { font-size: 16px; color: rgba(255,255,255,.75); margin-bottom: 36px; position: relative; z-index: 2; }
.cta-btn {
  display: inline-block; background: #fff; color: var(--v);
  font-size: 15px; font-weight: 700; padding: 18px 44px;
  border-radius: 999px; text-decoration: none;
  position: relative; z-index: 2;
  transition: transform .18s, box-shadow .18s;
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.25); }

/* footer */
footer {
  background: #080510;
  padding: 56px 72px;
  display: grid; grid-template-columns: 1fr auto;
  gap: 32px; align-items: center;
  border-top: 1px solid rgba(255,255,255,.06);
  color: #fff;
}
.ft-brand { display: flex; flex-direction: column; gap: 8px; }
.ft-tag { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,.3); }
.ft-info { text-align: right; }
.ft-info p { font-size: 14px; color: rgba(255,255,255,.55); line-height: 1.9; margin: 0; }
.ft-info a { color: var(--vglow); text-decoration: none; }
.ft-info a:hover { color: #fff; }
.ft-copy {
  grid-column: 1 / -1; text-align: center;
  font-size: 12px; color: rgba(255,255,255,.25); letter-spacing: 0.05em;
  border-top: 1px solid rgba(255,255,255,.05); padding-top: 24px; margin-top: 8px;
}

/* responsivo */
@media (max-width: 900px) {
  .capa { padding: 32px 24px 40px; }
  .sec, .sec-soft, .sec-dark, footer { padding: 72px 24px; }
  .nums-grid, .escopo-grid, .met-grid,
  .planos, .steps, .sobre-grid, .conds { grid-template-columns: 1fr; }
  .plano.is-destaque { transform: none; }
  .plano.is-destaque:hover { transform: translateY(-4px); }
  .obj-card, .met-desc, .ctx-box, .cta-box { padding: 36px 28px; }
  .conds { padding: 32px 28px; gap: 28px; }
  footer { grid-template-columns: 1fr; }
  .ft-info { text-align: left; }
  .capa-cta-row { flex-direction: column; align-items: stretch; }
  .capa-cta-row .btn-violet { text-align: center; }
  .sobre-grid { gap: 40px; }
  .fase { gap: 20px; }
}

/* conexão de valor */
.cv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-bottom: 32px; }
.cv-card {
  background: #fff; border: 1px solid var(--line);
  border-radius: 18px; padding: 32px 28px;
  transition: border-color .18s, transform .18s, box-shadow .18s;
}
.cv-card:hover { border-color: var(--v); transform: translateY(-3px); box-shadow: var(--youb-shadow); }
.cv-num { font-size: 13px; font-weight: 800; color: var(--v); letter-spacing: 0.18em; margin-bottom: 14px; }
.cv-card h4 { font-size: 18px; font-weight: 700; color: var(--ink); margin: 0 0 10px; letter-spacing: -0.01em; }
.cv-card p { font-size: 14px; color: var(--ink-soft); line-height: 1.65; margin: 0; }
.cv-roi {
  background: linear-gradient(135deg, var(--vsoft) 0%, #fff 100%);
  border: 1px solid var(--line); border-left: 4px solid var(--v);
  border-radius: 0 18px 18px 0; padding: 36px 40px;
}
.cv-roi-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--v); margin-bottom: 12px; }
.cv-roi p { font-size: 16px; color: var(--ink); line-height: 1.75; margin: 0; }
.cv-roi strong { color: var(--v); font-weight: 700; }

/* plano extras */
.plano-sub { display: block; font-size: 12px; font-weight: 600; color: var(--v); letter-spacing: 0.08em; text-transform: uppercase; margin: -6px 0 12px; }
.plano-prazo { display: block; font-size: 12px; color: var(--ink-soft); margin: -8px 0 18px; letter-spacing: 0.04em; }
.plano-diferencial { margin-top: 18px; padding-top: 18px; border-top: 1px dashed var(--line); }
.plano-diferencial .etit { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--v); margin-bottom: 8px; }
.plano-diferencial p { font-size: 13.5px; color: var(--ink); line-height: 1.6; margin: 0; }
.plano-beneficios { margin-top: 18px; padding: 18px 20px; border-radius: 14px; background: linear-gradient(135deg, color-mix(in oklab, var(--v) 12%, transparent), color-mix(in oklab, var(--v) 4%, transparent)); border: 1px solid color-mix(in oklab, var(--v) 25%, transparent); }
.plano.is-destaque .plano-beneficios { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.14); }
.plano-beneficios .etit { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--v); margin-bottom: 10px; }
.plano.is-destaque .plano-beneficios .etit { color: var(--vglow); }
.plano-beneficios ul { list-style: none; margin: 0 0 4px; padding: 0; }
.plano-beneficios ul li { display: flex; gap: 10px; font-size: 13px; color: var(--ink); line-height: 1.55; padding: 6px 0; }
.plano.is-destaque .plano-beneficios ul li { color: rgba(255,255,255,.85); }
.plano-beneficios ul li::before { content: '✓'; color: var(--v); font-weight: 800; flex-shrink: 0; }
.plano.is-destaque .plano-beneficios ul li::before { color: var(--vglow); }

/* canais */
.canais {
  background: linear-gradient(135deg, #1a0f2e 0%, #2a1450 100%);
  padding: 80px 72px; color: #fff;
}
.canais-inner { max-width: 1080px; margin: 0 auto; text-align: center; }
.canais h3 { font-size: clamp(26px, 3vw, 36px); font-weight: 800; letter-spacing: -0.02em; margin: 14px 0 12px; }
.canais p { font-size: 16px; color: rgba(255,255,255,.7); max-width: 560px; margin: 0 auto 32px; line-height: 1.65; }
.canais-row { display: inline-flex; gap: 18px; align-items: center; flex-wrap: wrap; justify-content: center; }

@media (max-width: 768px) {
  .cv-grid { grid-template-columns: 1fr; }
  .cv-roi { padding: 28px 24px; }
  .canais { padding: 56px 28px; }
}

.obj-lista { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 2; }
.obj-lista li { position: relative; padding-left: 30px; font-size: 17px; color: #fff; line-height: 1.6; font-weight: 500; z-index: 2; }
.obj-lista li::before { content: "→"; position: absolute; left: 0; top: 0; color: #fff; font-weight: 800; font-size: 18px; }

.plano-pgto { font-size: 12.5px; color: var(--ink-soft); line-height: 1.55; margin: 0 0 18px; padding: 10px 12px; background: rgba(124,58,237,.06); border-radius: 10px; border-left: 2px solid var(--v); }
.plano.is-destaque .plano-pgto { background: rgba(255,255,255,.08); color: rgba(255,255,255,.85); border-left-color: rgba(255,255,255,.5); }

.logistica { margin-top: 32px; padding: 28px; background: #fff; border: 1px solid var(--line); border-radius: 18px; }
.logistica .etit { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--v); margin-bottom: 14px; }
.logistica ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.logistica li { position: relative; padding-left: 22px; font-size: 14px; color: var(--ink-soft); line-height: 1.65; }
.logistica li::before { content: "•"; position: absolute; left: 6px; top: 0; color: var(--v); font-weight: 700; }

.sw-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 32px; }
.sw-card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 24px; transition: all .25s ease; }
.sw-card:hover { border-color: var(--v); transform: translateY(-3px); box-shadow: var(--youb-shadow); }
.sw-ico { font-size: 28px; margin-bottom: 12px; }
.sw-card h4 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.sw-card p { font-size: 13.5px; color: var(--ink-soft); line-height: 1.65; }
.sw-nota { margin-top: 28px; padding: 20px 24px; background: rgba(124,58,237,.06); border-left: 3px solid var(--v); border-radius: 12px; }
.sw-nota p { font-size: 14px; color: var(--ink); line-height: 1.65; margin: 0; }
@media (max-width: 768px) { .sw-grid { grid-template-columns: 1fr; } }

.crono-nota { margin-top: 24px; font-size: 13.5px; color: var(--ink-soft); line-height: 1.65; font-style: italic; }
`;

const gateCss = `
.gate {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(120% 80% at 80% 0%, #2a0f4d 0%, #15082a 45%, #0a0418 100%);
  color: #fff;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}
.gate-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.gate-orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: .55;
}
.gate-orb-1 { width: 520px; height: 520px; background: #7C3AED; top: -120px; left: -120px; }
.gate-orb-2 { width: 460px; height: 460px; background: #C084FC; bottom: -160px; right: -100px; opacity:.45;}
.gate-orb-3 { width: 360px; height: 360px; background: #4C1D95; top: 40%; left: 45%; opacity:.35;}

.gate-shell {
  position: relative; z-index: 2;
  width: min(1180px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 28px;
  overflow: hidden;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 40px 120px -40px rgba(124, 58, 237, 0.55), 0 0 0 1px rgba(255,255,255,0.04) inset;
}

/* Lado esquerdo */
.gate-side {
  position: relative;
  padding: 48px 44px;
  background:
    linear-gradient(160deg, rgba(124,58,237,0.35) 0%, rgba(76,29,149,0.15) 60%, rgba(0,0,0,0) 100%),
    rgba(0,0,0,0.25);
  display: flex; flex-direction: column; justify-content: space-between;
  min-height: 620px;
  overflow: hidden;
}
.gate-brand {
  font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #fff;
}
.gate-brand span { color: #C084FC; }

.gate-mosaic {
  position: relative;
  margin: 24px 0;
  height: 320px;
}
.gate-face {
  position: absolute;
  border-radius: 22px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.18);
  box-shadow: 0 20px 50px -15px rgba(0,0,0,0.5);
  background: #2a0f4d;
  animation: floaty 6s ease-in-out infinite;
}
.gate-face img { width: 100%; height: 100%; object-fit: cover; display:block; }
.gate-face-1 { width: 130px; height: 160px; top: 0; left: 0; transform: rotate(-6deg); }
.gate-face-2 { width: 110px; height: 140px; top: 20px; left: 150px; transform: rotate(4deg); animation-delay: .8s; }
.gate-face-3 { width: 120px; height: 150px; top: 0; right: 10px; transform: rotate(-3deg); animation-delay: 1.6s; }
.gate-face-4 { width: 140px; height: 170px; bottom: 0; left: 30px; transform: rotate(3deg); animation-delay: 2.4s; }
.gate-face-5 { width: 120px; height: 150px; bottom: 20px; left: 200px; transform: rotate(-5deg); animation-delay: 1.2s; }
.gate-face-6 { width: 110px; height: 140px; bottom: 10px; right: 0; transform: rotate(6deg); animation-delay: 2s; }
.gate-mosaic-glow {
  position: absolute; inset: -20px;
  background: radial-gradient(circle at 50% 50%, rgba(192,132,252,0.35), transparent 60%);
  pointer-events: none; z-index: -1;
}

@keyframes floaty {
  0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
}

.gate-quote {
  border-left: 2px solid #C084FC;
  padding-left: 16px;
}
.gate-quote p {
  font-size: 18px; line-height: 1.5; font-weight: 500;
  color: rgba(255,255,255,0.92); margin: 0 0 6px;
}
.gate-quote span { font-size: 13px; color: rgba(255,255,255,0.55); }

/* Lado direito */
.gate-main {
  padding: 56px 52px;
  display: flex; flex-direction: column; justify-content: space-between;
  background: rgba(10,4,24,0.4);
}
.gate-card { display: flex; flex-direction: column; }
.gate-tag {
  display: inline-flex; align-self: flex-start;
  font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(192,132,252,0.15);
  color: #E9D5FF;
  border: 1px solid rgba(192,132,252,0.3);
  padding: 8px 14px; border-radius: 999px;
  margin-bottom: 24px;
}
.gate-title {
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.15; font-weight: 800; letter-spacing: -0.02em;
  margin: 0 0 16px; color: #fff;
}
.gate-title em {
  font-style: normal;
  background: linear-gradient(90deg, #C084FC, #fff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.gate-sub {
  font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.7);
  margin: 0 0 32px; max-width: 480px;
}

.gate-form { display: flex; flex-direction: column; gap: 14px; }
.gate-label {
  font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: rgba(255,255,255,0.55);
}
.gate-input-wrap {
  position: relative; display: flex; align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  transition: all .2s ease;
}
.gate-input-wrap:focus-within {
  border-color: #C084FC;
  background: rgba(255,255,255,0.09);
  box-shadow: 0 0 0 4px rgba(192,132,252,0.15);
}
.gate-input {
  flex: 1; background: transparent; border: 0; outline: 0;
  padding: 18px 20px; font-size: 16px; color: #fff;
  font-family: inherit; letter-spacing: 0.02em;
}
.gate-input::placeholder { color: rgba(255,255,255,0.35); }
.gate-eye {
  background: transparent; border: 0; color: rgba(255,255,255,0.6);
  font-size: 12px; font-weight: 600; padding: 0 18px; cursor: pointer;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.gate-eye:hover { color: #fff; }

.gate-error {
  font-size: 13px; color: #FCA5A5;
  background: rgba(220,38,38,0.12);
  border: 1px solid rgba(220,38,38,0.3);
  padding: 10px 14px; border-radius: 10px;
}

.gate-btn {
  margin-top: 8px;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  background: linear-gradient(90deg, #7C3AED, #C084FC);
  color: #fff; border: 0; cursor: pointer;
  padding: 18px 24px; border-radius: 14px;
  font-family: inherit; font-size: 15px; font-weight: 700; letter-spacing: 0.02em;
  box-shadow: 0 14px 30px -12px rgba(124,58,237,0.7);
  transition: transform .15s ease, box-shadow .2s ease, opacity .2s ease;
}
.gate-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -12px rgba(124,58,237,0.85); }
.gate-btn:disabled { opacity: .7; cursor: wait; transform: none; }
.gate-btn-arrow { transition: transform .2s ease; }
.gate-btn:hover .gate-btn-arrow { transform: translateX(4px); }

.gate-help {
  font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 4px;
}
.gate-help a { color: #C084FC; text-decoration: none; font-weight: 600; }
.gate-help a:hover { color: #fff; }

.gate-trust {
  display: flex; align-items: center; gap: 18px;
  margin-top: 36px; padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.gate-trust-item { display: flex; flex-direction: column; }
.gate-trust-item strong {
  font-size: 22px; font-weight: 800; letter-spacing: -0.01em;
  background: linear-gradient(90deg, #C084FC, #fff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.gate-trust-item span { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }
.gate-trust-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.12); }

.gate-foot {
  display: flex; justify-content: space-between;
  font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.06em;
  margin-top: 32px; text-transform: uppercase;
}

@media (max-width: 900px) {
  .gate { padding: 16px; }
  .gate-shell { grid-template-columns: 1fr; }
  .gate-side { min-height: auto; padding: 32px 28px; }
  .gate-mosaic { height: 260px; }
  .gate-main { padding: 36px 28px; }
  .gate-foot { flex-direction: column; gap: 6px; }
}
@media (max-width: 520px) {
  .gate-mosaic { height: 220px; }
  .gate-face-1 { width: 95px; height: 120px; }
  .gate-face-2 { width: 85px; height: 110px; left: 110px; }
  .gate-face-3 { width: 90px; height: 115px; }
  .gate-face-4 { width: 100px; height: 125px; left: 10px; }
  .gate-face-5 { width: 90px; height: 115px; left: 130px; }
  .gate-face-6 { width: 85px; height: 110px; }
  .gate-trust { gap: 12px; }
  .gate-trust-item strong { font-size: 18px; }
}
`;
