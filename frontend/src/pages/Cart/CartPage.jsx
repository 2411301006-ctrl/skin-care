import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartLineItem } from '../../components/cart/CartLineItem';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { Loader } from '../../components/common/Loader';

export const CartPage = () => {
  const { cart, loading } = useCart();

  if (loading) return <Loader />;

  return (
    <div className="pt-28 md:pt-40 pb-section-gap min-h-screen">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-10">Your Bag</h1>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-6">shopping_bag</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">Your bag is empty</h2>
            <p className="text-on-surface-variant mb-8 max-w-md">
              Looks like you haven't added anything yet. Explore our collection and find your next favourite beauty essential.
            </p>
            <Link
              to="/shop"
              className="px-10 py-4 bg-on-surface text-surface font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Cart Items */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">
                  {cart.items.length} ITEM{cart.items.length !== 1 ? 'S' : ''}
                </span>
                <Link
                  to="/shop"
                  className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors text-xs underline underline-offset-2"
                >
                  Continue Shopping
                </Link>
              </div>
              {cart.items.map((item) => (
                <CartLineItem
                  key={`${item.product_id}-${item.variant_id || 'default'}`}
                  item={item}
                />
              ))}
            </div>

            {/* Order Summary */}
            <OrderSummary showCheckoutBtn={true} />
          </div>
        )}
      </div>
    </div>
  );
};
