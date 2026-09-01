# Modelo proposta 

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Proposta Estratégica | youB × Grupo SA</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --roxo:       #6B2D8B;
      --roxo-claro: #9B4DCA;
      --roxo-suave: #F3E8FA;
      --preto:      #0D0D0D;
      --cinza-esc:  #1A1A1A;
      --cinza-med:  #555555;
      --cinza-clar: #F5F5F5;
      --branco:     #FFFFFF;
      --borda:      #E8E8E8;
      --erro:       #FF4D4D;
    }
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--preto);
      color: var(--preto);
      -webkit-font-smoothing: antialiased;
    }

    /* ══════════════════════════════════
       TELA DE LOGIN
    ══════════════════════════════════ */
    #login-screen {
      position: fixed;
      inset: 0;
      background: var(--preto);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      overflow: hidden;
    }
    #login-screen::before {
      content: '';
      position: absolute;
      top: -200px; right: -200px;
      width: 600px; height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(107,45,139,.4) 0%, transparent 68%);
    }
    #login-screen::after {
      content: '';
      position: absolute;
      bottom: -150px; left: -150px;
      width: 450px; height: 450px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(155,77,202,.2) 0%, transparent 68%);
    }

    .login-box {
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 24px;
      padding: 56px 52px;
      width: 100%;
      max-width: 480px;
      position: relative;
      z-index: 2;
      backdrop-filter: blur(12px);
      text-align: center;
    }

    .login-logo {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: -2px;
      color: var(--branco);
      margin-bottom: 6px;
    }
    .login-logo span { color: var(--roxo-claro); }

    .login-para {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: rgba(255,255,255,.3);
      margin-bottom: 40px;
    }

    .login-card-empresa {
      background: rgba(107,45,139,.15);
      border: 1px solid rgba(155,77,202,.25);
      border-radius: 14px;
      padding: 18px 24px;
      margin-bottom: 36px;
      text-align: left;
    }
    .login-card-empresa .le {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--roxo-claro);
      margin-bottom: 6px;
    }
    .login-card-empresa .ln {
      font-size: 20px;
      font-weight: 800;
      color: var(--branco);
    }

    .login-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,.4);
      text-align: left;
      display: block;
      margin-bottom: 10px;
    }

    .login-input-wrap {
      position: relative;
      margin-bottom: 16px;
    }

    .login-input {
      width: 100%;
      background: rgba(255,255,255,.06);
      border: 1.5px solid rgba(255,255,255,.1);
      border-radius: 12px;
      padding: 16px 52px 16px 20px;
      font-size: 16px;
      font-weight: 600;
      color: var(--branco);
      font-family: 'Inter', sans-serif;
      letter-spacing: 3px;
      outline: none;
      transition: border-color .2s;
    }
    .login-input::placeholder {
      letter-spacing: 1px;
      font-weight: 400;
      color: rgba(255,255,255,.2);
    }
    .login-input:focus {
      border-color: var(--roxo-claro);
    }

    .toggle-pw {
      position: absolute;
      right: 16px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      cursor: pointer;
      color: rgba(255,255,255,.3);
      font-size: 18px;
      padding: 4px;
      transition: color .2s;
    }
    .toggle-pw:hover { color: var(--roxo-claro); }

    .login-erro {
      background: rgba(255,77,77,.1);
      border: 1px solid rgba(255,77,77,.3);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      color: #FF8080;
      margin-bottom: 16px;
      display: none;
      text-align: left;
    }

    .login-btn {
      width: 100%;
      background: linear-gradient(135deg, var(--roxo), var(--roxo-claro));
      color: var(--branco);
      border: none;
      border-radius: 12px;
      padding: 17px;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: .5px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      transition: opacity .2s, transform .1s;
      margin-top: 8px;
    }
    .login-btn:hover { opacity: .88; }
    .login-btn:active { transform: scale(.98); }

    .login-seguro {
      font-size: 11px;
      color: rgba(255,255,255,.2);
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    /* shake animation */
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-6px); }
      80%      { transform: translateX(6px); }
    }
    .shake { animation: shake .4s ease; }

    /* fade out login */
    @keyframes fadeOut {
      to { opacity:0; transform: scale(1.04); pointer-events:none; }
    }
    .fade-out { animation: fadeOut .5s ease forwards; }

    /* ══════════════════════════════════
       PROPOSTA (oculta até login)
    ══════════════════════════════════ */
    #proposta {
      display: none;
      background: var(--branco);
    }

    /* ── utilitários ── */
    .tag {
      display: inline-block;
      font-size: 10px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      padding: 6px 16px; border-radius: 50px;
    }
    .tag-branco {
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.6);
      border: 1px solid rgba(255,255,255,.12);
    }
    .tag-roxo { background: var(--roxo-suave); color: var(--roxo); }

    /* ══════════════════════════════════
       CAPA
    ══════════════════════════════════ */
    .capa {
      background: var(--preto);
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: 52px 72px;
      position: relative;
      overflow: hidden;
    }
    .capa::before {
      content:'';
      position:absolute; top:-180px; right:-180px;
      width:520px; height:520px; border-radius:50%;
      background:radial-gradient(circle,rgba(107,45,139,.4) 0%,transparent 68%);
    }
    .capa::after {
      content:'';
      position:absolute; bottom:-120px; left:-80px;
      width:380px; height:380px; border-radius:50%;
      background:radial-gradient(circle,rgba(155,77,202,.18) 0%,transparent 68%);
    }
    .capa-nav {
      display:flex; justify-content:space-between; align-items:center;
      position:relative; z-index:3;
    }
    .logo {
      font-size:38px; font-weight:900; letter-spacing:-1.5px;
      color:var(--branco); line-height:1;
    }
    .logo span { color:var(--roxo-claro); }
    .capa-body {
      display:flex; flex-direction:column; justify-content:center;
      position:relative; z-index:3;
    }
    .capa-pre {
      font-size:11px; font-weight:600; letter-spacing:3px;
      text-transform:uppercase; color:var(--roxo-claro); margin-bottom:28px;
    }
    .capa-titulo {
      font-size:clamp(40px,5.5vw,72px); font-weight:900;
      color:var(--branco); line-height:1.05; letter-spacing:-2px;
      max-width:820px; margin-bottom:28px;
    }
    .capa-titulo em { font-style:normal; color:var(--roxo-claro); }
    .capa-desc {
      font-size:17px; color:rgba(255,255,255,.45);
      max-width:560px; line-height:1.75; margin-bottom:48px;
    }
    .capa-empresa {
      display:inline-flex; align-items:center; gap:16px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.1);
      border-radius:14px; padding:18px 28px; width:fit-content;
    }
    .capa-empresa-detalhe {
      font-size:11px; color:rgba(255,255,255,.35);
      letter-spacing:1.5px; text-transform:uppercase; margin-bottom:4px;
    }
    .capa-empresa-nome { font-size:19px; font-weight:700; color:var(--branco); }
    .capa-footer {
      display:flex; justify-content:space-between; align-items:flex-end;
      position:relative; z-index:3;
    }
    .capa-data { font-size:12px; color:rgba(255,255,255,.25); letter-spacing:1px; }
    .capa-conf { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.15); }

    /* ══════════════════════════════════
       SEÇÕES
    ══════════════════════════════════ */
    .sec      { padding:96px 72px; max-width:1080px; margin:0 auto; }
    .sec-dark { background:var(--preto); padding:96px 72px; }
    .sec-dark-inner { max-width:1080px; margin:0 auto; }
    .sec-soft { background:var(--cinza-clar); padding:96px 72px; }
    .sec-soft-inner { max-width:1080px; margin:0 auto; }

    .sec-label {
      font-size:10px; font-weight:700; letter-spacing:3px;
      text-transform:uppercase; color:var(--roxo-claro); margin-bottom:14px;
    }
    .sec-h {
      font-size:clamp(28px,3.5vw,44px); font-weight:900;
      line-height:1.1; letter-spacing:-1px; margin-bottom:12px;
    }
    .sec-h span  { color:var(--roxo); }
    .sec-h.light { color:var(--branco); }
    .sec-h.light span { color:var(--roxo-claro); }
    .sec-sub {
      font-size:16px; color:var(--cinza-med);
      max-width:560px; margin-bottom:56px; line-height:1.75;
    }
    .sec-sub.light { color:rgba(255,255,255,.45); }

    /* contexto */
    .ctx-box {
      background:var(--cinza-clar);
      border-left:3px solid var(--roxo);
      border-radius:0 16px 16px 0;
      padding:40px 44px; margin-bottom:40px;
    }
    .ctx-box p  { font-size:16px; color:var(--cinza-esc); line-height:1.85; }
    .ctx-box strong { color:var(--roxo); font-weight:700; }
    .ctx-pills  { display:flex; flex-wrap:wrap; gap:12px; margin-top:28px; }
    .pill {
      background:var(--branco); border:1px solid var(--borda);
      border-radius:50px; padding:10px 22px;
      font-size:13px; font-weight:500; color:var(--cinza-med);
      display:flex; align-items:center; gap:8px;
    }
    .pill span { color:var(--roxo); font-weight:700; }

    /* números */
    .nums-grid {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:20px; margin-top:48px;
    }
    .num-card {
      background:var(--branco); border:1px solid var(--borda);
      border-radius:16px; padding:36px 28px; text-align:center;
    }
    .num-card .n {
      font-size:44px; font-weight:900; color:var(--roxo);
      line-height:1; letter-spacing:-2px; margin-bottom:10px;
    }
    .num-card .l { font-size:13px; color:var(--cinza-med); line-height:1.5; }

    /* objetivo */
    .obj-card {
      background:linear-gradient(140deg,var(--roxo) 0%,#4A1870 100%);
      border-radius:20px; padding:60px 64px;
      position:relative; overflow:hidden;
    }
    .obj-card::before {
      content:''; position:absolute; top:-100px; right:-100px;
      width:400px; height:400px; border-radius:50%;
      background:radial-gradient(circle,rgba(255,255,255,.06) 0%,transparent 70%);
    }
    .obj-card p {
      font-size:21px; font-weight:500; color:var(--branco);
      line-height:1.7; max-width:700px; position:relative; z-index:2;
    }
    .obj-card strong { font-weight:800; }
    .obj-card-tag { position:relative; z-index:2; margin-bottom:28px; }

    /* escopo */
    .escopo-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
    .escopo-card {
      background:var(--branco); border:1px solid var(--borda);
      border-radius:16px; padding:32px 28px;
      position:relative; overflow:hidden;
      transition:border-color .2s,transform .2s,box-shadow .2s;
    }
    .escopo-card:hover {
      border-color:var(--roxo-claro);
      transform:translateY(-2px);
      box-shadow:0 8px 32px rgba(107,45,139,.1);
    }
    .escopo-card::before {
      content:''; position:absolute; top:0; left:0; right:0; height:3px;
      background:linear-gradient(90deg,var(--roxo),var(--roxo-claro));
      opacity:0; transition:opacity .2s;
    }
    .escopo-card:hover::before { opacity:1; }
    .escopo-ico {
      width:48px; height:48px; background:var(--roxo-suave);
      border-radius:12px; display:flex; align-items:center;
      justify-content:center; font-size:22px; margin-bottom:20px;
    }
    .escopo-card h4 { font-size:15px; font-weight:700; color:var(--preto); margin-bottom:10px; }
    .escopo-card p  { font-size:13px; color:var(--cinza-med); line-height:1.65; }

    /* metodologia */
    .met-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:32px; }
    .met-item {
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      border-radius:14px; padding:28px 20px; text-align:center;
    }
    .met-num { font-size:36px; font-weight:900; color:rgba(155,77,202,.25); margin-bottom:14px; line-height:1; }
    .met-item h4 { font-size:13px; font-weight:700; color:var(--branco); margin-bottom:8px; }
    .met-item p  { font-size:12px; color:rgba(255,255,255,.38); line-height:1.6; }
    .met-desc {
      background:rgba(107,45,139,.15);
      border:1px solid rgba(155,77,202,.2);
      border-radius:14px; padding:36px 40px;
    }
    .met-desc p { font-size:15px; color:rgba(255,255,255,.65); line-height:1.85; }
    .met-desc strong { color:var(--branco); font-weight:700; }

    /* cronograma */
    .crono { display:flex; flex-direction:column; }
    .fase  { display:flex; gap:28px; }
    .fase-esq { display:flex; flex-direction:column; align-items:center; width:48px; flex-shrink:0; }
    .fase-dot {
      width:48px; height:48px; border-radius:50%;
      background:var(--roxo);
      display:flex; align-items:center; justify-content:center;
      font-size:15px; font-weight:800; color:var(--branco);
      flex-shrink:0; z-index:2;
    }
    .fase-line { width:2px; flex:1; background:linear-gradient(to bottom,var(--roxo),var(--borda)); }
    .fase:last-child .fase-line { display:none; }
    .fase-body { padding-bottom:44px; flex:1; }
    .fase-body h4 { font-size:17px; font-weight:800; color:var(--preto); padding-top:10px; margin-bottom:8px; }
    .fase-dur {
      display:inline-block; font-size:10px; font-weight:700;
      letter-spacing:1.5px; text-transform:uppercase;
      color:var(--roxo); background:var(--roxo-suave);
      padding:4px 14px; border-radius:50px; margin-bottom:12px;
    }
    .fase-body p { font-size:14px; color:var(--cinza-med); line-height:1.75; }

    /* planos */
    .planos { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; align-items:start; }
    .plano {
      background:var(--branco); border:1px solid var(--borda);
      border-radius:20px; padding:36px 28px; position:relative;
    }
    .plano.destaque {
      background:var(--preto); border-color:transparent;
      box-shadow:0 20px 60px rgba(0,0,0,.18); transform:scale(1.035);
    }
    .plano-badge {
      position:absolute; top:-13px; left:50%; transform:translateX(-50%);
      background:linear-gradient(90deg,var(--roxo),var(--roxo-claro));
      color:var(--branco); font-size:9px; font-weight:800;
      letter-spacing:2px; text-transform:uppercase;
      padding:6px 20px; border-radius:50px; white-space:nowrap;
    }
    .plano h3 { font-size:17px; font-weight:800; color:var(--preto); margin-bottom:6px; }
    .plano.destaque h3 { color:var(--branco); }
    .plano-foco { font-size:12px; color:var(--cinza-med); line-height:1.55; margin-bottom:24px; }
    .plano.destaque .plano-foco { color:rgba(255,255,255,.42); }
    .plano-preco {
      padding:20px 0; border-top:1px solid var(--borda);
      border-bottom:1px solid var(--borda); margin-bottom:24px;
    }
    .plano.destaque .plano-preco { border-color:rgba(255,255,255,.08); }
    .plano-preco .moeda { font-size:15px; font-weight:600; vertical-align:super; margin-right:2px; color:var(--roxo-claro); }
    .plano-preco .valor { font-size:36px; font-weight:900; color:var(--roxo); letter-spacing:-1.5px; }
    .plano.destaque .plano-preco .valor { color:var(--roxo-claro); }
    .plano-lista { list-style:none; margin-bottom:24px; }
    .plano-lista li {
      font-size:13px; color:var(--cinza-esc); padding:8px 0;
      border-bottom:1px solid var(--cinza-clar);
      display:flex; gap:10px; align-items:flex-start; line-height:1.5;
    }
    .plano.destaque .plano-lista li { color:rgba(255,255,255,.68); border-color:rgba(255,255,255,.06); }
    .plano-lista li::before { content:'✓'; color:var(--roxo-claro); font-weight:800; flex-shrink:0; }
    .plano-entregaveis { background:var(--cinza-clar); border-radius:10px; padding:16px 18px; margin-bottom:24px; }
    .plano.destaque .plano-entregaveis { background:rgba(255,255,255,.05); }
    .plano-entregaveis .etit {
      font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
      color:var(--roxo-claro); display:block; margin-bottom:10px;
    }
    .plano-entregaveis ul { list-style:none; }
    .plano-entregaveis ul li {
      font-size:12px; color:var(--cinza-med); padding:3px 0;
      display:flex; gap:8px; align-items:flex-start; line-height:1.55;
    }
    .plano.destaque .plano-entregaveis ul li { color:rgba(255,255,255,.42); }
    .plano-entregaveis ul li::before { content:'→'; color:var(--roxo-claro); flex-shrink:0; font-weight:700; }
    .btn-plan {
      display:block; text-align:center; padding:14px;
      border-radius:10px; font-size:13px; font-weight:700;
      text-decoration:none; transition:all .2s; cursor:pointer;
    }
    .btn-outline { border:1.5px solid var(--borda); color:var(--cinza-esc); background:transparent; }
    .btn-outline:hover { border-color:var(--roxo); color:var(--roxo); }
    .btn-solid { background:linear-gradient(135deg,var(--roxo),var(--roxo-claro)); color:var(--branco); border:none; }
    .btn-solid:hover { opacity:.88; }

    /* condições */
    .conds {
      margin-top:40px; background:var(--branco);
      border:1px solid var(--borda); border-radius:16px;
      padding:36px 40px;
      display:grid; grid-template-columns:repeat(3,1fr); gap:32px;
    }
    .cond-item .ct {
      font-size:10px; font-weight:700; letter-spacing:2px;
      text-transform:uppercase; color:var(--roxo-claro); margin-bottom:10px;
    }
    .cond-item p { font-size:13px; color:var(--cinza-med); line-height:1.7; }

    /* sobre */
    .sobre-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
    .sobre-txt p { font-size:15px; color:var(--cinza-med); line-height:1.85; margin-bottom:18px; }
    .sobre-txt strong { color:var(--preto); font-weight:700; }
    .sobre-nums { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .sobre-num { background:var(--cinza-clar); border-radius:14px; padding:28px 20px; text-align:center; }
    .sobre-num .sn { font-size:34px; font-weight:900; color:var(--roxo); letter-spacing:-1px; }
    .sobre-num .sl { font-size:12px; color:var(--cinza-med); margin-top:4px; line-height:1.4; }

    /* próximos passos */
    .steps { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:48px; }
    .step {
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      border-radius:16px; padding:32px 24px;
    }
    .step.ativo { background:rgba(107,45,139,.2); border-color:rgba(155,77,202,.3); }
    .step-n { font-size:36px; font-weight:900; color:rgba(155,77,202,.25); margin-bottom:16px; line-height:1; }
    .step h4 { font-size:15px; font-weight:700; color:var(--branco); margin-bottom:10px; }
    .step p  { font-size:13px; color:rgba(255,255,255,.4); line-height:1.7; }

    .cta-box {
      background:linear-gradient(135deg,var(--roxo) 0%,#3D1060 100%);
      border-radius:20px; padding:56px 52px; text-align:center;
      position:relative; overflow:hidden;
    }
    .cta-box::before {
      content:''; position:absolute; top:-80px; right:-80px;
      width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle,rgba(255,255,255,.06) 0%,transparent 70%);
    }
    .cta-box h3 { font-size:28px; font-weight:900; color:var(--branco); letter-spacing:-.5px; margin-bottom:10px; position:relative; z-index:2; }
    .cta-box p  { font-size:15px; color:rgba(255,255,255,.55); margin-bottom:36px; position:relative; z-index:2; }
    .cta-btn {
      display:inline-block; background:var(--branco); color:var(--roxo);
      font-size:14px; font-weight:800; padding:18px 48px;
      border-radius:12px; text-decoration:none; letter-spacing:.5px;
      position:relative; z-index:2; transition:opacity .2s;
    }
    .cta-btn:hover { opacity:.9; }

    /* rodapé */
    footer {
      background:#080808; padding:52px 72px;
      display:flex; justify-content:space-between; align-items:center;
      flex-wrap:wrap; gap:24px;
      border-top:1px solid rgba(255,255,255,.06);
    }
    .ft-logo { font-size:30px; font-weight:900; letter-spacing:-1px; color:var(--branco); }
    .ft-logo span { color:var(--roxo-claro); }
    .ft-tagline { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.18); margin-top:6px; }
    .ft-info { text-align:right; }
    .ft-info p { font-size:13px; color:rgba(255,255,255,.3); line-height:1.9; }
    .ft-info a { color:var(--roxo-claro); text-decoration:none; }
    .ft-copy {
      width:100%; text-align:center;
      font-size:11px; color:rgba(255,255,255,.12); letter-spacing:1px;
      border-top:1px solid rgba(255,255,255,.04); padding-top:24px; margin-top:8px;
    }

    /* ══════════════════════════════════
       BOT FLUTUANTE
    ══════════════════════════════════ */
    #bot-bubble {
      position: fixed;
      bottom: 28px; right: 28px;
      z-index: 8000;
    }

    #bot-toggle {
      width: 60px; height: 60px;
      background: linear-gradient(135deg, var(--roxo), var(--roxo-claro));
      border: none; border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px;
      box-shadow: 0 8px 28px rgba(107,45,139,.45);
      transition: transform .2s, box-shadow .2s;
      position: relative;
    }
    #bot-toggle:hover { transform: scale(1.08); box-shadow: 0 12px 36px rgba(107,45,139,.55); }

    .bot-ping {
      position: absolute;
      top: -3px; right: -3px;
      width: 14px; height: 14px;
      background: #4ECCA3;
      border-radius: 50%;
      border: 2px solid var(--preto);
      animation: ping 1.8s ease infinite;
    }
    @keyframes ping {
      0%,100% { transform:scale(1); opacity:1; }
      50%      { transform:scale(1.4); opacity:.6; }
    }

    #bot-window {
      display: none;
      position: absolute;
      bottom: 72px; right: 0;
      width: 360px;
      background: #141414;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,.5);
      animation: slideUp .25s ease;
    }
    @keyframes slideUp {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }
    #bot-window.open { display:block; }

    .bot-header {
      background: linear-gradient(135deg, var(--roxo), var(--roxo-claro));
      padding: 18px 20px;
      display: flex; align-items: center; gap: 12px;
    }
    .bot-avatar {
      width: 40px; height: 40px;
      background: rgba(255,255,255,.2);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .bot-header-info h4 { font-size:14px; font-weight:800; color:var(--branco); margin-bottom:2px; }
    .bot-header-info span {
      font-size:10px; color:rgba(255,255,255,.65);
      display:flex; align-items:center; gap:5px;
    }
    .bot-online { width:7px; height:7px; background:#4ECCA3; border-radius:50%; display:inline-block; }
    .bot-close {
      margin-left:auto; background:none; border:none;
      color:rgba(255,255,255,.6); font-size:20px; cursor:pointer;
      line-height:1; transition:color .2s;
    }
    .bot-close:hover { color:var(--branco); }

    .bot-msgs {
      height: 300px;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .bot-msgs::-webkit-scrollbar { width:4px; }
    .bot-msgs::-webkit-scrollbar-track { background:transparent; }
    .bot-msgs::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:4px; }

    .msg {
      max-width: 88%;
      padding: 11px 15px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.65;
      animation: msgIn .2s ease;
    }
    @keyframes msgIn {
      from { opacity:0; transform:translateY(6px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .msg.bot {
      background: rgba(255,255,255,.07);
      color: rgba(255,255,255,.85);
      border-radius: 4px 14px 14px 14px;
      align-self: flex-start;
    }
    .msg.user {
      background: linear-gradient(135deg, var(--roxo), var(--roxo-claro));
      color: var(--branco);
      border-radius: 14px 14px 4px 14px;
      align-self: flex-end;
    }
    .msg-time {
      font-size: 10px;
      color: rgba(255,255,255,.25);
      margin-top: 4px;
      align-self: flex-start;
    }
    .msg-time.right { align-self: flex-end; }

    /* opções rápidas */
    .bot-options {
      padding: 0 16px 12px;
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .bot-opt {
      background: rgba(107,45,139,.2);
      border: 1px solid rgba(155,77,202,.3);
      color: var(--roxo-claro);
      border-radius: 50px;
      padding: 7px 14px;
      font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all .2s;
      font-family: 'Inter', sans-serif;
    }
    .bot-opt:hover { background:rgba(107,45,139,.4); border-color:var(--roxo-claro); }

    .bot-input-area {
      padding: 12px 16px 16px;
      border-top: 1px solid rgba(255,255,255,.06);
      display: flex; gap: 8px; align-items: center;
    }
    #bot-input {
      flex: 1;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 10px;
      padding: 11px 14px;
      font-size: 13px; color: var(--branco);
      font-family: 'Inter', sans-serif;
      outline: none; transition: border-color .2s;
    }
    #bot-input::placeholder { color:rgba(255,255,255,.25); }
    #bot-input:focus { border-color:var(--roxo-claro); }
    #bot-send {
      width: 38px; height: 38px;
      background: linear-gradient(135deg,var(--roxo),var(--roxo-claro));
      border: none; border-radius: 10px;
      display: flex; align-items:center; justify-content:center;
      cursor: pointer; font-size:16px; flex-shrink:0;
      transition: opacity .2s;
    }
    #bot-send:hover { opacity:.85; }

    /* typing indicator */
    .typing {
      display:flex; gap:5px; align-items:center;
      background:rgba(255,255,255,.07);
      padding:12px 16px; border-radius:4px 14px 14px 14px;
      width:fit-content;
    }
    .typing span {
      width:7px; height:7px; background:rgba(255,255,255,.4);
      border-radius:50%; animation:bounce .9s ease infinite;
    }
    .typing span:nth-child(2) { animation-delay:.15s; }
    .typing span:nth-child(3) { animation-delay:.3s; }
    @keyframes bounce {
      0%,60%,100% { transform:translateY(0); }
      30%          { transform:translateY(-5px); }
    }

    /* ── responsivo ── */
    @media (max-width:860px) {
      .capa,.sec,.sec-dark,.sec-soft,footer { padding:56px 36px; }
      .nums-grid,.escopo-grid,.met-grid,
      .planos,.steps,.sobre-grid,.conds { grid-template-columns:1fr; }
      .plano.destaque { transform:none; }
      footer { flex-direction:column; }
      .ft-info { text-align:left; }
      #bot-window { width:calc(100vw - 56px); right:0; }
    }
  






    

youB


    

Proposta Estratégica Exclusiva



    


      

Documento preparado para


      

Grupo SA


    



    Senha de acesso
    


      
      👁
    



    


      ❌ Senha incorreta. Verifique com a equipe youB.
    



    
      Acessar proposta →
    

    


      🔒 Acesso restrito · Documento confidencial
    



  


    
      

youB


      

Ecossistema DHO


    
    


      

Proposta Estratégica · Desenvolvimento Humano & Organizacional


      


        Transformação

        Estratégica
em Gestão de Pessoas
      


      
        Conectamos desenvolvimento humano, cultura e liderança em experiências contínuas, profundas e práticas — estruturadas para gerar resultado real na sua operação.
      


      


        


          

Apresentado para


          

Grupo SA


        


      


    


    


      

Maio de 2026  ·  Versão 1.0


      

Documento Confidencial


    



  


    

01 — Contexto


    

Entendemos o seu cenário


    Antes de qualquer proposta, mapeamos o ambiente, os desafios e as oportunidades reais da operação.


    


      Considerando uma operação com aproximadamente 500 colaboradores, distribuídos em múltiplas unidades e com alta diversidade de cargos e funções, identificamos oportunidades relevantes na estruturação de processos de RH, eficiência organizacional e gestão estratégica de pessoas. O Grupo SA enfrenta um momento de crescimento que exige bases sólidas para sustentar a escala com consistência e competitividade.


    


    


      

👥 500+ colaboradores mapeados


      

🏢 Múltiplas unidades


      

📊 Alta diversidade de cargos


      

🚀 Fase de crescimento acelerado


    


    


      

6

Frentes estratégicas identificadas


      

3

Fases de transformação estruturadas


      

12–13

Semanas de execução estimadas


    



  


    

02 — Objetivo


    

O que vamos construir juntos


    Um norte claro para orientar cada decisão e entrega ao longo do projeto.


    


      


        
          Propósito do Projeto
        
      


      Estruturar e fortalecer a área de Recursos Humanos como alavanca estratégica de crescimento, eficiência e sustentabilidade da operação — transformando pessoas, processos e cultura em vantagem competitiva real e mensurável.


    



  


    


      

03 — Escopo


      

Seis frentes de atuação


      Estrutura modular que permite priorizar as frentes de maior impacto para a realidade da empresa.


      


        

🌡️

Pesquisa de Clima Organizacional

Diagnóstico do ambiente interno com análise de engajamento, satisfação e fatores críticos de retenção.




        

🔍

Diagnóstico da Função de RH

Mapeamento dos processos atuais, identificação de gaps e oportunidades de evolução estrutural da área.




        

📊

Estrutura de Cargos e Salários

Construção de grade salarial hierarquizada com equidade interna e alinhamento ao mercado.




        

💰

Pesquisa de Remuneração

Benchmarking de remuneração, benefícios e práticas de mercado por segmento e porte.




        

📋

Descrição de Cargos

Descritivos detalhados por função com requisitos, responsabilidades e perfil comportamental esperado.




        

👥

Dimensionamento de Equipe

Análise qualiquantitativa do quadro de pessoal com recomendações de eficiência e redesenho organizacional.




      


    



  


    


      

04 — Metodologia


      

Nossa abordagem proprietária


      O que diferencia a youB não é o que entregamos — é como chegamos lá.


      


        

01

Diagnóstico Organizacional

Escuta ativa, análise de dados e mapeamento preciso do estado atual.




        

02

Benchmarking de Mercado

Comparativos com empresas de referência no setor e porte equivalente.




        

03

Construção Acionável

Recomendações práticas, priorizadas e adaptadas à realidade do cliente.




        

04

Resultado Mensurável

Indicadores definidos desde o início para acompanhar impacto real.




      


      


        Utilizamos uma abordagem proprietária que integra diagnóstico organizacional, análise de dados, benchmarking de mercado e construção de planos acionáveis — com foco em resultado mensurável e implementação real. Desenvolvimento humano, cultura e liderança conectados em experiências contínuas, profundas e práticas.


      


    



  


    

05 — Cronograma


    

Execução em 3 fases


    Ritmo estruturado para garantir qualidade, alinhamento e entrega sem surpresas.


    


      


        

1


        

Fase 1 — Diagnóstico

3 a 4 semanasImersão no ambiente da empresa: coleta de dados, entrevistas com lideranças, aplicação das pesquisas e mapeamento do estado atual dos processos de RH.




      


      


        

2


        

Fase 2 — Estruturação

4 a 6 semanasDesenvolvimento das entregas contratadas: estrutura de cargos, tabelas salariais, benchmarking, descrições e dimensionamento — com validações intermediárias junto ao cliente.




      


      


        

3


        

Fase 3 — Implementação e Recomendações

2 a 3 semanasApresentação dos resultados finais, relatório executivo consolidado, plano de ação com prioridades e suporte para a área de RH iniciar a implantação com segurança.




      


    



  


    


      

06 — Investimento


      

Escolha o plano ideal


      Três opções estruturadas de acordo com o nível de profundidade e escopo desejado.


      


        
        


          

Plano Essencial


          Diagnóstico estruturado e direcionamento estratégico inicial.


          

R$45.000


          


            

Pesquisa de clima organizacional com análise consolidada


            

Diagnóstico da função de RH com identificação de gaps


            

Benchmark inicial de práticas de mercado


            

Recomendações estratégicas prioritárias


            

Plano de ação inicial para evolução da área de RH


          


          


            Entregáveis
            


              

Relatório executivo com principais achados


              

Matriz de riscos e oportunidades


              

Plano de ação estruturado (curto prazo)


            


          


          [Falar com a youB](https://wa.me/5521991417327)
        


        
        


          

⭐ Recomendado


          

Plano Estratégico


          Estruturação da base organizacional e aumento de eficiência.


          

R$85.000


          


            

Todos os itens do Plano Essencial


            

Pesquisa aprofundada de salários, benefícios e práticas de mercado


            

Construção de tabela salarial com hierarquização de cargos


            

Análise de equidade interna e consistência estrutural


            

Apoio na definição de critérios de progressão e movimentação


          


          


            Entregáveis
            


              

Tabela salarial estruturada


              

Diretrizes de remuneração e crescimento


              

Relatório analítico com recomendações estratégicas ampliadas


            


          


          [Escolher este plano](https://wa.me/5521991417327)
        


        
        


          

Plano Completo


          Transformação da estrutura organizacional e máxima eficiência operacional.


          

R$140.000


          


            

Todos os itens do Plano Estratégico


            

Desenvolvimento de descrições de cargos detalhadas


            

Dimensionamento qualiquantitativo do quadro de pessoal


            

Análise de produtividade e eficiência por estrutura


            

Recomendações de redesenho organizacional


            

Diretrizes para evolução contínua da área de RH


          


          


            Entregáveis
            


              

Estrutura completa de cargos documentada


              

Modelo recomendado de dimensionamento


              

Relatório executivo final com visão estratégica de longo prazo


            


          


          [Falar com a youB](https://wa.me/5521991417327)
        


      


      


        

Condições de Pagamento

50% na assinatura do contrato e 50% na entrega dos relatórios finais. Parcelamento disponível para projetos acima de R$ 85.000.




        

Validade da Proposta

Esta proposta tem validade de 30 dias a partir da data de emissão, sujeita à disponibilidade de agenda.




        

Início do Projeto

Em até 5 dias úteis após assinatura do contrato e confirmação do pagamento inicial.




      


    



  


    

07 — Quem somos


    

A empresa por trás do projeto


    Ecossistema completo de DHO — mais do que consultoria, somos parceiros de transformação.


    


      


        A youB é uma empresa de educação corporativa e desenvolvimento humano e organizacional que integra inteligência artificial, comportamento humano e liderança estratégica para gerar transformações reais nas organizações.


        Nossa atuação vai além do diagnóstico. Apoiamos empresas na construção de estruturas de RH que funcionam como verdadeiras alavancas de crescimento — com metodologia proprietária, foco em dados e entregas que movem o negócio.


        Conectamos desenvolvimento humano, cultura e liderança em experiências contínuas, profundas e práticas.


      


      


        

+50

Empresas atendidas


        

+5k

Líderes desenvolvidos


        

98%

Índice de satisfação


        

IA+

Metodologia integrada com tecnologia


      


    



  


    


      

08 — Pró

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://comercialyoub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bc146d5f-553d-4a79-baf4-9336b4e30206).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
