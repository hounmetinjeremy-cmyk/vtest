import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const formatPrice = (price) => price.toLocaleString('fr-FR') + ' FCFA';

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-3xl max-w-3xl w-full overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => { setSelectedProduct(null); setQuantity(1); }}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-white border border-border hover:bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-background">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-secondary uppercase tracking-wider">{selectedProduct.category}</span>
                <div className="flex items-center gap-1 text-warning font-bold text-xs bg-warning/10 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-warning" />
                  <span>{selectedProduct.rating} ({selectedProduct.reviewsCount || 42} avis)</span>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-white">{selectedProduct.name}</h2>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-primary">{formatPrice(selectedProduct.price)}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-textSecondary line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                )}
              </div>

              <p className="text-textSecondary text-sm leading-relaxed">
                {selectedProduct.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-border text-xs text-textSecondary">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-secondary" />
                  <span>Livraison express disponible à domicile</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Garantie constructeur & Satisfait ou remboursé</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-textSecondary uppercase">Quantité</span>
                <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 hover:bg-surface text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 hover:bg-surface text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter au panier • {formatPrice(selectedProduct.price * quantity)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
