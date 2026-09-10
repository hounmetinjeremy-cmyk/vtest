import React from 'react';
import { Sparkles, ShieldCheck, Truck, Headphones } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">E-Shop Pro</span>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              La plateforme e-commerce moderne conçue pour propulser vos ventes en ligne avec élégance et simplicité.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Catégories</h4>
            <ul className="space-y-2 text-xs text-textSecondary">
              <li className="hover:text-white transition-colors cursor-pointer">Électronique</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vêtements & Mode</li>
              <li className="hover:text-white transition-colors cursor-pointer">Accessoires</li>
              <li className="hover:text-white transition-colors cursor-pointer">Chaussures</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Paiements & Sécurité</h4>
            <ul className="space-y-2 text-xs text-textSecondary">
              <li>Mobile Money (MTN / Moov)</li>
              <li>FedaPay / Cartes bancaires</li>
              <li>Paiement à la livraison</li>
              <li>Garantie 100% Satisfait ou Remboursé</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Support Client</h4>
            <ul className="space-y-2 text-xs text-textSecondary">
              <li>Assistance WhatsApp 7j/7</li>
              <li>Suivi de commande en temps réel</li>
              <li>Contact : support@eshappro.com</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-xs text-textSecondary">
          <p>&copy; 2025 E-Shop Pro. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Confidentialité</span>
            <span className="hover:text-white transition-colors cursor-pointer">Conditions Générales de Vente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
