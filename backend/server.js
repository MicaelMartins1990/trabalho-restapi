require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);

// Servir os ficheiros estáticos do frontend tal como o json-server fazia
app.use(express.static(path.join(__dirname, '../frontend')));

// Qualquer outro endereço -> 404 em JSON (tem de ficar no fim)
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

// Ligar ao MongoDB e só depois arrancar o servidor
const { DB_USER, DB_PASS, DB_HOSTS } = process.env;
const MONGO_URI = `mongodb://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@${DB_HOSTS}/?ssl=true&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, { dbName: 'Academicos' }) // dbName com N maiúsculo!
  .then(() => {
    console.log('Ligado com sucesso ao MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Servidor Express a correr em http://localhost:${PORT}`));
  })
  .catch((erro) => console.log('Erro ao ligar ao MongoDB:', erro));
