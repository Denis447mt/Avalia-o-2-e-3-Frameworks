<template>
  <section class="page">
    <div class="toolbar">
      <div>
        <p class="eyebrow">Projetos academicos</p>
        <h1>Controle de atividades</h1>
      </div>
      <v-btn color="primary" to="/novo" prepend-icon="mdi-plus">Novo projeto</v-btn>
    </div>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card variant="flat" border>
          <v-card-text>
            <span>Total</span>
            <strong>{{ projects.length }}</strong>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="flat" border>
          <v-card-text>
            <span>Em andamento</span>
            <strong>{{ activeProjects }}</strong>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="flat" border>
          <v-card-text>
            <span>Usuario</span>
            <strong>{{ auth.user?.displayName ?? 'Google' }}</strong>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
    <v-progress-linear v-if="loading" color="primary" indeterminate class="mb-4" />

    <ProjectTable :projects="projects" @remove="askRemove" />

    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir projeto</v-card-title>
        <v-card-text>
          Confirma a exclusao de "{{ selectedProject?.title }}"? Esta acao remove o registro do
          Firebase.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="removing" @click="confirmRemove">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ProjectTable from '@/components/ProjectTable.vue'
import { useAuthStore } from '@/stores/auth'
import { listProjects, removeProject } from '@/services/projects'
import type { LabProject } from '@/types/project'

const auth = useAuthStore()
const projects = ref<LabProject[]>([])
const loading = ref(false)
const removing = ref(false)
const error = ref('')
const confirmDialog = ref(false)
const selectedProject = ref<LabProject | null>(null)

const activeProjects = computed(
  () => projects.value.filter((project) => project.status === 'Em andamento').length,
)

onMounted(loadProjects)

watch(
  () => auth.user?.uid,
  () => loadProjects(),
)

async function loadProjects() {
  if (!auth.user) return
  loading.value = true
  error.value = ''

  try {
    projects.value = await listProjects(auth.user.uid)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao carregar projetos'
  } finally {
    loading.value = false
  }
}

function askRemove(project: LabProject) {
  selectedProject.value = project
  confirmDialog.value = true
}

async function confirmRemove() {
  if (!selectedProject.value) return
  removing.value = true

  try {
    await removeProject(selectedProject.value.id)
    projects.value = projects.value.filter((project) => project.id !== selectedProject.value?.id)
    confirmDialog.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao excluir projeto'
  } finally {
    removing.value = false
  }
}
</script>

<style scoped>
.page {
  margin: 0 auto;
  max-width: 1180px;
  padding: 32px 20px;
}

.toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  color: #c95f3f;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 4px;
  text-transform: uppercase;
}

h1 {
  color: #1f3432;
  font-size: 2rem;
  margin: 0;
}

.v-card-text {
  display: grid;
  gap: 8px;
}

.v-card-text span {
  color: #66716f;
}

.v-card-text strong {
  color: #1f3432;
  font-size: 1.8rem;
}

@media (max-width: 680px) {
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
