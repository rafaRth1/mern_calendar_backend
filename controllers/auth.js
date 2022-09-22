const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/generarJWT');

const loginUsuario = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El usuario no existe con ese email',
			});
		}

		// Configurar los password
		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Password Incorrecto',
			});
		}

		// Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador',
		});
	}
};

const crearUsuario = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Ya existe este correo',
			});
		}

		usuario = new Usuario(req.body);

		// Encriptar password
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		// Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el administrador',
		});
	}
};

const revalidarToken = async (req, res = response) => {
	const { name, uid } = req;

	// Generar un nuevo JWT y retonarlo en esta peticion
	const token = await generarJWT(uid, name);

	res.json({
		ok: true,
		msg: 'renew',
		uid,
		name,
		token,
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken,
};
