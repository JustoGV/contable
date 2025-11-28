import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Redirigir según el rol
  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  } else {
    redirect('/employee')
  }
}
