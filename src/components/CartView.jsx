import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

export const CartView = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, addOrder, setActiveTab, showNotification } = useShop();

  const [step, setStep] = useState('cart'); // 'cart' or 'checkout' or 'success'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'Mobile Money (MTN/Moov)'
  });
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? 2000 : 0;
  const total = subtotal + shippingFee;

  const formatPrice = (price) => price.toLocaleString('fr-FR') + ' FCFA';

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      showNotification("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    const orderData = {
      customer: formData.name,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      items: cart,
      total: total,
      paymentMethod: formData.paymentMethod,
    };

    const newOrder = addOrder(orderData);
    setCompletedOrder(newOrder);
    setStep('success');
  };

  const openWhatsApp = () => {
    if (!completedOrder) return;
    const itemsList = completedOrder.items.map(i => `- ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`).join('%0A');
    const message = `Bonjour E-Shop Pro 👋,%0AJe souhaite confirmer ma commande *${completedOrder.id}*:%0A%0A${itemsList}%0A%0A*Total:* ${formatPrice(completedOrder.total)}%0A*Mode de paiement:* ${completedOrder.paymentMethod}%0A*Adresse:* ${completedOrder.address}%0A%0AMerci de valider l'expédition !`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (step === 'success' && completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto shadow-2xl animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-white">Commande validée avec succès !</h1>
        <p className="text-textSecondary text-sm">
          Votre référence de commande est <span className="text-white font-bold">{completedOrder.id}</span>. Un conseiller va traiter votre demande dans les plus brefs délais.
        </p>

        <div className="bg-surface border border-border rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-textSecondary text-sm">Client :</span>
            <span className="text-white font-bold text-sm">{completedOrder.customer}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-textSecondary text-sm">Téléphone / WhatsApp :</span>
            <span className="text-white font-bold text-sm">{completedOrder.phone}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-textSecondary text-sm">Mode de paiement :</span>
            <span className="text-white font-bold text-sm">{completedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary text-sm">Montant Total :</span>
            <span className="text-primary font-extrabold text-base">{formatPrice(completedOrder.total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={openWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-success hover:bg-success/90 text-white font-bold text-sm shadow-lg shadow-success/25 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Confirmer sur WhatsApp
          </button>
          <button
            onClick={() => { setActiveTab('shop'); setStep('cart'); }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface hover:bg-border text-white font-bold text-sm border border-border transition-all"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-textSecondary">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white">Votre panier est vide</h2>
        <p className="text-textSecondary text-sm">Découvrez nos superbes produits et commencez votre shopping dès maintenant.</p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all"
        >
          Explorer la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold text-white">
          {step === 'cart' ? 'Mon Panier' : 'Tunnel de Commande'}
        </h1>
        <button
          onClick={() => setActiveTab('shop')}
          className="text-xs text-primary font-bold hover:underline"
        >
          Continuer mes achats
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'cart' ? (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {cart.map(item => (
                <div key={item.id} className="p-4 sm:p-6 flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-xl bg-background"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-white text-base mb-1">{item.name}</h3>
                    <span className="text-xs text-secondary font-semibold">{item.category}</span>
                    <div className="mt-2 text-primary font-extrabold text-sm">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-surface text-white font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-surface text-white font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-xl bg-error/10 hover:bg-error text-error hover:text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Informations de livraison</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kévin Dossou"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">Numéro WhatsApp / Téléphone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +229 97000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">Ville / Commune *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cotonou, Abidjan, Dakar..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">Adresse précise / Quartier *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Haie Vive, rue 12, maison bleue"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">Mode de paiement *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Mobile Money (MTN/Moov)">Mobile Money (MTN/Moov / FedaPay)</option>
                    <option value="Paiement à la livraison">Paiement à la livraison (Cash)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-6 py-3.5 rounded-xl bg-background hover:bg-border text-white font-bold text-sm border border-border transition-all"
                >
                  Retour au panier
                </button>
                <button
                  type="submit"
                  className="flex-grow flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all"
                >
                  Valider et Commander
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-surface border border-border rounded-2xl p-6 h-fit space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-border pb-4">Résumé de la commande</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-textSecondary">
              <span>Sous-total</span>
              <span className="text-white font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-textSecondary">
              <span>Frais de livraison</span>
              <span className="text-white font-medium">{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-white pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {step === 'cart' && (
            <button
              onClick={() => setStep('checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all"
            >
              Passer à la commande
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
