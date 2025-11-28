import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Estadísticas hardcodeadas
  const stats = {
    totalReceipts: 23,
    pending: 5,
    sent: 8,
    signed: 10,
    totalEmployees: 5
  }

  // Recibos recientes hardcodeados
  const recentReceipts = [
    {
      id: 'rec-001',
      period: '2024-11',
      status: 'SIGNED',
      createdAt: new Date('2024-11-25'),
      employee: {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com'
      }
    },
    {
      id: 'rec-002',
      period: '2024-11',
      status: 'SENT',
      createdAt: new Date('2024-11-25'),
      employee: {
        name: 'María García',
        email: 'maria.garcia@example.com'
      }
    },
    {
      id: 'rec-003',
      period: '2024-11',
      status: 'SIGNED',
      createdAt: new Date('2024-11-24'),
      employee: {
        name: 'Carlos López',
        email: 'carlos.lopez@example.com'
      }
    },
    {
      id: 'rec-004',
      period: '2024-10',
      status: 'SIGNED',
      createdAt: new Date('2024-10-25'),
      employee: {
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com'
      }
    },
    {
      id: 'rec-005',
      period: '2024-10',
      status: 'SIGNED',
      createdAt: new Date('2024-10-25'),
      employee: {
        name: 'Pedro Rodríguez',
        email: 'pedro.rodriguez@example.com'
      }
    }
  ]

  return (
    <AdminDashboard
      user={session.user}
      stats={stats}
      recentReceipts={recentReceipts}
    />
  )
}
