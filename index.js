import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// 🔹 Carrega as variáveis do .env
dotenv.config();

// 🔹 Inicializa o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Inicializa o cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔹 Página inicial — renderiza um pequeno HTML com formulário
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vault Pro Tools + Supabase</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #222;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        h2 { color: #006400; }
        form {
          margin-top: 20px;
        }
        input, button {
          padding: 8px;
          margin: 4px;
        }
      </style>
    </head>
    <body>
      <h2>✅ Vault Pro Tools + Supabase conectado com sucesso!</h2>
      <p>Servidor ativo na porta ${PORT}</p>

      <form action="/send" method="POST">
        <input type="text" name="name" placeholder="Digite um nome" required />
        <button type="submit">Enviar para Supabase</button>
      </form>
    </body>
    </html>
  `);
});

// 🔹 Rota que grava dados na tabela do Supabase
app.post("/send", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Nome não fornecido" });
  }

  const { data, error } = await supabase.from("test_connection").insert([{ name }]);

  if (error) {
    console.error("Erro ao inserir no Supabase:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }

  console.log("✅ Registro inserido:", data);
  res.send(`
    <h3>✅ Registro salvo com sucesso!</h3>
    <p>Nome enviado: <strong>${name}</strong></p>
    <a href="/">Voltar</a>
  `);
});

// 🔹 Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
