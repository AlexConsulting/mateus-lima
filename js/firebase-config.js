// =============================================================
//  CONFIGURAÇÃO DO FIREBASE  —  projeto "mateus-personal"
// =============================================================
//
//  Estas chaves são PÚBLICAS por natureza (ficam visíveis no navegador).
//  A segurança de verdade vem das REGRAS do banco — veja o arquivo
//  "regras-firebase.txt" e cole no console em Realtime Database -> Regras.
//
//  Para trocar de projeto no futuro, basta substituir o objeto abaixo
//  (Console do Firebase -> engrenagem -> Configurações do projeto -> Seus apps).
// =============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCcqnBhqh5YrBIbtpdPWiICE7HENl3iyJQ",
  authDomain: "mateus-personal.firebaseapp.com",
  databaseURL: "https://mateus-personal-default-rtdb.firebaseio.com",
  projectId: "mateus-personal",
  storageBucket: "mateus-personal.firebasestorage.app",
  messagingSenderId: "200581464221",
  appId: "1:200581464221:web:4b603f870a1bf1048e9474",
  measurementId: "G-HE6F9DB5QN"
};

// Não altere abaixo desta linha ------------------------------------------
window.__FIREBASE_CONFIG__ = firebaseConfig;
