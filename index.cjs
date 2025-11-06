require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

// Inicializa o middleware do Auth0
app.use(auth(config));

// Página inicial (pública)
app.get('/', (req, res) => {
  if (req.oidc && req.oidc.isAuthenticated()) {
    res.send(`Olá ${req.oidc.user.name}! Você está logado. <a href="/logout">Sair</a>`);
  } else {
    res.send('Não logado — <a href="/login">Entrar</a>');
  }
});

// Página protegida
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Callback do Auth0 (redireciona)
app.get('/callback', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App rodando na porta ${PORT}`));
