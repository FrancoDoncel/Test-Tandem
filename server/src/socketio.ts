import { Server } from "socket.io";

// Creamos el servidor de socket.io
const io = new Server({
    connectionStateRecovery: {},
});

export default io;