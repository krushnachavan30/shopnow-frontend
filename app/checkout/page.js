'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import API from '../../lib/axios'

export default function Checkout() {
  const { user } = useAuth()
  const router = useRouter()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetchCart()
    loadRazorpay()
  }, [user])

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart')
      setCart(res.data)
      if (res.data.items.length === 0) router.push('/cart')
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Razorpay script load karo
  const loadRazorpay = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
  }

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handlePayment = async () => {
    // Validation
    if (!address.street || !address.city || !address.state || !address.pincode) {
      alert('Sabhi address fields fill karo')
      return
    }

    setPaymentLoading(true)

    try {
      // Step 1 — Backend se Razorpay order lo
      const res = await API.post('/orders/create-razorpay-order', { shippingAddress: address })

      const { razorpayOrderId, amount, keyId } = res.data

      // Step 2 — Razorpay popup kholo
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'ShopNow',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async (response) => {
          // Step 3 — Payment successful — verify karo
          try {
            const verifyRes = await API.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: address
            })

            // Order placed!
            router.push('/orders')

          } catch (err) {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#0ea5e9'
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
      setPaymentLoading(false)
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
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Address Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-white font-semibold text-xl mb-6">
              📍 Shipping Address
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-sm font-medium mb-2 block">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main Street"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm font-medium mb-2 block">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="Pune"
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-medium mb-2 block">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="Maharashtra"
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium mb-2 block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  placeholder="411001"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="flex flex-col gap-6">

            {/* Items */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-xl mb-4">Order Items</h2>
              <div className="flex flex-col gap-3">
                {cart.items.map(item => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.product.name}</p>
                      <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total + Pay */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{cart.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Delivery</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-bold text-xl">
                  <span>Total</span>
                  <span>₹{cart.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition text-base disabled:opacity-50"
              >
                {paymentLoading ? 'Processing...' : `Pay ₹${cart.total.toLocaleString('en-IN')}`}
              </button>

              <p className="text-center text-slate-500 text-xs mt-3">
                🔒 Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}