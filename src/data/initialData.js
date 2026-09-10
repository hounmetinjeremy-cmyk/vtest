export const categories = [
  "Tous",
  "Électronique",
  "Mode & Style",
  "Maison & Déco",
  "Bien-être & Sport"
];

export const initialProducts = [
  {
    id: "1",
    name: "Smartphone Apex Ultra 5G",
    category: "Électronique",
    price: 385000,
    originalPrice: 450000,
    rating: 4.9,
    reviewsCount: 128,
    stock: 15,
    featured: true,
    image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Le summum de la technologie mobile. Écran AMOLED 120Hz, triple capteur photo 108MP, processeur ultra-rapide et batterie longue durée avec charge rapide 120W."
  },
  {
    id: "2",
    name: "Casque Audio Sans Fil Pulse Pro",
    category: "Électronique",
    price: 65000,
    originalPrice: 85000,
    rating: 4.8,
    reviewsCount: 94,
    stock: 22,
    featured: true,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Immersion sonore totale avec réduction active du bruit (ANC). Coussinets à mémoire de forme et autonomie exceptionnelle de 40 heures."
  },
  {
    id: "3",
    name: "Montre Connectée Sport Horizon",
    category: "Électronique",
    price: 45000,
    originalPrice: 60000,
    rating: 4.7,
    reviewsCount: 76,
    stock: 30,
    featured: false,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Suivez vos performances sportives, votre fréquence cardiaque et votre sommeil avec précision. Étanche 5ATM et design élégant en acier."
  },
  {
    id: "4",
    name: "Sneakers Urbaines Streetwear Apex",
    category: "Mode & Style",
    price: 35000,
    originalPrice: 45000,
    rating: 4.9,
    reviewsCount: 210,
    stock: 18,
    featured: true,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Confort absolu et style affirmé. Conçues à partir de matériaux recyclés respirants avec semelle amortissante haute performance."
  },
  {
    id: "5",
    name: "Sac à Dos Minimaliste Cuir & Toile",
    category: "Mode & Style",
    price: 28000,
    originalPrice: 38000,
    rating: 4.6,
    reviewsCount: 52,
    stock: 12,
    featured: false,
    image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Parfait pour les déplacements urbains et professionnels. Compartiment rembourré pour ordinateur 15.6 pouces et finitions en cuir véritable."
  },
  {
    id: "6",
    name: "Lampe de Bureau Design LED Tactile",
    category: "Maison & Déco",
    price: 22000,
    originalPrice: 30000,
    rating: 4.8,
    reviewsCount: 45,
    stock: 25,
    featured: false,
    image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Éclairage ajustable avec 5 températures de couleur et variateur d'intensité tactile. Port USB de recharge intégré."
  },
  {
    id: "7",
    name: "Enceinte Bluetooth Nomade BassBoom",
    category: "Électronique",
    price: 32000,
    originalPrice: 40000,
    rating: 4.9,
    reviewsCount: 115,
    stock: 19,
    featured: true,
    image: "https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Son puissant à 360° avec basses profondes renforcées. Certification IPX7 étanche, idéale pour vos soirées et voyages."
  },
  {
    id: "8",
    name: "Tapis de Yoga Antidérapant Éco-responsable",
    category: "Bien-être & Sport",
    price: 18000,
    originalPrice: 25000,
    rating: 4.7,
    reviewsCount: 63,
    stock: 40,
    featured: false,
    image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Épaisseur optimale pour protéger vos articulations. Surface antidérapante même pendant les séances de hot yoga les plus intenses."
  }
];

export const initialOrders = [
  {
    id: "CMD-8492",
    customer: "Jean-Marc Kouassi",
    phone: "+225 0700112233",
    address: "Cocody Riviera 2, Abidjan",
    items: [
      { id: "1", name: "Smartphone Apex Ultra 5G", price: 385000, quantity: 1 }
    ],
    total: 387000,
    paymentMethod: "Mobile Money (MTN/Moov)",
    status: "Payée",
    date: "2025-05-14 14:32"
  },
  {
    id: "CMD-7120",
    customer: "Aïcha Diallo",
    phone: "+221 771234567",
    address: "Almadies, Dakar",
    items: [
      { id: "4", name: "Sneakers Urbaines Streetwear Apex", price: 35000, quantity: 2 }
    ],
    total: 72000,
    paymentMethod: "Paiement à la livraison",
    status: "En cours de livraison",
    date: "2025-05-14 11:15"
  },
  {
    id: "CMD-5931",
    customer: "Kévin Dossou",
    phone: "+229 97000000",
    address: "Haie Vive, Cotonou",
    items: [
      { id: "2", name: "Casque Audio Sans Fil Pulse Pro", price: 65000, quantity: 1 }
    ],
    total: 67000,
    paymentMethod: "Mobile Money (MTN/Moov)",
    status: "En attente",
    date: "2025-05-14 09:40"
  }
];
