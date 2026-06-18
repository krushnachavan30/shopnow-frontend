'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import ProductCard from '../../components/ProductCard'
import API from '../../lib/axios'

export default function Products() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')

  const categories = ['all', 'electronics', 'clothing', 'books', 'home', 'sports', 'other']

  useEffect(() => {
    fetchProducts()
  }, [category, sort])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (category && category !== 'all') params.category = category
      if (search) params.search = search
      if (sort) params.sort = sort

      const res = await API.get('/products', { params })
      setProducts(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
          <p className="text-slate-400">Apni pasand ki cheez dhundo</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-4 mb-8">

          {/* Search */}
          <div className="flex gap-2 flex-1 min-w-64">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProducts()}
              placeholder="Search products..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
            />
            <button
              onClick={fetchProducts}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
            >
              Search
            </button>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
          >
            <option value="">Sort by</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'all' ? '' : cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition capitalize ${
                (cat === 'all' && !category) || category === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400 text-lg">Loading...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-slate-300 text-xl font-medium">Koi product nahi mila</p>
            <p className="text-slate-500 text-sm mt-2">Doosri category try karo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}