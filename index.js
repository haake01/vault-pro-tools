// ================================================
// VAULT PRO TOOLS - SUPABASE CONNECTION (VERSÃO FINAL)
// ================================================

import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================
// CONFIGURAÇÃO SUPABASE
// ================================================
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ================================================
// MIDDLEWARES
// ================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ================================================
// HTML PRINCIPAL
// ================================================
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Vault Pro Tools + Supabase conectado com sucesso!</h2>
    <p>Servidor ativo na porta ${PORT}</p>
    <form id="form">
      <input type="text" id="name" placeholder="Digite um nome" required />
      <button type="button" onclick="sendData()">Enviar para Supabase</button>
    </form>

    <p id="status"></p>

    <script>
      async function sendData() {
        const name = document.getElementById('name').value.trim();
        const status = document.getElementById('status');
        if (!name) {
          status.innerText = "⚠️ Digite um nome antes de enviar.";
          return;
        }

        try {
          const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });

          const result = await response.json();
          if (result.success) {
            status.innerText = "✅ Dado enviado com sucesso!";
          } else {
            status.innerText = "❌ Erro: " + (result.error || 'Falha desconhecida');
          }
        } catch (err) {
          status.innerText = "💥 Erro de conexão com o servidor.";
        }
      }
    </script>
  `);
});

// ================================================
// ROTA DE INSERÇÃO NO SUPABASE
// ================================================
app.post("/send", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("🧩 Dado recebido:", name);

    if (!name) {
      return res.status(400).json({ success: false, error: "Campo 'name' vazio" });
    }

    const { data, error } = await supabase
      .from("test_connection")
      .insert([{ name }]);

    if (error) {
      console.error("❌ Erro ao inserir:", error.message);
      return res.json({ success: false, error: error.message });
    }

    console.log("✅ Inserido com sucesso:", data);
    res.json({ success: true, data });
  } catch (err) {
    console.error("💥 Erro interno:", err);
    res.status(500).json({ success: false, error: "Erro interno do servidor" });
  }
});

// ================================================
// INICIALIZAÇÃO
// ================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
