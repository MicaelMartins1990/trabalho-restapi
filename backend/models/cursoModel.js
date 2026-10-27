const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nomeDoCurso: { type: String, required: [true, 'O nome do curso é obrigatório'], trim: true }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Curso', cursoSchema, 'cursos');
