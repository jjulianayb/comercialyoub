import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Projeto Estratégico de Estruturação Organizacional | youB" },
      {
        name: "description",
        content:
          "Proposta executiva da youB — diagnóstico organizacional, arquitetura de cargos, remuneração estratégica e eficiência operacional orientados por dados.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: Proposta,
});

const WHATSAPP =
  "https://wa.me/5521991417327?text=Ol%C3%A1%2C%20vim%20pela%20proposta%20da%20youB%20e%20gostaria%20de%20avan%C3%A7ar%20nas%20pr%C3%B3ximas%20etapas.";

function exportarPDF() {
  document.body.classList.add("printing");
  const cleanup = () => {
    document.body.classList.remove("printing");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(() => window.print(), 60);
}

function Proposta() {
  return (
    <div className="doc">
      <Style />
      <TopBar />

      {/* CAPA */}
      <section className="capa">
        <div className="capa-grid">
          <div className="capa-meta">
            <span className="eyebrow">Documento confidencial · Proposta executiva</span>
            <span className="capa-ref">Ref. YB · 2026 / 01</span>
          </div>

          <h1 className="capa-title">
            Projeto Estratégico de<br />
            Estruturação Organizacional<br />
            <em>e Inteligência em Gestão de Pessoas</em>
          </h1>

          <p className="capa-sub">
            Diagnóstico organizacional, arquitetura de cargos, remuneração
            estratégica e eficiência operacional orientados por dados — para o
            fortalecimento da governança, da performance e da sustentabilidade
            do crescimento empresarial.
          </p>

          <div className="capa-footer">
            <div>
              <div className="capa-label">Preparado por</div>
              <div className="capa-value">youB · Desenvolvimento Humano &amp; Organizacional</div>
            </div>
            <div>
              <div className="capa-label">Escopo</div>
              <div className="capa-value">~500 colaboradores · múltiplas unidades · ~150 cargos</div>
            </div>
            <div>
              <div className="capa-label">Horizonte</div>
              <div className="capa-value">90 dias · roadmap 90 / 180 dias</div>
            </div>
          </div>
        </div>
      </section>

      {/* SUMÁRIO */}
      <section className="sec sec-thin">
        <SectionHead num="00" kicker="Sumário executivo" title="Estrutura do documento" />
        <ol className="toc">
          <li><span>01</span> Contexto organizacional</li>
          <li><span>02</span> Sobre a youB</li>
          <li><span>03</span> Diferenciais estratégicos</li>
          <li><span>04</span> Método youB de Estruturação Organizacional Inteligente</li>
          <li><span>05</span> Entregáveis</li>
          <li><span>06</span> Benefícios e impactos esperados</li>
          <li><span>07</span> Cronograma executivo</li>
          <li><span>08</span> Investimento</li>
          <li><span>09</span> Encerramento</li>
        </ol>
      </section>

      {/* 01 CONTEXTO */}
      <section className="sec">
        <SectionHead num="01" kicker="Contexto" title="Cenário organizacional" />
        <div className="prose">
          <p className="lede">
            Diante do atual cenário de crescimento e crescente complexidade
            operacional, organizações em expansão enfrentam desafios cada vez
            maiores relacionados à clareza estrutural, ao alinhamento entre
            áreas, à eficiência operacional, à retenção de talentos e ao
            fortalecimento da governança interna.
          </p>
          <p>
            Considerando uma operação com aproximadamente 500 colaboradores
            distribuídos em múltiplas unidades — entre Minas Gerais e Paraná —
            e um universo estimado de 150 cargos, torna-se essencial consolidar
            uma estrutura organizacional mais estratégica, padronizada e
            orientada por dados, garantindo previsibilidade, eficiência e
            sustentabilidade ao crescimento.
          </p>
          <p>
            Nesse contexto, a youB propõe uma atuação consultiva estruturada
            para apoiar a organização na construção de uma arquitetura
            organizacional mais clara, inteligente e alinhada aos objetivos
            estratégicos do negócio.
          </p>
        </div>

        <div className="stats">
          <Stat n="500" l="colaboradores no escopo" />
          <Stat n="150" l="cargos a serem mapeados" />
          <Stat n="2" l="estados · múltiplas unidades" />
          <Stat n="90d" l="ciclo executivo do projeto" />
        </div>
      </section>

      {/* 02 SOBRE */}
      <section className="sec">
        <SectionHead num="02" kicker="Quem somos" title="Posicionamento da youB" />
        <div className="two-col">
          <div className="prose">
            <p className="lede">
              A youB é uma consultoria estratégica especializada em
              desenvolvimento organizacional, inteligência humana aplicada à
              performance empresarial e estruturação de gestão de pessoas
              orientada por dados.
            </p>
            <p>
              Integramos análise organizacional, comportamento humano,
              arquitetura de cargos, eficiência operacional e inteligência
              analítica para apoiar empresas em processos de crescimento,
              profissionalização e fortalecimento da gestão.
            </p>
            <p>
              Mais do que executar projetos operacionais de RH, atuamos como
              parceiros estratégicos na construção de estruturas
              organizacionais eficientes, sustentáveis e preparadas para
              evolução contínua.
            </p>
          </div>
          <aside className="quote">
            <span className="quote-mark">“</span>
            <p>
              Não vendemos RH operacional. Estruturamos inteligência
              organizacional.
            </p>
          </aside>
        </div>
      </section>

      {/* 03 DIFERENCIAIS */}
      <section className="sec sec-shade">
        <SectionHead num="03" kicker="Diferenciais estratégicos" title="O que nos distingue de uma consultoria tradicional" />
        <div className="diff-grid">
          <Diff t="Visão sistêmica organizacional" d="Integração entre estrutura, cultura, liderança, performance e operação." />
          <Diff t="Metodologia orientada por dados" d="Decisões sustentadas por análises estruturadas e inteligência organizacional." />
          <Diff t="Inteligência analítica aplicada" d="Uso de IA e analytics como apoio estratégico para leitura de padrões e tomada de decisão." />
          <Diff t="Foco em aplicabilidade" d="Projetos desenhados para implementação prática e ganho operacional real." />
          <Diff t="Estruturação sustentável" d="Modelagem organizacional preparada para crescimento e escalabilidade." />
          <Diff t="Governança e clareza" d="Processos, papéis e responsabilidades alinhados ao modelo de gestão da empresa." />
        </div>

        <div className="compare">
          <div className="compare-col">
            <h4>Consultoria tradicional</h4>
            <ul>
              <li>Entrega relatórios estáticos</li>
              <li>Visão fragmentada por disciplina</li>
              <li>Foco operacional e pontual</li>
              <li>Limitada à função RH</li>
            </ul>
          </div>
          <div className="compare-col compare-col--accent">
            <h4>youB</h4>
            <ul>
              <li>Integra comportamento, estrutura e performance</li>
              <li>Atuação sistêmica e analítica</li>
              <li>Inteligência aplicada à decisão executiva</li>
              <li>Estrutura crescimento sustentável do negócio</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 04 METODOLOGIA */}
      <section className="sec">
        <SectionHead num="04" kicker="Metodologia proprietária" title="Método youB de Estruturação Organizacional Inteligente" />
        <p className="prose lede">
          Um framework executivo de três fases que conecta diagnóstico,
          arquitetura organizacional e plano diretor — sustentado por dados,
          análise de comportamento e leitura sistêmica do negócio.
        </p>

        <div className="phases">
          <Phase
            n="Fase 01"
            dur="30 dias"
            title="Diagnóstico Organizacional Estratégico"
            desc="Mapeamento aprofundado da estrutura atual: entrevistas com lideranças, levantamento de informações estratégicas, análise da função RH, leitura de clima e identificação dos fatores críticos que impactam eficiência, alinhamento e performance."
            entregas={[
              "Pesquisa de clima organizacional",
              "Diagnóstico da função RH",
              "Identificação de gaps organizacionais",
              "Análise estrutural preliminar",
              "Relatório executivo de diagnóstico",
            ]}
          />
          <Phase
            n="Fase 02"
            dur="45 dias"
            title="Arquitetura Organizacional & Remuneração Estratégica"
            desc="Estruturação da arquitetura de cargos e das práticas remuneratórias para fortalecer a governança, a clareza funcional, o equilíbrio interno e a consistência organizacional."
            entregas={[
              "Hierarquização de cargos",
              "Estruturação de tabela salarial",
              "Pesquisa de remuneração e benefícios",
              "Estruturação de descrições de cargos",
              "Recomendações de alinhamento estrutural",
            ]}
          />
          <Phase
            n="Fase 03"
            dur="15 dias"
            title="Eficiência Operacional & Plano Diretor"
            desc="Consolidação das análises e construção do plano estratégico de evolução organizacional, com foco em eficiência, clareza de responsabilidades e fortalecimento da gestão."
            entregas={[
              "Dimensionamento qualiquantitativo",
              "Organograma sugerido",
              "Dashboard executivo",
              "Plano de ação estratégico",
              "Roadmap 90 / 180 dias",
              "Recomendações executivas",
            ]}
          />
        </div>
      </section>

      {/* 05 ENTREGÁVEIS */}
      <section className="sec sec-shade">
        <SectionHead num="05" kicker="Entregáveis" title="O que a organização recebe ao final do ciclo" />
        <div className="deliverables">
          {[
            "Relatório executivo de diagnóstico organizacional",
            "Pesquisa de clima consolidada",
            "Diagnóstico estratégico da função RH",
            "Mapeamento estrutural organizacional",
            "Matriz e hierarquização de cargos",
            "Estrutura de remuneração e tabela salarial",
            "Pesquisa comparativa de práticas remuneratórias",
            "Estruturação de descrições de cargos",
            "Organograma sugerido",
            "Dimensionamento qualiquantitativo",
            "Dashboard executivo",
            "Plano de ação priorizado",
            "Roadmap estratégico 90 / 180 dias",
          ].map((d, i) => (
            <div key={d} className="deliverable">
              <span className="deliverable-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="deliverable-text">{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 06 BENEFÍCIOS */}
      <section className="sec">
        <SectionHead num="06" kicker="Benefícios" title="Impactos esperados na organização" />
        <p className="prose lede">
          A estruturação organizacional proposta visa gerar impactos diretos na
          eficiência operacional, na clareza de responsabilidades, no
          fortalecimento da liderança e na sustentabilidade do crescimento da
          operação.
        </p>
        <ul className="benefits">
          <li>Fortalecimento da governança organizacional</li>
          <li>Maior previsibilidade estrutural</li>
          <li>Redução de desalinhamentos internos</li>
          <li>Melhoria na tomada de decisão executiva</li>
          <li>Maior consistência nos processos de gestão de pessoas</li>
          <li>Fortalecimento da retenção e do engajamento</li>
          <li>Estrutura preparada para crescimento sustentável</li>
        </ul>
      </section>

      {/* 07 CRONOGRAMA */}
      <section className="sec sec-shade">
        <SectionHead num="07" kicker="Cronograma executivo" title="Linha do tempo do projeto" />
        <table className="schedule">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Escopo</th>
              <th>Checkpoints</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>01</strong></td>
              <td>Diagnóstico Organizacional Estratégico</td>
              <td>Validação executiva do diagnóstico</td>
              <td>30 dias</td>
            </tr>
            <tr>
              <td><strong>02</strong></td>
              <td>Arquitetura Organizacional &amp; Remuneração</td>
              <td>Aprovação de matriz de cargos e tabela salarial</td>
              <td>45 dias</td>
            </tr>
            <tr>
              <td><strong>03</strong></td>
              <td>Eficiência Operacional &amp; Plano Diretor</td>
              <td>Apresentação do plano diretor à diretoria</td>
              <td>15 dias</td>
            </tr>
            <tr className="schedule-total">
              <td colSpan={3}>Duração total estimada</td>
              <td>90 dias</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 08 INVESTIMENTO */}
      <section className="sec">
        <SectionHead num="08" kicker="Investimento" title="Modelos de contratação" />
        <div className="plans">
          <article className="plan">
            <header>
              <span className="plan-tag">Escopo Essencial</span>
              <h3>Estruturação organizacional fundamental</h3>
              <p>Base diagnóstica e arquitetura de cargos e remuneração para profissionalização imediata da gestão.</p>
            </header>
            <ul>
              <li>Diagnóstico organizacional</li>
              <li>Pesquisa de clima</li>
              <li>Diagnóstico da função RH</li>
              <li>Pesquisa salarial</li>
              <li>Hierarquização de cargos</li>
              <li>Tabela salarial</li>
            </ul>
            <div className="plan-invest">
              <span className="plan-label">Investimento</span>
              <span className="plan-value">a apresentar</span>
            </div>
          </article>

          <article className="plan plan--featured">
            <header>
              <span className="plan-tag">Escopo Estratégico Completo</span>
              <h3>Transformação organizacional integrada</h3>
              <p>Visão sistêmica end-to-end — diagnóstico, arquitetura, eficiência operacional e plano diretor com inteligência analítica.</p>
            </header>
            <ul>
              <li>Todos os itens do escopo essencial</li>
              <li>Estruturação de descrições de cargos</li>
              <li>Dimensionamento qualiquantitativo</li>
              <li>Organograma sugerido</li>
              <li>Dashboard executivo</li>
              <li>Plano diretor estratégico</li>
              <li>Roadmap 90 / 180 dias</li>
            </ul>
            <div className="plan-invest">
              <span className="plan-label">Investimento</span>
              <span className="plan-value">a apresentar</span>
            </div>
          </article>
        </div>
        <p className="plans-note">
          Os valores de investimento são apresentados em reunião executiva,
          considerando o escopo final aprovado, o número de unidades envolvidas
          e o nível de profundidade analítica acordado.
        </p>
      </section>

      {/* 09 ENCERRAMENTO */}
      <section className="sec sec-close">
        <SectionHead num="09" kicker="Encerramento" title="Uma decisão estratégica" />
        <div className="prose">
          <p className="lede">
            Acreditamos que organizações sustentáveis são construídas a partir
            de estruturas claras, decisões inteligentes e do alinhamento entre
            pessoas, estratégia e operação.
          </p>
          <p>
            Mais do que um projeto técnico de RH, esta proposta representa uma
            iniciativa de fortalecimento organizacional voltada para o
            crescimento sustentável, a eficiência operacional e a evolução da
            gestão empresarial.
          </p>
          <p>
            A youB coloca-se à disposição para conduzir este processo de forma
            estratégica, analítica e orientada à geração de valor real para o
            negócio.
          </p>
        </div>
        <div className="cta-block">
          <p className="cta-line">Estamos à disposição para avançarmos nas próximas etapas.</p>
          <a className="btn-primary no-print" href={WHATSAPP} target="_blank" rel="noreferrer">
            Agendar conversa executiva
          </a>
        </div>
      </section>

      <footer className="foot">
        <div>youB · Desenvolvimento Humano &amp; Organizacional</div>
        <div>Documento confidencial · uso restrito à diretoria executiva</div>
      </footer>
    </div>
  );
}

/* ---------- componentes auxiliares ---------- */

function TopBar() {
  return (
    <div className="topbar no-print">
      <div className="topbar-brand">
        <span className="brand-mark">youB</span>
        <span className="brand-sep" />
        <span className="brand-line">Desenvolvimento Humano &amp; Organizacional</span>
      </div>
      <div className="topbar-actions">
        <button className="btn-ghost" onClick={exportarPDF}>Exportar PDF</button>
        <a className="btn-dark" href={WHATSAPP} target="_blank" rel="noreferrer">Agendar conversa</a>
      </div>
    </div>
  );
}

function SectionHead({ num, kicker, title }: { num: string; kicker: string; title: string }) {
  return (
    <header className="sec-head">
      <div className="sec-head-meta">
        <span className="sec-num">{num}</span>
        <span className="sec-kicker">{kicker}</span>
      </div>
      <h2 className="sec-title">{title}</h2>
    </header>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="stat">
      <div className="stat-n">{n}</div>
      <div className="stat-l">{l}</div>
    </div>
  );
}

function Diff({ t, d }: { t: string; d: string }) {
  return (
    <div className="diff">
      <h4>{t}</h4>
      <p>{d}</p>
    </div>
  );
}

function Phase({
  n,
  dur,
  title,
  desc,
  entregas,
}: {
  n: string;
  dur: string;
  title: string;
  desc: string;
  entregas: string[];
}) {
  return (
    <article className="phase">
      <div className="phase-side">
        <div className="phase-n">{n}</div>
        <div className="phase-dur">{dur}</div>
      </div>
      <div className="phase-body">
        <h3>{title}</h3>
        <p>{desc}</p>
        <ul>
          {entregas.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ---------- estilos ---------- */

function Style() {
  return (
    <style>{`
      :root{
        --ink:#15161a;
        --ink-soft:#4a4d57;
        --ink-mute:#7e8290;
        --line:#e6e4df;
        --line-strong:#c9c5bd;
        --paper:#fbfaf6;
        --paper-2:#f3f1ea;
        --accent:#3a2c5a;
        --accent-soft:#efeaf7;
      }
      .doc{
        background:var(--paper);
        color:var(--ink);
        font-family:'Inter', system-ui, sans-serif;
        font-weight:400;
        font-size:16px;
        line-height:1.6;
        letter-spacing:-0.005em;
        min-height:100vh;
      }
      .doc h1,.doc h2,.doc h3,.doc h4{
        font-family:'Fraunces', 'Times New Roman', serif;
        font-weight:400;
        letter-spacing:-0.02em;
        color:var(--ink);
      }

      /* TOPBAR */
      .topbar{
        position:sticky;top:0;z-index:50;
        display:flex;align-items:center;justify-content:space-between;
        padding:18px 56px;
        background:rgba(251,250,246,.85);
        backdrop-filter:blur(10px);
        border-bottom:1px solid var(--line);
      }
      .topbar-brand{display:flex;align-items:center;gap:14px;color:var(--ink);}
      .brand-mark{font-family:'Fraunces',serif;font-size:22px;letter-spacing:-0.02em;}
      .brand-sep{width:1px;height:18px;background:var(--line-strong);}
      .brand-line{font-size:12px;color:var(--ink-mute);letter-spacing:.06em;text-transform:uppercase;}
      .topbar-actions{display:flex;gap:10px;}
      .btn-ghost,.btn-dark,.btn-primary{
        font-size:13px;padding:11px 20px;border-radius:2px;
        font-weight:500;letter-spacing:.02em;cursor:pointer;
        transition:all .2s ease;text-decoration:none;display:inline-block;
      }
      .btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line-strong);}
      .btn-ghost:hover{background:var(--ink);color:var(--paper);border-color:var(--ink);}
      .btn-dark{background:var(--ink);color:var(--paper);border:1px solid var(--ink);}
      .btn-dark:hover{background:var(--accent);border-color:var(--accent);}
      .btn-primary{background:var(--ink);color:var(--paper);border:1px solid var(--ink);padding:16px 28px;font-size:14px;}
      .btn-primary:hover{background:var(--accent);border-color:var(--accent);}

      /* CAPA */
      .capa{
        min-height:calc(100vh - 70px);
        padding:80px 56px 56px;
        display:flex;flex-direction:column;justify-content:space-between;
        background:linear-gradient(180deg,var(--paper) 0%, var(--paper-2) 100%);
        border-bottom:1px solid var(--line);
      }
      .capa-grid{max-width:1100px;margin:0 auto;width:100%;display:flex;flex-direction:column;gap:48px;}
      .capa-meta{display:flex;justify-content:space-between;align-items:center;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-mute);}
      .eyebrow{padding-left:14px;border-left:2px solid var(--accent);}
      .capa-ref{}
      .capa-title{
        font-size:clamp(40px, 6vw, 76px);
        line-height:1.05;
        font-weight:300;
        margin:0;
      }
      .capa-title em{font-style:italic;color:var(--accent);font-weight:300;}
      .capa-sub{
        max-width:760px;font-size:18px;line-height:1.7;color:var(--ink-soft);font-weight:400;
        margin:0;
      }
      .capa-footer{
        display:grid;grid-template-columns:repeat(3,1fr);gap:32px;
        padding-top:40px;border-top:1px solid var(--line-strong);
      }
      .capa-label{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px;}
      .capa-value{font-size:14px;color:var(--ink);line-height:1.5;}

      /* SEÇÕES */
      .sec{padding:120px 56px;border-bottom:1px solid var(--line);}
      .sec-thin{padding:80px 56px;}
      .sec-shade{background:var(--paper-2);}
      .sec-close{padding-bottom:140px;}
      .sec > *{max-width:1100px;margin-left:auto;margin-right:auto;}
      .sec-head{margin-bottom:64px;display:grid;grid-template-columns:200px 1fr;gap:48px;align-items:start;}
      .sec-head-meta{display:flex;flex-direction:column;gap:8px;}
      .sec-num{font-family:'Fraunces',serif;font-size:14px;color:var(--accent);letter-spacing:.04em;}
      .sec-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-mute);}
      .sec-title{font-size:clamp(28px,3.6vw,44px);line-height:1.15;margin:0;max-width:780px;}

      .prose{max-width:780px;}
      .prose p{margin:0 0 18px;color:var(--ink-soft);font-size:16.5px;line-height:1.75;}
      .prose .lede{font-size:19px;color:var(--ink);font-family:'Fraunces',serif;font-weight:300;line-height:1.55;letter-spacing:-0.01em;margin-bottom:28px;}

      .two-col{display:grid;grid-template-columns:1.5fr 1fr;gap:80px;align-items:start;}
      .quote{border-left:2px solid var(--accent);padding:8px 0 8px 28px;color:var(--ink);}
      .quote-mark{font-family:'Fraunces',serif;font-size:64px;line-height:1;color:var(--accent);display:block;margin-bottom:-12px;}
      .quote p{font-family:'Fraunces',serif;font-size:24px;line-height:1.4;font-weight:300;font-style:italic;margin:0;}

      /* STATS */
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:64px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
      .stat{background:var(--paper);padding:32px 24px;}
      .sec-shade .stat{background:var(--paper-2);}
      .stat-n{font-family:'Fraunces',serif;font-size:42px;line-height:1;color:var(--ink);font-weight:300;letter-spacing:-0.02em;}
      .stat-l{margin-top:10px;font-size:12px;color:var(--ink-mute);letter-spacing:.08em;text-transform:uppercase;}

      /* TOC */
      .toc{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;column-gap:48px;border-top:1px solid var(--line);}
      .toc li{display:flex;gap:18px;padding:18px 0;border-bottom:1px solid var(--line);font-size:15px;color:var(--ink);}
      .toc li span{font-family:'Fraunces',serif;color:var(--accent);font-size:13px;width:32px;}

      /* DIFERENCIAIS */
      .diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line-strong);border:1px solid var(--line-strong);}
      .diff{background:var(--paper-2);padding:36px 32px;}
      .sec-shade .diff{background:var(--paper);}
      .diff h4{font-size:18px;margin:0 0 12px;line-height:1.3;}
      .diff p{margin:0;font-size:14.5px;color:var(--ink-soft);line-height:1.65;}

      .compare{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:64px;}
      .compare-col{background:var(--paper);border:1px solid var(--line);padding:36px 32px;}
      .compare-col--accent{background:var(--ink);color:var(--paper);border-color:var(--ink);}
      .compare-col h4{font-size:13px;letter-spacing:.16em;text-transform:uppercase;font-family:'Inter',sans-serif;font-weight:500;color:var(--ink-mute);margin:0 0 20px;}
      .compare-col--accent h4{color:#a39ab8;}
      .compare-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;}
      .compare-col li{font-size:15px;line-height:1.5;padding-left:18px;position:relative;}
      .compare-col li::before{content:'—';position:absolute;left:0;color:var(--ink-mute);}
      .compare-col--accent li::before{color:#a39ab8;}

      /* PHASES */
      .phases{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--line-strong);}
      .phase{display:grid;grid-template-columns:200px 1fr;gap:48px;padding:48px 0;border-bottom:1px solid var(--line-strong);}
      .phase-side{}
      .phase-n{font-family:'Fraunces',serif;font-size:22px;color:var(--accent);}
      .phase-dur{margin-top:6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);}
      .phase-body h3{font-size:26px;margin:0 0 14px;line-height:1.25;}
      .phase-body > p{font-size:16px;color:var(--ink-soft);line-height:1.7;margin:0 0 22px;max-width:760px;}
      .phase-body ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px 32px;}
      .phase-body li{font-size:14.5px;color:var(--ink);padding-left:18px;position:relative;}
      .phase-body li::before{content:'';position:absolute;left:0;top:9px;width:8px;height:1px;background:var(--accent);}

      /* DELIVERABLES */
      .deliverables{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line-strong);border:1px solid var(--line-strong);}
      .deliverable{background:var(--paper);padding:22px 28px;display:flex;align-items:baseline;gap:18px;}
      .deliverable-num{font-family:'Fraunces',serif;font-size:13px;color:var(--accent);min-width:24px;}
      .deliverable-text{font-size:15px;color:var(--ink);line-height:1.5;}

      /* BENEFITS */
      .benefits{list-style:none;margin:48px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid var(--line);}
      .benefits li{padding:20px 0;border-bottom:1px solid var(--line);font-size:16px;color:var(--ink);padding-left:24px;position:relative;}
      .benefits li:nth-child(odd){padding-right:32px;}
      .benefits li:nth-child(even){padding-left:56px;border-left:1px solid var(--line);}
      .benefits li::before{content:'+';position:absolute;left:0;color:var(--accent);font-family:'Fraunces',serif;}
      .benefits li:nth-child(even)::before{left:32px;}

      /* SCHEDULE */
      .schedule{width:100%;border-collapse:collapse;font-size:15px;}
      .schedule th{text-align:left;padding:14px 18px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);font-weight:500;border-bottom:1px solid var(--line-strong);}
      .schedule td{padding:22px 18px;border-bottom:1px solid var(--line);color:var(--ink);vertical-align:top;}
      .schedule td strong{font-family:'Fraunces',serif;font-weight:400;color:var(--accent);font-size:18px;}
      .schedule-total td{background:var(--ink);color:var(--paper);font-family:'Fraunces',serif;font-size:18px;}
      .schedule-total td:first-child{text-align:right;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-family:'Inter',sans-serif;color:#a39ab8;}

      /* PLANS */
      .plans{display:grid;grid-template-columns:1fr 1fr;gap:32px;}
      .plan{background:var(--paper);border:1px solid var(--line-strong);padding:40px 36px;display:flex;flex-direction:column;gap:24px;}
      .plan--featured{background:var(--ink);color:var(--paper);border-color:var(--ink);}
      .plan-tag{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-mute);}
      .plan--featured .plan-tag{color:#a39ab8;}
      .plan h3{font-size:24px;line-height:1.25;margin:8px 0 12px;color:inherit;}
      .plan header > p{font-size:14.5px;color:var(--ink-soft);line-height:1.6;margin:0;}
      .plan--featured header > p{color:#c8c2d6;}
      .plan ul{list-style:none;margin:0;padding:20px 0;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:12px;flex:1;}
      .plan--featured ul{border-color:#3a3447;}
      .plan li{font-size:14.5px;padding-left:18px;position:relative;}
      .plan li::before{content:'—';position:absolute;left:0;color:var(--accent);}
      .plan--featured li::before{color:#a39ab8;}
      .plan-invest{display:flex;justify-content:space-between;align-items:baseline;padding-top:20px;border-top:1px solid var(--line);}
      .plan--featured .plan-invest{border-color:#3a3447;}
      .plan-label{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);}
      .plan-value{font-family:'Fraunces',serif;font-size:20px;color:inherit;font-style:italic;font-weight:300;}
      .plans-note{margin-top:32px;font-size:13.5px;color:var(--ink-mute);max-width:780px;line-height:1.7;font-style:italic;}

      /* CTA */
      .cta-block{margin-top:64px;padding-top:48px;border-top:1px solid var(--line-strong);display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap;}
      .cta-line{font-family:'Fraunces',serif;font-size:24px;font-style:italic;font-weight:300;color:var(--ink);margin:0;max-width:520px;line-height:1.4;}

      /* FOOT */
      .foot{padding:32px 56px;display:flex;justify-content:space-between;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);background:var(--paper-2);border-top:1px solid var(--line);}

      /* RESPONSIVE */
      @media (max-width:900px){
        .topbar{padding:14px 24px;}
        .brand-line{display:none;}
        .capa{padding:48px 24px;}
        .capa-footer{grid-template-columns:1fr;gap:24px;}
        .sec{padding:72px 24px;}
        .sec-head{grid-template-columns:1fr;gap:16px;margin-bottom:40px;}
        .two-col{grid-template-columns:1fr;gap:40px;}
        .stats,.diff-grid,.deliverables,.plans,.compare{grid-template-columns:1fr !important;}
        .benefits{grid-template-columns:1fr;}
        .benefits li:nth-child(even){padding-left:24px;border-left:none;}
        .benefits li:nth-child(even)::before{left:0;}
        .phase{grid-template-columns:1fr;gap:18px;}
        .phase-body ul{grid-template-columns:1fr;}
        .schedule{display:block;overflow-x:auto;}
        .foot{flex-direction:column;gap:8px;padding:24px;}
        .cta-block{flex-direction:column;align-items:flex-start;}
      }

      /* PRINT */
      @media print{
        .no-print{display:none !important;}
        body{background:#fff !important;}
        .doc{background:#fff;font-size:11pt;}
        .topbar{display:none;}
        .capa{min-height:auto;padding:32px 24px;page-break-after:always;background:#fff;}
        .sec{padding:32px 24px;page-break-inside:avoid;background:#fff !important;border-bottom:1px solid #ddd;}
        .sec-shade{background:#fafafa !important;}
        h1,h2,h3,h4{page-break-after:avoid;}
        .phase,.plan,.diff,.deliverable{page-break-inside:avoid;}
        .stats,.diff-grid,.deliverables{break-inside:avoid;}
        @page{margin:14mm;size:A4;}
      }
      body.printing{background:#fff;}
    `}</style>
  );
}
