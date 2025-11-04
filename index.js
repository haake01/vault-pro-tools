import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 3000;

// Página inicial (formulário)
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Vault Pro Tools + Supabase conectado com sucesso!</h2>
    <p>Servidor ativo na porta ${PORT}</p>
    <form action="/send" method="POST">
      <input type="text" name="name" placeholder="Digite um nome" required />
      <button type="submit">Enviar para Supabase</button>
    </form>
  `);
});

// Rota para enviar o nome ao Supabase
app.post("/send", async (req, res) => {
  const { name } = req.body;

  const { data, error } = await supabase
    .from("test_connection")
    .insert([{ name }]);

  if (error) {
    console.error("Erro ao inserir:", error);
    res.send(`<p>❌ Erro ao enviar dados: ${error.message}</p>`);
  } else {
    console.log("✅ Dado inserido:", data);
    res.send(`
      <p>✅ Nome enviado com sucesso para o Supabase!</p>
      <a href="/">Voltar</a>
    `);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
