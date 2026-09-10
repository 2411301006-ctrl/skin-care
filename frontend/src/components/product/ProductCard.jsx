import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

export const ProductCard = ({ product }) => {
  const { user, refreshProfile } = useAuth();
  const isWishlisted = user?.wishlist_product_ids?.includes(product.id || product._id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please sign in to manage your wishlist.");
      return;
    }
    const pid = product.id || product._id;
    try {
      if (isWishlisted) {
        await userService.removeFromWishlist(pid);
      } else {
        await userService.addToWishlist(pid);
      }
      refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const image = product.images?.[0] || 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg';
  const brandName = product.brand_name || "GLOW BEAUTY";

  return (
    <div className="group flex flex-col cursor-pointer relative">
      <Link to={`/product/${product.slug || product._id || product.id}`}>
        <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-4 rounded-sm isolate">
          <img 
            src={image} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          />

          {/* Badges */}
          {product.is_new && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-surface/80 backdrop-blur-sm font-label-caps text-[10px] text-on-surface border border-outline/20">
              NEW
            </div>
          )}
          {!product.is_new && product.is_bestseller && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-surface/80 backdrop-blur-sm font-label-caps text-[10px] text-on-surface border border-outline/20">
              BESTSELLER
            </div>
          )}

          {/* Wishlist Icon Button */}
          <button 
            onClick={toggleWishlist}
            aria-label="Add to wishlist" 
            className={`absolute top-2 right-2 p-2 rounded-full bg-surface/80 backdrop-blur-sm transition-opacity hover:bg-surface text-on-surface ${isWishlisted ? 'opacity-100 text-error' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isWishlisted ? 'filled-icon text-error' : ''}`}>
              favorite
            </span>
          </button>
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
          {brandName}
        </span>
        <Link to={`/product/${product.slug || product._id || product.id}`}>
          <h3 className="font-body-md text-body-md text-on-surface mb-2 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2">
          <RatingStars rating={product.rating_avg} count={product.rating_count} />
        </div>

        <div className="mt-auto pt-2 flex items-center gap-2">
          <span className="font-body-md text-body-md text-on-surface font-semibold">
            ${product.price?.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-on-surface-variant line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
