import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Loader } from '../../components/common/Loader';

const STATUS_CONFIG = {
  processing: { label: 'Processing', icon: 'schedule', color: 'text-secondary' },
  shipped: { label: 'Shipped', icon: 'local_shipping', color: 'text-primary' },
  delivered: { label: 'Delivered', icon: 'check_circle', color: 'text-success' },
  cancelled: { label: 'Cancelled', icon: 'cancel', color: 'text-error' },
};

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <Loader />;

  if (!order) return (
    <div className="pt-40 flex flex-col items-center justify-center min-h-[60vh] text-center px-margin-mobile">
      <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
      <h2 className="font-headline-md text-headline-md mb-3">Order Not Found</h2>
      <Link to="/account" className="px-8 py-3 border border-on-surface font-label-caps text-label-caps uppercase hover:bg-on-surface hover:text-surface transition-colors mt-2">
        View My Orders
      </Link>
    </div>
  );

  const statusCfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG['processing'];

  return (
    <div className="pt-28 md:pt-40 pb-section-gap min-h-screen">
      <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary filled-icon">check_circle</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">Thank You!</h1>
          <p className="text-on-surface-variant font-body-md">
            Your order has been placed successfully. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="border border-outline-variant divide-y divide-outline-variant mb-8">
          {/* Order ID + Status */}
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-1">ORDER NUMBER</p>
              <p className="font-body-md text-on-surface font-medium">#{order.id?.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-1">DATE</p>
              <p className="font-body-md text-on-surface">
                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-1">STATUS</p>
              <div className={`flex items-center gap-1 font-label-caps text-label-caps ${statusCfg.color}`}>
                <span className="material-symbols-outlined text-[16px]">{statusCfg.icon}</span>
                {statusCfg.label}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6">
            <h3 className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-4">ITEMS ORDERED</h3>
            <div className="flex flex-col gap-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 object-cover bg-surface-container-low" style={{ height: '4.5rem' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-on-surface line-clamp-1">{item.name}</p>
                    {item.variant_label && <p className="text-on-surface-variant text-xs">{item.variant_label}</p>}
                    <p className="font-label-caps text-xs text-on-surface-variant mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-body-md text-on-surface shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6">
            <h3 className="font-label-caps text-xs text-on-surface-variant tracking-wider mb-3">SHIPPING TO</h3>
            <p className="font-body-md text-on-surface">
              {order.shipping_address.first_name} {order.shipping_address.last_name}
            </p>
            <p className="text-on-surface-variant text-sm">{order.shipping_address.street_address}</p>
            <p className="text-on-surface-variant text-sm">
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="p-6">
            <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-on-surface">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.promo_code && (
                <div className="flex justify-between text-primary">
                  <span>Promo: {order.promo_code}</span>
                  <span>-${(order.subtotal - order.total + order.shipping_cost).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-on-surface">{order.shipping_cost === 0 ? 'FREE' : `$${order.shipping_cost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-headline-sm text-headline-sm text-on-surface border-t border-outline-variant pt-3 mt-1">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account"
            className="px-8 py-3 border border-on-surface text-on-surface font-label-caps text-label-caps tracking-widest uppercase hover:bg-on-surface hover:text-surface transition-colors text-center"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 bg-on-surface text-surface font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
