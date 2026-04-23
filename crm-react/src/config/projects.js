// Configuración de proyectos Supabase por cliente.
// Para agregar un cliente nuevo:
//  1. Crear un proyecto Supabase nuevo
//  2. Aplicar el schema (ver docs/onboarding.md)
//  3. Agregar la entrada acá con su url + key
//  4. Agregar el usuario en ./users.js con projectId que matchee este "id"
export const PROJECTS = {
  leo: {
    id: 'leo',
    name: 'ACELERAME · Desarrollo Personal',
    owner: 'Leonel Delnevo',
    brand: 'Leo',
    color: '#d4a574',
    supabaseUrl: 'https://nulxpixgcdviuwfnxbqc.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bHhwaXhnY2R2aXV3Zm54YnFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM4OTk4OCwiZXhwIjoyMDg5OTY1OTg4fQ.kPwpvmycYIv8AtkpwHFATT2zZXMs3MEooYJ-bw6pFf0',
    vertical: 'Automatización IA + Mentoría'
  },
  poncho: {
    id: 'poncho',
    name: 'ACELERAME · Sukhafé',
    owner: 'Poncho',
    brand: 'Sukhafé',
    color: '#7ea584',
    // Placeholders — completar cuando se cree el proyecto Supabase de Poncho
    supabaseUrl: 'PENDIENTE',
    supabaseKey: 'PENDIENTE',
    vertical: 'Café specialty'
  },
  ariel: {
    id: 'ariel',
    name: 'ACELERAME · Inversiones',
    owner: 'Ariel',
    brand: 'Inversiones',
    color: '#7a9bc2',
    // Placeholders — completar cuando se cree el proyecto Supabase de Ariel
    supabaseUrl: 'PENDIENTE',
    supabaseKey: 'PENDIENTE',
    vertical: 'Real Estate inmigrantes USA'
  }
}

export const ACTIVE_PROJECTS = Object.values(PROJECTS).filter(
  p => p.supabaseUrl !== 'PENDIENTE'
)
