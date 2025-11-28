'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { loginUser } from '@/lib/users'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // SIN async, SIN await, SIN fetch - SOLO localStorage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const user = loginUser(formData.username, formData.password)

    if (user) {
      // Redirigir según el rol
      if (user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/employee')
      }
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Sistema de Recibos de Sueldo
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Ingresa con tu usuario y contraseña
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <Input
              label="Usuario"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="usuario"
              required
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
            
            <Button 
              type="submit" 
              className="w-full"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
