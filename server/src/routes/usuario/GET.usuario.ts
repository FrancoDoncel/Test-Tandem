import app from '../../app';
import { prisma } from "../../config/Prisma";

// Endpoint para obtener todos los usuarios
app.get("/usuario", async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.json(usuarios).status(200);
    } catch (error) {
        console.log("Error al obtener los usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});