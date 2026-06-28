<template>
  <v-app>
    <v-app-bar color="primary" elevation="1">
      <v-app-bar-title>Laboratorio de Projetos</v-app-bar-title>

      <v-spacer />

      <v-btn v-if="auth.isAuthenticated" variant="text" to="/" prepend-icon="mdi-view-dashboard">
        Projetos
      </v-btn>
      <v-btn v-if="auth.isAuthenticated" variant="text" to="/novo" prepend-icon="mdi-plus">
        Novo
      </v-btn>
      <v-btn v-if="auth.isAuthenticated" variant="text" prepend-icon="mdi-logout" @click="auth.logout">
        Sair
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  auth.initAuthListener()
})

watch(
  () => [auth.loading, auth.isAuthenticated, route.meta.requiresAuth],
  () => {
    if (!auth.loading && route.meta.requiresAuth && !auth.isAuthenticated) {
      router.push('/login')
    }

    if (!auth.loading && route.name === 'login' && auth.isAuthenticated) {
      router.push('/')
    }
  },
)
</script>
