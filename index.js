const express = require('express');
const cors = require('cors');
const admin = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para autenticar
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).send('Sem token');

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send('Token inválido');
  }
}

// Exemplo de rota protegida
app.post('/exportar-video', verifyToken, (req, res) => {
  const userEmail = req.user.email;
  // TODO: processar animação, gerar vídeo, etc.
  res.send(`Olá ${userEmail}, sua animação será exportada!`);
});

app.listen(3000, () => console.log('Backend rodando na porta 3000'));
