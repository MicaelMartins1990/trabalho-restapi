const express = require('express');
const router = express.Router();
const controller = require('../Controllers/cursoController'); // C maiúsculo, como a pasta

router.get('/', controller.listar);
router.get('/:id', controller.obter);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.patch('/:id', controller.atualizar);
router.delete('/:id', controller.apagar);

module.exports = router;
