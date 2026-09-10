import React from 'react';
import { Sparkles, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Features Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-border">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Livraison Rapide</h4>
              <p className="text-xs text-textSecondary">Partout dans la région sous 24-48h</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Paiement Sécurisé</h4>
              <p className="text-xs text-textSecondary">Mobile Money & Cash à la livraison</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Support 7j/7</h4>
              <p className="text-xs text-textSecondary">Assistance WhatsApp dédiée</p>
            </div>
          </div>
        </div>

        {/* Brand & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">E-Shop Pro</span>
            </div>
            <p className="text-xs text-textSecondary max-w-sm">
              Votre destination de confiance pour des achats en ligne fluides, sécurisés et adaptés au marché africain et international.
            </p>
          </div>

          <div className="text-xs text-textSecondary flex flex-col sm:flex-row items-center gap-4">
            <span>© 2025 E-Shop Pro. Tous droits réservés.</span>
            <span className="flex items-center gap-1">
              Fait avec <Heart className="w-3.5 h-3.5 text-accent fill-accent" /> pour @hounmetinjeremy-cmyk
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
