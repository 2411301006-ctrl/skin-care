import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/common/Loader';

export const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await productService.getProducts({ is_bestseller: true, limit: 6 });
        setBestSellers(res.items || []);
      } catch (err) {
        console.error("Failed to load best sellers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 md:pt-16 pb-section-gap w-full max-w-container-max mx-auto overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[751px] min-h-[600px] flex items-center justify-center px-margin-mobile md:px-margin-desktop mb-section-gap group overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-surface-container-low">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center img-zoom-hover opacity-90"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAI9JcT8ZIXuvaHSWPwvBnI_4v2z-L6rvHhG7WoXOl7A88R6RURqxCugYSRy6yGHq_LVMDXIj7eB7FyYHXj_eElYeyf54uppU1LBX8XTAAoRWFipke26RzeLfvdC34sW-aWLwejc9kbItqd-6i2BCGmTr0_h_WC9pbm8Wpq7GZ_K3IlyxCIIPUeLXXReEK5kHzW_sdPsUkQKXBEsr61R_362ZgM0ekW5pwdDDXF7PNmulokbDB4nICZ7A')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/50 via-surface/10 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl px-4 flex flex-col items-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6 drop-shadow-sm">
            Reveal Your Natural Beauty
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg mx-auto">
            Discover our new collection of clean, high-performance skincare and makeup designed to elevate your daily ritual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/shop" 
              className="px-8 py-4 bg-on-surface text-surface font-label-caps text-label-caps tracking-widest hover:bg-secondary transition-colors duration-300 w-full sm:w-auto text-center border border-on-surface uppercase"
            >
              Shop Now
            </Link>
            <Link 
              to="/our-story" 
              className="px-8 py-4 bg-transparent text-on-surface font-label-caps text-label-caps tracking-widest border border-outline hover:border-on-surface transition-colors duration-300 w-full sm:w-auto text-center uppercase"
            >
              Explore Story
            </Link>
          </div>
        </div>
      </section>

      {/* Category Nav Quick Grid */}
      <section className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-container-max mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/shop?category=skincare" className="p-8 bg-surface-container-low text-center rounded-sm hover:bg-surface-container-high transition-colors">
            <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Skincare</h3>
            <span className="font-label-caps text-xs text-on-surface-variant tracking-widest uppercase">Explore Serums & Oils</span>
          </Link>
          <Link to="/shop?category=makeup" className="p-8 bg-surface-container-low text-center rounded-sm hover:bg-surface-container-high transition-colors">
            <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Makeup</h3>
            <span className="font-label-caps text-xs text-on-surface-variant tracking-widest uppercase">Foundations & Lips</span>
          </Link>
          <Link to="/shop?category=fragrance" className="p-8 bg-surface-container-low text-center rounded-sm hover:bg-surface-container-high transition-colors">
            <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Fragrance</h3>
            <span className="font-label-caps text-xs text-on-surface-variant tracking-widest uppercase">Eau De Parfum</span>
          </Link>
          <Link to="/shop?category=wellness" className="p-8 bg-surface-container-low text-center rounded-sm hover:bg-surface-container-high transition-colors">
            <h3 className="font-headline-sm text-headline-sm mb-2 text-on-surface">Wellness</h3>
            <span className="font-label-caps text-xs text-on-surface-variant tracking-widest uppercase">Elixirs & Body</span>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Best Sellers</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Curated essentials for your ritual.</p>
          </div>
          <Link 
            to="/shop" 
            className="hidden md:inline-block font-label-caps text-label-caps text-on-surface border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors tracking-widest uppercase"
          >
            View All Products
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {bestSellers.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/shop" 
            className="inline-block font-label-caps text-label-caps text-on-surface border-b border-on-surface pb-1 tracking-widest uppercase"
          >
            View All Best Sellers
          </Link>
        </div>
      </section>
    </div>
  );
};
