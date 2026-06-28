<template>
  <section class="login-page">
    <div class="login-panel">
      <v-chip color="secondary" variant="tonal">Atividade avaliativa 2 e 3</v-chip>
      <h1>Laboratorio de Projetos</h1>
      <p>
        Organize entregas academicas com CRUD em Vue 3, Vuetify, Pinia, Google Auth,
        validacao no backend e dados no Firebase.
      </p>

      <v-alert v-if="auth.validationError" type="error" variant="tonal" class="mb-4">
        {{ auth.validationError }}
      </v-alert>

      <div class="login-actions">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-google"
          :loading="auth.loading"
          @click="auth.loginWithGoogle"
        >
          Entrar com Google
        </v-btn>

        <v-btn
          v-if="!auth.isFirebaseConfigured"
          color="secondary"
          size="large"
          variant="flat"
          prepend-icon="mdi-account-check"
          @click="auth.loginDemo"
        >
          Entrar em modo local
        </v-btn>
      </div>

      <v-alert v-if="!auth.isFirebaseConfigured" type="warning" variant="tonal" class="mt-4">
        Firebase ainda nao configurado. Use o modo local para testar a tela e o CRUD, ou preencha o
        .env para autenticar com Google.
      </v-alert>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.login-page {
  align-items: center;
  background:
    linear-gradient(110deg, rgba(36, 91, 87, 0.9), rgba(76, 127, 186, 0.72)),
    url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80');
  background-position: center;
  background-size: cover;
  display: flex;
  min-height: calc(100vh - 64px);
  padding: 32px;
}

.login-panel {
  color: white;
  max-width: 620px;
}

h1 {
  font-size: clamp(2.4rem, 5vw, 4.4rem);
  line-height: 1;
  margin: 20px 0 16px;
}

p {
  font-size: 1.15rem;
  margin-bottom: 28px;
  max-width: 560px;
}

.login-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
