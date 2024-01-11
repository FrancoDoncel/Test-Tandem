import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import("@/views/Home.vue"),
    },
    {
      path: '/crear-editar-usuario',
      name: 'CrearEditarUsuario',
      component: () => import("@/views/CrearEditarUsuario.vue"),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import("@/views/Login.vue"),
    },
  ]
})

export default router
