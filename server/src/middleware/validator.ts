import {
    validateOrReject,
    IsEmail,
    IsNumberString,
    IsAlpha,
} from 'class-validator';

async function validator(req: any, res: any, next: any) {

    const { nombreUsuario, apellidoUsuario, emailUsuario, telefonoUsuario } = req.body;

    //Clase que contiene las propiedades del usuario, que seran validadas.
    class Usuario {
        @IsAlpha()
        nombreUsuario!: string;

        @IsAlpha()
        apellidoUsuario!: string;

        @IsNumberString()
        telefonoUsuario!: string;

        @IsEmail()
        emailUsuario!: string;
    }

    //Creo un objeto usuario con las propiedades del body
    let usuario = new Usuario();
    usuario.nombreUsuario = nombreUsuario;
    usuario.apellidoUsuario = apellidoUsuario;
    usuario.telefonoUsuario = telefonoUsuario;
    usuario.emailUsuario = emailUsuario;

    // Validamos el objeto usuario
    try {
        await validateOrReject(usuario, { skipMissingProperties: true });
        next();
    } catch (errors) {
        console.log(errors);
        res.status(400).json(errors);
    }
}

export default validator;
