# ACELERAME CRM v3

CRM multi-tenant del sistema ACELERAME. React + Supabase, diseñado para operar múltiples proyectos/clientes desde una sola interfaz.

## Arquitectura

- **Un proyecto Supabase por cliente** (aislamiento total de datos)
- **Un CRM React unificado** que apunta al Supabase del cliente según quién se loguee
- Login hardcoded con roles admin/client
- Auto-refresh cada 30 segundos

## Usuarios del sistema

Ver `src/config/users.js`. Cambiar passwords antes de producción.

| Usuario | Rol | Ve |
|---------|-----|-----|
| `admin` | admin | Todos los proyectos |
| `leo` | client | Solo su proyecto |
| `poncho` | client | Solo su proyecto |
| `ariel` | client | Solo su proyecto |

## Agregar un cliente nuevo

1. Crear un proyecto Supabase nuevo para el cliente
2. Replicar el schema de `prospeccion_leads`, `instagram_cuentas`, etc. (ver guía de onboarding)
3. Editar `src/config/projects.js` y agregar la entrada con `supabaseUrl` + `supabaseKey`
4. Editar `src/config/users.js` y agregar el usuario con `projectId` matcheando
5. Commit y push → Vercel auto-deploy

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build para producción

```bash
npm run build
```

Output en `dist/`.

## Deploy a Vercel

1. Conectar el repo de GitHub a Vercel
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

Con `vercel.json` ya incluido, el SPA routing funciona automáticamente.

## Estructura

```
src/
├── main.jsx              Entry point
├── App.jsx               Routing por estado (login vs dashboard)
├── styles.css            Estilos globales
├── config/
│   ├── projects.js       Config Supabase de cada cliente
│   └── users.js          Usuarios hardcoded
├── hooks/
│   └── useSupabaseData.js  Fetch + auto-refresh
└── components/
    ├── Login.jsx
    ├── Sidebar.jsx
    ├── Dashboard.jsx
    ├── MetricCard.jsx
    ├── Pipeline.jsx
    ├── Funnel.jsx
    └── HotLeads.jsx
```

## Notas técnicas

- La API key de Supabase va en `projects.js` como **service_role**. Esto es OK para MVP porque el CRM está detrás de login, pero lo ideal a futuro es usar el `anon` key con Row Level Security habilitada.
- El hook `useSupabaseData` usa `fetch` con apikey en query string para evitar preflight CORS.
- Auto-refresh cada 30 segundos en cada proyecto activo.

## Próximos pasos sugeridos

- [ ] Vista detalle de lead individual (click en lead abre modal con historial de conversación completo)
- [ ] Filtros por fecha / score / etapa
- [ ] Exportar a CSV
- [ ] Notificaciones push cuando un lead llega a etapa 12 (agendado)
- [ ] Dashboard del admin con métricas consolidadas de todos los proyectos
