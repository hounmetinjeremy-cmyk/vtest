import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingBag, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setActiveTab } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR') + ' FCFA';
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background text-white flex items-center justify-center border border-border transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-background aspect-square md:aspect-auto">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider px-3 py-1 bg-secondary/10 rounded-full">
                  {selectedProduct.category}
                </span>
                <div className="flex items-center gap-1 text-warning text-sm font-bold">
                  <Star className="w-4 h-4 fill-warning" />
                  <span>{selectedProduct.rating} / 5.0</span>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {selectedProduct.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-extrabold text-white">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-base text-textSecondary line-through">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-textSecondary text-sm leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="space-y-3 mb-6 bg-background/50 p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3 text-xs text-textSecondary">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Livraison rapide disponible à domicile (Cotonou, Abidjan, Dakar...)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-textSecondary">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Paiement sécurisé via Mobile Money ou à la livraison</span>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-textSecondary">Quantité :</span>
                <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-surface text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-surface text-white font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-textSecondary">
                  ({selectedProduct.stock} en stock)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  addToCart(selectedProduct, quantity);
                  setSelectedProduct(null);
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-background hover:bg-border text-white text-sm font-bold border border-border transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-primary" />
                Ajouter
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all"
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
