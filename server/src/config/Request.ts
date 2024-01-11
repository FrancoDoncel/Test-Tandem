//Configuracion de la interfaz Request para agregarle la propiedad passwordEstado
import { Request } from 'express';

//Necesito extender el tipo de Request para agregarle la propiedad passwordEstado
interface RequestExtend extends Request {
    passwordEstado?: boolean;
};

export default RequestExtend;