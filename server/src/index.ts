import app from './app';
import { prisma } from "./config/Prisma";
import "./routes" // Importa todas las rutas
import { createServer } from 'http'
import { Server } from "socket.io";




//Creamos server http
const server = createServer(app);

//Creamos server socket.io
const io = new Server(server, {
    //connectionStateRecovery: {},
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//Probando socket.io
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado')
    })

    //Escucho el evento chat mensaje
    socket.on('chat mensaje', (mensaje) => {

        //Envio el mensaje a todos los clientes coenctados
        io.emit('chat mensaje', mensaje);
    })
})

server.listen(3000, async () => {
    try {
        console.log("✔ Server running on port 3000")
        // Conecta con la base de datos
        await prisma.$connect();
        console.log("✔ Database connected")
    } catch (error) {
        console.log(error);
    }
});