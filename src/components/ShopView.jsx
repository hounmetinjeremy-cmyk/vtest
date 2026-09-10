import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { categories } from '../data/initialData';
import { Search, Sparkles, ShieldCheck, Truck, Headphones, Flame } from 'lucide-react';

export const ShopView = () => {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner / Slider */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface via-[#201c36] to-surface border border-border p-8 md:p-12 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -top-12 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Nouvelle Collection 2025</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            L'excellence à portée de main.
          </h1>

          <p className="text-textSecondary text-base sm:text-lg">
            Découvrez nos produits rigoureusement sélectionnés. Commandez en quelques clics et payez par Mobile Money ou à la livraison.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="#catalog"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all"
            >
              Explorer le catalogue
            </a>
            <div className="flex items-center gap-6 px-4 py-2">
              <div className="flex items-center gap-2 text-xs text-textSecondary">
                <Truck className="w-4 h-4 text-secondary" />
                <span>Livraison Rapide</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-textSecondary">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>100% Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div id="catalog" className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface hover:bg-border text-textSecondary hover:text-white border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Featured Section */}
        {selectedCategory === "Tous" && !searchQuery && featuredProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent animate-pulse" />
              <h2 className="text-xl font-bold text-white">Tendances & Vedettes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Main Catalog Grid */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {selectedCategory === "Tous" ? "Catalogue Complet" : `Catégorie : ${selectedCategory}`}
            </h2>
            <span className="text-xs text-textSecondary">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border">
              <p className="text-textSecondary text-base">Aucun produit ne correspond à votre recherche.</p>
              <button
                onClick={() => { setSelectedCategory("Tous"); setSearchQuery(""); }}
                className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
