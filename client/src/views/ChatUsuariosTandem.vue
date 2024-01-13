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
            <Card-mensaje v-for="(msg, index) of mensajes" :key="index" :mensaje="msg" class="mt-5"></Card-mensaje>
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

const router = useRouter();
const mensajes = ref<any[]>([]);
const mensaje = ref("");
const estadoDeConexion = ref(false);
const socket = ioSocket;

const conectarChat = () => {
    //Verifico si hay un usuario logueado
    if (!localStorage.getItem("usuario")) {

        //Si no hay un usuario logueado, muestro un mensaje de error y redirecciono al login
        alertaUsuarioNoLogueado()

        //Retorno para evitar que se conecte al chat
        return;
    }

    //Si el usuario esta logueado, conecto al chat
    socket.connect()

    estadoDeConexion.value = true
};
const desconectarChat = () => {
    socket.disconnect()
    Swal.fire({
        icon: "success",
        title: "Desconectado",
        text: "Se ha desconectado del chat"
    }).then(() => {
        //router.push("/");
        estadoDeConexion.value = false;
    })

};

//Funcion para enviar un mensaje
function enviarMensaje() {
    socket.emit("chat mensaje", mensaje.value);
    mensaje.value = "";
}

//Funcion para recibir un mensaje
socket.on("chat mensaje", (mensaje: any) => {
    mensajes.value.push(mensaje);
});


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

//Redireccionar a la pagina de login
function redireccionarLogin() {
    router.push({ path: "/login" });
}

//Redireccionar a la pagina de home
function redireccionarHome() {
    router.push({ path: "/" });
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