// ===============================================
// ⚙️ Vault Pro Tools - Backend App
// Integração com Supabase via Bolt.new
// ===============================================

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

// ===============================================
// 🔗 Conexão com Supabase
// ===============================================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Teste de conexão com o Supabase
app.get("/api/test-connection", async (req, res) => {
  try {
    const { data, error } = await supabase.from("test_connection").select("*");
    if (error) throw error;

    res.json({
      success: true,
      message: "✅ Conectado ao Supabase com sucesso!",
      data,
    });
  } catch (err) {
    console.error("Erro na conexão com o Supabase:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao conectar ao Supabase",
      error: err.message,
    });
  }
});

// ===============================================
// 🧠 Inserção de teste — POST /api/test
// ===============================================
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

// ===============================================
// 🌐 Rota principal (visual no Bolt.new)
// ===============================================
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Vault Pro Tools + Supabase conectado com sucesso!</h2>
    <p>Servidor ativo na porta 3000</p>
    <form action="/api/test" method="post" style="margin-top:20px;">
      <input name="name" placeholder="Digite um nome" required />
      <button type="submit">Enviar para Supabase</button>
    </form>
  `);
});

// ===============================================
// 🚀 Inicializa o servidor
// ===============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
