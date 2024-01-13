//Configuracion de la interfaz Request para agregarle la propiedad passwordEstado
import { Request } from 'express';

//Interface de usuario
interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    apellidoUsuario: string;
    emailUsuario: string;
}

//Necesito extender el tipo de Request para agregarle la propiedad passwordEstado y el usuario
interface RequestExtend extends Request {
    passwordEstado?: boolean;
    user?: Usuario;
};




export default RequestExtend;