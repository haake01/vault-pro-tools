import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  idpLogout: true,
};

app.use(auth(config));

app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send("✅ Logado com sucesso no Auth0!");
  } else {
    res.send('❌ Não logado — <a href="/login">Entrar</a>');
  }
});

app.get("/profile", (req, res) => {
  res.json(req.oidc.user || { error: "Usuário não autenticado" });
});

// exporta handler para Vercel (ponto crucial!)
export default app;
