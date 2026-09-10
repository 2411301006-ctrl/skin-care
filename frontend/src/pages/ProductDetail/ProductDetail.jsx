import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductTabs } from '../../components/product/ProductTabs';
import { ShadeSelector } from '../../components/product/ShadeSelector';
import { RatingStars } from '../../components/product/RatingStars';
import { Loader } from '../../components/common/Loader';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, refreshProfile } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const isWishlisted = user?.wishlist_product_ids?.includes(product?.id || product?._id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setLoading(true);
    async function load() {
      try {
        const p = await productService.getProductBySlug(slug);
        setProduct(p);
        if (p.variants?.length) {
          setSelectedVariant(p.variants[0]);
        }
        const pid = p.id || p._id;
        const [rev, rel] = await Promise.allSettled([
          productService.getReviews(pid),
          productService.getProducts({ category: p.category_id, limit: 5 })
        ]);
        if (rev.status === 'fulfilled') setReviews(rev.value || []);
        if (rel.status === 'fulfilled') {
          setRelated((rel.value?.items || []).filter(r => (r.id || r._id) !== pid).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const pid = product.id || product._id;
      await addToCart(pid, selectedVariant?.variant_id || null, quantity, product.name);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) { navigate('/auth'); return; }
    const pid = product.id || product._id;
    try {
      if (isWishlisted) {
        await userService.removeFromWishlist(pid);
      } else {
        await userService.addToWishlist(pid);
      }
      refreshProfile();
    } catch (err) { console.error(err); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const pid = product.id || product._id;
      await productService.createReview(pid, reviewForm);
      const updated = await productService.getReviews(pid);
      setReviews(updated || []);
      setReviewForm({ rating: 5, title: '', body: '' });
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;

  if (!product) return (
    <div className="pt-40 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
      <h2 className="font-headline-md text-headline-md mb-2">Product Not Found</h2>
      <Link to="/shop" className="px-8 py-3 border border-on-surface font-label-caps text-label-caps uppercase hover:bg-on-surface hover:text-surface transition-colors mt-4">
        Back to Shop
      </Link>
    </div>
  );

  const images = product.images?.length ? product.images : ['https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg'];

  return (
    <div className="pt-28 md:pt-40 pb-section-gap">
      {/* Breadcrumb */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-8">
        <nav className="flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant text-xs tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          {product.category_name && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category_id}`} className="hover:text-primary transition-colors capitalize">{product.category_name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-on-surface truncate max-w-[160px]">{product.name}</span>
        </nav>
      </div>

      {/* Product Hero */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-20 border-2 overflow-hidden transition-colors ${selectedImage === i ? 'border-on-surface' : 'border-transparent hover:border-outline-variant'}`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main Image */}
            <div className="flex-1 relative overflow-hidden bg-surface-container-low aspect-[4/5]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.is_new && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-surface/80 backdrop-blur-sm font-label-caps text-[10px] text-on-surface border border-outline/20">NEW</span>
              )}
              {!product.is_new && product.is_bestseller && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-surface/80 backdrop-blur-sm font-label-caps text-[10px] text-on-surface border border-outline/20">BESTSELLER</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col py-4">
            <span className="font-label-caps text-label-caps text-primary tracking-widest mb-2 uppercase">
              {product.brand_name || 'GLOW BEAUTY'}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <RatingStars rating={product.rating_avg} count={product.rating_count} />
              <a href="#reviews" className="font-label-caps text-label-caps text-on-surface-variant underline hover:text-primary text-xs">
                {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
              </a>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display-sm text-display-sm text-on-surface">${product.price?.toFixed(2)}</span>
              {product.compare_at_price && (
                <span className="text-on-surface-variant line-through text-lg">${product.compare_at_price.toFixed(2)}</span>
              )}
              {product.compare_at_price && (
                <span className="font-label-caps text-label-caps text-primary text-xs">
                  {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Shade Selector */}
            {product.variants?.length > 0 && (
              <ShadeSelector
                variants={product.variants}
                selectedVariantId={selectedVariant?.variant_id}
                onSelect={(v) => setSelectedVariant(v)}
              />
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center border border-outline-variant h-12 w-32">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex-1 h-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
                  aria-label="Decrease quantity"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="flex-1 text-center font-label-caps text-label-caps">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex-1 h-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
                  aria-label="Increase quantity"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-on-surface text-surface py-3 font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                )}
                {addingToCart ? 'ADDING...' : 'ADD TO BAG'}
              </button>

              <button
                onClick={toggleWishlist}
                aria-label="Toggle wishlist"
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${isWishlisted ? 'border-error text-error' : 'border-outline-variant text-on-surface-variant hover:border-on-surface'}`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isWishlisted ? 'filled-icon' : ''}`}>favorite</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-outline-variant pt-6 flex flex-col gap-3">
              {[
                { icon: 'local_shipping', label: 'FREE shipping on orders over $50' },
                { icon: 'autorenew', label: '30-day hassle-free returns' },
                { icon: 'verified', label: 'Authenticity guaranteed' },
              ].map(({ icon, label }) => (
                <div key={icon} className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
                  <span className="font-label-caps text-label-caps text-xs tracking-wider">{label}</span>
                </div>
              ))}
            </div>

            {/* Product Accordion Tabs */}
            <ProductTabs
              description={product.description}
              ingredients={product.ingredients}
              howToUse={product.how_to_use}
            />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap border-t border-outline-variant pt-16">
        <h2 className="font-headline-md text-headline-md mb-10">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Rating Overview */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md text-on-surface">{(product.rating_avg || 0).toFixed(1)}</span>
              <span className="text-on-surface-variant text-sm">/ 5</span>
            </div>
            <RatingStars rating={product.rating_avg} count={product.rating_count} />
            <p className="text-on-surface-variant text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>

            {/* Write a Review */}
            <div className="w-full mt-6 border-t border-outline-variant pt-6">
              <h3 className="font-label-caps text-label-caps mb-4 tracking-widest">WRITE A REVIEW</h3>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant tracking-wider block mb-1">RATING</label>
                  <select
                    value={reviewForm.rating}
                    onChange={e => setReviewForm(f => ({ ...f, rating: parseInt(e.target.value) }))}
                    className="w-full bg-transparent border border-outline-variant p-2 font-body-md focus:border-on-surface focus:ring-0"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Review Title"
                  value={reviewForm.title}
                  onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-transparent border-b border-outline-variant py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant"
                  required
                />
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.body}
                  onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                  className="w-full bg-transparent border border-outline-variant p-3 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant resize-none h-24"
                  required
                />
                {reviewError && <p className="text-error text-sm font-body-md">{reviewError}</p>}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full border border-on-surface text-on-surface font-label-caps text-label-caps py-3 hover:bg-on-surface hover:text-surface transition-colors uppercase tracking-widest disabled:opacity-60"
                >
                  {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-3">rate_review</span>
                <p className="font-body-md">Be the first to review this product.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-outline-variant">
                {reviews.map((rev, i) => (
                  <div key={rev.id || rev._id || i} className="py-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface">{rev.reviewer_name || 'Verified Buyer'}</p>
                        <RatingStars rating={rev.rating} />
                      </div>
                      <span className="font-label-caps text-xs text-on-surface-variant">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    {rev.title && <p className="font-body-md font-semibold text-on-surface mb-1">{rev.title}</p>}
                    <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">{rev.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-t border-outline-variant pt-16">
          <h2 className="font-headline-md text-headline-md mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {related.map(p => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
