import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Star, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR') + ' FCFA';
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group bg-surface rounded-2xl border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            -{discountPercent}%
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => setSelectedProduct(product)}
            className="w-10 h-10 rounded-xl bg-surface/90 text-white flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
            title="Voir les détails"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => addToCart(product)}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
            title="Ajouter au panier"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-warning text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-warning" />
            <span>{product.rating}</span>
          </div>
        </div>

        <h3 
          onClick={() => setSelectedProduct(product)}
          className="font-bold text-white text-base mb-2 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
        >
          {product.name}
        </h3>

        <p className="text-xs text-textSecondary line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <div>
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="block text-xs text-textSecondary line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all"
          >
            Acheter
          </button>
        </div>
      </div>
    </div>
  );
};
