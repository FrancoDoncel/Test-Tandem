import RequestExtend from '../config/Request';

//Creo un middleware para verificar si en el body envian la password
function verificarPassword(req: RequestExtend, res: any, next: any) {
    if (req.body.passwordUsuario) {
        req.passwordEstado = true;
    } else {
        req.passwordEstado = false;
    }
    next();
}

export default verificarPassword;