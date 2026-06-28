<template>
  <v-card variant="flat" border>
    <v-table>
      <thead>
        <tr>
          <th>Projeto</th>
          <th>Disciplina</th>
          <th>Status</th>
          <th>Entrega</th>
          <th class="text-right">Acoes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>
            <strong>{{ project.title }}</strong>
            <span>{{ project.owner }}</span>
          </td>
          <td>{{ project.subject }}</td>
          <td>
            <v-chip :color="statusColor(project.status)" size="small" variant="tonal">
              {{ project.status }}
            </v-chip>
          </td>
          <td>{{ formatDate(project.deadline) }}</td>
          <td class="text-right">
            <v-btn :to="`/editar/${project.id}`" icon="mdi-pencil" size="small" variant="text" />
            <v-btn
              color="error"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="$emit('remove', project)"
            />
          </td>
        </tr>
        <tr v-if="projects.length === 0">
          <td colspan="5" class="empty">Nenhum projeto cadastrado.</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import type { LabProject, ProjectStatus } from '@/types/project'

defineProps<{
  projects: LabProject[]
}>()

defineEmits<{
  remove: [project: LabProject]
}>()

function statusColor(status: ProjectStatus) {
  return {
    Planejado: 'accent',
    'Em andamento': 'secondary',
    Concluido: 'primary',
  }[status]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value))
}
</script>

<style scoped>
td strong,
td span {
  display: block;
}

td span {
  color: #66716f;
  font-size: 0.85rem;
}

.empty {
  color: #66716f;
  padding: 32px;
  text-align: center;
}
</style>
