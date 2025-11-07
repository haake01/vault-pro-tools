import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Diagnóstico
console.log("🔑 SESSION_SECRET:", process.env.SESSION_SECRET ? "OK" : "❌ Faltando");
console.log("🔐 AUTH0_CLIENT_SECRET:", process.env.AUTH0_CLIENT_SECRET ? "OK" : "❌ Faltando");

const baseURL =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.BASE_URL || "http://localhost:3000";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SESSION_SECRET,
  baseURL: baseURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET, // ✅ essencial
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  authorizationParams: {
    response_type: "code",
    response_mode: "query", // evita falha de HTTP no localhost
    scope: "openid profile email",
  },
};

try {
  app.use(auth(config));
} catch (err) {
  console.error("❌ Erro ao inicializar Auth0:", err);
}

app.get("/", (req, res) => {
  if (req.oidc && req.oidc.isAuthenticated()) {
    res.send(`<h1>✅ Autenticado</h1><p>Bem-vindo, ${req.oidc.user?.name}</p><a href="/logout">Logout</a>`);
  } else {
    res.send('<h1>❌ Não autenticado</h1><a href="/login">Login</a>');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em ${baseURL}`);
});
