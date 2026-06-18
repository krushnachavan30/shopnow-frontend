'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #0a4a5c 100%)' }}
      className="px-8 py-4 flex justify-between items-center border-b border-white/10">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">🛍</span>
        </div>
        <span className="text-white font-bold text-xl">ShopNow</span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link href="/products" className="text-slate-300 hover:text-white transition text-sm">
          Products
        </Link>

        {user ? (
          <>
            <Link href="/cart" className="text-slate-300 hover:text-white transition text-sm">
              🛒 Cart
            </Link>
            <Link href="/orders" className="text-slate-300 hover:text-white transition text-sm">
              Orders
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="text-sky-400 hover:text-sky-300 transition text-sm font-medium">
                Admin
              </Link>
            )}
            <div className="flex items-center gap-3">
              <span className="text-slate-300 text-sm">{user.name}</span>
              <button
                onClick={logout}
                className="border border-slate-600 hover:border-red-500/50 hover:text-red-400 text-slate-300 px-4 py-2 rounded-full text-sm transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-slate-300 hover:text-white transition text-sm">
              Login
            </Link>
            <Link href="/register"
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm font-medium transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}