import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  ChevronDown,
  Grid,
  List,
  Heart,
  Navigation,
  Coffee,
  Utensils,
  IceCream,
  Store,
  Map,
  Award,
  Flame,
  Zap,
  TrendingUp,
  Wifi,
  ParkingCircle,
  ShoppingBag,
  Percent,
  Shield,
  Truck,
  Sparkles
} from 'lucide-react';
import { shopAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('exploreViewMode') || 'grid';
  });
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  
  // Search Engine States (Same as Home Page)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([
    "Mess near me",
    "Best cafe in Pune",
    "Budget meals",
    "Pure veg restaurant",
    "Student mess subscription",
    "Late night delivery",
    "Breakfast specials",
    "Family restaurant"
  ]);
  
  const searchDebounceRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    pureVeg: searchParams.get('pureVeg') === 'true',
    minRating: searchParams.get('minRating') || '',
    minCost: searchParams.get('minCost') || '',
    maxCost: searchParams.get('maxCost') || '',
    sortBy: searchParams.get('sortBy') || 'rating',
  });
  
  const [tempFilters, setTempFilters] = useState(filters);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const observerRef = useRef();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("exploreRecentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("exploreRecentSearches", JSON.stringify(updated));
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (query) => {
      if (searching) return;
      setSearching(true);
      
      setTimeout(async () => {
        if (query.length > 1) {
          try {
            const response = await shopAPI.searchShops({ q: query });
            setSearchResults(response.data.shops || []);
          } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
        setSearching(false);
      }, 500);
    },
    [searching]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    
    if (value.length > 1) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setShowSuggestions(false);
      fetchShops();
    }
  };

  // Handle key press (Enter)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveRecentSearch(suggestion);
    setShowSuggestions(false);
    fetchShops();
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Category config
  const categoryConfig = {
    mess: { icon: <Utensils size={20} />, name: 'Mess', color: '#FF6B35' },
    hotel: { icon: <Store size={20} />, name: 'Hotel', color: '#FF6B35' },
    cafe: { icon: <Coffee size={20} />, name: 'Café', color: '#FF6B35' },
    dessert: { icon: <IceCream size={20} />, name: 'Dessert', color: '#FF6B35' },
    stall: { icon: <Map size={20} />, name: 'Stall', color: '#FF6B35' },
  };

  const fetchShops = useCallback(async (reset = true) => {
    if (reset) {
      setLoading(true);
      setShops([]);
    }
    
    try {
      const params = {
        page: reset ? 1 : pagination.page + 1,
        limit: 20,
        ...filters,
        search: searchQuery,
        ...(location && { lat: location.lat, lng: location.lng }),
      };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await shopAPI.getExploreShops(params);
      
      if (reset) {
        setShops(response.data.shops || []);
        setPagination(response.data.pagination || { page: 1, total: 0, pages: 1 });
      } else {
        setShops(prev => [...prev, ...(response.data.shops || [])]);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, location, pagination.page, searchQuery]);

  const loadMoreShops = useCallback(() => {
    if (pagination.page < pagination.pages && !loadingMore && !loading) {
      setLoadingMore(true);
      fetchShops(false);
    }
  }, [pagination.page, pagination.pages, loadingMore, loading, fetchShops]);

  useEffect(() => {
    localStorage.setItem('exploreViewMode', viewMode);
  }, [viewMode]);

  const lastShopRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.pages) {
        loadMoreShops();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, pagination, loadMoreShops]);

  useEffect(() => {
    getLocation();
    fetchShops();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.pureVeg) params.set('pureVeg', 'true');
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.sortBy !== 'rating') params.set('sortBy', filters.sortBy);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
    
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.pureVeg) count++;
    if (filters.minRating) count++;
    if (filters.minCost || filters.maxCost) count++;
    setActiveFilterCount(count);
    
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const timeout = setTimeout(() => {
      fetchShops();
    }, 500);
    searchDebounceRef.current = timeout;
    
    return () => clearTimeout(timeout);
  }, [filters, searchQuery, setSearchParams, fetchShops]);

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationPermission(true);
          fetchShops();
        },
        (error) => {
          console.log('Location denied:', error);
          setLocationPermission(false);
          fetchShops();
        }
      );
    }
  }, [fetchShops]);

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
    toast.success('Filters applied');
  };

  const clearFilters = () => {
    const resetFilters = {
      category: 'all',
      pureVeg: false,
      minRating: '',
      minCost: '',
      maxCost: '',
      sortBy: 'rating',
    };
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    setSearchQuery('');
    toast.success('All filters cleared');
  };

  const sortOptions = [
    { value: 'rating', label: 'Top Rated', icon: Star },
    { value: 'distance', label: 'Nearest First', icon: Navigation },
    { value: 'cost_low', label: 'Price: Low to High', icon: DollarSign },
    { value: 'cost_high', label: 'Price: High to Low', icon: DollarSign },
    { value: 'popularity', label: 'Most Popular', icon: Flame },
    { value: 'newest', label: 'Newly Added', icon: Zap },
  ];

  const formatDistance = (distance) => {
    if (!distance) return null;
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance.toFixed(1)}km away`;
  };

  const getOpenStatus = (timings) => {
    if (!timings) return { text: 'Closed', color: 'text-red-600 bg-red-50' };
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;
    
    const [openHour, openMinute] = (timings.open || '09:00').split(':').map(Number);
    const [closeHour, closeMinute] = (timings.close || '22:00').split(':').map(Number);
    const openTime = openHour + openMinute / 60;
    const closeTime = closeHour + closeMinute / 60;
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return {
      text: isOpen ? 'Open Now' : 'Closed',
      color: isOpen ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
    };
  };

  const categories = [
    { id: 'all', name: 'All', icon: null },
    { id: 'mess', name: 'Mess', icon: <Utensils size={16} /> },
    { id: 'hotel', name: 'Hotel', icon: <Store size={16} /> },
    { id: 'cafe', name: 'Cafe', icon: <Coffee size={16} /> },
    { id: 'dessert', name: 'Dessert', icon: <IceCream size={16} /> },
    { id: 'stall', name: 'Stall', icon: <Map size={16} /> },
  ];

  const ShopCard = ({ shop, index }) => {
    const openStatus = getOpenStatus(shop.timings);
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3) }}
        whileHover={{ y: -4 }}
        ref={index === shops.length - 1 ? lastShopRef : null}
        className="group cursor-pointer"
      >
        <Link to={`/shop/${shop.category}/${shop._id}`}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img
                src={shop.coverImage || shop.images?.[0]?.url || `https://placehold.co/600x400/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name)}`}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = `https://placehold.co/600x400/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name)}`;
                }}
              />
              
              <div className="absolute top-3 left-3 flex gap-2">
                {shop.pureVeg && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Pure Veg
                  </span>
                )}
                {shop.rating >= 4.5 && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award size={10} />
                    Top Rated
                  </span>
                )}
              </div>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Heart size={16} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
              </button>
              
              <div className="absolute bottom-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize shadow-sm flex items-center gap-1.5">
                  {categoryConfig[shop.category]?.icon}
                  {shop.category}
                </span>
              </div>
              
              <div className={`absolute bottom-3 right-3 ${openStatus.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm`}>
                <Clock size={10} />
                {openStatus.text}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 flex-1">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="font-medium text-sm text-gray-700">{shop.rating?.toFixed(1) || 'New'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate text-xs">{shop.location?.area}, {shop.location?.city}</span>
                {shop.distance && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    • {formatDistance(shop.distance)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-lg">
                  <DollarSign size={12} className="text-gray-500" />
                  <span className="text-xs font-medium">₹{shop.costForTwo || 300} for two</span>
                </div>
                {shop.homeDelivery && (
                  <div className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg">
                    <Truck size={10} />
                    Delivery
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header with Search Bar - Same as Home Page */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Find your <span className="text-[#FF6B35]">perfect meal</span>
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Explore the best mess, cafes, hotels, and street food near your college
            </p>
            
            {/* Active Search Bar with Suggestions - Same as Home Page */}
            <div className="max-w-2xl mt-6" ref={searchInputRef}>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search for mess, hotel, cafe, or dish..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full py-3 pl-11 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition bg-white"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Search Suggestions Dropdown - Same as Home Page */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto"
                    >
                      {/* Loading Indicator */}
                      {searching && (
                        <div className="p-4 text-center text-gray-500">
                          <div className="inline-block w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-sm">Searching...</span>
                        </div>
                      )}

                      {/* Search Results */}
                      {!searching && searchResults.length > 0 && searchQuery.length > 1 && (
                        <div>
                          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Search Results ({searchResults.length})
                          </div>
                          {searchResults.map((shop) => (
                            <button
                              key={shop._id}
                              onClick={() => handleSuggestionClick(shop.name)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100 last:border-0"
                            >
                              <img
                                src={shop.coverImage || "https://placehold.co/40x40/f3f4f6/9ca3af"}
                                alt={shop.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{shop.name}</p>
                                <p className="text-xs text-gray-500">{shop.location?.area}, {shop.location?.city}</p>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-yellow-500">
                                <span>⭐</span>
                                <span>{shop.rating?.toFixed(1) || "New"}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Recent Searches */}
                      {!searching && searchQuery.length === 0 && recentSearches.length > 0 && (
                        <div>
                          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                            <span>Recent Searches</span>
                            <button
                              onClick={() => {
                                setRecentSearches([]);
                                localStorage.removeItem("exploreRecentSearches");
                              }}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Clear All
                            </button>
                          </div>
                          {recentSearches.map((term, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(term)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-3"
                            >
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-gray-700">{term}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Trending Searches */}
                      {!searching && searchQuery.length === 0 && recentSearches.length === 0 && (
                        <div>
                          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp size={12} />
                            <span>Trending Now</span>
                          </div>
                          {trendingSearches.map((term, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(term)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-3"
                            >
                              <span className="text-[#FF6B35]">🔥</span>
                              <span className="text-gray-700">{term}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* No Results */}
                      {!searching && searchQuery.length > 1 && searchResults.length === 0 && (
                        <div className="p-6 text-center">
                          <p className="text-gray-500">No results found for "{searchQuery}"</p>
                          <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ ...filters, category: cat.id })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    filters.category === cat.id
                      ? 'bg-[#FF6B35] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="appearance-none bg-gray-100 px-4 py-2 pr-8 rounded-lg text-sm cursor-pointer hover:bg-gray-200 transition"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      Sort: {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
              
              {/* Location Info */}
              {locationPermission && location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                  <Navigation size={14} />
                  <span className="hidden sm:inline">Nearby</span>
                </div>
              )}
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition relative"
              >
                <Filter size={16} />
                <span className="text-sm">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filters Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
              {filters.category !== 'all' && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1.5">
                  {categoryConfig[filters.category]?.icon}
                  {categoryConfig[filters.category]?.name}
                  <button onClick={() => setFilters({ ...filters, category: 'all' })} className="hover:scale-110">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.pureVeg && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1.5">
                  🌱 Pure Veg
                  <button onClick={() => setFilters({ ...filters, pureVeg: false })} className="hover:scale-110">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.minRating && (
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs flex items-center gap-1.5">
                  ⭐ {filters.minRating}+ Stars
                  <button onClick={() => setFilters({ ...filters, minRating: '' })} className="hover:scale-110">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} className="text-gray-400 text-xs hover:text-gray-600 transition">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Results Count */}
        {!loading && shops.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{pagination.total}</span> places found
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}
        
        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse">
                <div className="h-48 bg-gray-100 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No shops found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              We couldn't find any shops matching your criteria. Try adjusting your filters or search term.
            </p>
            <button onClick={clearFilters} className="mt-4 text-[#FF6B35] text-sm font-medium hover:underline">
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {shops.map((shop, index) => (
              <ShopCard key={shop._id} shop={shop} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {shops.map((shop, index) => (
              <div key={shop._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex gap-4">
                  <img
                    src={shop.coverImage || `https://placehold.co/100x100/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name[0])}`}
                    alt={shop.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{shop.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-medium">{shop.rating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{shop.location?.area}, {shop.location?.city}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium text-gray-700">₹{shop.costForTwo || 300}</span>
                      <span className="text-xs text-gray-400">for two</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading More */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* End of Results */}
        {!loading && !loadingMore && shops.length > 0 && pagination.page >= pagination.pages && (
          <div className="text-center py-8 text-gray-400 text-sm">
            You've explored all {pagination.total} places
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Filter Shops</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Category */}
                <div>
                  <h3 className="font-medium mb-3">Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setTempFilters({ ...tempFilters, category: cat.id })}
                        className={`px-4 py-2 rounded-lg text-sm transition ${
                          tempFilters.category === cat.id
                            ? 'bg-[#FF6B35] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Pure Veg */}
                <div>
                  <h3 className="font-medium mb-3">Dietary Preference</h3>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={tempFilters.pureVeg}
                      onChange={(e) => setTempFilters({ ...tempFilters, pureVeg: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <span className="text-sm">Pure Vegetarian Only</span>
                  </label>
                </div>
                
                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-3">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {['', '3.5', '4.0', '4.5'].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setTempFilters({ ...tempFilters, minRating: rating })}
                        className={`flex-1 py-2 rounded-lg text-sm transition ${
                          tempFilters.minRating === rating
                            ? 'bg-[#FF6B35] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating ? `${rating}+ ★` : 'Any'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range (₹ for two)</h3>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={tempFilters.minCost}
                      onChange={(e) => setTempFilters({ ...tempFilters, minCost: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempFilters.maxCost}
                      onChange={(e) => setTempFilters({ ...tempFilters, maxCost: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white border-t p-5 flex gap-3">
                <button onClick={clearFilters} className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
                  Clear All
                </button>
                <button onClick={applyFilters} className="flex-1 bg-[#FF6B35] text-white py-3 rounded-lg font-medium hover:bg-[#e55a2b] transition shadow-sm">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Explore;