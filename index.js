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
app.post("/api/test", async (req, res) => {
  try {
    const { name } = req.body;

    const { data, error } = await supabase
      .from("test_connection")
      .insert([{ name }]);

    if (error) {
      console.error("Erro ao inserir no Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("Erro no servidor:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});