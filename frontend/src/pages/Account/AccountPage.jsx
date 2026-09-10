import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/common/Loader';

const TABS = [
  { id: 'orders', label: 'My Orders', icon: 'receipt_long' },
  { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
  { id: 'profile', label: 'Profile', icon: 'manage_accounts' },
  { id: 'addresses', label: 'Addresses', icon: 'location_on' },
];

const ORDER_STATUS_CONFIG = {
  processing: { label: 'Processing', color: 'text-secondary bg-secondary/10' },
  shipped: { label: 'Shipped', color: 'text-primary bg-primary/10' },
  delivered: { label: 'Delivered', color: 'text-success bg-success/10' },
  cancelled: { label: 'Cancelled', color: 'text-error bg-error/10' },
};

const EMPTY_ADDRESS = {
  label: 'Home', first_name: '', last_name: '',
  street_address: '', city: '', state: '', zip_code: '', is_default: false
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', subscribed_to_emails: false });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ ...EMPTY_ADDRESS });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/account' } });
    }
  }, [user, navigate]);

  // Initialize profile form
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        subscribed_to_emails: user.subscribed_to_emails || false,
      });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  // Load tab data
  useEffect(() => {
    if (!user) return;
    async function loadTabData() {
      setLoading(true);
      try {
        if (activeTab === 'orders') {
          const data = await orderService.getOrders();
          setOrders(data || []);
        } else if (activeTab === 'wishlist') {
          const data = await userService.getWishlist();
          setWishlist(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTabData();
  }, [activeTab, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    try {
      await userService.updateMe(profileForm);
      await refreshProfile();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const updated = await userService.updateAddress(editingAddress, addressForm);
        setAddresses(updated);
      } else {
        const updated = await userService.addAddress(addressForm);
        setAddresses(updated);
      }
      await refreshProfile();
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({ ...EMPTY_ADDRESS });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const updated = await userService.deleteAddress(addressId);
      setAddresses(updated);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr.id || addr._id);
    setAddressForm({
      label: addr.label || 'Home',
      first_name: addr.first_name,
      last_name: addr.last_name,
      street_address: addr.street_address,
      city: addr.city,
      state: addr.state,
      zip_code: addr.zip_code,
      is_default: addr.is_default || false,
    });
    setShowAddressForm(true);
  };

  if (!user) return null;

  return (
    <div className="pt-28 md:pt-40 pb-section-gap min-h-screen">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">My Account</h1>
            <p className="text-on-surface-variant font-body-md mt-1">
              Welcome back, {user.first_name}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-4 py-2 hover:border-error hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          {/* Sidebar Tabs */}
          <aside>
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps tracking-wider whitespace-nowrap transition-colors rounded-sm ${activeTab === tab.id ? 'bg-on-surface text-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab Content */}
          <div>
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-headline-sm text-headline-sm mb-6">Order History</h2>
                {loading ? <Loader fullScreen={false} /> : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-outline mb-4">receipt_long</span>
                    <h3 className="font-headline-sm text-headline-sm mb-2">No orders yet</h3>
                    <p className="text-on-surface-variant mb-6">When you place an order, it will appear here.</p>
                    <Link to="/shop" className="px-8 py-3 border border-on-surface font-label-caps text-label-caps uppercase hover:bg-on-surface hover:text-surface transition-colors">
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map(order => {
                      const statusCfg = ORDER_STATUS_CONFIG[order.order_status] || ORDER_STATUS_CONFIG['processing'];
                      return (
                        <div key={order.id} className="border border-outline-variant p-5 hover:border-outline transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                            <div>
                              <p className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-1">ORDER #{order.id?.slice(-8).toUpperCase()}</p>
                              <p className="text-on-surface-variant text-sm">
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 font-label-caps text-[10px] tracking-widest rounded-sm ${statusCfg.color}`}>
                                {statusCfg.label}
                              </span>
                              <Link to={`/order-confirmation/${order.id}`} className="font-label-caps text-xs text-on-surface-variant hover:text-primary underline">
                                View Details
                              </Link>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="flex items-center gap-3 overflow-x-auto pb-1">
                            {order.items.slice(0, 4).map((item, i) => (
                              <div key={i} className="shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-surface-container-low" style={{ height: '4.5rem' }} />
                                ) : (
                                  <div className="w-14 bg-surface-container-low flex items-center justify-center" style={{ height: '4.5rem' }}>
                                    <span className="material-symbols-outlined text-outline">image</span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {order.items.length > 4 && (
                              <span className="font-label-caps text-xs text-on-surface-variant">+{order.items.length - 4} more</span>
                            )}
                            <div className="ml-auto shrink-0 text-right">
                              <p className="font-label-caps text-xs text-on-surface-variant">TOTAL</p>
                              <p className="font-headline-sm text-headline-sm">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-headline-sm text-headline-sm mb-6">My Wishlist</h2>
                {loading ? <Loader fullScreen={false} /> : wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-outline mb-4">favorite</span>
                    <h3 className="font-headline-sm text-headline-sm mb-2">Your wishlist is empty</h3>
                    <p className="text-on-surface-variant mb-6">Save products you love by clicking the heart icon.</p>
                    <Link to="/shop" className="px-8 py-3 border border-on-surface font-label-caps text-label-caps uppercase hover:bg-on-surface hover:text-surface transition-colors">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                    {wishlist.map(product => (
                      <ProductCard key={product.id || product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="max-w-md">
                <h2 className="font-headline-sm text-headline-sm mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">FIRST NAME</label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={e => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                        className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">LAST NAME</label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={e => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                        className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-transparent border-b border-outline-variant py-2 font-body-md text-on-surface-variant cursor-not-allowed"
                    />
                    <p className="text-xs text-on-surface-variant/70 font-label-caps">Email cannot be changed</p>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.subscribed_to_emails}
                      onChange={e => setProfileForm(f => ({ ...f, subscribed_to_emails: e.target.checked }))}
                      className="form-checkbox text-on-surface border-outline"
                    />
                    <span className="font-body-md text-on-surface-variant text-sm">Subscribe to email updates & offers</span>
                  </label>

                  {profileSuccess && (
                    <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 text-sm font-body-md rounded-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Profile updated successfully!
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full border border-on-surface text-on-surface py-3 font-label-caps text-label-caps tracking-widest uppercase hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-60"
                  >
                    {profileSaving ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline-sm text-headline-sm">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressForm({ ...EMPTY_ADDRESS });
                        setShowAddressForm(true);
                      }}
                      className="flex items-center gap-2 font-label-caps text-label-caps border border-on-surface px-4 py-2 hover:bg-on-surface hover:text-surface transition-colors text-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      ADD ADDRESS
                    </button>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="border border-outline-variant p-6 mb-6 max-w-lg">
                    <h3 className="font-label-caps text-label-caps mb-5 tracking-widest">
                      {editingAddress ? 'EDIT ADDRESS' : 'NEW ADDRESS'}
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">LABEL</label>
                        <input type="text" value={addressForm.label} onChange={e => setAddressForm(a => ({ ...a, label: e.target.value }))} placeholder="Home, Work, etc." className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">FIRST NAME</label>
                          <input type="text" required value={addressForm.first_name} onChange={e => setAddressForm(a => ({ ...a, first_name: e.target.value }))} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">LAST NAME</label>
                          <input type="text" required value={addressForm.last_name} onChange={e => setAddressForm(a => ({ ...a, last_name: e.target.value }))} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">STREET ADDRESS</label>
                        <input type="text" required value={addressForm.street_address} onChange={e => setAddressForm(a => ({ ...a, street_address: e.target.value }))} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">CITY</label>
                          <input type="text" required value={addressForm.city} onChange={e => setAddressForm(a => ({ ...a, city: e.target.value }))} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">STATE</label>
                          <input type="text" required maxLength={2} value={addressForm.state} onChange={e => setAddressForm(a => ({ ...a, state: e.target.value.toUpperCase() }))} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors uppercase" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">ZIP</label>
                          <input type="text" required value={addressForm.zip_code} onChange={e => setAddressForm(a => ({ ...a, zip_code: e.target.value }))} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 outline-none transition-colors" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={addressForm.is_default} onChange={e => setAddressForm(a => ({ ...a, is_default: e.target.checked }))} className="form-checkbox text-on-surface border-outline" />
                        <span className="font-label-caps text-xs text-on-surface-variant">Set as default address</span>
                      </label>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="flex-1 bg-on-surface text-surface py-3 font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors text-sm">
                        {editingAddress ? 'UPDATE' : 'SAVE ADDRESS'}
                      </button>
                      <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="flex-1 border border-outline-variant text-on-surface-variant py-3 font-label-caps text-label-caps tracking-widest uppercase hover:border-on-surface hover:text-on-surface transition-colors text-sm">
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                {/* Address List */}
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-outline mb-4">location_on</span>
                    <h3 className="font-headline-sm text-headline-sm mb-2">No saved addresses</h3>
                    <p className="text-on-surface-variant">Add an address for faster checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, i) => (
                      <div key={addr.id || addr._id || i} className={`border p-5 relative ${addr.is_default ? 'border-on-surface' : 'border-outline-variant'}`}>
                        {addr.is_default && (
                          <span className="absolute top-3 right-3 font-label-caps text-[10px] text-primary tracking-wider">DEFAULT</span>
                        )}
                        <p className="font-label-caps text-xs text-on-surface-variant mb-2">{addr.label || 'Address'}</p>
                        <p className="font-body-md text-on-surface">{addr.first_name} {addr.last_name}</p>
                        <p className="text-on-surface-variant text-sm">{addr.street_address}</p>
                        <p className="text-on-surface-variant text-sm">{addr.city}, {addr.state} {addr.zip_code}</p>
                        <div className="flex gap-4 mt-4">
                          <button onClick={() => openEditAddress(addr)} className="font-label-caps text-xs text-on-surface-variant hover:text-primary underline">Edit</button>
                          <button onClick={() => handleDeleteAddress(addr.id || addr._id)} className="font-label-caps text-xs text-on-surface-variant hover:text-error underline">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
