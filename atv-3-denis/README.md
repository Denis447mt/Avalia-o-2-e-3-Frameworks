# ATV-3 - Laboratorio de Projetos

Mini-aplicacao Vue 3 + Vuetify com Vue Router, componentes reutilizaveis, Pinia,
login com Google, validacao do token no backend e CRUD completo usando Firebase
Firestore.

## Tema

O tema escolhido foi **Laboratorio de Projetos Academicos**. O CRUD gerencia
projetos e entregas de faculdade com titulo, disciplina, responsavel, status,
prazo e descricao.

## Recursos implementados

- Vue 3 com Composition API e TypeScript.
- Vuetify para interface responsiva.
- Vue Router com rotas protegidas.
- Pinia para estado global de autenticacao.
- Autenticacao com Google pelo Firebase Auth.
- Backend Express em `server/index.js` validando o ID token com Firebase Admin.
- Firestore como banco de dados.
- Create, Read, Update e Delete de projetos.
- Componentes reutilizaveis `ProjectForm` e `ProjectTable`.

## Como configurar

1. Instale as dependencias:

```sh
npm install
```

2. Copie `.env.example` para `.env` e preencha os dados do Firebase Web App.

3. No Firebase Console, habilite:

- Authentication > Sign-in method > Google.
- Firestore Database.

4. Configure a credencial do backend. Use uma das opcoes:

- `FIREBASE_SERVICE_ACCOUNT` com o JSON da conta de servico em uma linha.
- `GOOGLE_APPLICATION_CREDENTIALS` apontando para o arquivo JSON da conta.

## Como rodar

```sh
npm run dev:full
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3001`

## Observacao sobre a validacao do token

O login Google e feito pelo Firebase Auth. Depois do login, o frontend obtem o
ID token do usuario e envia para `POST /api/auth/verify`. O backend valida esse
token usando `firebase-admin/auth`. Se o token for valido, a rota protegida e o
CRUD ficam disponiveis.
