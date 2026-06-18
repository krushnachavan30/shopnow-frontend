'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import API from '../../lib/axios'

export default function Admin() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Product form
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'electronics', stock: ''
  })
  const [image, setImage] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (user.role !== 'admin') { router.push('/products'); return }
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/products'),
        API.get('/admin/orders')
      ])
      setStats(statsRes.data)
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreateProduct = async () => {
    if (!form.name || !form.description || !form.price || !form.stock || !image) {
      setFormMessage('Sabhi fields aur image required hai')
      return
    }

    setFormLoading(true)
    setFormMessage('')

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('category', form.category)
      formData.append('stock', form.stock)
      formData.append('image', image)

      await API.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setFormMessage('Product create ho gaya!')
      setForm({ name: '', description: '', price: '', category: 'electronics', stock: '' })
      setImage(null)
      fetchAll()

    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Error hua')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Product delete karna chahte ho?')) return
    try {
      await API.delete(`/admin/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { orderStatus: status })
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, orderStatus: status } : o
      ))
    } catch (err) {
      console.log(err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-yellow-400'
      case 'shipped': return 'text-blue-400'
      case 'delivered': return 'text-green-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-slate-400'
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

      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {['dashboard', 'products', 'add-product', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Products', value: stats.totalProducts, icon: '📦' },
              { label: 'Total Orders', value: stats.totalOrders, icon: '🛒' },
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-white font-bold text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <div key={product._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">{product.name}</p>
                  <p className="text-slate-400 text-sm capitalize">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className="text-slate-400 text-sm">Stock: {product.stock}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-white font-semibold text-xl mb-6">New Product Add Karo</h2>

            {formMessage && (
              <div className={`px-4 py-3 rounded-xl text-sm mb-5 ${
                formMessage.includes('ho gaya')
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {formMessage}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Product name"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Product description"
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="Price"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
                />
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleFormChange}
                  placeholder="Stock"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
                />
              </div>
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
              >
                {['electronics', 'clothing', 'books', 'home', 'sports', 'other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {image ? (
                    <p className="text-green-400 text-sm">✓ {image.name}</p>
                  ) : (
                    <div>
                      <p className="text-4xl mb-2">📸</p>
                      <p className="text-slate-400 text-sm">Click to upload image</p>
                    </div>
                  )}
                </label>
              </div>
              <button
                onClick={handleCreateProduct}
                disabled={formLoading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50"
              >
                {formLoading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-mono text-sm">{order._id}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {order.user?.name} — {order.user?.email}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <p className="text-white font-bold text-lg">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Items */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {order.items.map((item, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>

                {/* Status Update */}
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <select
                    value={order.orderStatus}
                    onChange={e => handleUpdateOrderStatus(order._id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500 transition"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}