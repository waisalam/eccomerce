'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await axios.post('/api/seller/login', form)
      if (res.status === 201) {
        setMessage('Login successful!')
        const data = res.data
        localStorage.setItem('token', data.token)
        router.push('/sellerDashboard') // Redirect after successful login
      } else {
        setMessage('Invalid credentials')
      }
    } catch (err: any) {
      console.error(err)
      setMessage(err.response?.data || 'Error logging in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Seller Login</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <p className="text-center text-sm text-red-500">{message}</p>}

          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/seller-signup" className="text-blue-500 underline">
              Signup here
            </Link>
          </p>

        </CardContent>
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full"
        >
          Go to Home
        </Button>

      </Card>
    </main>
  )
}
