const LABELS = {"personal": [{"titulo": "👤 Dados pessoais", "campos": [{"key": "nome", "label": "Nome completo"}, {"key": "celular", "label": "Celular"}, {"key": "email", "label": "E-mail"}]}, {"titulo": "📊 Dados físicos", "campos": [{"key": "idade", "label": "Idade"}, {"key": "altura", "label": "Altura"}, {"key": "peso", "label": "Peso atual"}, {"key": "profissao", "label": "Profissão"}]}, {"titulo": "🏃 Perfil físico e estilo de vida", "campos": [{"key": "atividade_atual", "label": "Você pratica alguma atividade física atualmente? Se sim, qual(is)?"}, {"key": "condicionamento", "label": "Como classificaria seu condicionamento físico hoje?"}, {"key": "pontos_fortes", "label": "Quais você considera seus principais pontos fortes fisicamente?"}, {"key": "pontos_melhorar", "label": "Quais pontos você sente que precisa melhorar?"}]}, {"titulo": "🏥 Saúde e histórico", "campos": [{"key": "lesao", "label": "Já teve alguma lesão? Se sim, qual(is)?"}, {"key": "dor", "label": "Sente alguma dor ou desconforto atualmente?"}, {"key": "cirurgia", "label": "Já realizou alguma cirurgia?"}, {"key": "problema_saude", "label": "Possui algum problema de saúde diagnosticado?"}, {"key": "medicamento", "label": "Faz uso de algum medicamento contínuo?"}, {"key": "restricao", "label": "Possui alguma restrição médica para exercícios físicos?"}]}, {"titulo": "🏋️ Rotina e treino", "campos": [{"key": "ja_treina", "label": "Você já treina atualmente? Se sim, o que faz e há quanto tempo?"}, {"key": "dias_semana", "label": "Quantos dias por semana consegue treinar?"}, {"key": "tempo_treino", "label": "Quanto tempo você tem disponível por treino?"}, {"key": "local_treino", "label": "Onde pretende treinar?"}]}, {"titulo": "🥗 Hábitos", "campos": [{"key": "alimentacao", "label": "Como está sua alimentação hoje? Está em dieta?"}, {"key": "refeicoes", "label": "Quantas refeições faz por dia, em média?"}, {"key": "sono_horas", "label": "Quantas horas você dorme por noite, em média?"}, {"key": "sono_qualidade", "label": "Como avalia sua qualidade de sono?"}, {"key": "agua", "label": "Quantos litros de água costuma beber por dia?"}, {"key": "alcool", "label": "Consome bebidas alcoólicas? Com qual frequência?"}, {"key": "nicotina", "label": "Você fuma ou utiliza algum produto com nicotina?"}]}, {"titulo": "🎯 Objetivos", "campos": [{"key": "objetivo", "label": "Qual seu principal objetivo com o treino?"}, {"key": "meta", "label": "Existe alguma meta específica que deseja alcançar?"}]}, {"titulo": "💳 Organização", "campos": [{"key": "dia_pagamento", "label": "Melhor dia do mês para o pagamento do personal"}]}, {"titulo": "📝 Observações", "campos": [{"key": "observacoes", "label": "Tem mais alguma informação importante que eu deva saber?"}]}], "atleta": [{"titulo": "👤 Dados pessoais", "campos": [{"key": "nome", "label": "Nome completo"}, {"key": "celular", "label": "Celular"}, {"key": "email", "label": "E-mail"}]}, {"titulo": "📊 Dados físicos", "campos": [{"key": "idade", "label": "Idade"}, {"key": "altura", "label": "Altura"}, {"key": "peso", "label": "Peso atual"}, {"key": "posicao", "label": "Posição que joga"}]}, {"titulo": "⚽ Perfil como atleta", "campos": [{"key": "qual_tecnicas", "label": "Quais você considera suas principais qualidades técnicas?"}, {"key": "qual_fisicas", "label": "Quais suas principais qualidades físicas?"}, {"key": "melhorar_tecnico", "label": "Quais pontos técnicos você acha que precisa melhorar?"}, {"key": "melhorar_fisico", "label": "Quais pontos físicos você sente que precisa evoluir?"}]}, {"titulo": "🏥 Saúde e histórico", "campos": [{"key": "lesao", "label": "Já teve alguma lesão? Se sim, qual(is)?"}, {"key": "dor", "label": "Sente alguma dor atualmente?"}, {"key": "cirurgia", "label": "Já fez cirurgia?"}, {"key": "problema_saude", "label": "Possui algum problema de saúde ou limitação?"}]}, {"titulo": "🏋️ Rotina e treino", "campos": [{"key": "ja_treina", "label": "Você já treina atualmente? Se sim, o que faz?"}, {"key": "treinos_extras", "label": "Além dos dois dias de personal, consegue treinar nos outros dias? Se sim, quantos?"}]}, {"titulo": "🥗 Hábitos", "campos": [{"key": "alimentacao", "label": "Como está sua alimentação hoje?"}, {"key": "sono_horas", "label": "Quantas horas você dorme por noite, em média?"}]}, {"titulo": "🎯 Objetivo", "campos": [{"key": "objetivo", "label": "Qual seu principal objetivo com o treino?"}]}, {"titulo": "💳 Organização", "campos": [{"key": "dia_pagamento", "label": "Melhor dia do mês para o pagamento do personal"}]}, {"titulo": "📝 Observações", "campos": [{"key": "observacoes", "label": "Tem mais alguma informação importante que eu deva saber?"}]}]};
// =============================================================
//  admin.js — login (Firebase Auth) + painel completo
// =============================================================

// ---------- referências de UI ----------
const loginView = document.getElementById("loginView");
const panelView = document.getElementById("panelView");
const navRight  = document.getElementById("navRight");

// ---------- estado ----------
let ALUNOS = [];        // [{id, perfil, ...campos}]
let PAGAMENTOS = {};    // { alunoId: { "YYYY-MM": {status, valor, pagoEm} } }
let PRECOS = { personal: 0, atleta: 0 };
let filtroPerfil = "todos";

// ================= AUTENTICAÇÃO =================
if (!window.App || !App.pronto) {
  document.getElementById("cfgWarn").hidden = false;
} else {
  App.auth.onAuthStateChanged(user => {
    if (user) entrarPainel(user);
    else sairPainel();
  });
}

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("loginMsg");
  msg.textContent = "";
  msg.className = "form-msg err";

  if (!window.App || !App.pronto) {
    msg.innerHTML = "⚠️ Firebase não configurado. Verifique se <b>js/firebase-config.js</b> tem suas chaves e se as pastas <b>css/</b> e <b>js/</b> subiram para o servidor.";
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPass").value;

  if (!email || !pass) {
    msg.textContent = "Preencha e-mail e senha.";
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  const btnTxt = btn.textContent;
  btn.textContent = "Entrando…";

  try {
    await App.auth.signInWithEmailAndPassword(email, pass);
    // sucesso: onAuthStateChanged assume daqui
  } catch (err) {
    // log completo para depuração (você vê no F12 -> Console)
    console.error("[Login] Falha na autenticação:", err.code, err.message, err);

    // mensagem amigável + dica de correção por código
    const info = {
      "auth/invalid-credential":     ["E-mail ou senha incorretos.", "Confira a senha. Se esqueceu, redefina em Authentication → Users → ⋮ → Redefinir senha."],
      "auth/invalid-login-credentials": ["E-mail ou senha incorretos.", "Confira a senha ou redefina no console (Authentication → Users)."],
      "auth/wrong-password":         ["Senha incorreta.", "Redefina a senha em Authentication → Users, se precisar."],
      "auth/user-not-found":         ["Usuário não encontrado.", "Crie o login em Authentication → Users → Adicionar usuário."],
      "auth/invalid-email":          ["E-mail inválido.", "Verifique se digitou o e-mail corretamente."],
      "auth/user-disabled":          ["Usuário desativado.", "Reative o usuário no console do Firebase."],
      "auth/too-many-requests":      ["Muitas tentativas.", "Aguarde alguns minutos antes de tentar de novo."],
      "auth/operation-not-allowed":  ["Login por e-mail/senha desativado.", "Ative em Authentication → Sign-in method → E-mail/senha."],
      "auth/unauthorized-domain":    ["Domínio não autorizado.", "Adicione o domínio deste site em Authentication → Settings → Domínios autorizados."],
      "auth/network-request-failed": ["Falha de conexão.", "Verifique a internet e se o site está no ar (https)."],
      "auth/api-key-not-valid":      ["Chave de API inválida.", "Revise a apiKey em js/firebase-config.js."],
      "auth/configuration-not-found":["Configuração não encontrada.", "Ative o método E-mail/senha em Authentication → Sign-in method."]
    };
    const [texto, dica] = info[err.code] || ["Não foi possível entrar.", "Veja o console (F12) para o erro completo."];
    const codigo = err.code ? ` <span style="opacity:.7">(${err.code})</span>` : "";
    msg.innerHTML = `${texto}${codigo}<br><span class="hint" style="color:#ffcf9a">💡 ${dica}</span>`;
  } finally {
    btn.disabled = false;
    btn.textContent = btnTxt;
  }
});

document.getElementById("btnSair").addEventListener("click", () => App.auth.signOut());

function entrarPainel(user) {
  loginView.hidden = true;
  panelView.hidden = false;
  navRight.hidden = false;
  // reforço: garante a troca mesmo se o CSS antigo estiver em cache
  loginView.style.display = "none";
  panelView.style.display = "block";
  navRight.style.display = "flex";
  document.getElementById("whoami").textContent = user.email;
  carregarTudo();
}
function sairPainel() {
  panelView.hidden = true;
  navRight.hidden = true;
  loginView.hidden = false;
  panelView.style.display = "none";
  navRight.style.display = "none";
  loginView.style.display = "grid";
}

// ================= ABAS =================
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tabpane").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    document.getElementById("tab-" + t.dataset.tab).classList.add("active");
  });
});

// ================= CARREGAR DADOS =================
function carregarTudo() {
  // alunos (personal + atleta) em tempo real
  App.db.ref("alunos").on("value", snap => {
    const v = snap.val() || {};
    ALUNOS = [];
    ["personal", "atleta"].forEach(perfil => {
      const grupo = v[perfil] || {};
      Object.keys(grupo).forEach(id => {
        ALUNOS.push(Object.assign({ id, perfil }, grupo[id]));
      });
    });
    ALUNOS.sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));
    renderAlunos();
    renderFinanceiro();
  }, erroLeitura);

  App.db.ref("pagamentos").on("value", snap => {
    PAGAMENTOS = snap.val() || {};
    renderAlunos();
    renderFinanceiro();
  }, erroLeitura);

  App.db.ref("config/precos").on("value", snap => {
    PRECOS = snap.val() || { personal: 0, atleta: 0 };
    document.getElementById("precoPersonal").value = PRECOS.personal || "";
    document.getElementById("precoAtleta").value = PRECOS.atleta || "";
    renderFinanceiro();
  }, erroLeitura);
}

// mostra um aviso no topo do painel se a leitura for bloqueada
let avisoMostrado = false;
function erroLeitura(err) {
  console.error("[Painel] Erro ao ler dados:", err && err.code, err && err.message, err);
  if (avisoMostrado) return;
  avisoMostrado = true;
  const main = document.getElementById("panelView");
  const div = document.createElement("div");
  div.className = "note";
  div.style.margin = "0 0 20px";
  const permissao = err && (err.code === "PERMISSION_DENIED" || /permission/i.test(err.message || ""));
  if (permissao) {
    div.innerHTML = "🔒 <b>Permissão negada ao ler os dados.</b> Você entrou, mas o banco está bloqueado. " +
      "Publique as regras: Console do Firebase → Realtime Database → aba <b>Regras</b> → cole o conteúdo de <b>regras-firebase.txt</b> → <b>Publicar</b>.";
  } else {
    div.innerHTML = "⚠️ Não consegui carregar os dados" +
      (err && err.code ? ` <span style='opacity:.7'>(${err.code})</span>` : "") +
      ". Verifique sua conexão e o console (F12).";
  }
  main.insertBefore(div, main.firstChild);
}

// preço padrão conforme perfil (permite override por aluno em .valorMensal)
function valorDoAluno(a) {
  if (a.valorMensal != null && a.valorMensal !== "") return Number(a.valorMensal);
  return Number(PRECOS[a.perfil] || 0);
}
function diaVenc(a) {
  return a.dia_pagamento || "—";
}

// ================= ABA ALUNOS =================
const segPerfil = document.getElementById("segPerfil");
segPerfil.querySelectorAll("button").forEach(b => {
  b.addEventListener("click", () => {
    segPerfil.querySelectorAll("button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    filtroPerfil = b.dataset.f;
    renderAlunos();
  });
});
document.getElementById("busca").addEventListener("input", renderAlunos);

function alunosFiltrados() {
  const termo = document.getElementById("busca").value.toLowerCase().trim();
  return ALUNOS.filter(a => {
    if (filtroPerfil !== "todos" && a.perfil !== filtroPerfil) return false;
    if (!termo) return true;
    return (a.nome + " " + a.email + " " + (a.celular || "")).toLowerCase().includes(termo);
  });
}

function renderAlunos() {
  // KPIs
  const nP = ALUNOS.filter(a => a.perfil === "personal").length;
  const nA = ALUNOS.filter(a => a.perfil === "atleta").length;
  const seteDias = Date.now() - 7 * 864e5;
  const novos = ALUNOS.filter(a => (a.criadoEm || 0) >= seteDias).length;
  document.getElementById("kpiTotal").textContent = ALUNOS.length;
  document.getElementById("kpiPersonal").textContent = nP;
  document.getElementById("kpiAtletas").textContent = nA;
  document.getElementById("kpiNovos").textContent = novos;

  const lista = alunosFiltrados();
  const tb = document.querySelector("#tblAlunos tbody");
  if (!lista.length) {
    tb.innerHTML = '<tr><td colspan="7" class="empty">Nenhum aluno encontrado.</td></tr>';
    return;
  }
  const mes = mesAtual();
  tb.innerHTML = lista.map(a => {
    const pg = (PAGAMENTOS[a.id] && PAGAMENTOS[a.id][mes]) || null;
    const status = statusPagamento(a, pg);
    const data = a.criadoEmISO ? new Date(a.criadoEmISO).toLocaleDateString("pt-BR") : "—";
    return `<tr>
      <td><span class="name">${esc(a.nome)}</span></td>
      <td><span class="pill ${a.perfil}">${a.perfil === "personal" ? "Personal" : "Atleta"}</span></td>
      <td>${esc(a.celular || "—")}<br><span class="hint">${esc(a.email || "")}</span></td>
      <td>${esc((a.objetivo || "—").slice(0, 46))}</td>
      <td>${pillStatus(status)}</td>
      <td>${data}</td>
      <td style="white-space:nowrap">
        <button class="icon-btn" title="Ver ficha" data-ver="${a.perfil}:${a.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="icon-btn danger" title="Excluir" data-del="${a.perfil}:${a.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>
      </td>
    </tr>`;
  }).join("");

  tb.querySelectorAll("[data-ver]").forEach(b =>
    b.addEventListener("click", () => abrirFicha(b.dataset.ver)));
  tb.querySelectorAll("[data-del]").forEach(b =>
    b.addEventListener("click", () => excluirAluno(b.dataset.del)));
}

function statusPagamento(a, pg) {
  if (pg && pg.status === "pago") return "pago";
  // vencido se hoje já passou do dia de vencimento no mês atual
  const dia = parseInt(a.dia_pagamento, 10);
  if (dia && new Date().getDate() > dia) return "vencido";
  return "pendente";
}
function pillStatus(s) {
  const t = { pago: "Pago", pendente: "Pendente", vencido: "Vencido" }[s] || "—";
  return `<span class="pill ${s}">${t}</span>`;
}

function excluirAluno(ref) {
  const [perfil, id] = ref.split(":");
  const a = ALUNOS.find(x => x.id === id);
  if (!confirm(`Excluir ${a ? a.nome : "este aluno"}? Esta ação não pode ser desfeita.`)) return;
  App.db.ref(`alunos/${perfil}/${id}`).remove();
  App.db.ref(`pagamentos/${id}`).remove();
  App.db.ref(`notas/${id}`).remove();
}

// ================= FICHA (MODAL) =================
const modalBack = document.getElementById("modalBack");
document.getElementById("mdClose").addEventListener("click", fecharFicha);
modalBack.addEventListener("click", e => { if (e.target === modalBack) fecharFicha(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharFicha(); });
function fecharFicha() { modalBack.classList.remove("open"); }

function abrirFicha(ref) {
  const [perfil, id] = ref.split(":");
  const a = ALUNOS.find(x => x.id === id);
  if (!a) return;

  document.getElementById("mdNome").textContent = a.nome || "—";
  document.getElementById("mdBadges").innerHTML =
    `<span class="pill ${a.perfil}">${a.perfil === "personal" ? "Personal" : "Atleta"}</span> ` +
    `<span class="pill">Recebido em ${a.criadoEmISO ? new Date(a.criadoEmISO).toLocaleDateString("pt-BR") : "—"}</span>`;

  const grupos = LABELS[perfil] || [];
  let html = "";

  grupos.forEach(g => {
    const linhas = g.campos.map(c => {
      const val = a[c.key];
      const blank = (val == null || val === "");
      return `<div class="qa"><div class="q">${esc(c.label)}</div>
        <div class="a ${blank ? "blank" : ""}">${blank ? "— não informado —" : esc(val)}</div></div>`;
    }).join("");
    html += `<div class="modal-group"><h3>${esc(g.titulo)}</h3>${linhas}</div>`;
  });

  // valor individual (override)
  html += `<div class="modal-group"><h3>💳 Financeiro do aluno</h3>
    <div class="qa"><div class="q">Valor mensal (deixe vazio para usar o padrão ${moeda(PRECOS[perfil] || 0)})</div>
      <div class="prefix-input" style="max-width:220px;margin-top:6px"><span>R$</span>
        <input type="number" id="mdValor" min="0" step="0.01" value="${a.valorMensal != null ? a.valorMensal : ""}" placeholder="${PRECOS[perfil] || 0}"></div>
    </div>
    <div class="qa"><div class="q">Histórico de pagamentos (clique para alternar pago/pendente)</div>
      <div class="pay-hist" id="mdPayHist"></div>
    </div>
  </div>`;

  // notas internas
  html += `<div class="modal-group"><h3>🗒️ Observações internas (só você vê)</h3>
    <textarea id="mdNota" placeholder="Anotações sobre o aluno, evolução, combinados…"></textarea>
    <div class="form-actions">
      <button class="btn-sm solid" id="mdSalvar">Salvar alterações</button>
      <span class="form-msg" id="mdMsg"></span>
    </div>
  </div>`;

  document.getElementById("mdBody").innerHTML = html;
  modalBack.classList.add("open");

  // histórico de meses (últimos 6)
  renderPayHist(id, a);

  // carregar nota
  App.db.ref("notas/" + id).once("value").then(s => {
    const n = s.val();
    document.getElementById("mdNota").value = (n && n.texto) || "";
  });

  document.getElementById("mdSalvar").addEventListener("click", () => salvarFicha(perfil, id));
}

function renderPayHist(id, a) {
  const box = document.getElementById("mdPayHist");
  const meses = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    meses.push(dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0"));
  }
  box.innerHTML = meses.map(m => {
    const pg = (PAGAMENTOS[id] && PAGAMENTOS[id][m]) || null;
    const pago = pg && pg.status === "pago";
    return `<span class="mo ${pago ? "pago" : "pendente"}" data-mes="${m}">${rotuloMes(m)}${pago ? " ✓" : ""}</span>`;
  }).join("");
  box.querySelectorAll("[data-mes]").forEach(el => {
    el.addEventListener("click", () => {
      const m = el.dataset.mes;
      const pg = (PAGAMENTOS[id] && PAGAMENTOS[id][m]) || null;
      const novo = !(pg && pg.status === "pago");
      togglePagamento(id, a, m, novo).then(() => {
        el.classList.toggle("pago", novo);
        el.classList.toggle("pendente", !novo);
        el.textContent = rotuloMes(m) + (novo ? " ✓" : "");
      });
    });
  });
}

function togglePagamento(id, a, mes, pago) {
  const ref = App.db.ref(`pagamentos/${id}/${mes}`);
  if (pago) {
    return ref.set({ status: "pago", valor: valorDoAluno(a), pagoEm: new Date().toISOString() });
  }
  return ref.set({ status: "pendente", valor: valorDoAluno(a) });
}

function salvarFicha(perfil, id) {
  const valor = document.getElementById("mdValor").value;
  const nota = document.getElementById("mdNota").value;
  const msg = document.getElementById("mdMsg");
  const up = {};
  up[`alunos/${perfil}/${id}/valorMensal`] = valor === "" ? null : Number(valor);
  Promise.all([
    App.db.ref().update(up),
    App.db.ref("notas/" + id).set({ texto: nota, atualizadoEm: new Date().toISOString() })
  ]).then(() => {
    msg.className = "form-msg ok"; msg.textContent = "Salvo!";
    setTimeout(() => msg.textContent = "", 1600);
  }).catch(() => { msg.className = "form-msg err"; msg.textContent = "Erro ao salvar."; });
}

// ================= ABA FINANCEIRO =================
const finMes = document.getElementById("finMes");
finMes.value = mesAtual();
finMes.addEventListener("change", renderFinanceiro);

function renderFinanceiro() {
  const mes = finMes.value || mesAtual();
  let recebido = 0, aReceber = 0, previsto = 0, inadimplentes = 0;
  const alertas = [];
  const hoje = new Date().getDate();

  const linhas = ALUNOS.map(a => {
    const valor = valorDoAluno(a);
    previsto += valor;
    const pg = (PAGAMENTOS[a.id] && PAGAMENTOS[a.id][mes]) || null;
    const pago = pg && pg.status === "pago";
    if (pago) recebido += (pg.valor != null ? Number(pg.valor) : valor);
    else {
      aReceber += valor;
      const dia = parseInt(a.dia_pagamento, 10);
      const venceHoje = dia === hoje;
      const vencido = dia && hoje > dia;
      if (vencido) inadimplentes++;
      if (mes === mesAtual() && (venceHoje || (dia && hoje >= dia - 2 && hoje <= dia)))
        alertas.push(`${a.nome} vence dia ${a.dia_pagamento}`);
    }
    const st = pago ? "pago" : (parseInt(a.dia_pagamento,10) && hoje > parseInt(a.dia_pagamento,10) && mes===mesAtual() ? "vencido" : "pendente");
    return { a, valor, pago, st };
  });

  document.getElementById("finRecebido").textContent = moeda(recebido);
  document.getElementById("finAReceber").textContent = moeda(aReceber);
  document.getElementById("finPrevisto").textContent = moeda(previsto);
  document.getElementById("finInadimplentes").textContent = inadimplentes;
  document.getElementById("finResumoMes").textContent =
    `${linhas.filter(l => l.pago).length} de ${linhas.length} pagos`;

  const boxAl = document.getElementById("finAlertas");
  if (alertas.length && mes === mesAtual()) {
    boxAl.hidden = false;
    boxAl.innerHTML = "⏰ <b>Vencimentos próximos:</b> " + alertas.map(esc).join(" · ");
  } else boxAl.hidden = true;

  const tb = document.querySelector("#tblFin tbody");
  if (!linhas.length) {
    tb.innerHTML = '<tr><td colspan="6" class="empty">Nenhum aluno ainda.</td></tr>';
    return;
  }
  tb.innerHTML = linhas.map(({ a, valor, pago, st }) => `<tr>
    <td><span class="name">${esc(a.nome)}</span></td>
    <td><span class="pill ${a.perfil}">${a.perfil === "personal" ? "Personal" : "Atleta"}</span></td>
    <td>dia ${esc(a.dia_pagamento || "—")}</td>
    <td>${moeda(valor)}</td>
    <td>${pillStatus(st)}</td>
    <td><button class="btn-sm ${pago ? "" : "solid"}" data-toggle="${a.id}">${pago ? "Desmarcar" : "Marcar pago"}</button></td>
  </tr>`).join("");

  tb.querySelectorAll("[data-toggle]").forEach(btn =>
    btn.addEventListener("click", () => {
      const a = ALUNOS.find(x => x.id === btn.dataset.toggle);
      const pg = (PAGAMENTOS[a.id] && PAGAMENTOS[a.id][mes]) || null;
      const novo = !(pg && pg.status === "pago");
      togglePagamento(a.id, a, mes, novo);
    }));
}

// ================= CONFIG =================
document.getElementById("btnSalvarPrecos").addEventListener("click", () => {
  const msg = document.getElementById("cfgMsg");
  const dados = {
    personal: Number(document.getElementById("precoPersonal").value) || 0,
    atleta: Number(document.getElementById("precoAtleta").value) || 0
  };
  App.db.ref("config/precos").set(dados).then(() => {
    msg.className = "form-msg ok"; msg.textContent = "Valores salvos!";
    setTimeout(() => msg.textContent = "", 1800);
  }).catch(() => { msg.className = "form-msg err"; msg.textContent = "Erro ao salvar."; });
});

// ================= EXPORTAR CSV =================
document.getElementById("btnExport").addEventListener("click", () => {
  const lista = alunosFiltrados();
  if (!lista.length) return alert("Nada para exportar.");
  const cols = ["perfil", "nome", "celular", "email", "idade", "altura", "peso", "objetivo", "dia_pagamento", "criadoEmISO"];
  const cab = ["Perfil","Nome","Celular","Email","Idade","Altura","Peso","Objetivo","Dia pagamento","Recebido em"];
  const linhas = lista.map(a => cols.map(c => {
    let v = a[c] == null ? "" : String(a[c]);
    v = v.replace(/"/g, '""');
    return `"${v}"`;
  }).join(";"));
  const csv = "\uFEFF" + cab.join(";") + "\n" + linhas.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `alunos-${filtroPerfil}-${mesAtual()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});
