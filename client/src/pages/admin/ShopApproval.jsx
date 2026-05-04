import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI } from '../../services/api';
import { CheckCircle, XCircle, Clock, Eye, MapPin, Phone, Mail, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './components/AdminLayout';

const ShopApproval = () => {
  const { user } = useAuth();
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const fetchPendingShops = async () => {
    setLoading(true);
    try {
      const response = await shopAPI.getPendingShopEdits();
      setPendingShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching pending shops:', error);
      toast.error('Failed to load pending shop edits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId) => {
    setActionLoading(true);
    try {
      await shopAPI.approveShopEdit(shopId, { adminNotes: 'Approved by admin' });
      toast.success('Shop edit approved successfully');
      fetchPendingShops();
      setModalOpen(false);
      setSelectedShop(null);
    } catch (error) {
      toast.error('Failed to approve shop edit');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (shopId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await shopAPI.rejectShopEdit(shopId, { rejectionReason });
      toast.success('Shop edit rejected');
      fetchPendingShops();
      setModalOpen(false);
      setSelectedShop(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject shop edit');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (shop) => {
    setSelectedShop(shop);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedShop(null);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Edit Approvals</h1>
          <p className="text-gray-500">Review and approve shop edit requests</p>
        </div>

        {pendingShops.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pending Approvals</h3>
            <p className="text-gray-500">All shop edit requests have been processed</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingShops.map((shop) => (
              <div key={shop._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                        <Store size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                        <p className="text-sm text-gray-500">Owner: {shop.ownerId?.name || 'Unknown'}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail size={16} />
                        {shop.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone size={16} />
                        {shop.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 md:col-span-2">
                        <MapPin size={16} />
                        {shop.location?.address}, {shop.location?.city}, {shop.location?.area}
                      </div>
                    </div>

                    {shop.pendingEdits && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Pending Changes:</h4>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                          {Object.entries(shop.pendingEdits).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openModal(shop)}
                      className="flex items-center gap-2 px-4 py-2 text-[#FF6B35] border border-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition"
                    >
                      <Eye size={16} />
                      Review
                    </button>
                    <button
                      onClick={() => handleApprove(shop._id)}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for detailed review */}
        {modalOpen && selectedShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Shop Edit</h2>
                <p className="text-gray-500">{selectedShop.name}</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedShop.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedShop.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedShop.phone}</p>
                      <p><span className="font-medium">Address:</span> {selectedShop.location?.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Proposed Changes</h3>
                    <div className="space-y-2 text-sm">
                      {selectedShop.pendingEdits && Object.entries(selectedShop.pendingEdits).map(([key, value]) => (
                        <p key={key}>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                          <span className="text-[#FF6B35]">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rejection Reason (if rejecting)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800 resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedShop._id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  <XCircle size={16} />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedShop._id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ShopApproval;