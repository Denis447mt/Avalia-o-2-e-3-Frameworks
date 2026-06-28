export type ProjectStatus = 'Planejado' | 'Em andamento' | 'Concluido'

export interface LabProject {
  id: string
  title: string
  subject: string
  owner: string
  status: ProjectStatus
  deadline: string
  description: string
  createdAt: string
}

export type ProjectPayload = Omit<LabProject, 'id' | 'createdAt'>
