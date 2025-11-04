// ===============================
// 🔧 Vault Pro Tools - Backend App
// Integração com Supabase via Bolt.new
// ===============================

// Importação de dependências
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Configuração do dotenv (para ler o arquivo .env)
dotenv.config();

// Inicializa o app Express
const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// 🧩 Conexão com Supabase
// ===============================
const supabase = createClient(
  process.env.BOLT_DATABASE_URL,
  process.env.BOLT_DATABASE_ANON_KEY
);

// Rota inicial para testar a conexão
app.get("/", async (req, res) => {
  try {
    // Teste de comunicação simples com o Supabase
    const { data, error } = await supabase.from("test_connection").select("*").limit(1);

    if (error) {
      throw error;
    }

    res.send("✅ Vault Pro Tools + Supabase conectado com sucesso!");
  } catch (err) {
    console.error("Erro na conexão com o Supabase:", err.message);
    res.status(500).send("❌ Falha ao conectar ao Supabase: " + err.message);
  }
});

// ===============================
// 🚀 Inicialização do servidor
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
