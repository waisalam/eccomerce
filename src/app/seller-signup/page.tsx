'use client'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'


export default function Page() {
    const steps = ['sendOtp', 'verifyOtp', 'createAccount'] as const
    const [currentStep, setCurrentStep] = useState<typeof steps[number]>('sendOtp')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        code: '',
    })

    const handleSendOtp = async () => {
        setLoading(true)
        setMessage('')
        try {
            const res = await axios.post('/api/seller/sendotp', { email: form.email })
            if (res.status === 201) {
                setCurrentStep('verifyOtp')
                setMessage('OTP sent to your email!')
            } else {
                setMessage('Failed to send OTP')
            }
        } catch (err: any) {
            console.error(err)
            if (err.response?.status === 409) {
                // ✅ User already verified → skip OTP and move to create account
                setCurrentStep('createAccount')
                setMessage('Email already verified! Please set your password to complete your account.')
            } else {
                setMessage(err.response?.data || 'Error sending OTP')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        setMessage('')
        try {
            const res = await axios.post('/api/seller/verifyotp', { email: form.email, code: form.code })
            if (res.status === 200) {
                setCurrentStep('createAccount')
                setMessage('OTP verified! Now set your password.')
            } else {
                setMessage('Invalid OTP')
            }
        } catch (err: any) {
            console.error(err)
            const status = err.response?.status
            if (status === 400 || status === 401 || status === 404) {
                // ✅ Already verified or similar → move to createAccount
                setCurrentStep('createAccount')
                setMessage('User already verified. Please set your password.')
            } else {
                setMessage(err.response?.data || 'Error verifying OTP')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        setLoading(true)
        setMessage('')
        try {
            const res = await axios.post('/api/seller/creatSeller', { name: form.name, email: form.email, password: form.password })
            if (res.status === 201) {
                setMessage('Account created successfully!')
                const data = res.data
                localStorage.setItem('token', data.token)

                router.push('/sellerDashboard')
            } else {
                setMessage('Failed to create account')
            }
        } catch (err: any) {
            console.error(err)
            setMessage(err.response?.data || 'Error creating account')
        } finally {
            setLoading(false)
        }
    }

    const handleSkipOtpAndCreateAccount = () => {
        // This will directly skip the OTP step and move to create account
        setCurrentStep('createAccount')
        setMessage('Email already verified! Please set your password.')
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Seller Signup</CardTitle>
                    <CardDescription className="text-center text-gray-500">
                        {currentStep === 'sendOtp' && 'Enter your email to receive OTP'}
                        {currentStep === 'verifyOtp' && 'Enter the OTP sent to your email'}
                        {currentStep === 'createAccount' && 'Create your seller account'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {message && <p className="text-center text-sm text-red-500">{message}</p>}

                    {currentStep === 'sendOtp' && (
                        <>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <Button onClick={handleSendOtp} disabled={loading} className="w-full">
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>

                            {/* Add this button to skip OTP and directly go to Create Account */}
                            <Button onClick={handleSkipOtpAndCreateAccount} disabled={loading} className="w-full mt-4" variant="secondary">
                                Already Verified? Go to Create Account
                            </Button>
                        </>
                    )}

                    {currentStep === 'verifyOtp' && (
                        <>
                            <Label>Verification Code</Label>
                            <Input
                                type="text"
                                placeholder="Enter OTP"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                            />
                            <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                        </>
                    )}

                    {currentStep === 'createAccount' && (
                        <>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={form.email}
                                disabled // disable editing email once verified
                            />
                            <Label>Name</Label>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <Label>Password</Label>
                            <Input
                                type="password"
                                placeholder="Create Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <Button onClick={handleRegister} disabled={loading} className="w-full">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </>
                    )}



                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/sellerlogin" className="text-blue-500 underline">
                            Login here
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
