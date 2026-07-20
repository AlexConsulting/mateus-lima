// =============================================================
//  app.js — inicialização do Firebase + utilidades compartilhadas
//  (carregado depois dos SDKs e do firebase-config.js)
// =============================================================

(function () {
  const cfg = window.__FIREBASE_CONFIG__;
  const configurado = cfg && cfg.apiKey && cfg.apiKey.indexOf("COLE_") === -1;

  if (!configurado) {
    console.warn("[Mateus] Firebase ainda não configurado. Edite js/firebase-config.js.");
  } else {
    firebase.initializeApp(cfg);
  }

  // expõe estado e serviços
  window.App = {
    pronto: configurado,
    db: configurado ? firebase.database() : null,
    auth: configurado ? firebase.auth() : null,
  };
})();

// ----------------------------------------------------------------
//  Padronização de texto: "primeira letra de cada palavra maiúscula"
//  (mantém e-mail em minúsculo; preserva siglas curtas em maiúsculo)
// ----------------------------------------------------------------
const MINUSCULAS = ["de","da","do","das","dos","e","a","o","para","com","em","no","na"];

function titleCase(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w, i) => {
      if (i > 0 && MINUSCULAS.includes(w)) return w;          // preposições
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

// Aplica padronização conforme o tipo do campo
function padronizar(valor, tipo) {
  if (valor == null) return "";
  valor = String(valor).trim();
  if (valor === "") return "";
  if (tipo === "email") return valor.toLowerCase();
  if (tipo === "tel")   return valor.replace(/[^\d()+\-\s]/g, "").trim();
  if (tipo === "num")   return valor;                          // números/medidas ficam como estão
  if (tipo === "raw")   return valor;                          // texto livre (observações longas)
  return titleCase(valor);                                     // padrão: Title Case
}

// Formata dinheiro em BRL
function moeda(v) {
  const n = Number(v) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Mês/ano atual no formato YYYY-MM
function mesAtual() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

// Rótulo amigável do mês (ex.: "jul/2026")
function rotuloMes(chave) {
  const [y, m] = chave.split("-").map(Number);
  const nomes = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return nomes[m - 1] + "/" + y;
}

// Escapa HTML para exibição segura de dados vindos do banco
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
