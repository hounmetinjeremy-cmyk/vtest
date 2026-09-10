import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { LayoutDashboard, Package, ShoppingCart, Plus, Edit, Trash2, CheckCircle2, Clock, Truck, X } from 'lucide-react';
import { categories } from '../data/initialData';

export const AdminView = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, showNotification } = useShop();
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard', 'products', 'orders'

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Électronique',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    description: '',
    featured: false
  });

  const formatPrice = (price) => price.toLocaleString('fr-FR') + ' FCFA';

  // Stats calculation
  const totalRevenue = orders
    .filter(o => o.status !== 'Annulée')
    .reduce((sum, o) => sum + o.total, 0);
  
  const pendingOrdersCount = orders.filter(o => o.status === 'En attente').length;
  const totalProductsCount = products.length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Électronique',
      price: '',
      originalPrice: '',
      stock: '',
      image: '',
      description: '',
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      image: product.image,
      description: product.description,
      featured: product.featured || false
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      stock: Number(productForm.stock)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsProductModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Back-Office Administration</h1>
          <p className="text-xs text-textSecondary mt-1">Pilotez votre boutique, vos produits et vos commandes en temps réel</p>
        </div>

        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'products' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Produits ({totalProductsCount})
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Commandes ({orders.length})
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Chiffre d'Affaires</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{formatPrice(totalRevenue)}</h3>
              </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Commandes en attente</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{pendingOrdersCount}</h3>
              </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Produits en catalogue</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{totalProductsCount}</h3>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Dernières commandes reçues</h3>
              <button
                onClick={() => setActiveSubTab('orders')}
                className="text-xs text-primary font-bold hover:underline"
              >
                Voir tout
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-bold text-textSecondary uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="hover:bg-background/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">{order.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{order.customer}</div>
                        <div className="text-xs text-textSecondary">{order.phone}</div>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-primary">{formatPrice(order.total)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Payée' ? 'bg-success/10 text-success' :
                          order.status === 'En cours de livraison' ? 'bg-secondary/10 text-secondary' :
                          order.status === 'Livrée' ? 'bg-primary/10 text-primary' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-textSecondary">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Gestion des Produits (CRUD)</h3>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] bg-background">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                      Vedette
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-secondary uppercase">{product.category}</span>
                    <span className="text-xs text-textSecondary">Stock: {product.stock}</span>
                  </div>
                  <h4 className="font-bold text-white text-base mb-2">{product.name}</h4>
                  <div className="text-primary font-extrabold text-sm mb-4">{formatPrice(product.price)}</div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="flex-grow flex items-center justify-center gap-1.5 py-2 rounded-xl bg-background hover:bg-border text-white text-xs font-bold border border-border"
                    >
                      <Edit className="w-3.5 h-3.5 text-secondary" />
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 rounded-xl bg-error/10 hover:bg-error text-error hover:text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Gestion des Commandes</h3>

          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <span className="text-base font-extrabold text-white">{order.id}</span>
                    <span className="text-xs text-textSecondary ml-3">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-textSecondary">Statut :</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-background border border-border text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary"
                    >
                      <option value="En attente">En attente</option>
                      <option value="Payée">Payée</option>
                      <option value="En cours de livraison">En cours de livraison</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-textSecondary block">Client :</span>
                    <span className="font-bold text-white">{order.customer}</span>
                    <span className="block text-xs text-secondary">{order.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-textSecondary block">Adresse de livraison :</span>
                    <span className="font-medium text-white">{order.address}</span>
                  </div>
                  <div>
                    <span className="text-xs text-textSecondary block">Mode de paiement :</span>
                    <span className="font-medium text-white">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="bg-background/50 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">Articles commandés :</span>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-white">{item.quantity}x {item.name}</span>
                        <span className="text-textSecondary">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-extrabold text-sm text-white">
                    <span>Total payé</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background flex items-center justify-center text-white border border-border"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sneakers Apex Pro"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Catégorie *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {categories.filter(c => c !== "Tous").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 10"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 45000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Prix barré (Promo)</label>
                  <input
                    type="number"
                    placeholder="Ex: 60000"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase mb-1">URL de l'image (Pexels / Web) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.pexels.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Description détaillée du produit..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded bg-background border-border text-primary focus:ring-0"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-medium text-white cursor-pointer">
                  Mettre en vedette sur la page d'accueil
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-background text-white text-xs font-bold border border-border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25"
                >
                  {editingProduct ? 'Enregistrer les modifications' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
