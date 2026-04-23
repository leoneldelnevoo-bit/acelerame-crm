export default function Sidebar({ user, projects, selectedProjectId, onSelectProject, onLogout }) {
  const isAdmin = user.role === 'admin'
  const visibleProjects = isAdmin
    ? Object.values(projects)
    : Object.values(projects).filter(p => p.id === user.projectId)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">ACELERAME</div>
      <div className="sidebar-sub">CRM · v3</div>

      <div className="sidebar-section-title">Proyectos</div>
      <div className="project-list">
        {visibleProjects.map(p => {
          const isDisabled = p.supabaseUrl === 'PENDIENTE' && !isAdmin
          const isActive = p.id === selectedProjectId
          return (
            <button
              key={p.id}
              className={`project-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onSelectProject(p.id)}
              disabled={isDisabled}
            >
              <span className="project-dot" style={{ background: p.color }} />
              <span className="project-name">
                <span className="project-owner">{p.owner}</span>
                <span className="project-label">{p.brand}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-name">{user.name}</div>
        <div className="sidebar-user-role">
          {isAdmin ? '◆ Administrador' : '● Cliente'}
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
