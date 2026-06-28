import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '@/firebase'
import { validateTokenOnBackend } from '@/services/api'

interface AppUser {
  uid: string
  displayName: string | null
  email: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AppUser | null>(null)
  const idToken = ref('')
  const loading = ref(false)
  const backendValidated = ref(false)
  const validationError = ref('')
  let listenerStarted = false

  const isAuthenticated = computed(() => Boolean(user.value && backendValidated.value))

  function initAuthListener() {
    if (listenerStarted) return
    listenerStarted = true

    if (!auth) {
      loading.value = false
      return
    }

    onAuthStateChanged(auth, async (currentUser) => {
      loading.value = true
      validationError.value = ''
      user.value = currentUser

      if (!currentUser) {
        idToken.value = ''
        backendValidated.value = false
        loading.value = false
        return
      }

      try {
        const token = await currentUser.getIdToken()
        await validateTokenOnBackend(token)
        idToken.value = token
        backendValidated.value = true
      } catch (error) {
        backendValidated.value = false
        validationError.value = error instanceof Error ? error.message : 'Falha ao validar token'
      } finally {
        loading.value = false
      }
    })
  }

  async function loginWithGoogle() {
    if (!auth || !isFirebaseConfigured) {
      validationError.value = 'Configure o arquivo .env com os dados do Firebase para usar o Google.'
      return
    }

    loading.value = true
    validationError.value = ''
    try {
      const credential = await signInWithPopup(auth, googleProvider)
      const token = await credential.user.getIdToken()
      await validateTokenOnBackend(token)
      user.value = credential.user
      idToken.value = token
      backendValidated.value = true
    } catch (error) {
      validationError.value = error instanceof Error ? error.message : 'Nao foi possivel autenticar'
      backendValidated.value = false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    if (auth) {
      await signOut(auth)
    }
    user.value = null
    idToken.value = ''
    backendValidated.value = false
  }

  function loginDemo() {
    user.value = {
      uid: 'usuario-local',
      displayName: 'Aluno Teste',
      email: 'aluno@exemplo.com',
    }
    idToken.value = 'modo-local'
    backendValidated.value = true
    validationError.value = ''
  }

  return {
    user,
    idToken,
    loading,
    backendValidated,
    validationError,
    isFirebaseConfigured,
    isAuthenticated,
    initAuthListener,
    loginWithGoogle,
    loginDemo,
    logout,
  }
})
