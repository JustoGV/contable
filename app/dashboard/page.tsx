'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/users'

// SIN async, SIN await - SOLO localStorage
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Redirigir según rol
    if (user.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/employee')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirigiendo...</p>
    </div>
  )
}
