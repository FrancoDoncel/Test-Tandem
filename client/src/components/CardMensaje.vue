<template>
    <v-card width="300" class="mb-3 ml-5" color="success" theme="dark">
        <v-card-subtitle>
            Franco
        </v-card-subtitle>
        <v-card-text>
            {{ mensaje }}
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
defineProps(["mensaje"])
</script>