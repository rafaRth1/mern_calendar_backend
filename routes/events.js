// Rutas de usuarios / Events
// host + /api/events

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar_jwt');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar_campos');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

// Todas tienes que pasar por la validacion del JWT
router.use(validarJWT);

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo Evento
router.post(
	'/',
	[
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatorio').custom(isDate),
		check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
		validarCampos,
	],
	crearEvento
);

// Actualizar Evento
router.put(
	'/:id',
	[
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatorio').custom(isDate),
		check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
		validarCampos,
	],
	actualizarEvento
);

// Borrdar Evento
router.delete('/:id', eliminarEvento);

module.exports = router;
