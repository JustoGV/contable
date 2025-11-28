// Usuarios hardcodeados - SIN fetch, SIN await, SIN async
export const USERS = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    name: 'Administrador',
    role: 'ADMIN',
  },
  {
    id: 'emp-001',
    username: 'juan.perez',
    password: 'empleado123',
    email: 'juan.perez@example.com',
    name: 'Juan Pérez',
    role: 'EMPLOYEE',
  }
]

// Función simple de login - SIN async, SIN fetch
export function loginUser(username: string, password: string) {
  const user = USERS.find(u => u.username === username && u.password === password)
  if (user) {
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
    return user
  }
  return null
}

// Obtener usuario actual - SIN async
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      return JSON.parse(userStr)
    }
  }
  return null
}

// Cerrar sesión - SIN async
export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
  }
}

// Verificar si está logueado - SIN async
export function isLoggedIn() {
  return getCurrentUser() !== null
}

// Verificar si es admin - SIN async
export function isAdmin() {
  const user = getCurrentUser()
  return user && user.role === 'ADMIN'
}
