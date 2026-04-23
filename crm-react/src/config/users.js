// Usuarios hardcoded del CRM.
// Cambiar passwords antes de deploy a producción.
//
// role: 'admin' → ve todos los proyectos, puede cambiar entre ellos
// role: 'client' → solo ve el proyecto en 'projectId'
export const USERS = [
  {
    username: 'admin',
    password: 'ACELERAME2026!',
    name: 'Leonel Delnevo',
    role: 'admin',
    projectId: null // admin ve todos
  },
  {
    username: 'leo',
    password: 'leo-acelerame',
    name: 'Leonel Delnevo',
    role: 'client',
    projectId: 'leo'
  },
  {
    username: 'poncho',
    password: 'poncho-sukhafe',
    name: 'Poncho',
    role: 'client',
    projectId: 'poncho'
  },
  {
    username: 'ariel',
    password: 'ariel-inversiones',
    name: 'Ariel',
    role: 'client',
    projectId: 'ariel'
  }
]

export function authenticate(username, password) {
  const user = USERS.find(
    u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password
  )
  return user || null
}
