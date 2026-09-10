import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { MobileMenu } from './MobileMenu';

export const Navbar = () => {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-surface-container-highest text-on-surface py-2 text-center font-label-caps text-label-caps z-50 fixed top-0 w-full border-b border-outline-variant tracking-wider">
        FREE SHIPPING ON ORDERS OVER $50
      </div>

      {/* Top Header */}
      <header className="fixed top-8 w-full z-40 bg-surface/90 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-outline-variant h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto w-full relative">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary hover:opacity-70 transition-opacity p-2 flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Desktop Left Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
              Shop All
            </Link>
            <Link to="/our-story" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
              Our Story
            </Link>
          </div>

          {/* Brand Logo */}
          <Link 
            to="/" 
            className="font-headline-md text-headline-md tracking-widest text-on-surface text-center md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            GLOW BEAUTY
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/account" 
              className="text-primary hover:opacity-70 transition-opacity flex items-center gap-1 font-label-caps text-label-caps"
              title={user ? `Account (${user.first_name})` : "Sign In"}
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
              <span className="hidden md:inline">{user ? user.first_name : 'Account'}</span>
            </Link>

            <Link 
              to="/cart" 
              className="text-primary hover:opacity-70 transition-opacity flex items-center gap-2 font-label-caps text-label-caps relative"
            >
              <span className="hidden md:inline tracking-widest uppercase">Cart</span>
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Bar (Desktop) */}
      <nav className="hidden md:flex justify-center items-center h-14 bg-surface z-30 fixed top-28 w-full border-b border-outline-variant/30">
        <ul className="flex space-x-10">
          <li>
            <Link to="/shop?category=skincare" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
              Skincare
            </Link>
          </li>
          <li>
            <Link to="/shop?category=makeup" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
              Makeup
            </Link>
          </li>
          <li>
            <Link to="/shop?category=fragrance" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
              Fragrance
            </Link>
          </li>
          <li>
            <Link to="/shop?category=wellness" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
              Wellness
            </Link>
          </li>
          <li>
            <Link to="/shop?is_new=true" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors text-primary font-bold">
              New Arrivals
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
