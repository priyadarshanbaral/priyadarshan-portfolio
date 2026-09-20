import React, { useState } from 'react';
import { ProductItem, CartItem } from '../../types';
import { INITIAL_PRODUCTS } from '../../data/portfolioData';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  CheckCircle2,
  CreditCard,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const EcommerceSim: React.FC = () => {
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
    { product: INITIAL_PRODUCTS[1], quantity: 2 },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>({
    code: 'PRIYA10',
    percent: 10,
  });
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string; total: number } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = ['All', 'Electronics', 'Accessories', 'Audio', 'Ergonomics'];

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.');
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'PRIYA10') {
      setAppliedDiscount({ code: 'PRIYA10', percent: 10 });
      showToast('Coupon PRIYA10 applied: 10% discount!');
      setCouponCode('');
    } else if (code === 'WELCOME20') {
      setAppliedDiscount({ code: 'WELCOME20', percent: 20 });
      showToast('Coupon WELCOME20 applied: 20% discount!');
      setCouponCode('');
    } else {
      setCouponError('Invalid voucher code. Try "PRIYA10" or "WELCOME20"');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent) / 100) : 0;
  const shipping = subtotal > 2000 ? 0 : 150;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-PB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderConfirmed({ id: orderId, total: grandTotal });
    setCart([]);
    setShowCheckoutModal(false);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="bg-neutral-950/80 px-6 py-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              Online Shopping Website (E-Commerce Frontend)
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                Interactive Sandbox
              </span>
            </h4>
            <p className="text-xs text-neutral-400">
              Simulating dynamic product catalog, client-side cart state management, and checkout workflow.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === c
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="bg-amber-950/90 border-b border-amber-700/50 px-6 py-2.5 text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-amber-400 hover:text-amber-200">
            ✕
          </button>
        </div>
      )}

      {/* Order Confirmation Alert */}
      {orderConfirmed && (
        <div className="m-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-emerald-300">
                Order Placed Successfully! (Order ID: {orderConfirmed.id})
              </h5>
              <p className="text-xs text-emerald-200/80 mt-1">
                Simulated transaction confirmed. Total: ₹{orderConfirmed.total.toLocaleString('en-IN')}. State logic verified.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOrderConfirmed(null)}
            className="text-xs px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/40"
          >
            Start New Order
          </button>
        </div>
      )}

      {/* Main Grid: Products + Cart Sidebar */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Showing {filteredProducts.length} developer gear items</span>
            <span className="font-mono text-amber-400">Free delivery on orders &gt; ₹2,000</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{product.image}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {product.category}
                    </span>
                  </div>
                  <h5 className="text-sm font-semibold text-neutral-100 group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-amber-400 font-medium">★ {product.rating}</span>
                    <span className="text-xs text-neutral-500">•</span>
                    <span className="text-xs text-neutral-400">{product.stock} in stock</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between">
                  <div className="text-base font-bold text-neutral-100 font-mono">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <button
                    id={`btn-cart-add-${product.id}`}
                    onClick={() => addToCart(product)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout Panel */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h5 className="font-semibold text-sm text-neutral-100 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                Your Shopping Cart
              </h5>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-amber-400 border border-neutral-800">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </div>

            {/* Cart Items List */}
            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  Your cart is empty. Add products from the catalog!
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-neutral-200 truncate">{item.product.name}</div>
                      <div className="text-[11px] font-mono text-neutral-400">
                        ₹{item.product.price} × {item.quantity} = ₹
                        {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium px-1 text-neutral-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-5 h-5 rounded hover:bg-rose-950/60 flex items-center justify-center text-neutral-500 hover:text-rose-400 text-xs ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Coupon Code Section */}
            {cart.length > 0 && (
              <form onSubmit={applyCoupon} className="mt-4 pt-3 border-t border-neutral-900">
                <label className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" /> Have a discount code? Try <code className="text-amber-300 font-mono">PRIYA10</code>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. PRIYA10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                {appliedDiscount && (
                  <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center justify-between">
                    <span>Discount active: {appliedDiscount.code} (-{appliedDiscount.percent}%)</span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      className="text-neutral-400 hover:text-neutral-200 underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Pricing breakdown and checkout */}
          {cart.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-200">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-400">
                  <span>Voucher Discount</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Shipping Delivery</span>
                <span className="font-mono text-neutral-200">
                  {shipping === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-100 pt-2 border-t border-neutral-800/60">
                <span>Total Amount</span>
                <span className="font-mono text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                id="btn-ecommerce-checkout"
                onClick={() => setShowCheckoutModal(true)}
                className="w-full mt-3 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                Proceed to Checkout (Simulation)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Simulated Checkout & Payment
              </h4>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-neutral-400 hover:text-neutral-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompletePayment} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Order Total ({cart.length} items):</span>
                  <span className="font-bold text-amber-400 font-mono">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Test transaction simulation. No actual credit card is charged.
                </p>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Full Shipping Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Priyadarshan Baral"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  defaultValue="Near NMIET Campus, Bhubaneswar, Odisha - 751024"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-300 flex items-center gap-2 font-medium">
                    <CreditCard className="w-4 h-4" /> UPI / Net Banking
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Cash on Delivery
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold flex items-center gap-2 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Simulate Payment ₹{grandTotal.toLocaleString('en-IN')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
