<template>
  <section class="page">
    <v-btn variant="text" to="/" prepend-icon="mdi-arrow-left" class="mb-4">Voltar</v-btn>

    <v-card variant="flat" border>
      <v-card-title>{{ isEditing ? 'Editar projeto' : 'Novo projeto' }}</v-card-title>
      <v-card-subtitle>
        {{ isEditing ? 'Atualize os dados salvos no Firebase.' : 'Cadastre uma nova entrega academica.' }}
      </v-card-subtitle>
      <v-card-text>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
        <v-progress-linear v-if="loadingProject" color="primary" indeterminate class="mb-4" />
        <ProjectForm :project="project" :loading="saving" @save="saveProject" />
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectForm from '@/components/ProjectForm.vue'
import { useAuthStore } from '@/stores/auth'
import { createProject, listProjects, updateProject } from '@/services/projects'
import type { LabProject, ProjectPayload } from '@/types/project'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const project = ref<LabProject>()
const saving = ref(false)
const loadingProject = ref(false)
const error = ref('')

const isEditing = computed(() => Boolean(route.params.id))

onMounted(async () => {
  if (!isEditing.value || !auth.user) return
  loadingProject.value = true

  try {
    const projects = await listProjects(auth.user.uid)
    project.value = projects.find((item) => item.id === route.params.id)
    if (!project.value) {
      error.value = 'Projeto nao encontrado'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao buscar projeto'
  } finally {
    loadingProject.value = false
  }
})

async function saveProject(payload: ProjectPayload) {
  if (!auth.user) return
  saving.value = true
  error.value = ''

  try {
    if (isEditing.value && typeof route.params.id === 'string') {
      await updateProject(route.params.id, payload)
    } else {
      await createProject(auth.user.uid, payload)
    }
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao salvar projeto'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  margin: 0 auto;
  max-width: 920px;
  padding: 32px 20px;
}
</style>
