import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const employeeIds = formData.getAll('employeeIds') as string[]
    const period = formData.get('period') as string
    const companyId = formData.get('companyId') as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 })
    }

    if (!period || !companyId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Crear directorio si no existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads', companyId, period)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const results = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const employeeId = employeeIds[i]

      if (!employeeId) {
        errors.push(`${file.name}: No se asignó empleado`)
        continue
      }

      try {
        // Leer el archivo
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generar nombre único para el archivo
        const fileExt = file.name.split('.').pop()
        const fileName = `${employeeId}_${Date.now()}.${fileExt}`
        const filePath = join(uploadsDir, fileName)

        // Guardar archivo
        await writeFile(filePath, buffer)

        // Simular creación de registro (sin DB)
        console.log('Archivo guardado:', fileName)
        results.push({ id: `rec-${Date.now()}` })
      } catch (error) {
        console.error('Error procesando archivo:', error)
        errors.push(`${file.name}: Error al procesar`)
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: results.length,
      errors
    })
  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
