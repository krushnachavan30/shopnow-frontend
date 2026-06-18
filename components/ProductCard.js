'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import API from '../lib/axios'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const addToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setAdding(true)
    try {
      await API.post('/cart/add', {
        productId: product._id,
        quantity: 1
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.log(err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition group">

      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-sky-400 font-medium uppercase tracking-wider mb-1 capitalize">
          {product.category}
        </p>
        <h3 className="text-white font-semibold text-base mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-slate-400 text-xs mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-white font-bold text-lg">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <p className="text-slate-500 text-xs">
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </p>
        </div>

        <button
          onClick={addToCart}
          disabled={adding || product.stock === 0}
          className={`w-full mt-4 py-3 rounded-xl text-sm font-semibold transition ${
            added
              ? 'bg-green-500 text-white'
              : product.stock === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
        >
          {added ? '✓ Added to Cart' : adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}