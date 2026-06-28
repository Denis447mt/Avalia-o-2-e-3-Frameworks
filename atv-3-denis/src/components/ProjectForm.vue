<template>
  <v-form @submit.prevent="submit">
    <v-row>
      <v-col cols="12" md="7">
        <v-text-field v-model="form.title" label="Titulo do projeto" :rules="[required]" />
      </v-col>
      <v-col cols="12" md="5">
        <v-text-field v-model="form.subject" label="Disciplina" :rules="[required]" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="form.owner" label="Responsavel" :rules="[required]" />
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="form.status" label="Status" :items="statusOptions" />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="form.deadline" label="Entrega" type="date" :rules="[required]" />
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="form.description" label="Descricao" rows="4" :rules="[required]" />
      </v-col>
    </v-row>

    <div class="actions">
      <v-btn variant="text" to="/">Cancelar</v-btn>
      <v-btn color="primary" type="submit" :loading="loading" prepend-icon="mdi-content-save">
        Salvar projeto
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { LabProject, ProjectPayload, ProjectStatus } from '@/types/project'

const props = defineProps<{
  project?: LabProject
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: ProjectPayload]
}>()

const statusOptions: ProjectStatus[] = ['Planejado', 'Em andamento', 'Concluido']
const required = (value: string) => Boolean(value) || 'Campo obrigatorio'

const form = reactive<ProjectPayload>({
  title: '',
  subject: '',
  owner: '',
  status: 'Planejado',
  deadline: '',
  description: '',
})

watch(
  () => props.project,
  (project) => {
    if (!project) return
    form.title = project.title
    form.subject = project.subject
    form.owner = project.owner
    form.status = project.status
    form.deadline = project.deadline
    form.description = project.description
  },
  { immediate: true },
)

function submit() {
  if (!form.title || !form.subject || !form.owner || !form.deadline || !form.description) return
  emit('save', { ...form })
}
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
