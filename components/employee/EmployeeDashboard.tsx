'use client'

import { signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, CheckCircle, Clock, LogOut, Download } from 'lucide-react'

interface Receipt {
  id: string
  period: string
  status: string
  fileName: string
  filePath: string
  createdAt: Date
  sentAt: Date | null
  signature: {
    signedAt: Date
  } | null
}

interface EmployeeDashboardProps {
  user: {
    name?: string | null
    email?: string | null
  }
  receipts: Receipt[]
}

export default function EmployeeDashboard({ user, receipts }: EmployeeDashboardProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' },
      SENT: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Por Firmar' },
      SIGNED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Firmado' }
    }
    const badge = badges[status as keyof typeof badges] || badges.PENDING
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${badge.color}`}>
        <Icon size={14} className="mr-1" />
        {badge.label}
      </span>
    )
  }

  const pendingReceipts = receipts.filter(r => r.status === 'SENT')
  const signedReceipts = receipts.filter(r => r.status === 'SIGNED')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Mis Recibos de Sueldo
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut size={18} className="mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Recibos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{receipts.length}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{pendingReceipts.length}</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Clock size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Firmados</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{signedReceipts.length}</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recibos Pendientes */}
        {pendingReceipts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock size={20} className="mr-2 text-yellow-600" />
                Recibos Pendientes de Firma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReceipts.map(receipt => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText size={32} className="text-yellow-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{receipt.fileName}</h4>
                        <p className="text-sm text-gray-600">Período: {receipt.period}</p>
                      </div>
                    </div>
                    <Link href={`/employee/receipts/${receipt.id}`}>
                      <Button>
                        Ver y Firmar
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todos los Recibos */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Recibos</CardTitle>
          </CardHeader>
          <CardContent>
            {receipts.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tienes recibos todavía</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Período</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Archivo</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.map(receipt => (
                      <tr key={receipt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{receipt.period}</td>
                        <td className="py-3 px-4 text-gray-700">{receipt.fileName}</td>
                        <td className="py-3 px-4">{getStatusBadge(receipt.status)}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {receipt.signature 
                            ? new Date(receipt.signature.signedAt).toLocaleDateString('es-AR')
                            : new Date(receipt.createdAt).toLocaleDateString('es-AR')
                          }
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {receipt.status === 'SENT' && (
                              <Link href={`/employee/receipts/${receipt.id}`}>
                                <Button size="sm">Firmar</Button>
                              </Link>
                            )}
                            {receipt.status === 'SIGNED' && (
                              <a href={`/api/receipts/${receipt.id}/download`} download>
                                <Button size="sm" variant="secondary">
                                  <Download size={16} className="mr-1" />
                                  Descargar
                                </Button>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
