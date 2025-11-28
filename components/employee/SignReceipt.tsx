'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react'

interface Receipt {
  id: string
  period: string
  fileName: string
  filePath: string
  status: string
  signature: {
    signedAt: Date
    ipAddress: string
  } | null
  employee: {
    name: string
    email: string
  }
}

interface SignReceiptProps {
  receipt: Receipt
  userId: string
}

export default function SignReceipt({ receipt, userId }: SignReceiptProps) {
  const router = useRouter()
  const [isSigning, setIsSigning] = useState(false)
  const [showSignModal, setShowSignModal] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [signatureMethod, setSignatureMethod] = useState<'draw' | 'upload'>('draw')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        setContext(ctx)
      }
    }
  }, [showSignModal])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return
    setIsDrawing(true)
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY
    
    context.beginPath()
    context.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY
    
    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (context) {
      context.closePath()
    }
  }

  const clearSignature = () => {
    if (!context || !canvasRef.current) return
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setSignatureData(null)
  }

  const saveSignature = () => {
    if (!canvasRef.current) return
    const dataURL = canvasRef.current.toDataURL('image/png')
    setSignatureData(dataURL)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona una imagen válida')
      return
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // Dibujar imagen en el canvas
        if (!canvasRef.current || !context) return
        
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        
        // Calcular dimensiones para ajustar al canvas
        const maxWidth = canvasRef.current.width
        const maxHeight = canvasRef.current.height
        let width = img.width
        let height = img.height
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        const x = (canvasRef.current.width - width) / 2
        const y = (canvasRef.current.height - height) / 2
        
        context.drawImage(img, x, y, width, height)
        
        // Guardar imagen
        const dataURL = canvasRef.current.toDataURL('image/png')
        setSignatureData(dataURL)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // SIN async, SIN await, SIN fetch - SOLO simulación
  const handleSign = () => {
    if (!signatureData) {
      alert('Por favor, dibuja tu firma primero')
      return
    }

    setIsSigning(true)

    // Simular firma (sin fetch)
    setTimeout(() => {
      setShowSignModal(false)
      setIsSigning(false)
      alert('¡Recibo firmado exitosamente!')
      router.push('/employee?signed=true')
    }, 1000)
  }

  const alreadySigned = receipt.status === 'SIGNED'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/employee" className="text-blue-600 hover:underline inline-flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Volver a mis recibos
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recibo de Sueldo - {receipt.period}</span>
              {alreadySigned && (
                <span className="text-green-600 text-base font-normal inline-flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  Firmado
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Empleado</p>
                <p className="text-base text-gray-900">{receipt.employee.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-base text-gray-900">{receipt.employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Período</p>
                <p className="text-base text-gray-900">{receipt.period}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Archivo</p>
                <p className="text-base text-gray-900">{receipt.fileName}</p>
              </div>
            </div>

            {alreadySigned && receipt.signature && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Información de la Firma</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-green-800">Fecha:</span>{' '}
                    <span className="text-green-700">
                      {new Date(receipt.signature.signedAt).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">IP:</span>{' '}
                    <span className="text-green-700">{receipt.signature.ipAddress}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PDF Viewer */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4">
              <iframe
                src={receipt.filePath}
                className="w-full h-[600px] border-0 rounded"
                title="Recibo de Sueldo"
              />
            </div>
            <div className="mt-4 text-center">
              <a 
                href={`/api/receipts/${receipt.id}/download`}
                download
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                <FileText size={16} className="mr-1" />
                Descargar PDF
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Sign Actions */}
        {!alreadySigned && (
          <Card>
            <CardContent className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ⚖️ Validez Legal de la Firma Electrónica
                </h3>
                <p className="text-sm text-blue-800">
                  Al firmar este documento electrónicamente, estás confirmando que has recibido y 
                  revisado tu recibo de sueldo. Esta firma tiene la misma validez legal que una firma 
                  manuscrita según la ley vigente. Se registrará la fecha, hora, dirección IP y otros 
                  datos para garantizar la autenticidad.
                </p>
              </div>

              <Button 
                onClick={() => setShowSignModal(true)}
                className="w-full"
                size="lg"
              >
                Firmar Recibo Electrónicamente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Firma */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>Firmar documento</span>
                <button 
                  onClick={() => setShowSignModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {/* Selector de método */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de firma
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSignatureMethod('draw')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      signatureMethod === 'draw'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    ✍️ Dibujar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMethod('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      signatureMethod === 'upload'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    📤 Subir imagen
                  </button>
                </div>
              </div>

              {/* Canvas para dibujar o mostrar imagen */}
              {signatureMethod === 'draw' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dibuja tu firma
                  </label>
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Usa el mouse o tu dedo para firmar
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sube una imagen de tu firma
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-2 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📁 Seleccionar imagen
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Formatos: JPG, PNG, GIF (máx. 2MB)
                    </p>
                  </div>
                </div>
              )}

              {signatureData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-800">
                    ✓ Firma capturada correctamente
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowSignModal(false)}
                  disabled={isSigning}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    saveSignature()
                    handleSign()
                  }}
                  disabled={isSigning}
                >
                  {isSigning ? 'Firmando...' : 'Confirmar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
