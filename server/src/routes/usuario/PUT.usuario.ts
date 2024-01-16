import app from '../../app';
import { prisma } from "../../config/Prisma";
import bcrypt from 'bcrypt';
import RequestExtend from '../../config/Request';
import validator from '../../middleware/validator';
import verificarPassword from '../../middleware/verificarPassword';
import authenticateToken from '../../middleware/authenticateToken';

//Endpoint para actualizar un usuario
app.put("/usuario", authenticateToken, validator, verificarPassword, async (req: RequestExtend, res: any) => {
    try {
        let { idUsuario, nombreUsuario, apellidoUsuario, emailUsuario, telefonoUsuario, passwordUsuario } = req.body;

        //Parseo el idUsuario a number
        idUsuario = parseInt(idUsuario);

        //Verifico estado de password
        if (req.passwordEstado) {
            //Hasheo la contraseña
            const hasshedPassword = await bcrypt.hash(passwordUsuario, 10);

            //Actualizo el usuario con la nueva contraseña
            const usuario = await prisma.usuario.update({
                where: {
                    idUsuario
                },
                data: {
                    nombreUsuario,
                    apellidoUsuario,
                    emailUsuario,
                    telefonoUsuario,
                    passwordUsuario: hasshedPassword
                }
            });
            res.json(usuario).status(200);
        } else {
            //Actualizo el usuario sin la contraseña
            const usuario = await prisma.usuario.update({
                where: {
                    idUsuario
                },
                data: {
                    nombreUsuario,
                    apellidoUsuario,
                    emailUsuario,
                    telefonoUsuario
                }
            });

            res.json(usuario).status(200);
        }
    } catch (error) {
        console.log("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
