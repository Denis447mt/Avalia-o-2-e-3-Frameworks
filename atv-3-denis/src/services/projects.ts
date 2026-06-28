import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { LabProject, ProjectPayload } from '@/types/project'

const collectionName = 'lab-projects'
const localKey = 'lab-projects-local'

function readLocalProjects(): LabProject[] {
  return JSON.parse(localStorage.getItem(localKey) ?? '[]') as LabProject[]
}

function saveLocalProjects(projects: LabProject[]) {
  localStorage.setItem(localKey, JSON.stringify(projects))
}

export async function listProjects(userId: string): Promise<LabProject[]> {
  if (!db) {
    return readLocalProjects()
      .filter((project) => project.id.startsWith(`${userId}-`))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  const projectsQuery = query(
    collection(db, collectionName),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(projectsQuery)

  return snapshot.docs.map((item) => {
    const data = item.data() as Omit<LabProject, 'id'>
    return { ...data, id: item.id }
  })
}

export async function createProject(userId: string, payload: ProjectPayload) {
  if (!db) {
    const projects = readLocalProjects()
    projects.push({
      ...payload,
      id: `${userId}-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    })
    saveLocalProjects(projects)
    return
  }

  await addDoc(collection(db, collectionName), {
    ...payload,
    userId,
    createdAt: new Date().toISOString(),
  })
}

export async function updateProject(projectId: string, payload: ProjectPayload) {
  if (!db) {
    const projects = readLocalProjects().map((project) =>
      project.id === projectId ? { ...project, ...payload } : project,
    )
    saveLocalProjects(projects)
    return
  }

  await updateDoc(doc(db, collectionName, projectId), payload)
}

export async function removeProject(projectId: string) {
  if (!db) {
    saveLocalProjects(readLocalProjects().filter((project) => project.id !== projectId))
    return
  }

  await deleteDoc(doc(db, collectionName, projectId))
}
