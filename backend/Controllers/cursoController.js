const Curso = require('../models/cursoModel');

// GET /  -> lista todos
exports.listar = async (req, res) => {
  try {
    res.json(await Curso.find());
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
};

// GET /:id -> devolve um
exports.obter = async (req, res) => {
  try {
    const doc = await Curso.findById(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ erro: 'ID inválido' });
  }
};

// POST / -> cria
exports.criar = async (req, res) => {
  try {
    res.status(201).json(await Curso.create(req.body));
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

// PUT/PATCH /:id -> atualiza
exports.atualizar = async (req, res) => {
  try {
    const doc = await Curso.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after', // devolve já a versão atualizada
      runValidators: true  // aplica as regras do schema
    });
    if (!doc) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

// DELETE /:id -> apaga
exports.apagar = async (req, res) => {
  try {
    const doc = await Curso.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ erro: 'ID inválido' });
  }
};
