'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, Users, CheckCircle } from "lucide-react"

export default function DistributePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [employeesFound, setEmployeesFound] = useState(0)

  const months = [
    { value: '2024-11', label: 'Noviembre 2024' },
    { value: '2024-10', label: 'Octubre 2024' },
    { value: '2024-09', label: 'Septiembre 2024' },
    { value: '2024-08', label: 'Agosto 2024' },
  ]

  const categories = [
    { value: 'todos', label: 'Todos los empleados' },
    { value: 'administrativos', label: 'Administrativos' },
    { value: 'operarios', label: 'Operarios' },
    { value: 'gerentes', label: 'Gerentes' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'ventas', label: 'Ventas' },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles(files)
    }
  }

  const handleContinue = () => {
    if (step === 1 && selectedPeriod && selectedCategory) {
      setStep(2)
    } else if (step === 2 && uploadedFiles.length > 0) {
      setAnalyzing(true)
      // Simular análisis
      setTimeout(() => {
        setEmployeesFound(uploadedFiles.length)
        setAnalyzing(false)
        setStep(3)
      }, 2000)
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleDistribute = () => {
    // Simular distribución
    setTimeout(() => {
      router.push('/admin/receipts')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/admin">
            <button className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-xl font-semibold">Recibos digitales</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Step 1: Seleccionar período */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Seleccionar período</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría de empleados
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mensaje opcional para los empleados..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[100px]"
                  />
                </div>

                <div className="text-center text-gray-600 py-4">
                  recibos <span className="font-semibold">de sueldo a</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinatarios
                  </label>
                  <input
                    type="text"
                    value="CUIL"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <Button 
                  onClick={handleContinue}
                  disabled={!selectedPeriod || !selectedCategory}
                  className="w-full py-3 text-lg"
                >
                  Adjuntar
                </Button>

                <div className="flex items-center gap-2 text-blue-600">
                  <input type="checkbox" id="firma" className="w-4 h-4" />
                  <label htmlFor="firma" className="text-sm">
                    Solicitar firma electrónica
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Subir documentos */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Documentos</h2>
                
                {uploadedFiles.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Arrastra los PDFs aquí o</p>
                    <label className="cursor-pointer">
                      <span className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block">
                        Seleccionar archivos
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-8 w-8 text-red-500" />
                        <span className="flex-1 text-gray-900">{file.name}</span>
                      </div>
                    ))}
                    
                    <label className="cursor-pointer block text-center py-3 text-blue-600 hover:text-blue-700">
                      + Agregar más archivos
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <Button onClick={handleContinue} className="w-full py-3 text-lg">
                    Continuar
                  </Button>
                )}
              </div>
            )}

            {/* Step 3: Análisis del documento */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Análisis del documento</h2>
                
                {analyzing ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analizando documentos...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {Array.from({ length: Math.min(6, employeesFound) }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center py-4">
                      <p className="text-gray-700">
                        de <span className="text-2xl font-bold text-gray-900">{employeesFound}</span> personas.
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total de colaboradores encontrados: {employeesFound}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Firma empresa
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                        <option>Firma predeterminada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        placeholder="••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>

                    <Button onClick={handleContinue} className="w-full py-3 text-lg">
                      Distribuir documento
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Confirmación */}
            {step === 4 && (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Distribución completada!</h2>
                <p className="text-gray-600 mb-6">
                  Se han enviado {employeesFound} recibos a los empleados
                </p>
                <Button onClick={handleDistribute} className="px-8 py-3">
                  Ver recibos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
