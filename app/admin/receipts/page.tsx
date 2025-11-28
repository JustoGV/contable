'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, FileText, User, Calendar, Download, CheckCircle, Clock, Send, ChevronDown, ChevronRight, Folder } from "lucide-react"

export default function ReceiptsPage() {
  const router = useRouter()
  const [expandedPeriods, setExpandedPeriods] = useState<string[]>(['2024-11'])
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga de sesión
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const togglePeriod = (period: string) => {
    setExpandedPeriods(prev => 
      prev.includes(period) 
        ? prev.filter(p => p !== period)
        : [...prev, period]
    )
  }

  // Recibos hardcodeados
  const allReceipts = [
    {
      id: 'rec-001',
      period: '2024-11',
      status: 'SIGNED',
      fileName: 'recibo_noviembre_2024.pdf',
      fileSize: 245678,
      createdAt: new Date('2024-11-25T10:00:00'),
      sentAt: new Date('2024-11-25T10:30:00'),
      employee: {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com'
      },
      signature: {
        signedAt: new Date('2024-11-26T14:20:00')
      }
    },
    {
      id: 'rec-002',
      period: '2024-11',
      status: 'SENT',
      fileName: 'recibo_noviembre_2024.pdf',
      fileSize: 234567,
      createdAt: new Date('2024-11-25T10:00:00'),
      sentAt: new Date('2024-11-25T10:30:00'),
      employee: {
        name: 'María García',
        email: 'maria.garcia@example.com'
      },
      signature: null
    },
    {
      id: 'rec-003',
      period: '2024-11',
      status: 'SIGNED',
      fileName: 'recibo_noviembre_2024.pdf',
      fileSize: 256789,
      createdAt: new Date('2024-11-24T10:00:00'),
      sentAt: new Date('2024-11-24T11:00:00'),
      employee: {
        name: 'Carlos López',
        email: 'carlos.lopez@example.com'
      },
      signature: {
        signedAt: new Date('2024-11-24T15:30:00')
      }
    },
    {
      id: 'rec-004',
      period: '2024-10',
      status: 'SIGNED',
      fileName: 'recibo_octubre_2024.pdf',
      fileSize: 245123,
      createdAt: new Date('2024-10-25T10:00:00'),
      sentAt: new Date('2024-10-25T10:30:00'),
      employee: {
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com'
      },
      signature: {
        signedAt: new Date('2024-10-26T09:15:00')
      }
    },
    {
      id: 'rec-005',
      period: '2024-10',
      status: 'SIGNED',
      fileName: 'recibo_octubre_2024.pdf',
      fileSize: 248901,
      createdAt: new Date('2024-10-25T10:00:00'),
      sentAt: new Date('2024-10-25T10:30:00'),
      employee: {
        name: 'Pedro Rodríguez',
        email: 'pedro.rodriguez@example.com'
      },
      signature: {
        signedAt: new Date('2024-10-25T16:45:00')
      }
    },
    {
      id: 'rec-006',
      period: '2024-10',
      status: 'PENDING',
      fileName: 'recibo_octubre_2024.pdf',
      fileSize: 243456,
      createdAt: new Date('2024-10-25T10:00:00'),
      sentAt: null,
      employee: {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com'
      },
      signature: null
    },
    {
      id: 'rec-007',
      period: '2024-09',
      status: 'SIGNED',
      fileName: 'recibo_septiembre_2024.pdf',
      fileSize: 241234,
      createdAt: new Date('2024-09-25T10:00:00'),
      sentAt: new Date('2024-09-25T10:30:00'),
      employee: {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com'
      },
      signature: {
        signedAt: new Date('2024-09-26T11:30:00')
      }
    },
    {
      id: 'rec-008',
      period: '2024-09',
      status: 'SIGNED',
      fileName: 'recibo_septiembre_2024.pdf',
      fileSize: 239876,
      createdAt: new Date('2024-09-25T10:00:00'),
      sentAt: new Date('2024-09-25T10:30:00'),
      employee: {
        name: 'María García',
        email: 'maria.garcia@example.com'
      },
      signature: {
        signedAt: new Date('2024-09-25T14:20:00')
      }
    }
  ]

  // Agrupar recibos por período
  const receiptsByPeriod = allReceipts.reduce((acc, receipt) => {
    if (!acc[receipt.period]) {
      acc[receipt.period] = []
    }
    acc[receipt.period].push(receipt)
    return acc
  }, {} as Record<string, typeof allReceipts>)

  // Ordenar períodos de más reciente a más antiguo
  const sortedPeriods = Object.keys(receiptsByPeriod).sort((a, b) => b.localeCompare(a))

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Firmado
          </span>
        )
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Send className="h-3 w-3" />
            Enviado
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3" />
            Pendiente
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Todos los Recibos</h1>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Estudio Contable Demo</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Total de recibos: <span className="font-bold text-gray-900">{allReceipts.length}</span>
            {' '}• Períodos: <span className="font-bold text-gray-900">{sortedPeriods.length}</span>
          </p>
        </div>

        <div className="space-y-4">
          {sortedPeriods.map((period) => {
            const periodReceipts = receiptsByPeriod[period]
            const isExpanded = expandedPeriods.includes(period)
            const [year, month] = period.split('-')
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
            
            // Estadísticas del período
            const stats = {
              total: periodReceipts.length,
              signed: periodReceipts.filter(r => r.status === 'SIGNED').length,
              sent: periodReceipts.filter(r => r.status === 'SENT').length,
              pending: periodReceipts.filter(r => r.status === 'PENDING').length
            }

            return (
              <div key={period} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header de la carpeta/período */}
                <div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  onClick={() => togglePeriod(period)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-blue-600" />
                      )}
                      <Folder className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg capitalize">
                          {monthName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {stats.total} recibos
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {stats.signed} firmados
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {stats.sent} enviados
                        </span>
                        {stats.pending > 0 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                            {stats.pending} pendientes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido expandible */}
                {isExpanded && (
                  <div className="bg-white p-4 space-y-3">
                    {periodReceipts.map((receipt) => (
                      <Card key={receipt.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{receipt.fileName}</p>
                                <p className="text-xs text-gray-500">{formatBytes(receipt.fileSize)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{receipt.employee.name}</p>
                                <p className="text-xs text-gray-500">{receipt.employee.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-gray-600">
                                  Creado: {receipt.createdAt.toLocaleDateString('es-AR')}
                                </p>
                                {receipt.sentAt && (
                                  <p className="text-xs text-gray-500">
                                    Enviado: {receipt.sentAt.toLocaleDateString('es-AR')}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              {getStatusBadge(receipt.status)}
                              {receipt.signature && (
                                <p className="text-xs text-gray-500">
                                  Firmado: {receipt.signature.signedAt.toLocaleDateString('es-AR')}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
