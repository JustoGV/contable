'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/users'
import EmployeeDashboard from "@/components/employee/EmployeeDashboard"

// SIN async, SIN await - SOLO hardcoded
export default function EmployeePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'EMPLOYEE') {
      router.push('/login')
      return
    }

    setUser(currentUser)
  }, [router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  // Recibos hardcodeados
  const receipts = [
    {
      id: 'rec-001',
      period: '2024-11',
      status: 'SIGNED',
      fileName: 'recibo_noviembre_2024.pdf',
      filePath: '/uploads/comp-001/2024-11/recibo_noviembre_2024.pdf',
      createdAt: new Date('2024-11-25T10:00:00'),
      sentAt: new Date('2024-11-25T10:30:00'),
      signature: {
        signedAt: new Date('2024-11-26T14:20:00')
      }
    },
    {
      id: 'rec-002',
      period: '2024-10',
      status: 'SIGNED',
      fileName: 'recibo_octubre_2024.pdf',
      filePath: '/uploads/comp-001/2024-10/recibo_octubre_2024.pdf',
      createdAt: new Date('2024-10-25T10:00:00'),
      sentAt: new Date('2024-10-25T10:30:00'),
      signature: {
        signedAt: new Date('2024-10-26T09:15:00')
      }
    },
    {
      id: 'rec-003',
      period: '2024-09',
      status: 'SENT',
      fileName: 'recibo_septiembre_2024.pdf',
      filePath: '/uploads/comp-001/2024-09/recibo_septiembre_2024.pdf',
      createdAt: new Date('2024-09-25T10:00:00'),
      sentAt: new Date('2024-09-25T10:30:00'),
      signature: null
    }
  ]

  return (
    <EmployeeDashboard
      user={user}
      receipts={receipts}
    />
  )
}
