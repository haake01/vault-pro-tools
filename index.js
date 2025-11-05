// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { auth, requiresAuth } from "express-openid-connect";

// Carrega variáveis do .env local
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === SUPABASE ===
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRO: Variáveis SUPABASE_URL ou SUPABASE_KEY não foram definidas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// === AUTH0 ===
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL || "https://vaulttools.online",
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
};

app.use(auth(config));

// === ROTA PRINCIPAL ===
app.get("/", (req, res) => {
  if (req.oidc?.isAuthenticated()) {
    res.send(`
      <h2>Olá ${req.oidc.user.name} 👋</h2>
      <p>Você está logado com sucesso!</p>
      <a href="/profile">Ver perfil</a> |
      <a href="/logout">Sair</a>
    `);
  } else {
    res.send(`
      <h2>Bem-vindo ao Vault Tools</h2>
      <p><a href="/login">Fazer login</a></p>
    `);
  }
});

// === ROTA DE TESTE SUPABASE ===
app.post("/api/enviar", async (req, res) => {
  try {
    const { tabela, dados } = req.body;
    const { data, error } = await supabase.from(tabela).insert(dados);
    if (error) throw error;
    res.json({ sucesso: true, data });
  } catch (err) {
    console.error("Erro ao enviar dados:", err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// === ROTA DE PERFIL PROTEGIDA ===
app.get("/profile", requiresAuth(), async (req, res) => {
  const user = req.oidc.user;
  // Grava o usuário no Supabase (se quiser)
  await supabase.from("users").upsert([{ email: user.email, name: user.name }]);
  res.send(`<pre>${JSON.stringify(user, null, 2)}</pre>`);
});

// === CALLBACK DO AUTH0 ===
app.get("/callback", (req, res) => {
  res.redirect("/");
});

// === PORTA ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

