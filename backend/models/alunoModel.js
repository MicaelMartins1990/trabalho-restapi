const mongoose = require('mongoose');


const alunoSchema = new mongoose.Schema({
  nome:          { type: String, required: [true, 'O nome é obrigatório'], trim: true },
  apelido:       { type: String, required: [true, 'O apelido é obrigatório'], trim: true },
  idCurso:       { type: String, required: [true, 'O curso é obrigatório'] },
  anoCurricular: { type: Number, required: [true, 'O ano curricular é obrigatório'], min: 1, max: 5 }
}, {
  // Troca _id por id (como no json-server)
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

//nome exato da coleção no Atlas
module.exports = mongoose.model('Aluno', alunoSchema, 'alunos');
