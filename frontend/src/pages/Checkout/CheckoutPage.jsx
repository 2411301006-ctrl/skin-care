import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';

const INITIAL_ADDRESS = {
  first_name: '',
  last_name: '',
  street_address: '',
  city: '',
  state: '',
  zip_code: '',
  label: 'Shipping',
  is_default: false,
};

const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit / Debit Card', icon: 'credit_card' },
  { value: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' },
  { value: 'apple_pay', label: 'Apple Pay', icon: 'phone_iphone' },
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState(() => {
    // Pre-fill from default address
    const defaultAddr = user?.addresses?.find(a => a.is_default) || user?.addresses?.[0];
    return defaultAddr ? {
      first_name: defaultAddr.first_name,
      last_name: defaultAddr.last_name,
      street_address: defaultAddr.street_address,
      city: defaultAddr.city,
      state: defaultAddr.state,
      zip_code: defaultAddr.zip_code,
      label: 'Shipping',
      is_default: false,
    } : { ...INITIAL_ADDRESS };
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cart.subtotal || 0;
  const discount = cart.discount_amount || 0;
  const shipping = subtotal - discount >= 50 || subtotal === 0 ? 0 : 10;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleAddressChange = (e) => {
    setShippingAddress(a => ({ ...a, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (cart.items.length === 0) return;

    setPlacing(true);
    setError('');
    try {
      const order = await orderService.createOrder({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        promo_code: cart.promo_code || null,
      });
      await refreshCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-section-gap min-h-screen flex flex-col items-center justify-center text-center px-margin-mobile">
        <span className="material-symbols-outlined text-5xl text-outline mb-4">lock</span>
        <h2 className="font-headline-md text-headline-md mb-3">Sign in to Checkout</h2>
        <p className="text-on-surface-variant mb-6">You need to be signed in to complete your purchase.</p>
        <Link to="/auth" state={{ from: '/checkout' }} className="px-10 py-4 bg-on-surface text-surface font-label-caps text-label-caps uppercase hover:bg-secondary transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="pt-40 pb-section-gap min-h-screen flex flex-col items-center justify-center text-center px-margin-mobile">
        <span className="material-symbols-outlined text-5xl text-outline mb-4">shopping_bag</span>
        <h2 className="font-headline-md text-headline-md mb-3">Your bag is empty</h2>
        <Link to="/shop" className="px-10 py-4 bg-on-surface text-surface font-label-caps text-label-caps uppercase hover:bg-secondary transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-40 pb-section-gap min-h-screen">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12 font-label-caps text-label-caps text-xs tracking-widest">
          <Link to="/cart" className="text-on-surface-variant hover:text-primary">BAG</Link>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface border-b border-on-surface pb-0.5">CHECKOUT</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface-variant">CONFIRMATION</span>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Left: Shipping + Payment */}
            <div className="flex flex-col gap-10">
              {/* Shipping Address */}
              <section>
                <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-on-surface text-surface flex items-center justify-center font-label-caps text-[11px]">1</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { name: 'first_name', label: 'FIRST NAME', placeholder: 'Jane', type: 'text' },
                    { name: 'last_name', label: 'LAST NAME', placeholder: 'Doe', type: 'text' },
                  ].map(({ name, label, placeholder, type }) => (
                    <div key={name} className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={shippingAddress[name]}
                        onChange={handleAddressChange}
                        placeholder={placeholder}
                        required
                        className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">STREET ADDRESS</label>
                    <input
                      type="text"
                      name="street_address"
                      value={shippingAddress.street_address}
                      onChange={handleAddressChange}
                      placeholder="123 Main Street, Apt 4B"
                      required
                      className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">CITY</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="New York"
                      required
                      className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">STATE</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        placeholder="NY"
                        required
                        maxLength={2}
                        className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors uppercase"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">ZIP CODE</label>
                      <input
                        type="text"
                        name="zip_code"
                        value={shippingAddress.zip_code}
                        onChange={handleAddressChange}
                        placeholder="10001"
                        required
                        className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-on-surface text-surface flex items-center justify-center font-label-caps text-[11px]">2</span>
                  Payment Method
                </h2>

                <div className="flex flex-col gap-3 mb-6">
                  {PAYMENT_METHODS.map(({ value, label, icon }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === value ? 'border-on-surface bg-surface-container-low' : 'border-outline-variant hover:border-outline'}`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                        className="form-radio text-on-surface"
                      />
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
                      <span className="font-label-caps text-label-caps">{label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="bg-surface-container-low p-6 flex flex-col gap-4">
                    <p className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-2">
                      <span className="material-symbols-outlined text-[14px] text-primary align-middle mr-1">lock</span>
                      Secured by 256-bit SSL encryption (Demo — no real payment)
                    </p>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">CARDHOLDER NAME</label>
                      <input type="text" value={cardInfo.name} onChange={e => setCardInfo(c => ({ ...c, name: e.target.value }))} placeholder="Jane Doe" className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">CARD NUMBER</label>
                      <input type="text" value={cardInfo.number} onChange={e => setCardInfo(c => ({ ...c, number: e.target.value }))} placeholder="•••• •••• •••• ••••" maxLength={19} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors tracking-widest" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">EXPIRY DATE</label>
                        <input type="text" value={cardInfo.expiry} onChange={e => setCardInfo(c => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">CVV</label>
                        <input type="text" value={cardInfo.cvv} onChange={e => setCardInfo(c => ({ ...c, cvv: e.target.value }))} placeholder="•••" maxLength={4} className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors" />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {error && (
                <div className="bg-error/10 border border-error/30 text-error px-4 py-3 text-sm font-body-md rounded-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-surface p-8 border border-outline-variant sticky top-32">
              <h2 className="font-headline-sm text-headline-sm mb-6 border-b border-outline-variant pb-4">Order Summary</h2>

              <div className="flex flex-col gap-4 mb-6 max-h-48 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img src={item.image || 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg'} alt={item.name} className="w-14 h-18 object-cover bg-surface-container-low" style={{ height: '4.5rem' }} />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-on-surface text-surface flex items-center justify-center font-label-caps text-[10px]">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-md text-sm text-on-surface line-clamp-1">{item.name}</p>
                      {item.variant_label && <p className="text-on-surface-variant text-xs">{item.variant_label}</p>}
                    </div>
                    <span className="font-body-md text-sm shrink-0">${(item.current_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-outline-variant pt-4 mb-6 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({cart.promo_code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-on-surface">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-headline-sm text-headline-sm border-t border-outline-variant pt-4 mb-8">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-on-surface text-surface py-4 font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    PLACING ORDER...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    PLACE ORDER · ${total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-center text-on-surface-variant font-label-caps text-[10px] mt-4 tracking-wider">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
