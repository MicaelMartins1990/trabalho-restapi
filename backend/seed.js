// Copia os alunos e cursos do mock-data/bd.json para o MongoDB Atlas.
// ⚠️ APAGA o que já existe nas coleções alunos e cursos antes de inserir.
// Correr dentro da pasta backend:  node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Aluno = require('./models/alunoModel');
const Curso = require('./models/cursoModel');
const dados = require('../mock-data/bd.json');

const { DB_USER, DB_PASS, DB_HOSTS } = process.env;
// usa exatamente a mesma linha do server.js
const MONGO_URI = `mongodb://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@${DB_HOSTS}/?ssl=true&authSource=admin&retryWrites=true&w=majority`;

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'Academicos' });

    await Aluno.deleteMany();
    await Curso.deleteMany();

    // Cursos: guarda a correspondência id antigo -> id novo do Mongo
    const mapa = {};
    for (const c of dados.cursos) {
      const novo = await Curso.create({ nomeDoCurso: c.nomeDoCurso });
      mapa[c.id] = novo._id.toString();
    }

    // Alunos: troca o idCurso antigo pelo id novo
    for (const a of dados.alunos) {
      await Aluno.create({
        nome: a.nome,
        apelido: a.apelido,
        idCurso: mapa[a.idCurso],
        anoCurricular: a.anoCurricular
      });
    }

    console.log(`Migrados ${dados.cursos.length} cursos e ${dados.alunos.length} alunos.`);
  } catch (e) {
    console.log('Erro:', e.message);
  } finally {
    await mongoose.disconnect();
  }
})();
