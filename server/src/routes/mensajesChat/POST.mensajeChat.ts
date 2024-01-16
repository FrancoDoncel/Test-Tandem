import app from '../../app';
import { prisma } from "../../config/Prisma";
import authenticateToken from '../../middleware/authenticateToken';

//Endpoint para agregar un mensaje
app.post("/mensajeChat", authenticateToken, async (req, res) => {
    try {
        const { idUsuario, mensaje } = req.body;
        const mensajeChat = await prisma.mensajesChat.create({
            data: {
                mensajeChat: mensaje,
                idUsuario: idUsuario,
            },
        });
        res.json(mensajeChat).status(200);
    } catch (error) {
        console.log("Error al agregar el mensaje:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});