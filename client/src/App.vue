<script setup lang="ts">
import { api } from '@/service';

//Pedir user del localstorage
const usuarioItem = localStorage.getItem('usuario');
const usuario = usuarioItem ? JSON.parse(usuarioItem) : null;
if (usuario && usuario.accessToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${usuario.accessToken}`;
}
</script>

<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>


