import app from '../../app';
import { prisma } from "../../config/Prisma";
import bcrypt from 'bcrypt';

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
        }

        res.status(200).json({ message: 'Usuario logeado correctamente' });

    } catch (error) {
        console.log("Error al logearse:", error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});