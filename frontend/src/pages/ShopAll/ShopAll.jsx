import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { Loader } from '../../components/common/Loader';

export const ShopAll = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Categories & Brands list
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Query state derived from URL params
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const isNewParam = searchParams.get('is_new') === 'true';

  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const [catData, brandData] = await Promise.all([
          productService.getCategories(),
          productService.getBrands()
        ]);
        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        console.error("Meta load error:", err);
      }
    }
    fetchMeta();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await productService.getProducts({
          category: categoryParam,
          brand: brandParam,
          min_price: minPriceParam ? parseFloat(minPriceParam) : undefined,
          max_price: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
          search: searchParam,
          sort: sortParam,
          is_new: isNewParam ? true : undefined,
          page: pageParam,
          limit: 12
        });
        setProducts(res.items || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryParam, brandParam, minPriceParam, maxPriceParam, sortParam, searchParam, pageParam, isNewParam]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceApply = () => {
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) newParams.set('min_price', minPrice);
    else newParams.delete('min_price');
    if (maxPrice) newParams.set('max_price', maxPrice);
    else newParams.delete('max_price');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setMinPrice('');
    setMaxPrice('');
    setSearchInput('');
  };

  return (
    <main className="flex-1 pt-28 flex flex-col lg:flex-row max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop gap-gutter mb-section-gap">
      {/* Sidebar Filters (Desktop) */}
      <aside className="hidden lg:block w-64 shrink-0 pt-6 sticky top-36 h-[calc(100vh-10rem)] overflow-y-auto pr-4 border-r border-outline-variant/40">
        <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
          <h2 className="font-headline-sm text-headline-sm">Filters</h2>
          {(categoryParam || brandParam || minPriceParam || maxPriceParam || searchParam || isNewParam) && (
            <button onClick={clearAllFilters} className="font-label-caps text-xs text-secondary underline hover:text-primary">
              Clear All
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">CATEGORIES</h3>
          <ul className="space-y-3 font-body-md text-body-md text-on-surface">
            <li className="flex items-center gap-2 cursor-pointer hover:text-primary">
              <input 
                type="radio" 
                name="category_radio"
                checked={!categoryParam} 
                onChange={() => updateParam('category', '')}
                className="form-radio border-outline text-primary rounded-sm focus:ring-0" 
              /> 
              All Categories
            </li>
            {categories.map(cat => (
              <li key={cat.id || cat._id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input 
                  type="radio" 
                  name="category_radio"
                  checked={categoryParam === cat.slug} 
                  onChange={() => updateParam('category', cat.slug)}
                  className="form-radio border-outline text-primary rounded-sm focus:ring-0" 
                /> 
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Brand Filter */}
        <div className="mb-8">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">BRAND</h3>
          <ul className="space-y-3 font-body-md text-body-md text-on-surface">
            <li className="flex items-center gap-2 cursor-pointer hover:text-primary">
              <input 
                type="radio" 
                name="brand_radio"
                checked={!brandParam} 
                onChange={() => updateParam('brand', '')}
                className="form-radio border-outline text-primary rounded-sm focus:ring-0" 
              /> 
              All Brands
            </li>
            {brands.map(b => (
              <li key={b.id || b._id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input 
                  type="radio" 
                  name="brand_radio"
                  checked={brandParam === b.slug} 
                  onChange={() => updateParam('brand', b.slug)}
                  className="form-radio border-outline text-primary rounded-sm focus:ring-0" 
                /> 
                {b.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Filter */}
        <div className="mb-8">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">PRICE ($)</h3>
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border-b border-outline bg-transparent text-body-md focus:border-on-surface focus:ring-0 px-0 py-1"
            />
            <span className="text-on-surface-variant">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border-b border-outline bg-transparent text-body-md focus:border-on-surface focus:ring-0 px-0 py-1"
            />
          </div>
          <button 
            onClick={handlePriceApply}
            className="w-full border border-on-surface text-on-surface font-label-caps text-label-caps py-2 hover:bg-on-surface hover:text-surface transition-colors tracking-widest uppercase"
          >
            APPLY PRICE
          </button>
        </div>
      </aside>

      {/* Main Product Grid Area */}
      <section className="flex-1 pt-6">
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant pl-8 pr-4 py-2 font-body-md text-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant transition-colors"
            />
          </form>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button 
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 font-label-caps text-label-caps text-on-surface border border-outline-variant px-4 py-2 rounded-sm"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span> Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">SORT BY</span>
              <select 
                value={sortParam} 
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-transparent border-none font-body-md text-body-md text-on-surface cursor-pointer focus:ring-0 pr-8"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden mb-8 p-6 bg-surface-container-low rounded-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Category */}
            <div className="mb-6">
              <h4 className="font-label-caps text-xs text-on-surface-variant mb-2">CATEGORY</h4>
              <select 
                value={categoryParam} 
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full bg-surface border border-outline-variant p-2 font-body-md"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            {/* Brand */}
            <div className="mb-6">
              <h4 className="font-label-caps text-xs text-on-surface-variant mb-2">BRAND</h4>
              <select 
                value={brandParam} 
                onChange={(e) => updateParam('brand', e.target.value)}
                className="w-full bg-surface border border-outline-variant p-2 font-body-md"
              >
                <option value="">All Brands</option>
                {brands.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {(categoryParam || brandParam || searchParam || minPriceParam || maxPriceParam || isNewParam) && (
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <span className="text-xs text-on-surface-variant font-label-caps mr-2">Active Filters:</span>
            {categoryParam && (
              <span className="px-3 py-1 bg-surface-container-high font-label-caps text-[11px] flex items-center gap-1 rounded-sm">
                Category: {categoryParam} 
                <button onClick={() => updateParam('category', '')} className="material-symbols-outlined text-[14px]">close</button>
              </span>
            )}
            {brandParam && (
              <span className="px-3 py-1 bg-surface-container-high font-label-caps text-[11px] flex items-center gap-1 rounded-sm">
                Brand: {brandParam} 
                <button onClick={() => updateParam('brand', '')} className="material-symbols-outlined text-[14px]">close</button>
              </span>
            )}
            {searchParam && (
              <span className="px-3 py-1 bg-surface-container-high font-label-caps text-[11px] flex items-center gap-1 rounded-sm">
                Search: "{searchParam}" 
                <button onClick={() => updateParam('search', '')} className="material-symbols-outlined text-[14px]">close</button>
              </span>
            )}
            {isNewParam && (
              <span className="px-3 py-1 bg-surface-container-high font-label-caps text-[11px] flex items-center gap-1 rounded-sm">
                New Arrivals 
                <button onClick={() => updateParam('is_new', '')} className="material-symbols-outlined text-[14px]">close</button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <Loader fullScreen={false} />
        ) : products.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-4">search_off</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No Products Found</h3>
            <p className="text-on-surface-variant mb-6">Try adjusting your filters or search criteria.</p>
            <button 
              onClick={clearAllFilters}
              className="px-6 py-3 border border-on-surface font-label-caps text-label-caps uppercase hover:bg-on-surface hover:text-surface transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
              {products.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  disabled={pageParam <= 1}
                  onClick={() => handlePageChange(pageParam - 1)}
                  className="px-4 py-2 border border-outline-variant font-label-caps text-xs disabled:opacity-30 hover:border-on-surface"
                >
                  PREVIOUS
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 font-label-caps text-xs rounded-sm ${pageParam === i + 1 ? 'bg-on-surface text-surface' : 'hover:bg-surface-container-high'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={pageParam >= pages}
                  onClick={() => handlePageChange(pageParam + 1)}
                  className="px-4 py-2 border border-outline-variant font-label-caps text-xs disabled:opacity-30 hover:border-on-surface"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};
