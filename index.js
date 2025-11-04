// index.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Carrega variáveis do .env local
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa Supabase usando variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRO: Variáveis SUPABASE_URL ou SUPABASE_KEY não foram definidas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Rota principal de teste
app.get("/", (req, res) => {
  res.send("✅ Servidor rodando e conectado ao Supabase!");
});

// ✅ Exemplo de envio de dados
app.post("/api/enviar", async (req, res) => {
  try {
    const { tabela, dados } = req.body;
    const { data, error } = await supabase.from(tabela).insert(dados);
    if (error) throw error;

    res.json({ sucesso: true, data });
  } catch (err) {
    console.error("Erro ao enviar dados:", err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// ⚙️ Porta dinâmica (Render usa PORT automática)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
