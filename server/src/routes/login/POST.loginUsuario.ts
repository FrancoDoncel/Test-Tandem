import app from '../../app';
import { prisma } from "../../config/Prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { dot } from 'node:test/reporters';

//Leo variables de entorno
dotenv.config();

app.post('/login', async (req, res) => {
    const { emailUsuario, passwordUsuario } = req.body;

    // Encuentro el usuario por su email
    const usuario = await prisma.usuario.findUnique({
        where: {
            emailUsuario: emailUsuario
        }
    });
    // Valido que el usuario exista
    if (!usuario) {
        return res.status(404).json({ message: 'Usuario o contraseña incorrectos' });
    }

    try {
        // Comparo la contraseña ingresada con la contraseña del usuario
        const isMatch = await bcrypt.compare(passwordUsuario, usuario.passwordUsuario);

        // Valido que la contraseña sea correcta
        if (!isMatch) {
            return res.status(404).json({ message: 'Usuario o contraseña incorrectos' });
        } else {
            const secret = process.env.ACCESS_TOKEN_SECRET;

            //Verifico que la variable de entorno exista
            if (!secret) {
                throw new Error(
                    "ACCESS_TOKEN_SECRET no está definido en las variables de entorno"
                );
            }

            //Creo el token
            const accessToken = jwt.sign({ emailUsuario: usuario.emailUsuario, idUsuario: usuario.idUsuario }, secret, { expiresIn: '24h' });
            res.status(200).json({ accessToken });
        }


    } catch (error) {
        console.log("Error al logearse:", error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});