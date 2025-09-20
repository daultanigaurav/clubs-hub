'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Signing you out...
        </h2>
        <p className="text-gray-600">
          You will be redirected to the home page shortly.
        </p>
      </div>
    </div>
  )
}

