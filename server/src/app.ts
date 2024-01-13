//Configuracion de express
import express from 'express';
import cors from 'cors';
const app = express();

// Disable x-powered-by header
app.disable('x-powered-by');

app.use(cors());
app.use(express.json());


export default app;

