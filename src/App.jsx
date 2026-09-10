import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { ShopView } from './components/ShopView';
import { CartView } from './components/CartView';
import { AdminView } from './components/AdminView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';

const MainContent = () => {
  const { activeTab } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'shop' && <ShopView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'admin' && <AdminView />}
      </main>
      <Footer />
      <ProductDetailModal />
      <Notification />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
