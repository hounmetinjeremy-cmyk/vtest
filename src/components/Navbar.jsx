import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ShieldCheck, Sparkles, Store, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, cart, setSelectedProduct } = useShop();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => { setSelectedProduct(null); setActiveTab('shop'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-text to-textSecondary bg-clip-text text-transparent">
              E-Shop Pro
            </span>
            <span className="block text-xs text-primary font-semibold tracking-widest uppercase">
              Boutique Premium
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedProduct(null); setActiveTab('shop'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'shop'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-background/50 hover:bg-background text-textSecondary hover:text-white border border-border'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Boutique</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'admin'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-background/50 hover:bg-background text-textSecondary hover:text-white border border-border'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Back-Office</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-border hover:border-primary/50 text-white font-medium text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Panier</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shadow-md animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
