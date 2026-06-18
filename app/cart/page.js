'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import API from '../../lib/axios'

export default function Cart() {
  const { user } = useAuth()
  const router = useRouter()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart')
      setCart(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await API.put('/cart/update', { productId, quantity })
      setCart(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const removeItem = async (productId) => {
    try {
      const res = await API.delete(`/cart/remove/${productId}`)
      setCart(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">🛒 Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-slate-300 text-xl font-medium">Cart khali hai</p>
            <p className="text-slate-500 text-sm mt-2 mb-6">Kuch products add karo</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-medium transition"
            >
              Products dekho
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.items.map(item => (
                <div key={item._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-5 items-start">

                  {/* Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base">{item.product.name}</h3>
                    <p className="text-sky-400 font-bold text-lg mt-1">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-white font-bold text-lg">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-slate-500 hover:text-red-400 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
              <h2 className="text-white font-semibold text-xl mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Items ({cart.items.length})</span>
                  <span>₹{cart.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Delivery</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{cart.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition text-base"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full mt-3 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white font-medium py-3 rounded-xl transition text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}