export const initialProducts = [
  {
    id: "1",
    name: "Sneakers Apex Pro Runner",
    category: "Chaussures",
    price: 45000,
    originalPrice: 60000,
    stock: 15,
    rating: 4.8,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Conçues pour les performances urbaines et le confort absolu toute la journée. Amorti renforcé et design futuriste.",
    featured: true
  },
  {
    id: "2",
    name: "Casque Audio Wireless Studio ANC",
    category: "Électronique",
    price: 85000,
    originalPrice: 110000,
    stock: 8,
    rating: 4.9,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Réduction active du bruit de pointe, autonomie de 40 heures et son haute fidélité immersif.",
    featured: true
  },
  {
    id: "3",
    name: "Montre Connectée Chrono X",
    category: "Accessoires",
    price: 65000,
    originalPrice: 80000,
    stock: 12,
    rating: 4.7,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Suivi de santé avancé, écran AMOLED ultra lumineux et étanchéité 5ATM pour le sport et le quotidien.",
    featured: true
  },
  {
    id: "4",
    name: "Sac à Dos Minimaliste Cuir & Nylon",
    category: "Accessoires",
    price: 35000,
    originalPrice: 45000,
    stock: 20,
    rating: 4.6,
    image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Compartiment rembourré pour ordinateur 15.6 pouces, résistant à l'eau et design élégant épuré.",
    featured: false
  },
  {
    id: "5",
    name: "Veste Coupe-Vent Technique Lumina",
    category: "Vêtements",
    price: 40000,
    originalPrice: 55000,
    stock: 10,
    rating: 4.8,
    image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Tissu respirant et imperméable, idéal pour affronter les intempéries avec style.",
    featured: true
  },
  {
    id: "6",
    name: "Lampe de Bureau LED Design Arc",
    category: "Électronique",
    price: 25000,
    originalPrice: 35000,
    stock: 25,
    rating: 4.5,
    image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Température de couleur réglable, recharge sans fil intégrée pour smartphone sur la base.",
    featured: false
  }
];

export const initialOrders = [
  {
    id: "CMD-9482",
    customer: "Kévin Dossou",
    phone: "+229 97 00 00 00",
    address: "Haie Vive, Cotonou",
    items: [
      { id: "1", name: "Sneakers Apex Pro Runner", price: 45000, quantity: 1 }
    ],
    total: 45000,
    paymentMethod: "Mobile Money (MTN/Moov)",
    status: "Payée",
    date: "2025-05-12 14:30"
  },
  {
    id: "CMD-9483",
    customer: "Aïcha Traoré",
    phone: "+225 07 00 00 00",
    address: "Cocody Riviera, Abidjan",
    items: [
      { id: "2", name: "Casque Audio Wireless Studio ANC", price: 85000, quantity: 1 },
      { id: "4", name: "Sac à Dos Minimaliste Cuir & Nylon", price: 35000, quantity: 1 }
    ],
    total: 120000,
    paymentMethod: "Paiement à la livraison",
    status: "En cours de livraison",
    date: "2025-05-12 16:45"
  }
];

export const categories = ["Tous", "Vêtements", "Électronique", "Accessoires", "Chaussures"];
