<template>
    <div>
        <div>
            <!-- Navbar -->
            <v-app-bar :elevation="2" class="d-flex align-center">
                <template v-slot:append>
                    <v-btn v-show="estadoDeConexion" @click="desconectarChat" color="error" variant="outlined"
                        icon="mdi-cancel"></v-btn>
                    <v-btn v-show="!estadoDeConexion" icon="mdi-home-outline" @click="redireccionarHome"></v-btn>
                </template>
                <h1 class="text-center flex-grow-1">Sala de chat</h1>
            </v-app-bar>
        </div>

        <div>
            <v-container v-if="!estadoDeConexion"
                style="height: 82vh; overflow: hidden; overflow-y: auto; scroll-behavior: smooth;" fluid
                class="pa-0 pa-md-3">
                <!-- Card de conexion al chat -->
                <v-row justify="center">
                    <v-col cols="12" class="text-center">
                    </v-col>
                    <v-card class="pa-0">
                        <v-card-title class="text-center">
                            Chat de usuarios Tandem
                        </v-card-title>
                        <v-card-text>
                            <v-btn block color="success" @click="conectarChat">Conectar</v-btn>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </div>

        <v-container v-if="estadoDeConexion"
            style="height: 82vh; overflow: hidden; overflow-y: auto; scroll-behavior: smooth;" fluid class="pa-0 pa-md-3">
            <!-- Card de mensajes -->
            <Card-mensaje v-for="(msg, index) of mensajes" :key="index" :mensajeCompleto="msg"
                :datosUsuarioLogueado="datosUsuarioLogueado" class="mt-5"></Card-mensaje>
        </v-container>
        <v-footer v-if="estadoDeConexion">
            <v-form class="w-100" @submit.prevent="enviarMensaje">
                <v-row>
                    <v-col cols="12" md="11">
                        <v-text-field rounded variant="outlined" label="Mensaje" density="compact" hide-details
                            v-model="mensaje"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                        <v-btn rounded @click="enviarMensaje">
                            <v-icon start>mdi-send</v-icon>
                            <span>Enviar</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-footer>

    </div>
</template>
<script setup lang="ts">
import { ioSocket } from "@/service"
import { ref } from "vue";
import CardMensaje from "@/components/CardMensaje.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { api } from "@/service";

const router = useRouter();
const mensajes = ref<any[]>([]);
const mensaje = ref("");
const estadoDeConexion = ref(false);
const socket = ioSocket;
const datosUsuarioLogueado = ref<any>({});

const conectarChat = () => {
    //Verifico si hay un usuario logueado
    if (!localStorage.getItem("usuario")) {
        //Si no hay un usuario logueado, muestro un mensaje de error y redirecciono al login
        alertaUsuarioNoLogueado();

        //Retorno para evitar que se conecte al chat
        return;
    }
    //Si el usuario esta logueado, conecto al chat
    socket.connect();

    //Obtener el token de acceso desde el Local Storage
    const accessToken = localStorage.getItem('usuario');

    //Verifico si el token de acceso existe
    verificarTokenUsuario(accessToken);

    //Pido mensajes en la base de datos
    pedirMensajes();

    estadoDeConexion.value = true;
};
const desconectarChat = () => {
    socket.disconnect();
    Swal.fire({
        icon: "success",
        title: "Desconectado",
        text: "Se ha desconectado del chat"
    }).then(() => {
        estadoDeConexion.value = false;
    });
};

//Funcion para enviar un mensaje
function enviarMensaje() {
    const mensajeCompleto = {
        mensaje: mensaje.value,
        emailUsuario: datosUsuarioLogueado.value.emailUsuario,
        idUsuario: datosUsuarioLogueado.value.idUsuario,
    }
    socket.emit("chat mensaje", mensajeCompleto);
    mensaje.value = "";
}

//Funcion para recibir un mensaje
socket.on("chat mensaje", (mensajeCompleto: any) => {
    //Guardo los mensajes en la base de datos
    guardarMensajesEnBaseDeDatos(mensajeCompleto.mensaje, mensajeCompleto.idUsuario);
    mensajes.value.push(mensajeCompleto);
});


//Funcion para verificar si el token de usuario existre
function verificarTokenUsuario(accessToken: any) {
    // Verifico si el token existe
    if (accessToken) {
        // Divido el token en sus partes
        const [header, payload, signature] = accessToken.split('.');

        // Decodifico el payload y lo parseo
        datosUsuarioLogueado.value = JSON.parse(atob(payload));
    } else {
        console.error('No se encontró el token de acceso en el Local Storage.');
    }
}

//Funcion para pedir los mensajes de la base de datos
async function pedirMensajes() {
    try {
        const { data } = await api.get("/mensajesChat");
        //Guardo los mensajes en el array de mensajes
        data.forEach((mensaje: any) => {
            guardarMensajesEnArray(mensaje.mensajeChat, mensaje.idUsuario, mensaje.Usuario.emailUsuario);
        });
    } catch (error: any) {
        console.log(error);
        if (error.response || error.response.status === 401) {
            redireccionarLogin();
        }
    }
}

//Funcion para guardar los mensajes en la base de datos
async function guardarMensajesEnBaseDeDatos(mensaje: any, idUsuario: any) {
    try {
        const { data } = await api.post("/mensajeChat", {
            mensaje,
            idUsuario,
        });
        console.log(data);
    } catch (error: any) {
        console.log(error);
        if (error.response || error.response.status === 401) {
            redireccionarLogin();
        }
    }
}

//Funcion para guardar los mensajes de la base de datos en el array de mensajes
function guardarMensajesEnArray(mensaje: any, idUsuario: any, emailUsuario: any) {
    const mensajeCompleto = {
        mensaje,
        idUsuario,
        emailUsuario,
    };
    mensajes.value.push(mensajeCompleto);
}

//Configuracion alerta de usuario no logueado
function alertaUsuarioNoLogueado() {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay un usuario logueado"
    }).then(() => {
        router.push("/login");
    })
}

//Redireccionar a la pagina de home
function redireccionarHome() {
    router.push({ path: "/" });
}

//Redireccionar a la paginad de login
function redireccionarLogin() {
    router.push({ path: "/login" });
}

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
    margin-left: 50px;
}
</style>