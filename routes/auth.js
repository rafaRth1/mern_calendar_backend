// Rutas de usuarios / Auth
// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar_jwt');

const router = Router();

router.post(
	'/',
	[
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe de ser 6 caracteres').isLength({ min: 6 }),
		validarCampos,
	],
	loginUsuario
);

router.post(
	'/new',
	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe de ser 6 caracteres').isLength({ min: 6 }),
		validarCampos,
	],
	crearUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
