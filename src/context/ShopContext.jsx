import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialOrders } from '../data/initialData';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('eshop_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('eshop_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('eshop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'admin', 'cart', 'checkout'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('eshop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('eshop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('eshop_cart', JSON.stringify(cart));
  }, [cart]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`${product.name} ajouté au panier !`);
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showNotification("Article retiré du panier", "warning");
  };

  const clearCart = () => setCart([]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "En attente",
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showNotification(`Statut de la commande ${orderId} mis à jour : ${newStatus}`);
  };

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now().toString(),
      rating: 5.0,
      ...productData
    };
    setProducts(prev => [newProduct, ...prev]);
    showNotification("Produit ajouté avec succès !");
  };

  const updateProduct = (id, productData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    showNotification("Produit mis à jour avec succès !");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification("Produit supprimé", "warning");
  };

  return (
    <ShopContext.Provider value={{
      products,
      orders,
      cart,
      activeTab,
      setActiveTab,
      selectedProduct,
      setSelectedProduct,
      notification,
      showNotification,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      addOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
