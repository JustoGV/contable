'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Employee {
  id: string
  name: string
  email: string
  username: string
}

interface UploadReceiptsProps {
  employees: Employee[]
  companyId: string
}

interface FileMapping {
  file: File
  employeeId: string
  employeeName: string
  period: string
}

export default function UploadReceipts({ employees, companyId }: UploadReceiptsProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [period, setPeriod] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [mappings, setMappings] = useState<FileMapping[]>([])
  const [step, setStep] = useState<'upload' | 'mapping' | 'sending'>('upload')
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
      
      // Auto-mapear archivos basándose en el nombre
      const autoMappings = selectedFiles.map(file => {
        const fileName = file.name.toLowerCase()
        const matchedEmployee = employees.find(emp => 
          fileName.includes(emp.username.toLowerCase()) ||
          fileName.includes(emp.name.toLowerCase().replace(/\s/g, ''))
        )
        
        return {
          file,
          employeeId: matchedEmployee?.id || '',
          employeeName: matchedEmployee?.name || 'No asignado',
          period: period
        }
      })
      
      setMappings(autoMappings)
    }
  }

  const updateMapping = (index: number, employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId)
    setMappings(prev => prev.map((mapping, i) => 
      i === index 
        ? { ...mapping, employeeId, employeeName: employee?.name || 'No asignado' }
        : mapping
    ))
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setMappings(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (step === 'upload' && files.length > 0 && period) {
      setStep('mapping')
    }
  }

  const handleSubmit = async () => {
    // Validar que todos los archivos tengan empleado asignado
    const invalid = mappings.filter(m => !m.employeeId)
    if (invalid.length > 0) {
      alert(`Hay ${invalid.length} archivo(s) sin empleado asignado`)
      return
    }

    setIsUploading(true)
    setStep('sending')

    try {
      const formData = new FormData()
      
      mappings.forEach((mapping, index) => {
        formData.append('files', mapping.file)
        formData.append(`employeeIds`, mapping.employeeId)
      })
      
      formData.append('period', period)
      formData.append('companyId', companyId)

      const response = await fetch('/api/receipts/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: data.uploaded,
          errors: data.errors || []
        })
      } else {
        throw new Error(data.error || 'Error al subir los recibos')
      }
    } catch (error) {
      alert('Error al subir los recibos: ' + (error as Error).message)
      setStep('mapping')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendAll = async () => {
    try {
      const response = await fetch('/api/receipts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
      })

      if (response.ok) {
        alert('¡Recibos enviados exitosamente!')
        router.push('/admin')
      } else {
        throw new Error('Error al enviar')
      }
    } catch (error) {
      alert('Error al enviar los recibos')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Volver al panel
          </Link>
        </div>

        {/* Step Upload */}
        {step === 'upload' && (
          <Card>
            <CardHeader>
              <CardTitle>Subir Recibos de Sueldo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período (mes/año)
                </label>
                <Input
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ejemplo: Noviembre 2024 → 2024-11
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos PDF
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Seleccionar archivos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    o arrastra los archivos aquí
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">{files.length} archivo(s) seleccionado(s)</h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <FileText size={20} className="text-blue-600 mr-2" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={handleNext}
                  disabled={files.length === 0 || !period}
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Mapping */}
        {step === 'mapping' && (
          <Card>
            <CardHeader>
              <CardTitle>Asignar Empleados</CardTitle>
              <p className="text-sm text-gray-600">
                Verifica que cada recibo esté asignado al empleado correcto
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mappings.map((mapping, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FileText size={24} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{mapping.file.name}</p>
                    </div>
                    <select
                      value={mapping.employeeId}
                      onChange={(e) => updateMapping(index, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar empleado...</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.username})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setStep('upload')}>
                  Atrás
                </Button>
                <Button onClick={handleSubmit} disabled={isUploading}>
                  {isUploading ? 'Subiendo...' : `Subir ${files.length} recibo(s)`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Result */}
        {step === 'sending' && result && (
          <Card>
            <CardHeader>
              <CardTitle>Recibos Subidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {result.success} recibo(s) subido(s) correctamente
                </h3>
                {result.errors.length > 0 && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle size={20} className="text-yellow-600 mt-0.5 mr-2" />
                      <div className="text-left">
                        <h4 className="font-medium text-yellow-800">Algunos archivos tuvieron errores:</h4>
                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                          {result.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  ¿Quieres enviar estos recibos ahora?
                </h4>
                <p className="text-sm text-blue-700 mb-4">
                  Se enviará una notificación por email a cada empleado para que firme su recibo.
                </p>
                <div className="flex space-x-4">
                  <Button onClick={handleSendAll}>
                    Enviar todos ahora
                  </Button>
                  <Button variant="secondary" onClick={() => router.push('/admin')}>
                    Enviar más tarde
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
