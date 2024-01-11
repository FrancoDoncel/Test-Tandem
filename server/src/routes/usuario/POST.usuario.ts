import app from '../../app';
import { prisma } from "../../config/Prisma";
import bcrypt from 'bcrypt';
import validator from "../../middleware/validator";


//Endpoint para crear un usuario nuevo
app.post('/usuario', validator, async (req, res) => {
    try {
        const { nombreUsuario, apellidoUsuario, emailUsuario, telefonoUsuario, passwordUsuario } = req.body;

        // Verifico si todos los campos requeridos fueron enviados
        if (!nombreUsuario || !apellidoUsuario || !emailUsuario || !telefonoUsuario || !passwordUsuario) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        // Hasheo la contraseña
        const hasshedPassword = await bcrypt.hash(passwordUsuario, 10);

        // Creo el usuario
        const usuario = await prisma.usuario.create({
            data: {
                nombreUsuario,
                apellidoUsuario,
                emailUsuario,
                telefonoUsuario,
                passwordUsuario: hasshedPassword
            }
        });

        res.json(usuario).status(201);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});