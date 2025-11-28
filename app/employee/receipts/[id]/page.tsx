'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCurrentUser } from '@/lib/users'
import SignReceipt from "@/components/employee/SignReceipt"

// Recibos hardcodeados
const hardcodedReceipts: Record<string, any> = {
  'rec-001': {
    id: 'rec-001',
    period: '2024-11',
    fileName: 'recibo_noviembre_2024.pdf',
    filePath: '/uploads/comp-001/2024-11/recibo_noviembre_2024.pdf',
    status: 'SIGNED',
    signature: {
      signedAt: new Date('2024-11-26T14:20:00'),
      ipAddress: '192.168.1.100'
    },
    employee: {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com'
    }
  },
  'rec-002': {
    id: 'rec-002',
    period: '2024-10',
    fileName: 'recibo_octubre_2024.pdf',
    filePath: '/uploads/comp-001/2024-10/recibo_octubre_2024.pdf',
    status: 'SIGNED',
    signature: {
      signedAt: new Date('2024-10-26T09:15:00'),
      ipAddress: '192.168.1.100'
    },
    employee: {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com'
    }
  },
  'rec-003': {
    id: 'rec-003',
    period: '2024-09',
    fileName: 'recibo_septiembre_2024.pdf',
    filePath: '/uploads/comp-001/2024-09/recibo_septiembre_2024.pdf',
    status: 'SENT',
    signature: null,
    employee: {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com'
    }
  }
}

// SIN async, SIN await - SOLO hardcoded
export default function ReceiptPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [receipt, setReceipt] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'EMPLOYEE') {
      router.push('/login')
      return
    }

    const id = params.id as string
    const foundReceipt = hardcodedReceipts[id]

    if (!foundReceipt) {
      router.push('/employee')
      return
    }

    setUser(currentUser)
    setReceipt(foundReceipt)
  }, [router, params.id])

  if (!user || !receipt) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return <SignReceipt receipt={receipt} userId={user.id} />
}
