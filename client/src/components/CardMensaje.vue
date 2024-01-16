<template>
    <v-card width="300" :class="mensajeCompleto.emailUsuario === datosUsuarioLogueado.emailUsuario && 'ml-auto'"
        :color="mensajeCompleto.emailUsuario === datosUsuarioLogueado.emailUsuario ? 'success' : '#555'" theme="dark">
        <v-card-subtitle>
            {{ mensajeCompleto.emailUsuario }}
        </v-card-subtitle>
        <v-card-text>
            {{ mensajeCompleto.mensaje }}
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
defineProps(["mensajeCompleto", "datosUsuarioLogueado"]);

</script>