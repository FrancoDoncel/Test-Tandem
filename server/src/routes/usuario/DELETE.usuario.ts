import app from '../../app';
import { prisma } from "../../config/Prisma";
import authenticateToken from '../../middleware/authenticateToken';

// Endpoint para eliminar un usuario
app.delete("/usuario", authenticateToken, async (req, res) => {

    try {
        const { idUsuario } = req.body;
        const usuario = await prisma.usuario.delete({
            where: {
                idUsuario: Number(idUsuario)
            },
        });
        res.json(usuario).status(200);
    } catch (error) {
        console.log("Error al eliminar el usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});