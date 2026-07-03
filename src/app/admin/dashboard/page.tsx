'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Plus, Edit, Trash2, CheckCircle2, AlertCircle, 
  DollarSign, ShoppingCart, Calendar, LogOut, Package, Star, Loader2, Save, X 
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // States
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Tabs: 'analytics' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');

  // Form states for Product Add/Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Birthday Cakes',
    description: '',
    inventory: '10',
    rating: '4.8',
    image: ''
  });

  // Verify JWT authorization on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setAuthorized(true);
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);
      // Fetch products
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData.success) setProducts(pData.products);

      // Fetch orders
      const oRes = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const oData = await oRes.json();
      if (oData.success) {
        setOrders(oData.orders);
      } else {
        // Token might be expired, log out
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    // Clear cookies via login API or simple expire check
    document.cookie = 'admin_token=; Max-Age=0; path=/;';
    router.push('/admin/login');
  };

  // Toggle order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle payment status
  const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product Actions (Add/Edit/Delete)
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      category: 'Birthday Cakes',
      description: '',
      inventory: '10',
      rating: '4.8',
      image: ''
    });
    setShowProductModal(true);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description,
      inventory: String(product.inventory),
      rating: String(product.rating),
      image: product.image || ''
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const isEdit = !!editingProduct;
    const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
        } else {
          setProducts(prev => [...prev, data.product]);
        }
        setShowProductModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== prodId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Analytics helper calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalInquiries = orders.filter(o => o.isCustomCake).length;
  const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered').length;

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-cream/15 dark:bg-dark-cocoa/5 font-sans">
      
      {/* Upper Sticky Admin Navbar */}
      <header className="glassmorphism sticky top-0 z-30 w-full px-4 sm:px-6 lg:px-8 border-b border-warm-brown/10 dark:border-gold/10">
        <div className="flex h-20 items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-warm-brown/60 dark:text-cream/60">
              Admin Session Active
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-200 dark:border-red-900/30 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/35 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-3 border-b border-warm-brown/10 dark:border-gold/10 pb-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'analytics'
                ? 'bg-gold text-white shadow-md'
                : 'text-warm-brown dark:text-cream hover:bg-cream dark:hover:bg-warm-brown/15'
            }`}
          >
            Dashboard Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'products'
                ? 'bg-gold text-white shadow-md'
                : 'text-warm-brown dark:text-cream hover:bg-cream dark:hover:bg-warm-brown/15'
            }`}
          >
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'orders'
                ? 'bg-gold text-white shadow-md'
                : 'text-warm-brown dark:text-cream hover:bg-cream dark:hover:bg-warm-brown/15'
            }`}
          >
            Orders / Custom Cakes ({pendingOrders})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-gold animate-spin" />
            <p className="text-xs text-warm-brown/60 dark:text-cream/60">Syncing dashboard logs...</p>
          </div>
        ) : (
          <>
            {/* TAB CONTENT: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Stats cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Revenue */}
                  <div className="bg-white dark:bg-warm-brown/10 p-6 rounded-2xl border border-warm-brown/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">TOTAL GROSS</span>
                      <DollarSign size={20} className="text-warm-brown/30" />
                    </div>
                    <div className="text-3xl font-serif font-bold text-warm-brown dark:text-cream">₹{totalRevenue}</div>
                    <p className="text-[10px] text-green-600 font-semibold uppercase">Gross Billing Sales</p>
                  </div>

                  {/* Orders count */}
                  <div className="bg-white dark:bg-warm-brown/10 p-6 rounded-2xl border border-warm-brown/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">TOTAL BOOKED</span>
                      <ShoppingCart size={20} className="text-warm-brown/30" />
                    </div>
                    <div className="text-3xl font-serif font-bold text-warm-brown dark:text-cream">{orders.length}</div>
                    <p className="text-[10px] text-gold font-semibold uppercase">Total items checked out</p>
                  </div>

                  {/* Custom inquiries */}
                  <div className="bg-white dark:bg-warm-brown/10 p-6 rounded-2xl border border-warm-brown/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">CUSTOM CAKES</span>
                      <Calendar size={20} className="text-warm-brown/30" />
                    </div>
                    <div className="text-3xl font-serif font-bold text-warm-brown dark:text-cream">{totalInquiries}</div>
                    <p className="text-[10px] text-purple-600 font-semibold uppercase">Custom designer inquiries</p>
                  </div>

                  {/* Low stock alerts */}
                  <div className="bg-white dark:bg-warm-brown/10 p-6 rounded-2xl border border-warm-brown/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">LOW STOCK ITEMS</span>
                      <AlertCircle size={20} className="text-warm-brown/30" />
                    </div>
                    <div className="text-3xl font-serif font-bold text-red-500">
                      {products.filter(p => p.inventory < 10).length}
                    </div>
                    <p className="text-[10px] text-red-500 font-semibold uppercase">Requires restock catalog</p>
                  </div>
                </div>

                {/* Sales Chart (Luxury SVG based) */}
                <div className="bg-white dark:bg-warm-brown/10 p-8 rounded-3xl border border-warm-brown/5 shadow-md space-y-6">
                  <div className="flex justify-between items-center border-b border-warm-brown/5 pb-4">
                    <h3 className="font-serif text-base font-bold text-warm-brown dark:text-cream">Weekly Revenue Performance</h3>
                    <span className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">SVG GRAPH PERFORMANCE</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="w-full h-[250px] relative">
                    <svg viewBox="0 0 700 250" className="w-full h-full text-gold">
                      {/* Grid Lines */}
                      <line x1="50" y1="50" x2="650" y2="50" stroke="#6F4E37" strokeWidth="0.5" strokeOpacity="0.1" />
                      <line x1="50" y1="125" x2="650" y2="125" stroke="#6F4E37" strokeWidth="0.5" strokeOpacity="0.1" />
                      <line x1="50" y1="200" x2="650" y2="200" stroke="#6F4E37" strokeWidth="0.5" strokeOpacity="0.2" />

                      {/* Smooth Area underneath the line */}
                      <path
                        d="M 50,200 L 150,140 L 250,160 L 350,100 L 450,130 L 550,70 L 650,50 L 650,200 Z"
                        fill="url(#goldGradient)"
                        opacity="0.15"
                      />

                      {/* Spark Line */}
                      <path
                        d="M 50,200 L 150,140 L 250,160 L 350,100 L 450,130 L 550,70 L 650,50"
                        fill="none"
                        stroke="#D4A017"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Dots */}
                      <circle cx="50" cy="200" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />
                      <circle cx="150" cy="140" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />
                      <circle cx="250" cy="160" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />
                      <circle cx="350" cy="100" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />
                      <circle cx="450" cy="130" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />
                      <circle cx="550" cy="70" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />
                      <circle cx="650" cy="50" r="5" fill="#6F4E37" stroke="#D4A017" strokeWidth="2" />

                      {/* X Axis Labels */}
                      <text x="50" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Mon</text>
                      <text x="150" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Tue</text>
                      <text x="250" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Wed</text>
                      <text x="350" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Thu</text>
                      <text x="450" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Fri</text>
                      <text x="550" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Sat</text>
                      <text x="650" y="225" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Sun</text>

                      {/* Y Axis Labels */}
                      <text x="40" y="203" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="end">₹0</text>
                      <text x="40" y="128" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="end">₹5k</text>
                      <text x="40" y="53" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="end">₹10k</text>

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4A017" />
                          <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRODUCTS LIST */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream">
                    Product Catalogue ({products.length})
                  </h3>
                  <button
                    onClick={openAddProduct}
                    className="px-5 py-2.5 bg-gold hover:bg-warm-brown text-white font-sans text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus size={14} /> Add New Bakery Item
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-warm-brown/10 rounded-2xl border border-warm-brown/5 shadow-md overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-cream/45 dark:bg-dark-cocoa/40 border-b border-warm-brown/10 text-warm-brown/60 dark:text-cream/60 font-bold uppercase tracking-wider">
                        <th className="p-4">Name & Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Inventory</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-brown/5 text-warm-brown dark:text-cream">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-cream/10 dark:hover:bg-warm-brown/5">
                          <td className="p-4">
                            <div className="font-serif font-bold text-sm text-warm-brown dark:text-cream">{p.name}</div>
                            <div className="text-[10px] text-gold font-bold uppercase mt-0.5">{p.category}</div>
                          </td>
                          <td className="p-4 font-bold text-sm">₹{p.price}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.inventory < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}>
                              {p.inventory} left
                            </span>
                          </td>
                          <td className="p-4 flex items-center gap-1 mt-2">
                            <Star size={12} className="text-gold fill-gold" />
                            <span className="font-semibold">{p.rating.toFixed(1)}</span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="p-1.5 border border-warm-brown/10 hover:border-gold hover:text-gold rounded transition-all"
                              title="Edit item"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 border border-warm-brown/10 hover:border-red-500 hover:text-red-500 rounded transition-all"
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ORDERS LIST */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-bold text-warm-brown dark:text-cream">
                  Customer Orders & Custom Cakes
                </h3>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-warm-brown/40 dark:text-cream/40 text-xs">
                      No customer checkouts recorded yet.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-warm-brown/10 p-6 rounded-2xl border border-warm-brown/5 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                      >
                        {/* Summary details */}
                        <div className="md:col-span-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm font-bold text-warm-brown dark:text-cream">
                              Order #{order.id}
                            </span>
                            {order.isCustomCake && (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-bold rounded-full uppercase">
                                Custom Cake
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-warm-brown/70 dark:text-cream/70 font-sans">
                            <p className="font-semibold text-warm-brown dark:text-cream">{order.customerName}</p>
                            <p className="mt-0.5">{order.phone} • {order.whatsapp}</p>
                            <p className="text-[10px] text-warm-brown/50 dark:text-cream/50 mt-1 truncate">{order.deliveryAddress}</p>
                          </div>
                        </div>

                        {/* Items list review */}
                        <div className="md:col-span-4 space-y-1 text-xs">
                          <p className="font-bold text-warm-brown/40 dark:text-cream/40 text-[9px] uppercase">ITEMS LIST</p>
                          {order.isCustomCake ? (
                            <p className="text-warm-brown dark:text-cream font-medium">
                              Custom: {order.cakeFlavor} ({order.weight}kg) - {order.theme}
                            </p>
                          ) : (
                            order.items.map((item: any, idx: number) => (
                              <p key={idx} className="text-warm-brown dark:text-cream font-medium truncate max-w-xs">
                                • {item.name} x {item.quantity}
                              </p>
                            ))
                          )}
                          <p className="font-bold text-gold mt-1.5 text-sm">₹{order.totalAmount}</p>
                        </div>

                        {/* Order management state dropdowns */}
                        <div className="md:col-span-4 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-sans font-bold uppercase tracking-wider text-warm-brown/50 mb-1">
                              ORDER STATUS
                            </label>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-cream/35 dark:bg-dark-cocoa border border-warm-brown/10 dark:border-gold/10 rounded-lg text-xs text-warm-brown dark:text-cream focus:outline-none"
                            >
                              <option value="Received">Received</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-sans font-bold uppercase tracking-wider text-warm-brown/50 mb-1">
                              PAYMENT STATUS
                            </label>
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-cream/35 dark:bg-dark-cocoa border border-warm-brown/10 dark:border-gold/10 rounded-lg text-xs text-warm-brown dark:text-cream focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Product ADD/EDIT Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-cocoa rounded-3xl border border-warm-brown/5 shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-cream dark:hover:bg-warm-brown/20 text-warm-brown dark:text-cream transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-xl font-bold text-warm-brown dark:text-cream border-b border-warm-brown/10 pb-4">
              {editingProduct ? 'Edit Catalogue Product' : 'Add New Catalogue Product'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Traditional Cardamom Honey Cake"
                  className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  >
                    <option value="Signature Cakes">Signature Cakes</option>
                    <option value="Celebration Cakes">Celebration Cakes</option>
                    <option value="Puffs & Savories">Puffs & Savories</option>
                    <option value="Buns & Sandwiches">Buns & Sandwiches</option>
                    <option value="Desserts & Ice Cream">Desserts & Ice Cream</option>
                    <option value="Fresh Breads & Cookies">Fresh Breads & Cookies</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Inventory */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                    Starting Inventory
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.inventory}
                    onChange={(e) => setProductForm(prev => ({ ...prev, inventory: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={productForm.rating}
                    onChange={(e) => setProductForm(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Summarize product taste profile, allergens, size, details..."
                  className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-warm-brown/60 dark:text-cream/60 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Leave blank to use default placeholder card letter"
                  className="w-full px-3.5 py-2.5 bg-cream/25 dark:bg-dark-cocoa/40 border border-warm-brown/10 dark:border-gold/10 rounded-xl font-sans text-xs focus:outline-none focus:border-gold text-warm-brown dark:text-cream"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 border border-warm-brown/20 dark:border-gold/20 rounded-full font-sans text-xs font-bold uppercase tracking-wider text-warm-brown dark:text-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gold hover:bg-warm-brown text-white font-sans text-xs font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Save size={14} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
