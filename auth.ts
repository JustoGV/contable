import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Usuarios hardcodeados para desarrollo
const users = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    name: 'Administrador',
    role: 'ADMIN',
    company_id: 'comp-001',
    company_name: 'Estudio Contable Demo'
  },
  {
    id: 'emp-001',
    username: 'juan.perez',
    password: 'empleado123',
    email: 'juan.perez@example.com',
    name: 'Juan Pérez',
    role: 'EMPLOYEE',
    company_id: 'comp-001',
    company_name: 'Estudio Contable Demo'
  }
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Buscar usuario en la lista hardcodeada
        const user = users.find(u => u.username === credentials.username)

        if (!user) {
          return null
        }

        // Verificar contraseña (comparación simple, sin hash)
        if (credentials.password !== user.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.company_id,
          companyName: user.company_name
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
        token.companyName = user.companyName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
        session.user.companyName = token.companyName as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: "demo-secret-no-database-123456789",
})
