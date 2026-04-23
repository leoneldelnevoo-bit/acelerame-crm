import { useState, useEffect } from 'react'
import { authenticate } from './config/users.js'
import { PROJECTS, ACTIVE_PROJECTS } from './config/projects.js'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'

const STORAGE_KEY = 'acelerame_session'

export default function App() {
  const [user, setUser] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  // Restaurar sesión de memoria (no usamos localStorage porque a veces está bloqueado)
  // Si se recarga la página se pierde la sesión. Es aceptable para este MVP.
  useEffect(() => {
    // Intentar restaurar desde sessionStorage si está disponible
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setUser(parsed.user)
        setSelectedProjectId(parsed.projectId)
      }
    } catch (e) {
      // sessionStorage no disponible, ignorar
    }
  }, [])

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user, projectId: selectedProjectId }))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      // ignorar
    }
  }, [user, selectedProjectId])

  function handleLogin(username, password) {
    const authUser = authenticate(username, password)
    if (!authUser) {
      return { error: 'Usuario o contraseña incorrectos' }
    }
    setUser(authUser)
    // Si es cliente, seleccionar su proyecto automáticamente
    // Si es admin, seleccionar el primero disponible
    if (authUser.role === 'client') {
      setSelectedProjectId(authUser.projectId)
    } else {
      setSelectedProjectId(ACTIVE_PROJECTS[0]?.id || null)
    }
    return { success: true }
  }

  function handleLogout() {
    setUser(null)
    setSelectedProjectId(null)
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const selectedProject = selectedProjectId ? PROJECTS[selectedProjectId] : null

  return (
    <div className="app">
      <Sidebar
        user={user}
        projects={PROJECTS}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onLogout={handleLogout}
      />
      <main className="main">
        <Dashboard project={selectedProject} user={user} />
      </main>
    </div>
  )
}
