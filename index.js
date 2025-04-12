const express = require("express");
const cors = require("cors");
const admin = require("./firebase");

const app = express();

// ✅ Liberar acesso apenas do seu GitHub Pages:
app.use(cors({
  origin: "https://ericktsw.github.io"
}));

app.use(express.json());

// Middleware para validar token Firebase
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Sem token");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Token inválido");
  }
}

// Rota protegida de verificação de token
app.post("/verificar-token", verifyToken, (req, res) => {
  res.status(200).send("Token válido");
});

// Exemplo de rota protegida para exportar
app.post("/exportar-video", verifyToken, (req, res) => {
  const userEmail = req.user.email;
  res.send(`Olá ${userEmail}, sua animação será exportada!`);
});

app.listen(3000, () => {
  console.log("🚀 Backend rodando na porta 3000");
});
