import app from '../../app';
import { prisma } from "../../config/Prisma";
import authenticateToken from '../../middleware/authenticateToken';

// Endpoint para obtener un usuario por su id
app.get("/usuario/:idUsuario", authenticateToken, async (req, res) => {
    try {
        const { idUsuario } = req.params; //Obtengo el id del usuario por la url
        const usuario = await prisma.usuario.findUnique({
            where: {
                idUsuario: Number(idUsuario),
            },
        });
        res.json(usuario).status(200);
    } catch (error) {
        console.log("Error al obtener el usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});