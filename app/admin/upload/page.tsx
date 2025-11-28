'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/users'
import UploadReceipts from "@/components/admin/UploadReceipts"

// SIN async, SIN await - SOLO hardcoded
export default function UploadPage() {
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

  // Datos hardcodeados de empleados
  const employees = [
    {
      id: 'emp-001',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      username: 'jperez'
    },
    {
      id: 'emp-002',
      name: 'María García',
      email: 'maria.garcia@example.com',
      username: 'mgarcia'
    },
    {
      id: 'emp-003',
      name: 'Carlos López',
      email: 'carlos.lopez@example.com',
      username: 'clopez'
    },
    {
      id: 'emp-004',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      username: 'amartinez'
    },
    {
      id: 'emp-005',
      name: 'Pedro Rodríguez',
      email: 'pedro.rodriguez@example.com',
      username: 'prodriguez'
    }
  ]

  return <UploadReceipts employees={employees} companyId="company-001" />
}
