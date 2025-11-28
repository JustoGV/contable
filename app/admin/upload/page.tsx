import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UploadReceipts from "@/components/admin/UploadReceipts"

export default async function UploadPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
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

  return <UploadReceipts employees={employees} companyId={session.user.companyId || 'company-001'} />
}
