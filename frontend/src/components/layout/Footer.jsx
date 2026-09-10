import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export const Footer = () => {
  const { itemCount } = useCart();

  return (
    <>
      {/* Footer */}
      <footer className="w-full mt-section-gap flex flex-col items-center py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-outline-variant/30 pb-24 md:pb-16">
        <div className="font-headline-sm text-headline-sm mb-4 text-on-surface tracking-widest">
          GLOW BEAUTY
        </div>

        <nav className="mb-12 w-full max-w-2xl">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-body-md text-body-md">
            <li>
              <Link to="/our-story" className="text-secondary hover:underline transition-all">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-secondary hover:underline transition-all">
                Shop All
              </Link>
            </li>
            <li>
              <a href="#shipping" className="text-secondary hover:underline transition-all">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#privacy" className="text-secondary hover:underline transition-all">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#contact" className="text-secondary hover:underline transition-all">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>

        <div className="font-label-caps text-label-caps text-secondary opacity-70">
          © {new Date().getFullYear()} GLOW BEAUTY. ALL RIGHTS RESERVED.
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 bg-surface border-t border-outline-variant z-40 pb-safe">
        <Link 
          to="/shop" 
          className="flex flex-col items-center justify-center text-on-secondary-container hover:text-primary transition-transform active:scale-90 w-1/4 h-full"
        >
          <span className="material-symbols-outlined text-[22px] mb-1">storefront</span>
          <span className="font-label-caps text-[10px] tracking-widest">Shop</span>
        </Link>
        <Link 
          to="/account" 
          className="flex flex-col items-center justify-center text-on-secondary-container hover:text-primary transition-transform active:scale-90 w-1/4 h-full"
        >
          <span className="material-symbols-outlined text-[22px] mb-1">favorite</span>
          <span className="font-label-caps text-[10px] tracking-widest">Wishlist</span>
        </Link>
        <Link 
          to="/account" 
          className="flex flex-col items-center justify-center text-on-secondary-container hover:text-primary transition-transform active:scale-90 w-1/4 h-full"
        >
          <span className="material-symbols-outlined text-[22px] mb-1">person</span>
          <span className="font-label-caps text-[10px] tracking-widest">Account</span>
        </Link>
        <Link 
          to="/cart" 
          className="flex flex-col items-center justify-center text-primary font-bold transition-transform active:scale-90 w-1/4 h-full relative"
        >
          <span className="material-symbols-outlined text-[22px] mb-1 filled-icon">shopping_bag</span>
          <span className="font-label-caps text-[10px] tracking-widest">Cart</span>
          {itemCount > 0 && (
            <span className="absolute top-2 right-6 bg-error text-on-error rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </>
  );
};
