import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ShopSidebar from './components/layout/ShopSidebar';
import ShopHeader from './components/layout/ShopHeader';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI } from '../../services/api';

const ShopLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shop, setShop] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/shop/dashboard') return 'dashboard';
    if (path === '/shop/orders') return 'orders';
    if (path === '/shop/subscriptions') return 'subscriptions';
    if (path === '/shop/menu') return 'menu';
    if (path === '/shop/students') return 'students';
    if (path === '/shop/attendance') return 'attendance';
    if (path === '/shop/analytics') return 'analytics';
    if (path === '/shop/earnings') return 'earnings';
    if (path === '/shop/settings') return 'settings';
    if (path === '/shop/help') return 'help';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  React.useEffect(() => {
    const fetchShopData = async () => {
      if (user?.role === 'shopowner') {
        try {
          const shopsRes = await shopAPI.getMyShops();
          const userShop = shopsRes.data.shops?.[0];
          setShop(userShop);
        } catch (error) {
          console.error('Error fetching shop data:', error);
        }
      }
    };

    fetchShopData();

    // Mock notifications
    setNotifications([
      { id: 1, title: 'New Order', message: 'Order #ORD001 has been placed', time: '2 min ago', read: false },
      { id: 2, title: 'Subscription Renewal', message: 'Student Mess Monthly plan renewed', time: '1 hour ago', read: false },
    ]);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ShopSidebar
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <ShopHeader shop={shop} notifications={notifications} unreadCount={unreadCount} />

        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ShopLayout;