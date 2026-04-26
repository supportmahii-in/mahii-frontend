import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiHome, 
  FiCompass, 
  FiInfo, 
  FiMail, 
  FiSun, 
  FiMoon, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiSettings,
  FiHelpCircle,
  FiBell,
  FiHeart,
  FiStar,
  FiBriefcase,
  FiShield,
  FiUsers
} from 'react-icons/fi';
import { 
  MdRestaurant, 
  MdStorefront, 
  MdDashboard, 
  MdMessage,
  MdLocalOffer 
} from 'react-icons/md';
import { FaUtensils, FaStore, FaCrown, FaRegGem, FaChartLine } from 'react-icons/fa';
import { GiFoodChain, GiMeal, GiCoffeeCup, GiCakeSlice, GiFoodTruck } from 'react-icons/gi';
import { LogIn, UserCircle, ShoppingBag, LayoutDashboard, Crown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  
  const userMenuRef = useRef(null);
  const loginDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get profile picture URL
  const getProfilePicture = () => {
    if (user?.profileImage) {
      return user.profileImage;
    }
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    return `https://ui-avatars.com/api/?name=${initials}&background=C2185B&color=fff&bold=true&size=80&rounded=true`;
  };

  // Get user email (truncated)
  const getDisplayEmail = () => {
    if (!user?.email) return '';
    const email = user.email;
    if (email.length > 25) {
      return email.substring(0, 22) + '...';
    }
    return email;
  };

  // Get user role badge
  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return { text: 'Administrator', color: 'bg-gradient-to-r from-purple-500 to-indigo-600', icon: <FiShield size={12} /> };
      case 'shopowner':
        return { text: 'Business Partner', color: 'bg-gradient-to-r from-emerald-500 to-teal-600', icon: <FiBriefcase size={12} /> };
      default:
        return { text: 'Foodie', color: 'bg-gradient-to-r from-[#C2185B] to-[#ad1457]', icon: <FiStar size={12} /> };
    }
  };

  const profilePath = user?.role === 'customer'
    ? '/profile'
    : user?.role === 'shopowner'
    ? '/shop/dashboard'
    : user?.role === 'admin'
    ? '/admin/dashboard'
    : '/login/customer';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const roleStats = {
    customer: {
      menuItems: [
        { name: 'My Orders', path: '/my-orders', icon: <FiPackage size={16} /> },
        { name: 'Subscriptions', path: '/my-subscriptions', icon: <FiCalendar size={16} /> },
        { name: 'Saved Places', path: '/saved', icon: <FiHeart size={16} /> },
        { name: 'Payment History', path: '/payments', icon: <FiCreditCard size={16} /> },
      ]
    },
    shopowner: {
      menuItems: [
        { name: 'Dashboard', path: '/shop/dashboard', icon: <MdDashboard size={16} /> },
        { name: 'Menu Manager', path: '/shop/menu', icon: <MdRestaurant size={16} /> },
        { name: 'Order Analytics', path: '/shop/analytics', icon: <FaChartLine size={16} /> },
        { name: 'Earnings', path: '/shop/earnings', icon: <FiCreditCard size={16} /> },
      ]
    },
    admin: {
      menuItems: [
        { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
        { name: 'User Management', path: '/admin/users', icon: <FiUsers size={16} /> },
        { name: 'Shop Approvals', path: '/admin/approvals', icon: <FiShield size={16} /> },
        { name: 'Support Chat', path: '/admin/chat', icon: <MdMessage size={16} /> },
      ]
    }
  };

  const currentRoleStats = roleStats[user?.role] || roleStats.customer;

  return (
    <nav className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-lg sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 lg:h-18">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C2185B] to-[#ad1457] rounded-xl blur-md opacity-60 group-hover:opacity-100 transition"></div>
              <div className="relative bg-gradient-to-br from-[#C2185B] to-[#ad1457] p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition">
                <GiFoodChain className="text-white text-xl" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
                Mah<span className="bg-gradient-to-r from-[#C2185B] to-[#ad1457] bg-clip-text text-transparent">ii</span>
              </span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 font-medium">Food Discovery Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-[#C2185B] font-medium rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
              >
                <span className="text-gray-400 group-hover:text-[#C2185B] transition">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-2">

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group"
              aria-label="Toggle theme"
            >
              {darkMode
                ? <FiSun className="text-yellow-500 text-lg group-hover:rotate-90 transition" />
                : <FiMoon className="text-gray-600 text-lg group-hover:rotate-12 transition" />}
            </button>

            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="relative p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group"
              aria-label="Shopping cart"
            >
              <FiShoppingCart className="text-gray-700 dark:text-gray-300 text-lg group-hover:text-[#C2185B] transition" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C2185B] to-[#ad1457] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu - When Logged In */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group"
                  aria-label="User menu"
                >
                  {/* Profile Picture with Status Indicator */}
                  <div className="relative">
                    <img
                      src={getProfilePicture()}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#C2185B]/30 group-hover:ring-[#C2185B] transition"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900"></div>
                  </div>
                  
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                      {user.name.split(' ')[0]}
                      {user?.role === 'admin' && <Crown size={12} className="text-yellow-500" />}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiMail size={10} />
                      {getDisplayEmail()}
                    </p>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="relative p-5 bg-gradient-to-r from-[#C2185B]/5 to-[#ad1457]/5">
                      <div className="flex items-center gap-4">
                        <img
                          src={getProfilePicture()}
                          alt={user.name}
                          className="w-16 h-16 rounded-xl object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <FiMail size={12} />
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-white ${getRoleBadge().color}`}>
                              {getRoleBadge().icon}
                              {getRoleBadge().text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Section */}
                    {user?.role === 'customer' && (
                      <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-700">
                        <div className="bg-white dark:bg-gray-800 p-3 text-center">
                          <p className="text-lg font-bold text-[#C2185B]">12</p>
                          <p className="text-xs text-gray-500">Orders</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 text-center">
                          <p className="text-lg font-bold text-[#C2185B]">3</p>
                          <p className="text-xs text-gray-500">Active Subs</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 text-center">
                          <p className="text-lg font-bold text-[#C2185B]">₹2,450</p>
                          <p className="text-xs text-gray-500">Saved</p>
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to={profilePath}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#C2185B]/10 transition">
                          <UserCircle size={16} className="text-gray-500 group-hover:text-[#C2185B]" />
                        </div>
                        <span className="flex-1 text-sm">Profile Settings</span>
                      </Link>
                      
                      {currentRoleStats.menuItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#C2185B]/10 transition">
                            {item.icon}
                          </div>
                          <span className="flex-1 text-sm">{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Settings & Help */}
                    <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#C2185B]/10 transition">
                          <FiSettings size={16} className="text-gray-500" />
                        </div>
                        <span className="flex-1 text-sm">Settings & Privacy</span>
                      </Link>
                      <Link
                        to="/help"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#C2185B]/10 transition">
                          <FiHelpCircle size={16} className="text-gray-500" />
                        </div>
                        <span className="flex-1 text-sm">Help Center</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                          <FiLogOut size={16} className="text-red-500" />
                        </div>
                        <span className="flex-1 text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Dropdown - When Not Logged In */
              <div className="relative" ref={loginDropdownRef}>
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#C2185B] to-[#ad1457] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  aria-label="Login options"
                >
                  <LogIn size={16} />
                  Get Started
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-[#C2185B]/5 to-[#ad1457]/5">
                      <p className="font-semibold text-gray-900 dark:text-white">Welcome to Mahii!</p>
                      <p className="text-sm text-gray-500 mt-1">Sign in to continue your food journey</p>
                    </div>
                    
                    <Link
                      to="/login/customer"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <GiMeal size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Customer Login</p>
                        <p className="text-xs text-gray-500">Order food & manage subscriptions</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/login/shopowner"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <MdStorefront size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Business Login</p>
                        <p className="text-xs text-gray-500">Manage your shop & earnings</p>
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                    
                    <Link
                      to="/register/customer"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <FaRegGem size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-amber-600">Create Account</p>
                        <p className="text-xs text-gray-500">Join as a foodie</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/register/shopowner"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 transition rounded-b-2xl"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                        <FaStore size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-teal-600">Partner With Us</p>
                        <p className="text-xs text-gray-500">List your shop & grow business</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition"
            aria-label="Mobile menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 space-y-3 border border-gray-100 dark:border-gray-700 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">

            {/* Mobile User Info when logged in */}
            {user && (
              <div className="flex items-center gap-4 pb-4 mb-2 border-b border-gray-100 dark:border-gray-700">
                <img
                  src={getProfilePicture()}
                  alt={user.name}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#C2185B]"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white mt-1 ${getRoleBadge().color}`}>
                    {getRoleBadge().icon}
                    {getRoleBadge().text}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-[#C2185B] font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <span className="text-gray-400">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* Cart Link for Mobile */}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-[#C2185B] font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <FiShoppingCart size={18} />
              Cart
              {getCartCount() > 0 && (
                <span className="ml-auto bg-[#C2185B] text-white text-xs px-2 py-0.5 rounded-full">
                  {getCartCount()} items
                </span>
              )}
            </Link>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              {user ? (
                <>
                  <Link to={profilePath} className="flex items-center gap-3 py-3 px-2" onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle size={18} /> Profile
                  </Link>
                  {currentRoleStats.menuItems.map((item, idx) => (
                    <Link key={idx} to={item.path} className="flex items-center gap-3 py-3 px-2" onClick={() => setMobileMenuOpen(false)}>
                      {item.icon} {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 px-2 text-red-500 w-full text-left"
                  >
                    <FiLogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login/customer" className="flex items-center gap-3 py-3 px-2" onClick={() => setMobileMenuOpen(false)}>
                    <GiMeal size={18} /> Customer Login
                  </Link>
                  <Link to="/login/shopowner" className="flex items-center gap-3 py-3 px-2" onClick={() => setMobileMenuOpen(false)}>
                    <MdStorefront size={18} /> Business Login
                  </Link>
                  <hr className="my-2 border-gray-100 dark:border-gray-700" />
                  <Link to="/register/customer" className="flex items-center gap-3 py-3 px-2 text-amber-600" onClick={() => setMobileMenuOpen(false)}>
                    <FaRegGem size={16} /> Create Account
                  </Link>
                  <Link to="/register/shopowner" className="flex items-center gap-3 py-3 px-2 text-emerald-600" onClick={() => setMobileMenuOpen(false)}>
                    <FaStore size={16} /> Partner With Us
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;