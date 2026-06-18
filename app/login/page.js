'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(formData.email, formData.password)
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/products')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #0a4a5c 100%)' }}>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🛍</span>
          </div>
          <span className="text-white font-bold text-2xl">ShopNow</span>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Sign in to your account
        </h1>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              className="w-full bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-400 rounded-full px-6 py-4 text-base outline-none focus:border-sky-500 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                className="w-full bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-400 rounded-full px-6 py-4 text-base outline-none focus:border-sky-500 transition pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? '👁' : '🙈'}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-full text-base transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Account nahi hai?{' '}
            <Link href="/register" className="text-sky-400 hover:text-sky-300 font-medium">
              Register karo
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}