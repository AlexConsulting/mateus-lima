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
    dados[el.name] = padronizar(el.value, norm);
  });
  return dados;
}

// validação simples dos obrigatórios
function validar(form) {
  let ok = true;
  form.querySelectorAll("[required]").forEach(el => {
    const vazio = !el.value.trim();
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
    msg.textContent = "Preencha os campos obrigatórios (marcados com *).";
    return;
  }

  if (!window.App || !App.pronto) {
    msg.className = "form-msg err";
    msg.textContent = "Sistema ainda não conectado ao banco. Avise o Mateus.";
    return;
  }

  const registro = coletar(form);
  registro.perfil = perfil;
  registro.criadoEm = Date.now();
  registro.criadoEmISO = new Date().toISOString();
  registro.status = "novo";            // novo | ativo | inativo (o admin ajusta)

  btn.disabled = true;
  msg.className = "form-msg";
  msg.innerHTML = '<span class="loader"></span> Enviando…';

  try {
    await App.db.ref("alunos/" + perfil).push(registro);
    mostrar(secSucesso);
    form.reset();
  } catch (e) {
    console.error(e);
    msg.className = "form-msg err";
    msg.textContent = "Não consegui enviar agora. Tente novamente em instantes.";
    btn.disabled = false;
  }
}

document.getElementById("formPersonal").addEventListener("submit", e => {
  e.preventDefault(); enviar(e.target, "personal");
});
document.getElementById("formAtleta").addEventListener("submit", e => {
  e.preventDefault(); enviar(e.target, "atleta");
});

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
