import { auth } from "@/auth"
import { redirect } from "next/navigation"
import EmployeeDashboard from "@/components/employee/EmployeeDashboard"

export default async function EmployeePage() {
  const session = await auth()

  if (!session || session.user.role !== 'EMPLOYEE') {
    redirect('/login')
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
      user={session.user}
      receipts={receipts}
    />
  )
}
