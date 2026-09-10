import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ShieldAlert, Store, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, cart } = useShop();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('shop')}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight block">
              E-Shop <span className="text-primary">Pro</span>
            </span>
            <span className="text-xs text-textSecondary block">Boutique & Back-Office</span>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-textSecondary hover:text-white hover:bg-border/50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Boutique</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cart' || activeTab === 'checkout'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-textSecondary hover:text-white hover:bg-border/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Panier</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'admin'
                ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/25'
                : 'border-border text-textSecondary hover:text-white hover:bg-border/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-secondary" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
