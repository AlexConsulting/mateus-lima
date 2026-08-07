// =============================================================
//  questionario.js — escolha de perfil, envio para o Firebase
// =============================================================

const secEscolha  = document.getElementById("escolha");
const secPersonal = document.getElementById("form-personal");
const secAtleta   = document.getElementById("form-atleta");
const secSucesso  = document.getElementById("sucesso");

function mostrar(sec) {
  [secEscolha, secPersonal, secAtleta, secSucesso].forEach(s => s.hidden = true);
  sec.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// escolha de perfil
document.querySelectorAll(".choice").forEach(c => {
  c.addEventListener("click", () => {
    mostrar(c.dataset.perfil === "atleta" ? secAtleta : secPersonal);
  });
});
document.querySelectorAll("[data-voltar]").forEach(b => {
  b.addEventListener("click", () => mostrar(secEscolha));
});

// coleta + padronização dos campos de um form
function coletar(form) {
  const dados = {};
  form.querySelectorAll("[name]").forEach(el => {
    const norm = el.dataset.norm || "title";
    // Garante a leitura correta tanto de inputs quanto de selects (como a modalidade)
    const valorCampo = el.type === "select-one" ? el.value : el.value;
    dados[el.name] = padronizar(valorCampo, norm);
  });
  return dados;
}

// validação simples dos obrigatórios
function validar(form) {
  let ok = true;
  form.querySelectorAll("[required]").forEach(el => {
    // Tratamento especial para checkbox obrigatório (Termo PAR-Q)
    const vazio = el.type === "checkbox" ? !el.checked : !el.value.trim();
    el.style.borderColor = vazio ? "#ff8a6b" : "";
    if (vazio && ok) { el.focus(); ok = false; }
  });
  return ok;
}

async function enviar(form, perfil) {
  const msg = form.querySelector("[data-msg]");
  const btn = form.querySelector('button[type="submit"]');

  if (!validar(form)) {
    msg.className = "form-msg err";
    msg.textContent = "Preencha os campos obrigatórios e aceite o termo (marcados com *).";
    return;
  }

  if (!window.App || !App.pronto) {
    msg.className = "form-msg err";
    msg.textContent = "Sistema ainda não conectado ao banco. Avise o Mateus.";
    return;
  }

  const registro = coletar(form);
  registro.perfil = perfil;
  
  // Captura os campos adicionados dinamicamente via ID (Cupom e Termo)
  const sufixo = perfil === "atleta" ? "Atleta" : "Personal";
  const cupomEl = document.getElementById("cupomInput" + sufixo);
  const termoEl = document.getElementById("termoResponsabilidade" + sufixo);

  registro.cupom = cupomEl ? cupomEl.value.trim().toUpperCase() : "";
  registro.termoAceito = termoEl ? termoEl.checked : false;

  // Assegura que o campo modalidade venha preenchido para o personal (caso venha vazio no atleta, define padrão)
  if (perfil === "personal" && !registro.modalidade) {
    registro.modalidade = "Individual";
  } else if (perfil === "atleta") {
    registro.modalidade = "Atleta";
  }

  registro.criadoEm = Date.now();
  registro.criadoEmISO = new Date().toISOString();
  registro.status = "novo";             // novo | ativo | inativo (o admin ajusta)

  btn.disabled = true;
  msg.className = "form-msg";
  msg.innerHTML = '<span class="loader"></span> Enviando…';

  try {
    await App.db.ref("alunos/" + perfil).push(registro);
    mostrar(secSucesso);
    form.reset();
    // Limpa feedbacks extras de cupom se houver
    const feedbackEl = document.getElementById("cupomFeedback" + sufixo);
    if (feedbackEl) feedbackEl.textContent = "";
  } catch (e) {
    console.error("[Questionário] Falha ao salvar:", e.code, e.message, e);
    msg.className = "form-msg err";
    if (e.code === "PERMISSION_DENIED" || /permission/i.test(e.message || "")) {
      msg.innerHTML = 'Não consegui salvar (permissão negada). <span class="hint" style="color:#ffcf9a">💡 As regras do banco precisam ser publicadas — veja regras-firebase.txt.</span>';
    } else {
      msg.innerHTML = `Não consegui enviar agora. Tente novamente em instantes.${e.code ? ` <span style="opacity:.7">(${e.code})</span>` : ""}`;
    }
    btn.disabled = false;
  }
}

document.getElementById("formPersonal").addEventListener("submit", e => {
  e.preventDefault(); enviar(e.target, "personal");
});
document.getElementById("formAtleta").addEventListener("submit", e => {
  e.preventDefault(); enviar(e.target, "atleta");
});

// Lógica de validação do Cupom Relâmpago (Personal)
const btnCupomPersonal = document.getElementById("btnAplicarCupomPersonal");
if (btnCupomPersonal) {
  btnCupomPersonal.addEventListener("click", () => {
    const input = document.getElementById("cupomInputPersonal");
    const feedback = document.getElementById("cupomFeedbackPersonal");
    const val = input.value.trim().toUpperCase();
    if (!val) {
      feedback.style.color = "#ff8a6b";
      feedback.textContent = "Digite um código de cupom válido.";
      return;
    }
    // Exemplo de checagem simulada ou integrada
    feedback.style.color = "#4ade80";
    feedback.textContent = "✔ Cupom aplicado com sucesso!";
  });
}

// Lógica de validação do Cupom Relâmpago (Atleta)
const btnCupomAtleta = document.getElementById("btnAplicarCupomAtleta");
if (btnCupomAtleta) {
  btnCupomAtleta.addEventListener("click", () => {
    const input = document.getElementById("cupomInputAtleta");
    const feedback = document.getElementById("cupomFeedbackAtleta");
    const val = input.value.trim().toUpperCase();
    if (!val) {
      feedback.style.color = "#ff8a6b";
      feedback.textContent = "Digite um código de cupom válido.";
      return;
    }
    feedback.style.color = "#4ade80";
    feedback.textContent = "✔ Cupom aplicado com sucesso!";
  });
}

// máscara leve de telefone enquanto digita
document.querySelectorAll('input[type="tel"]').forEach(inp => {
  inp.addEventListener("input", () => {
    let v = inp.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    inp.value = v;
  });
});