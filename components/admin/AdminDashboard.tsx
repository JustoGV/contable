'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Upload, 
  CheckCircle, 
  Clock, 
  Send,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface AdminDashboardProps {
  user: {
    name?: string | null
    email?: string | null
    companyName?: string
  }
  stats: {
    totalReceipts: number
    pending: number
    sent: number
    signed: number
    totalEmployees: number
  }
  recentReceipts: Array<{
    id: string
    period: string
    status: string
    createdAt: Date
    employee: {
      name: string
      email: string
    }
  }>
}

export default function AdminDashboard({ user, stats, recentReceipts }: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const statCards = [
    {
      title: 'Total Recibos',
      value: stats.totalReceipts,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Enviados',
      value: stats.sent,
      icon: Send,
      color: 'bg-purple-500'
    },
    {
      title: 'Firmados',
      value: stats.signed,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Empleados',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-indigo-500'
    }
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SENT: 'bg-purple-100 text-purple-800',
      SIGNED: 'bg-green-100 text-green-800'
    }
    const labels = {
      PENDING: 'Pendiente',
      SENT: 'Enviado',
      SIGNED: 'Firmado'
    }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.companyName}</p>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/distribute">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Send size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Distribuir</h3>
                    <p className="text-sm text-gray-600">Envío automático</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/upload">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Upload size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Subir Recibos</h3>
                    <p className="text-sm text-gray-600">Carga manual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/employees">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-500 p-3 rounded-lg">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Empleados</h3>
                    <p className="text-sm text-gray-600">Gestionar nómina</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/receipts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ver Recibos</h3>
                    <p className="text-sm text-gray-600">Historial completo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Receipts */}
        <Card>
          <CardHeader>
            <CardTitle>Recibos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Empleado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Período</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No hay recibos todavía. <Link href="/admin/upload" className="text-blue-600 hover:underline">Sube tu primer lote</Link>
                      </td>
                    </tr>
                  ) : (
                    recentReceipts.map((receipt) => (
                      <tr key={receipt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{receipt.employee.name}</p>
                            <p className="text-sm text-gray-500">{receipt.employee.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{receipt.period}</td>
                        <td className="py-3 px-4">{getStatusBadge(receipt.status)}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(receipt.createdAt).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
