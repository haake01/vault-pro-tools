import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexão com o Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Porta
const PORT = process.env.PORT || 3000;

// Página inicial
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Vault Pro Tools + Supabase conectado com sucesso!</h2>
    <p>Servidor ativo na porta ${PORT}</p>
    <form id="form" action="/send" method="POST">
      <input type="text" name="name" placeholder="Digite um nome" required />
      <button type="submit">Enviar para Supabase</button>
    </form>
    <p id="msg"></p>
  `);
});

// Rota de envio (POST)
app.post("/send", async (req, res) => {
  const { name } = req.body;

  console.log("🧩 Valor recebido no servidor:", name);

  if (!name) {
    return res.status(400).send("<p>❌ Nenhum nome recebido!</p><a href='/'>Voltar</a>");
  }

  const { data, error } = await supabase
    .from("test_connection")
    .insert([{ name }]);

  if (error) {
    console.error("Erro ao inserir:", error);
    return res.send(`<p>❌ Erro ao enviar dados: ${error.message}</p><a href="/">Voltar</a>`);
  }

  console.log("✅ Dado inserido:", data);
  res.send(`<p>✅ Nome "${name}" enviado com sucesso!</p><a href="/">Voltar</a>`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
