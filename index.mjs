import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  idpLogout: true,
  routes: {
    login: "/login",
    logout: "/logout",
    callback: "/callback"
  }
};

// Middleware do Auth0
app.use(auth(config));

// Rota principal
app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send(`<h1>✅ Autenticado com sucesso!</h1><p>Usuário: ${req.oidc.user.name}</p>`);
  } else {
    res.send('<h1>❌ Não autenticado</h1><a href="/login">Login</a>');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em ${process.env.BASE_URL}`);
});
