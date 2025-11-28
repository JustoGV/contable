'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, CheckCircle, XCircle, Plus, Edit, Trash2, X } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  position: string
  hireDate: string
  status: 'active' | 'inactive'
  totalReceipts: number
  signedReceipts: number
}

export default function EmployeesPage() {
  // Empleados hardcodeados iniciales
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'emp-001',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      position: 'Desarrollador Senior',
      hireDate: '2020-03-15',
      status: 'active',
      totalReceipts: 48,
      signedReceipts: 45
    },
    {
      id: 'emp-002',
      name: 'María García',
      email: 'maria.garcia@example.com',
      position: 'Diseñadora UX/UI',
      hireDate: '2021-06-01',
      status: 'active',
      totalReceipts: 36,
      signedReceipts: 36
    },
    {
      id: 'emp-003',
      name: 'Carlos López',
      email: 'carlos.lopez@example.com',
      position: 'Project Manager',
      hireDate: '2019-11-20',
      status: 'active',
      totalReceipts: 60,
      signedReceipts: 58
    },
    {
      id: 'emp-004',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      position: 'Backend Developer',
      hireDate: '2022-01-10',
      status: 'active',
      totalReceipts: 24,
      signedReceipts: 24
    },
    {
      id: 'emp-005',
      name: 'Pedro Rodríguez',
      email: 'pedro.rodriguez@example.com',
      position: 'DevOps Engineer',
      hireDate: '2021-09-15',
      status: 'active',
      totalReceipts: 30,
      signedReceipts: 29
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    hireDate: '',
    status: 'active' as 'active' | 'inactive'
  })

  const openAddModal = () => {
    setEditingEmployee(null)
    setFormData({
      name: '',
      email: '',
      position: '',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active'
    })
    setShowModal(true)
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      hireDate: employee.hireDate,
      status: employee.status
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEmployee) {
      // Editar empleado existente
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData }
          : emp
      ))
    } else {
      // Agregar nuevo empleado
      const newEmployee: Employee = {
        id: `emp-${String(employees.length + 1).padStart(3, '0')}`,
        ...formData,
        totalReceipts: 0,
        signedReceipts: 0
      }
      setEmployees([...employees, newEmployee])
    }
    
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      setEmployees(employees.filter(emp => emp.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ))
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Estudio Contable Demo</span>
              </div>
              <Button onClick={openAddModal} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Empleado
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Total de empleados: <span className="font-bold text-gray-900">{employees.length}</span>
            {' '}• Activos: <span className="font-bold text-green-600">{employees.filter(e => e.status === 'active').length}</span>
          </p>
        </div>

        <div className="grid gap-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{employee.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Ingreso: {new Date(employee.hireDate).toLocaleDateString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-600">
                        Recibos firmados: <span className="font-semibold">{employee.signedReceipts}/{employee.totalReceipts}</span>
                      </p>
                      {employee.totalReceipts > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(employee.signedReceipts / employee.totalReceipts) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleStatus(employee.id)}
                      className="ml-4"
                    >
                      {employee.status === 'active' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 cursor-pointer hover:text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditModal(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Modal para agregar/editar empleado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEmployee ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Nombre Completo"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Juan Pérez"
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan.perez@example.com"
                required
              />
              
              <Input
                label="Puesto"
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Ej: Desarrollador Senior"
                required
              />
              
              <Input
                label="Fecha de Ingreso"
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingEmployee ? 'Guardar Cambios' : 'Agregar Empleado'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
