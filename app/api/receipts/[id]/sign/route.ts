import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import crypto from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { userId } = await request.json()
    const { id: receiptId } = await params

    // Simular verificación de recibo (sin DB)
    console.log('Firmando recibo:', receiptId, 'para usuario:', userId)

    // Obtener datos de trazabilidad
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Generar hash simulado
    const documentHash = crypto.createHash('sha256')
      .update(`${receiptId}-${userId}-${Date.now()}`)
      .digest('hex')

    console.log('Firma creada:', {
      receiptId,
      userId,
      ipAddress,
      userAgent,
      documentHash
    })

    return NextResponse.json({
      success: true,
      signature: {
        id: `sig-${Date.now()}`,
        signedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error al firmar:', error)
    return NextResponse.json(
      { error: 'Error al procesar la firma' },
      { status: 500 }
    )
  }
}
