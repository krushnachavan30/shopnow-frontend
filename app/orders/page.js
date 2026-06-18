'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import API from '../../lib/axios'

export default function Orders() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders')
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-500/20 text-yellow-400'
      case 'shipped': return 'bg-blue-500/20 text-blue-400'
      case 'delivered': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-500/20 text-slate-400'
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

      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-slate-300 text-xl font-medium">Koi order nahi hai</p>
            <p className="text-slate-500 text-sm mt-2 mb-6">Pehla order karo!</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-medium transition"
            >
              Shopping karo
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div key={order._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                {/* Order Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Order ID</p>
                    <p className="text-white font-mono text-sm">{order._id}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      {order.paymentInfo.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex flex-col gap-3 mb-5">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{item.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs">Shipping to</p>
                    <p className="text-white text-sm mt-0.5">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Total</p>
                    <p className="text-white font-bold text-xl">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}