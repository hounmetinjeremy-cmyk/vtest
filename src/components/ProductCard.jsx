import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Star, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();

  const formatPrice = (price) => price.toLocaleString('fr-FR') + ' FCFA';

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden group flex flex-col hover:border-primary/50 transition-all duration-300 shadow-xl">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] bg-background overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPercentage && (
            <span className="bg-accent text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg">
              Populaire
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-primary"
          title="Aperçu rapide"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary font-semibold uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center gap-1 text-warning font-bold">
            <Star className="w-3.5 h-3.5 fill-warning" />
            <span>{product.rating}</span>
          </div>
        </div>

        <h3 
          onClick={() => setSelectedProduct(product)}
          className="font-bold text-white text-base hover:text-primary transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        <p className="text-textSecondary text-xs line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-end justify-between pt-2 mt-auto border-t border-border">
          <div>
            <div className="text-primary font-extrabold text-base">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-textSecondary text-xs line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
