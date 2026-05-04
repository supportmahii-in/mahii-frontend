import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, orderAPI, subscriptionAPI } from '../../services/api';
import {
  Store,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Star,
  MessageSquare,
  QrCode,
  Image,
  MapPin,
  Bell,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ApprovalStatus from '../../components/common/ApprovalStatus';
import PendingEditStatus from '../../components/shop/PendingEditStatus';
import ShopEditForm from '../../components/shop/ShopEditForm';
import ShopMediaManager from '../../components/shop/ShopMediaManager';
import MenuManager from '../../components/shop/MenuManager';
import OrderManager from '../../components/shop/OrderManager';
import SubscriptionManager from '../../components/shop/SubscriptionManager';
import AttendanceScanner from '../../components/shop/AttendanceScanner';
import ReviewManager from '../../components/shop/ReviewManager';
import LocationManager from '../../components/shop/LocationManager';
import EarningsReport from '../../components/shop/EarningsReport';

const ShopDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    averageRating: 0,
    totalCustomers: 0
  });

  const fetchShopData = async () => {
    setLoading(true);
    try {
      // Get user's shop
      try {
        const shopsRes = await shopAPI.getMyShops();
        const userShop = shopsRes.data.shops?.[0];
        setShop(userShop);
        
        if (userShop) {
          // Fetch orders with error handling
          try {
            const ordersRes = await orderAPI.getShopOrders(userShop._id);
            setOrders(ordersRes.data.orders || []);
          } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
          }

          // Fetch subscriptions with error handling
          try {
            const subscriptionsRes = await subscriptionAPI.getShopSubscriptions(userShop._id);
            setSubscriptions(subscriptionsRes.data.subscriptions || []);
          } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setSubscriptions([]);
          }

          // Fetch products with error handling
          try {
            const productsRes = await shopAPI.getShopProducts(userShop._id);
            setProducts(productsRes.data.products || []);
          } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
        toast.error('Failed to load shop data');
        setShop(null);
      }
    } catch (error) {
      console.error('Error in shop data fetch:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Recalculate stats whenever shop data changes
  useEffect(() => {
    if (shop) {
      const totalOrders = orders.length;
      const activeSubscriptions = subscriptions.filter(s => s.isActive).length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
      
      setStats({ totalOrders, activeSubscriptions, totalRevenue, pendingOrders, averageRating: 4.5, totalCustomers: 45 });
    }
  }, [orders, subscriptions, shop]);

  useEffect(() => {
    if (user?.id && user.role === 'shopowner') {
      fetchShopData();
    }
  }, [user?.id, user?.role]);

  // Redirect if not shop owner
  if (!user || user.role !== 'shopowner') {
    return <Navigate to="/login/shopowner" />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'menu', label: 'Menu', icon: Store },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: stats.pendingOrders },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users, count: stats.activeSubscriptions },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!shop && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={40} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Shop Registered</h2>
          <p className="text-gray-600 mb-4">You haven't registered a shop yet.</p>
          <Link to="/register/shopowner" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold inline-block">
            Register Your Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {shop?.name || 'Shop Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your orders, menu, and track earnings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditForm(true)}
              className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
            >
              <Edit size={18} />
              Edit Shop
            </button>
            <Link
              to="/explore"
              className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-lg font-semibold hover:bg-pink-100 transition"
            >
              <Eye size={18} />
              View on Explore
            </Link>
          </div>
        </div>

        {/* Approval Status */}
        <ApprovalStatus shop={shop} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
            {stats.pendingOrders > 0 && (
              <p className="text-xs text-orange-500 mt-1">{stats.pendingOrders} pending</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Active Subscriptions</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Revenue</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-green-500 text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Pending Edit Status */}
                    <PendingEditStatus shop={shop} />

                    {/* Recent Orders */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Orders</h3>
                        <button className="text-green-500 text-sm">View All</button>
                      </div>
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                          <div>
                            <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                            <p className="text-sm text-gray-500">{order.userId?.name}</p>
                            <p className="text-xs text-gray-400">₹{order.total}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                            <button className="text-green-500">
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      {shop?.isActive ? (
                        <Link to="/shop/menu/add" className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 transition">
                          <Plus className="text-green-600" />
                          <span className="font-medium">Add Menu Item</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-not-allowed opacity-50">
                          <Plus className="text-gray-400" />
                          <span className="font-medium text-gray-400">Add Menu Item</span>
                        </div>
                      )}
                      {shop?.isActive ? (
                        <Link to="/shop/attendance" className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition">
                          <QrCode className="text-blue-600" />
                          <span className="font-medium">Mark Attendance</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-not-allowed opacity-50">
                          <QrCode className="text-gray-400" />
                          <span className="font-medium text-gray-400">Mark Attendance</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && <OrderManager shopId={shop?._id} />}
                {activeTab === 'subscriptions' && <SubscriptionManager shopId={shop?._id} />}
                {activeTab === 'menu' && <MenuManager shopId={shop?._id} />}
                {activeTab === 'attendance' && <AttendanceScanner shopId={shop?._id} />}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl mb-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-600">{stats.averageRating}</div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(stats.averageRating) ? "#FFBD0C" : "none"} className={i < Math.floor(stats.averageRating) ? "text-yellow-500" : "text-gray-300"} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Based on {stats.totalCustomers} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        {[5,4,3,2,1].map(rating => (
                          <div key={rating} className="flex items-center gap-2 text-sm">
                            <span>{rating}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(stats.totalCustomers / 5) * rating}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="border-t pt-4">
                      <div className="flex gap-3 p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">Rahul S.</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < 5 ? "#FFBD0C" : "none"} className="text-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Great food and service! Highly recommended for students.</p>
                          <button className="text-xs text-green-500 mt-2">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'media' && <ShopMediaManager shop={shop} onUpdate={fetchShopData} />}
                {activeTab === 'location' && <LocationManager shop={shop} onUpdate={fetchShopData} />}
                {activeTab === 'earnings' && <EarningsReport shopId={shop?._id} />}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Shop Name</label>
                          <input type="text" value={shop?.name} className="input-field" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Number</label>
                          <input type="text" value={shop?.contactNumber} className="input-field" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Timings</label>
                          <div className="flex gap-4">
                            <input type="time" value={shop?.timings?.open} className="input-field" />
                            <span>to</span>
                            <input type="time" value={shop?.timings?.close} className="input-field" />
                          </div>
                        </div>
                        <button className="bg-green-500 text-white px-6 py-2 rounded-lg">Save Changes</button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">UPI ID</label>
                          <input type="text" placeholder="shop@okhdfcbank" className="input-field" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Bank Account</label>
                          <input type="text" placeholder="Account Number" className="input-field" />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shop Edit Form Modal */}
      {showEditForm && (
        <ShopEditForm
          shop={shop}
          onClose={() => setShowEditForm(false)}
          onSuccess={fetchShopData}
        />
      )}
    </div>
  );
};

export default ShopDashboard;