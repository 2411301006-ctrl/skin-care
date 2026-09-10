import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-surface flex flex-col pt-24 px- margin-mobile">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant px-4">
        <span className="font-headline-sm text-headline-sm text-on-surface">Menu</span>
        <button onClick={onClose} className="p-2 text-on-surface">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <nav className="flex flex-col space-y-6 px-4">
        <Link 
          to="/shop" 
          onClick={onClose} 
          className="font-label-caps text-lg tracking-widest text-on-surface hover:text-primary transition-colors"
        >
          Shop All
        </Link>
        <Link 
          to="/shop?category=skincare" 
          onClick={onClose} 
          className="font-label-caps text-lg tracking-widest text-on-surface-variant hover:text-primary transition-colors pl-4 border-l-2 border-outline-variant"
        >
          Skincare
        </Link>
        <Link 
          to="/shop?category=makeup" 
          onClick={onClose} 
          className="font-label-caps text-lg tracking-widest text-on-surface-variant hover:text-primary transition-colors pl-4 border-l-2 border-outline-variant"
        >
          Makeup
        </Link>
        <Link 
          to="/shop?category=fragrance" 
          onClick={onClose} 
          className="font-label-caps text-lg tracking-widest text-on-surface-variant hover:text-primary transition-colors pl-4 border-l-2 border-outline-variant"
        >
          Fragrance
        </Link>
        <Link 
          to="/shop?category=wellness" 
          onClick={onClose} 
          className="font-label-caps text-lg tracking-widest text-on-surface-variant hover:text-primary transition-colors pl-4 border-l-2 border-outline-variant"
        >
          Wellness
        </Link>
        <Link 
          to="/our-story" 
          onClick={onClose} 
          className="font-label-caps text-lg tracking-widest text-on-surface hover:text-primary transition-colors"
        >
          Our Story
        </Link>
        
        <hr className="border-outline-variant my-4" />

        {user ? (
          <>
            <Link 
              to="/account" 
              onClick={onClose} 
              className="font-label-caps text-md tracking-widest text-primary flex items-center gap-2"
            >
              <span className="material-symbols-outlined">person</span>
              My Account ({user.first_name})
            </Link>
            <button 
              onClick={() => { logout(); onClose(); }} 
              className="font-label-caps text-md tracking-widest text-error flex items-center gap-2 text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </>
        ) : (
          <Link 
            to="/account" 
            onClick={onClose} 
            className="font-label-caps text-md tracking-widest text-on-surface flex items-center gap-2"
          >
            <span className="material-symbols-outlined">login</span>
            Sign In / Register
          </Link>
        )}
      </nav>
    </div>
  );
};
