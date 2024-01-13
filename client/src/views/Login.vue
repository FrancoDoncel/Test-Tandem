<template>
    <v-container fluid class="pa-0 pa-md-3">
        <v-row dense justify="center">
            <v-col cols="12" md="3"></v-col>
            <!-- Card de inicio de sesion -->
            <v-col cols="12" md="6">
                <v-card class="pa-0">
                    <v-card-title class="text-center">Inicio de sesión</v-card-title>
                    <v-card-text>
                        <!-- Input de email -->
                        <v-row dense justify="center">
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" density="compact" label="Correo electronico" hide-details
                                    clearable type="email" v-model="emailUsuario">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!-- Input de contraseña -->
                        <v-row dense justify="center">
                            <v-col cols="12" md="6">
                                <v-text-field variant="outlined" density="compact" label="Contraseña" hide-details clearable
                                    type="password" v-model="passwordUsuario">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!-- Boton de ingreso -->
                        <v-row dense justify="center">
                            <v-col cols="12" md="6">
                                <v-btn block @click="iniciarSesion">
                                    <v-icon start>mdi-login</v-icon>
                                    <span>Ingresar</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3"></v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { api } from "@/service"; //Importo la instancia de axios
import { ref } from "vue";
import router from "@/router";
import Swal from "sweetalert2";

const emailUsuario = ref("");
const passwordUsuario = ref("");

//Funcion para iniciar sesion
async function iniciarSesion() {
    try {
        const { data } = await api.post("/login", {
            emailUsuario: emailUsuario.value,
            passwordUsuario: passwordUsuario.value
        });
        console.log(data);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        localStorage.setItem("usuario", JSON.stringify(data));
        redireccionarHome();
    } catch (error) {
        console.log(error);
        alertaUsuarioOContraseñaIncorrectos();
        resetVariables();
    }
}

//Configuracion de alerta de usuario o contraseña incorrectos
function alertaUsuarioOContraseñaIncorrectos() {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario o contraseña incorrectos!",
    });
}

//Funcion para pushear al home (lista de usuarios)
function redireccionarHome() {
    router.push("/");
}

//Resetear los campos del formulario
function resetVariables() {
    emailUsuario.value = "";
    passwordUsuario.value = "";
};
</script>