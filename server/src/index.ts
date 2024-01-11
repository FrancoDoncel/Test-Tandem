import app from './app';
import { prisma } from "./config/Prisma";
import "./routes" // Importa todas las rutas

// Disable x-powered-by header
app.disable('x-powered-by');

app.listen(3000, async () => {
    try {
        console.log("✔ Server running on port 3000")
        // Conecta con la base de datos
        await prisma.$connect();
        console.log("✔ Database connected")
    } catch (error) {
        console.log(error);
    }
});