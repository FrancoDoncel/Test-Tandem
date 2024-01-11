<template>
    <v-container>
        <v-card :flat="$vuetify.display.mobile">
            <v-card-title> Crear/Editar nuevo usuario</v-card-title>
            <v-card-text>
                <v-row dense>
                    <!-- Input nombre -->
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Nombre" hide-details clearable
                            v-model="nombreUsuario"></v-text-field>
                    </v-col>
                    <!-- Input apellido -->
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Apellido" hide-details clearable
                            v-model="apellidoUsuario"></v-text-field>
                    </v-col>
                    <!-- Input telefono -->
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Telefono" hide-details clearable
                            type="number" v-model="telefonoUsuario"></v-text-field>
                    </v-col>
                    <!-- Input email -->
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Correo electronico" hide-details clearable
                            type="email" v-model="emailUsuario"></v-text-field>
                    </v-col>
                    <!-- Input contraseña -->
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Contraseña" hide-details clearable
                            type="password" v-model="passwordUsuario"></v-text-field>
                    </v-col>

                </v-row>
                <!-- Botones del formulario -->
                <v-row dense>
                    <!-- Boton de guardar -->
                    <v-col>
                        <v-btn block color="primary" @click="alertaDeActualizacionDeBaseDeDatos">
                            <v-icon left>mdi-content-save</v-icon>
                            <span>Guardar</span>
                        </v-btn>
                    </v-col>
                    <!-- Boton de cancelar -->
                    <v-col>
                        <v-btn block color="error" @click="alertaCancelarOperacion">
                            <v-icon left>mdi-close</v-icon>
                            <span>Cancelar</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { api } from "@/service"; //Importo la instancia de axios
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();

//Obtengo el id del usuario a actualizar
const idUsuarioParaActualizar = route.query.idUsuario ? route.query.idUsuario : null;


const nombreUsuario = ref("");
const apellidoUsuario = ref("");
const telefonoUsuario = ref("");
const emailUsuario = ref("");
const passwordUsuario = ref("");

//Verificar si hay informacion de usuario en la query, para saber si es crear o editar
function verificarInfoUsuario() {
    if (idUsuarioParaActualizar) {
        //Busco usuario en la base de datos
        buscarUsuarioPorId();
    } else {
        //Reseteo las variables del formulario
        resetearVariablesUsuario();
    }
}
verificarInfoUsuario();


//Funcion para buscar usuario por id
async function buscarUsuarioPorId() {
    try {
        const { data } = await api.get(`/usuario/${idUsuarioParaActualizar}`);
        actualizarVariablesUsuario(data);
    } catch (error) {
        console.log(error);
    }
}

//Funcion para crear un usuario
async function crearUsuario() {

    //Valido los datos del formulario (no deben ser nulos)   
    if (!validarDatosDelFormulario()) return 400;

    try {
        const { data, status } = await api.post("/usuario", {
            nombreUsuario: nombreUsuario.value,
            apellidoUsuario: apellidoUsuario.value,
            telefonoUsuario: telefonoUsuario.value,
            emailUsuario: emailUsuario.value,
            passwordUsuario: passwordUsuario.value
        })
        console.log(data);
        return status;
    } catch (error: any) {
        console.log(error);
        return error.response.status;
    }
}

//Funcion para actualizar un usuario
async function actualizarUsuario() {

    //Valido los datos del formulario (no deben ser nulos)
    if (!validarDatosDelFormulario()) return 400;

    try {
        const { data, status } = await api.put("/usuario", {
            idUsuario: idUsuarioParaActualizar,
            nombreUsuario: nombreUsuario.value,
            apellidoUsuario: apellidoUsuario.value,
            telefonoUsuario: telefonoUsuario.value,
            emailUsuario: emailUsuario.value,
            passwordUsuario: passwordUsuario.value
        });
        console.log(data);
        return status;
    } catch (error: any) {
        console.log(error);
        return error.response.status;
    }
}

//Configuracion de la alerta para crear/editar usuario
function alertaDeActualizacionDeBaseDeDatos() {
    Swal.fire({
        title: "Desea guardar los cambios?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
    }).then((result) => {
        if (result.isConfirmed) {
            if (idUsuarioParaActualizar) {
                //Despues de ejecutar el endpoint, verifico los status
                actualizarUsuario().then((status) => {
                    //Si el status es 200, redirecciono a la pagina de usuarios
                    if (status === 200) {
                        Swal.fire("Los cambios fueron guardados!", "", "success",).then(() => {
                            redireccionarHome();
                        });
                        //Si el status es 400, muestro un mensaje de error
                    } else {
                        Swal.fire("Los datos ingresados no son válidos!", "", "error",);
                    }
                });
            } else {
                crearUsuario().then((status) => {
                    if (status === 200) {
                        Swal.fire("Los cambios fueron guardados!", "", "success",).then(() => {
                            redireccionarHome();
                        });
                    } else {
                        Swal.fire("Los datos ingresados no son válidos!", "", "error",);
                    }
                });
            }
        }
    });
}

//Configuracion de la alerta para cancelar operacion
function alertaCancelarOperacion() {
    Swal.fire({
        title: "Esta seguro de cancelar la operacion?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            redireccionarHome();
        }
    });
}


//Funcion para actualizar variables de usuario
function actualizarVariablesUsuario(usuario: any) {
    nombreUsuario.value = usuario.nombreUsuario;
    apellidoUsuario.value = usuario.apellidoUsuario;
    telefonoUsuario.value = usuario.telefonoUsuario;
    emailUsuario.value = usuario.emailUsuario;
}

//Funcion para resetear las variables del formulario
function resetearVariablesUsuario() {
    nombreUsuario.value = "";
    apellidoUsuario.value = "";
    telefonoUsuario.value = "";
    emailUsuario.value = "";
    passwordUsuario.value = "";
}

//Funcion para validar los datos del formulario (no hace falta validar ya que el back valida todos los datos)
function validarDatosDelFormulario() {
    if (nombreUsuario.value === "" || apellidoUsuario.value === "" || telefonoUsuario.value === "" || emailUsuario.value === "") {
        return false;
    } else {
        return true;
    }
}

//Funcion para redireccionar a la pagina de usuarios (home)
function redireccionarHome() {
    router.push({ path: "/" });
}
</script>