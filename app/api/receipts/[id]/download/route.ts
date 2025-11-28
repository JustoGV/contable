import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Datos de recibos hardcodeados
const receipts: Record<string, any> = {
  'rec-001': {
    id: 'rec-001',
    file_name: 'recibo_noviembre_2024.pdf',
    file_path: '/uploads/comp-001/2024-11/recibo_noviembre_2024.pdf',
    company_id: 'comp-001',
    employee_id: 'emp-001'
  },
  'rec-002': {
    id: 'rec-002',
    file_name: 'recibo_octubre_2024.pdf',
    file_path: '/uploads/comp-001/2024-10/recibo_octubre_2024.pdf',
    company_id: 'comp-001',
    employee_id: 'emp-001'
  },
  'rec-003': {
    id: 'rec-003',
    file_name: 'recibo_septiembre_2024.pdf',
    file_path: '/uploads/comp-001/2024-09/recibo_septiembre_2024.pdf',
    company_id: 'comp-001',
    employee_id: 'emp-001'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    
    const receipt = receipts[id]

    if (!receipt) {
      return NextResponse.json({ error: 'Recibo no encontrado' }, { status: 404 })
    }

    // Verificar permisos: Admin de la empresa o empleado dueño del recibo
    const isAuthorized = 
      (session.user.role === 'ADMIN' && session.user.companyId === receipt.company_id) ||
      (session.user.role === 'EMPLOYEE' && session.user.id === receipt.employee_id)

    if (!isAuthorized) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Leer el archivo
    const filePath = join(process.cwd(), 'public', receipt.file_path)
    const fileBuffer = await readFile(filePath)

    // Retornar el archivo
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${receipt.file_name}"`
      }
    })
  } catch (error) {
    console.error('Error al descargar:', error)
    return NextResponse.json(
      { error: 'Error al descargar el archivo' },
      { status: 500 }
    )
  }
}
