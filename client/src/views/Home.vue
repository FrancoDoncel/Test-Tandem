<template>
    <v-container fluid class="pa-0 pa-md-3">
        <v-app-bar :elevation="2" class="d-flex align-center">
            <template v-slot:append>
                <v-btn icon @click="redireccionarChat">
                    <v-icon>mdi-chat-outline</v-icon>
                </v-btn>
                <v-btn icon @click="cerrarSesion">
                    <v-icon>mdi-logout</v-icon>
                </v-btn>
            </template>
            <h1 class="text-center flex-grow-1">Control clientes</h1>
        </v-app-bar>

        <!-- Input de busqueda en la tabla -->
        <v-row dense>
            <v-col cols="12" md="3">
                <v-card :flat="$vuetify.display.mobile">
                    <v-card-title>Filtrar tabla</v-card-title>
                    <v-card-text>
                        <v-text-field variant="outlined" label="Buscar" density="compact" hide-details clearable
                            v-model="valorBusqueda"></v-text-field>
                    </v-card-text>
                </v-card>

                <!-- Crear nuevo usuario -->
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <v-card :flat="$vuetify.display.mobile">
                            <v-card-title>Crear nuevo usuario</v-card-title>
                            <v-card-text>
                                <v-row dense>
                                    <v-col>
                                        <v-btn block @click="redireccionarCrearUsuario">
                                            <v-icon start>mdi-account-plus-outline</v-icon>
                                            <span>Crear</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Data table de usuarios -->
            <v-col cols="12" md="9">
                <v-sheet class="pa-2" :elevation="$vuetify.display.mobile ? 0 : 2" rounded>
                    <v-data-table :headers="headers" :items="usuariosDb" :search="valorBusqueda">
                        <template v-slot:[`item.accion`]="{ item }">
                            <v-btn variant="text" icon="mdi-pencil" color="primary"
                                @click="redireccionarEditarUsuario(item.idUsuario)" />
                            <v-btn variant="text" icon="mdi-delete" color="error"
                                @click="alertaEliminarUsuarioDeBaseDeDatos(item.idUsuario)" />
                        </template>
                    </v-data-table>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { api } from "@/service"; //Importo la instancia de axios
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";


const router = useRouter();

const usuariosDb = ref<any[]>([]);
const valorBusqueda = ref<string>("");

//Pido los usuarios a la base de datos
async function pedirUsuarios() {
    try {
        const { data } = await api.get("/usuario",);
        usuariosDb.value = data;
        console.log(usuariosDb.value);
    } catch (error: any) {
        console.log(error);
        if (error.response || error.response.status === 401) {
            redireccionarLogin();
        }
    }
}
pedirUsuarios();

//Funcion para eliminar un usuario
async function eliminarUsuario(idUsuario: any) {
    try {
        const { data } = await api.delete("/usuario", {
            data: {
                idUsuario: idUsuario
            }
        });
        console.log(data);
        //Actualizar la lista de usuarios
        filtrarUsuarios(idUsuario);
    } catch (error: any) {
        console.log(error);
        if (error.response || error.response.status === 401) {
            redireccionarLogin();
        }
    }
}


//Configuracion de la alerta para eliminar usuario
function alertaEliminarUsuarioDeBaseDeDatos(idUsuario: any) {
    Swal.fire({
        title: "Desea eliminar usuario?",
        text: "Esta accion no se puede deshacer!",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
    }).then((result) => {
        if (result.isConfirmed) {
            //Si confirma, elimino el usuario
            eliminarUsuario(idUsuario);
            Swal.fire("El usuario fue eliminado con exito!", "", "success",).then(() => {
            });
        }
    });
}

//Funcion de cierre de sesion () redirecciona al login y limpia el localstorage)
function cerrarSesion() {
    localStorage.clear();
    redireccionarLogin();
}

//Redireccionar a la paginad de login
function redireccionarLogin() {
    router.push({ path: "/login" });
}

//Redireccionar a la pagina para editar usuario
function redireccionarEditarUsuario(idUsuario: any) {
    if (idUsuario) {
        router.push({ path: "/crear-editar-usuario", query: { idUsuario: idUsuario } });
    }
}

//Redireccionar a la pagina para crear usuario (se podria optimizar con la funcion anterior)
function redireccionarCrearUsuario() {
    router.push({ path: "/crear-editar-usuario" });
}

//Redireccionar a la pagina de chat
function redireccionarChat() {
    router.push({ path: "/chat_tandem" });
}
//Funcion para filtrar los usuarios
function filtrarUsuarios(idUsuario: any) {
    usuariosDb.value = usuariosDb.value.filter((usuario) => usuario.idUsuario !== idUsuario);
}

//Headers de la tabla
const headers = [
    { title: "Nombre", value: "nombreUsuario" },
    { title: "Apellido", value: "apellidoUsuario" },
    { title: "Numero", value: "telefonoUsuario" },
    { title: "Email", value: "emailUsuario" },
    { title: "Editar/Eliminar", value: "accion" },
];
</script>

<style scoped>
.d-flex {
    display: flex;
}

.align-center {
    align-items: center;
}

.flex-grow-1 {
    flex-grow: 1;
}
</style>