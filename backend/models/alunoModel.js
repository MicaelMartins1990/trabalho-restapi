const mongoose = require('mongoose');

// Molde de um aluno: os campos têm de ser IGUAIS aos do bd.json
const alunoSchema = new mongoose.Schema({
  nome:          { type: String, required: [true, 'O nome é obrigatório'], trim: true },
  apelido:       { type: String, required: [true, 'O apelido é obrigatório'], trim: true },
  idCurso:       { type: String, required: [true, 'O curso é obrigatório'] },
  anoCurricular: { type: Number, required: [true, 'O ano curricular é obrigatório'], min: 1, max: 5 }
}, {
  // Troca _id por id (como no json-server) e esconde o __v
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// 3.º argumento = nome exato da coleção no Atlas
module.exports = mongoose.model('Aluno', alunoSchema, 'alunos');
