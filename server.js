const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());

// 👇 ISSO AQUI SERVE O SITE
app.use(express.static("public"));

const TOKEN = process.env.SYMPLA_TOKEN;
const EVENT_ID = process.env.SYMPLA_EVENT_ID;
const EVENT_URL = process.env.SYMPLA_EVENT_URL;

app.get("/api/ingresso", async (req, res) => {
  try {
    const resposta = await fetch(
      `https://api.sympla.com.br/public/v3/events/${EVENT_ID}`,
      {
        headers: {
          s_token: TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const dados = await resposta.json();
    const evento = dados.data;

    res.json({
      nome: evento?.name || "Evento",
      data: evento?.start_date || "",
      local: `${evento?.address?.name || ""}, ${evento?.address?.address_num || ""}`,
      lote: process.env.SYMPLA_LOTE_ATUAL || "1º lote disponível",
      preco: "R$ 289,90",
      link: EVENT_URL,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao conectar com Sympla" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
