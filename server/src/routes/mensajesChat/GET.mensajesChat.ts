import app from '../../app';
import { prisma } from "../../config/Prisma";
import authenticateToken from '../../middleware/authenticateToken';

//Endpoint para obtener todos los mensajes
app.get("/mensajesChat", authenticateToken, async (req, res) => {
    try {
        //obtener los ultimos 50 mensajes
        const mensajes = await prisma.mensajesChat.findMany({
            //Ordeno los mensajes de forma descendente, para poder obtener los ultimos 50
            take: 50,
            orderBy: {
                idMensajeChat: 'desc',
            },
            include: {
                Usuario: {
                    select: {
                        emailUsuario: true,
                        nombreUsuario: true,
                        apellidoUsuario: true,
                    }
                },
            }
        });
        //Ordeno los mensajes de forma ascendente, para que se muestren en orden cronologico
        mensajes.reverse();
        res.json(mensajes).status(200);
    } catch (error) {
        console.log("Error al obtener los mensajes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});