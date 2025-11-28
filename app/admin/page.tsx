'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/users'
import AdminDashboard from "@/components/admin/AdminDashboard"

// SIN async, SIN await - SOLO hardcoded
export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    setUser(currentUser)
  }, [router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
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
      user={user}
      stats={stats}
      recentReceipts={recentReceipts}
    />
  )
}
