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
      <Cronograma />
      <Investimento />
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
  .proposta-locked { display: none !important; }
  body::before {
    content: "Documento confidencial — impressão desabilitada.";
    display: block; padding: 40px; font-family: sans-serif;
    font-size: 18px; color: #333;
  }
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

function Capa() {
  return (
    <header className="capa">
      <nav className="capa-nav">
        <Logo light />
        <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-violet btn-sm">
          Agendar Conversa
        </a>
      </nav>

      <div className="capa-body">
        <span className="eyebrow eyebrow-light">Ecossistema completo de DHO</span>
        <h1 className="capa-titulo">
          Transformação <em>estratégica</em>
          <br />
          em gestão de pessoas.
        </h1>
        <p className="capa-desc">
          Conectamos desenvolvimento humano, cultura e liderança em experiências
          contínuas, profundas e práticas — estruturadas para gerar resultado real
          na sua operação.
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
            <div className="capa-empresa-nome">Nome da Empresa Cliente</div>
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
        Entendemos o seu <span>cenário</span>
      </h2>
      <p className="sec-sub">
        Antes de qualquer proposta, mapeamos o ambiente, os desafios e as
        oportunidades reais da operação.
      </p>

      <div className="ctx-box">
        <p>
          Considerando uma operação com aproximadamente{" "}
          <strong>500 colaboradores</strong>, distribuídos em múltiplas unidades
          e com alta diversidade de cargos e funções, identificamos
          oportunidades relevantes na estruturação de processos de RH,
          eficiência organizacional e gestão estratégica de pessoas. A empresa
          enfrenta um momento de crescimento que exige bases sólidas para
          sustentar a escala com consistência e competitividade.
        </p>
        <div className="ctx-pills">
          {[
            ["👥", "500+ colaboradores mapeados"],
            ["🏢", "Múltiplas unidades"],
            ["📊", "Alta diversidade de cargos"],
            ["🚀", "Fase de crescimento acelerado"],
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
          ["6", "Frentes estratégicas identificadas"],
          ["3", "Fases de transformação estruturadas"],
          ["12–13", "Semanas de execução estimadas"],
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
          <span className="obj-tag">Propósito do Projeto</span>
          <p>
            Estruturar e fortalecer a área de <strong>Recursos Humanos</strong>{" "}
            como alavanca estratégica de crescimento, eficiência e
            sustentabilidade da operação — transformando pessoas, processos e
            cultura em <strong>vantagem competitiva real e mensurável</strong>.
          </p>
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
    ["01", "Diagnóstico Organizacional", "Escuta ativa, análise de dados e mapeamento preciso do estado atual."],
    ["02", "Benchmarking de Mercado", "Comparativos com empresas de referência no setor e porte equivalente."],
    ["03", "Construção Acionável", "Recomendações práticas, priorizadas e adaptadas à realidade do cliente."],
    ["04", "Resultado Mensurável", "Indicadores definidos desde o início para acompanhar impacto real."],
  ];
  return (
    <section className="sec-dark">
      <div className="sec-inner">
        <span className="eyebrow eyebrow-light">04 — Metodologia</span>
        <h2 className="sec-h is-light">
          Nossa abordagem <span>proprietária</span>
        </h2>
        <p className="sec-sub is-light">
          O que diferencia a youB não é o que entregamos — é como chegamos lá.
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
            Utilizamos uma abordagem proprietária que integra{" "}
            <strong>diagnóstico organizacional</strong>, análise de dados,{" "}
            <strong>benchmarking de mercado</strong> e construção de planos
            acionáveis — com foco em resultado mensurável e implementação real,
            não apenas entrega de relatórios.
          </p>
        </div>
      </div>
    </section>
  );
}

function Cronograma() {
  const fases = [
    ["1", "Fase 1 — Diagnóstico", "3 a 4 semanas", "Imersão no ambiente da empresa: coleta de dados, entrevistas com lideranças, aplicação das pesquisas e mapeamento do estado atual dos processos de RH."],
    ["2", "Fase 2 — Estruturação", "4 a 6 semanas", "Desenvolvimento das entregas contratadas: estrutura de cargos, tabelas salariais, benchmarking, descrições e dimensionamento — com validações intermediárias junto ao cliente."],
    ["3", "Fase 3 — Implementação e Recomendações", "2 a 3 semanas", "Apresentação dos resultados finais, relatório executivo consolidado, plano de ação com prioridades e suporte para a área de RH iniciar a implantação com segurança."],
  ];
  return (
    <section className="sec">
      <span className="eyebrow">05 — Cronograma</span>
      <h2 className="sec-h">
        Execução em <span>3 fases</span>
      </h2>
      <p className="sec-sub">
        Ritmo estruturado para garantir qualidade, alinhamento e entrega sem
        surpresas.
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
    </section>
  );
}

const PLANOS = [
  {
    nome: "Plano Core",
    subtitulo: "Estruturação & Diagnóstico (Fundacional)",
    foco: "Cumprimento estrito do briefing com agilidade — base sólida para decisões rápidas e geração de confiança.",
    valor: "45.000",
    prazo: "60 dias",
    itens: [
      "Pesquisa de Clima Digital — coleta e análise em tempo real via plataforma",
      "Diagnóstico DHO 360 — auditoria de processos atuais + plano de ação tático",
      "Survey de Remuneração — comparativo de mercado para MG e PR",
      "Grade Salarial — estrutura de cargos e salários (150 cargos) com foco em equidade",
    ],
    entregaveis: [
      "Relatório executivo com os Top 5 Gaps de retenção",
      "Tabela salarial estruturada para 150 cargos",
      "Plano de ação tático priorizado",
    ],
    diferencial: "Relatório executivo com os Top 5 Gaps de retenção.",
    cta: "Solicitar proposta",
  },
  {
    nome: "Plano Scale",
    subtitulo: "Eficiência Operacional (Recomendado)",
    foco: "Adiciona itens opcionais do briefing e introduz a metodologia de escala — preparando a empresa para o ecossistema youB.",
    valor: "85.000",
    prazo: "90 dias",
    destaque: true,
    itens: [
      "Tudo do Plano Core",
      "Job Description Matrix — descrições modernas focadas em competências",
      "Dimensionamento (Headcount Planning) — análise qualiquantitativa de quadro",
    ],
    entregaveis: [
      "Matriz de descrições de cargos por competência",
      "Modelo de dimensionamento com recomendações",
      "Workshop de Liderança Regenerativa para gestores",
    ],
    diferencial: "Workshop de Liderança Regenerativa alinhando estrutura à cultura desejada.",
    cta: "Escolher este plano",
  },
  {
    nome: "Plano Elite",
    subtitulo: "Ecossistema youB (Parceria Estratégica)",
    foco: "High-ticket que posiciona a consultoria como alicerce para a implementação da plataforma SaaS youB.",
    valor: "150.000+",
    prazo: "120 dias",
    itens: [
      "Tudo do Plano Scale",
      "Implementação de LMS youB (Trial/Setup) — digitalização dos novos planos de cargo e treinamentos de integração",
      "Mentoria para o Board — 4 sessões exclusivas com RH e Diretoria",
    ],
    entregaveis: [
      "LMS youB ativo com conteúdos de integração",
      "Dashboard dinâmico de Dimensionamento dentro do App youB",
      "Mentoria estratégica recorrente com o Board",
    ],
    diferencial: "Dimensionamento de Quadro vira dashboard dinâmico no App youB · recorrência de licenciamento SaaS inclusa no pós-projeto.",
    cta: "Solicitar proposta",
  },
];

function Investimento() {
  return (
    <section id="investimento" className="sec-soft">
      <div className="sec-inner">
        <span className="eyebrow">06 — Investimento</span>
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
              <p className="plano-foco">{p.foco}</p>
              <div className="plano-preco">
                <span className="moeda">R$</span>
                <span className="valor">{p.valor}</span>
              </div>
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
            ["Condições de Pagamento", "50% na assinatura do contrato e 50% na entrega dos relatórios finais. Parcelamento disponível para projetos acima de R$ 85.000."],
            ["Validade da Proposta", "Esta proposta tem validade de 30 dias a partir da data de emissão, sujeita à disponibilidade de agenda."],
            ["Início do Projeto", "Em até 5 dias úteis após assinatura do contrato e confirmação do pagamento inicial."],
          ].map(([t, d]) => (
            <div key={t} className="cond-item">
              <div className="ct">{t}</div>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section className="sec">
      <span className="eyebrow">07 — Quem somos</span>
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
        <span className="eyebrow eyebrow-light">08 — Próximos passos</span>
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
.capa-nav { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 3; }
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
.capa-empresa-detalhe { font-size: 11px; color: rgba(255,255,255,.5); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
.capa-empresa-nome { font-size: 18px; font-weight: 700; color: #fff; }
.capa-footer { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 3; max-width: 1080px; margin: 0 auto; width: 100%; }
.capa-meta { font-size: 11px; color: rgba(255,255,255,.35); letter-spacing: 0.1em; text-transform: uppercase; }

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
