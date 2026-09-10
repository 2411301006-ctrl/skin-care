import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { Home } from './pages/Home/Home';
import { ShopAll } from './pages/ShopAll/ShopAll';
import { ProductDetail } from './pages/ProductDetail/ProductDetail';
import { CartPage } from './pages/Cart/CartPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { AccountPage } from './pages/Account/AccountPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { OrderConfirmation } from './pages/OrderConfirmation/OrderConfirmation';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopAll />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          {/* Fallback */}
          <Route path="*" element={
            <div className="pt-40 flex flex-col items-center justify-center text-center px-6 min-h-[60vh]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
              <h2 className="font-headline-md text-headline-md mb-2">Page Not Found</h2>
              <p className="text-on-surface-variant mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="px-8 py-3 border border-on-surface font-label-caps text-label-caps uppercase hover:bg-on-surface hover:text-surface transition-colors">
                Return Home
              </a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default App;
