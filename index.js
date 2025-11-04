// ================================================
// VAULT PRO TOOLS - CONEXÃO SUPABASE
// ================================================

import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ================================================
// CONFIGURAÇÃO DO SUPABASE
// ================================================
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const PORT = process.env.PORT || 3000;

// ================================================
// ROTA PRINCIPAL - INTERFACE HTML
// ================================================
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Vault Pro Tools + Supabase conectado com sucesso!</h2>
    <p>Servidor ativo na porta ${PORT}</p>
    <form id="form" action="/send" method="POST">
      <input type="text" name="name" placeholder="Digite um nome" required />
      <button type="submit">Enviar para Supabase</button>
    </form>
  `);
});

// ================================================
// ROTA DE ENVIO - INSERÇÃO NO SUPABASE
// ================================================
app.post("/send", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("🧩 Dado recebido:", name);

    if (!name) {
      return res.status(400).send("<p>❌ Nenhum nome foi enviado!</p><a href='/'>Voltar</a>");
    }

    const { data, error } = await supabase
      .from("test_connection")
      .insert([{ name }]);

    if (error) {
      console.error("❌ Erro Supabase:", error.message);
      return res.send(`<p>Erro ao salvar: ${error.message}</p><a href="/">Voltar</a>`);
    }

    console.log("✅ Inserção confirmada:", data);
    res.send(`<p>✅ Nome "${name}" gravado com sucesso!</p><a href="/">Voltar</a>`);
  } catch (err) {
    console.error("💥 Erro geral:", err);
    res.status(500).send("<p>Erro interno no servidor.</p><a href='/'>Voltar</a>");
  }
});

// ================================================
// INICIALIZAÇÃO
// ================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
