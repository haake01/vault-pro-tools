import express from 'express';
import { auth } from 'express-openid-connect';

console.log('🔹 [1] Iniciando aplicação...');

const app = express();
console.log('🔹 [2] Express carregado.');

import dotenv from 'dotenv';
dotenv.config();
console.log('🔹 [3] Variáveis de ambiente carregadas.');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  idpLogout: true,
};

console.log('🔹 [4] Configuração do Auth0:', config);

try {
  app.use(auth(config));
  console.log('🔹 [5] Middleware Auth0 carregado.');
} catch (err) {
  console.error('❌ ERRO ao inicializar Auth0:', err);
}

app.get('/', (req, res) => {
  res.send(req.oidc?.isAuthenticated() ? '✅ Logado!' : '❌ Não logado');
});
console.log('🔹 [6] Rota / registrada.');

try {
  app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));
  console.log('🔹 [7] app.listen chamado.');
} catch (err) {
  console.error('❌ ERRO ao iniciar servidor:', err);
}
