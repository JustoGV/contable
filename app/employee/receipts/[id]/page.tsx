import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import SignReceipt from "@/components/employee/SignReceipt"

interface PageProps {
  params: Promise<{ id: string }>
}

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

export default async function ReceiptPage({ params }: PageProps) {
  const session = await auth()

  if (!session || session.user.role !== 'EMPLOYEE') {
    redirect('/login')
  }

  const { id } = await params

  const receipt = hardcodedReceipts[id]

  if (!receipt) {
    notFound()
  }

  // Verificar que el recibo pertenece al empleado
  if (receipt.employee.email !== session.user.email) {
    redirect('/employee')
  }

  return <SignReceipt receipt={receipt} userId={session.user.id} />
}
