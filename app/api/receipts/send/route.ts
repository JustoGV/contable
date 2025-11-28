import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { period, receiptIds } = await request.json()

    // Simular envío de emails (sin DB ni SMTP)
    console.log('Simulando envío de emails para período:', period)
    console.log('Receipt IDs:', receiptIds)

    // Retornar éxito simulado
    return NextResponse.json({
      success: true,
      sent: receiptIds?.length || 5,
      errors: []
    })
  } catch (error) {
    console.error('Error en send:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
