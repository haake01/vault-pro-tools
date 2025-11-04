// index.js — versão completa e estável

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// 🔹 Carrega variáveis do .env
dotenv.config();

// 🔹 Inicializa o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Conexão com o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔹 Página principal (interface simples com formulário)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vault Pro Tools + Supabase</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          color: #333;
          text-align: center;
          margin-top: 80px;
        }
        h1 {
          color: #007bff;
        }
        form {
          margin-top: 20px;
        }
        input {
          padding: 8px;
          width: 200px;
        }
        button {
          padding: 8px 12px;
          background-color: #007bff;
          border: none;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        .success {
          color: green;
        }
      </style>
    </head>
    <body>
      <h1>✅ Vault Pro Tools + Supabase conectado com sucesso!</h1>
      <p>Servidor ativo na porta ${PORT}</p>

      <form action="/send" method="POST">
        <input type="text" name="name" placeholder="Digite um nome" required />
        <button type="submit">Enviar para Supabase</button>
      </form>
    </body>
    </html>
  `);
});

// 🔹 Endpoint para enviar dados ao Supabase
app.post("/send", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .send("<h3 style='color:red;'>Erro: nome não fornecido.</h3><a href='/'>Voltar</a>");
  }

  // Insere o nome na tabela "test_connection"
  const { data, error } = await supabase
    .from("test_connection")
    .insert([{ name }]);

  if (error) {
    console.error("❌ Erro ao inserir no Supabase:", error.message);
    return res.status(500).send(`
      <h3 style="color:red;">Erro ao salvar no Supabase:</h3>
      <pre>${error.message}</pre>
      <a href="/">Voltar</a>
    `);
  }

  console.log("✅ Registro inserido com sucesso:", data);
  res.send(`
    <h2 class="success">✅ Registro salvo com sucesso!</h2>
    <p>Nome enviado: <strong>${name}</strong></p>
    <a href="/">Voltar</a>
  `);
});

// 🔹 Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
