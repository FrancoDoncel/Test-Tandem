import RequestExtend from '../config/Request';
import jwt from 'jsonwebtoken';


function authenticateToken(req: RequestExtend, res: any, next: any) {

    //Obtengo el token de la cabecera
    const authHeader = req.headers['authorization'];

    //Separo el token del bearer
    const token = authHeader && authHeader.split(' ')[1];

    //Si el toquen no existe, retorno un status 401
    if (token == null) return res.sendStatus(401);

    //Verifico que exista variable de entorno
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error(
            "ACCESS_TOKEN_SECRET no está definido en las variables de entorno"
        );
    }

    //Verifico el token
    jwt.verify(token, secret, (err: any, user: any) => {

        //Si hay error retorno un status 403
        if (err) return res.sendStatus(403);

        //Si no hay error, guardo el usuario en el request
        req.user = user;

        //Continuo con el siguiente middleware
        next();
    });
}

export default authenticateToken;