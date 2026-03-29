/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Leaf,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Product {
  id: string;
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thc: string;
  cbd: string;
  price: number;
  image: string;
  description: string;
  effects: string[];
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Purple Emperor',
    type: 'Indica',
    thc: '24%',
    cbd: '1%',
    price: 65,
    image: 'https://picsum.photos/seed/purple-kush/600/600',
    description: 'A regal strain with deep purple hues and a heavy, relaxing body high.',
    effects: ['Relaxed', 'Sleepy', 'Euphoric']
  },
  {
    id: '2',
    name: 'Golden Scepter',
    type: 'Sativa',
    thc: '22%',
    cbd: '0.5%',
    price: 60,
    image: 'https://picsum.photos/seed/gold-kush/600/600',
    description: 'Energizing and uplifting, perfect for daytime creativity and focus.',
    effects: ['Energetic', 'Creative', 'Focused']
  },
  {
    id: '3',
    name: 'Royal Hybrid',
    type: 'Hybrid',
    thc: '20%',
    cbd: '2%',
    price: 55,
    image: 'https://picsum.photos/seed/hybrid-kush/600/600',
    description: 'The perfect balance of head and body effects for any time of day.',
    effects: ['Balanced', 'Happy', 'Calm']
  },
  {
    id: '4',
    name: 'Black Diamond',
    type: 'Indica',
    thc: '26%',
    cbd: '0.1%',
    price: 75,
    image: 'https://picsum.photos/seed/black-diamond/600/600',
    description: 'Rare and potent, this strain offers a profound sensory experience.',
    effects: ['Deep Sleep', 'Hungry', 'Relaxed']
  },
  {
    id: '5',
    name: 'Silver Crown',
    type: 'Sativa',
    thc: '21%',
    cbd: '1.5%',
    price: 58,
    image: 'https://picsum.photos/seed/silver-kush/600/600',
    description: 'Sharp, citrusy notes with a clear-headed cerebral buzz.',
    effects: ['Clear', 'Talkative', 'Uplifted']
  },
  {
    id: '6',
    name: 'Emerald King',
    type: 'Hybrid',
    thc: '23%',
    cbd: '0.8%',
    price: 62,
    image: 'https://picsum.photos/seed/emerald-kush/600/600',
    description: 'Rich earthy tones with a smooth finish and long-lasting effects.',
    effects: ['Mellow', 'Social', 'Grounded']
  }
];

// --- Components ---

const AgeVerification = ({ onVerify }: { onVerify: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-4"
    >
      <div className="max-w-md w-full glass-card p-10 text-center space-y-8 border-gold/20">
        <h1 className="text-4xl font-serif gold-gradient font-bold tracking-tighter">MAN KING</h1>
        <div className="space-y-4">
          <p className="text-xl font-medium">VERIFICAÇÃO DE IDADE</p>
          <p className="text-gray-400 text-sm">
            Você deve ter 18 anos ou mais para acessar este site. Ao entrar, você confirma que tem idade legal.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button 
            onClick={onVerify}
            className="gold-button w-full"
          >
            SOU MAIOR DE 18 ANOS
          </button>
          <button 
            onClick={() => window.location.href = 'https://google.com'}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            SAIR
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button className="lg:hidden text-white">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-serif font-bold tracking-tighter gold-gradient">MAN KING</h1>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Strains</a>
            <a href="#" className="hover:text-white transition-colors">Acessórios</a>
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-white hover:text-[#D4AF37] transition-colors"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onRemove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0A0A0A] z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold">SEU CARRINHO</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="font-bold text-[#D4AF37]">${item.price}</p>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.type}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-white/10 rounded-full px-2 py-1 gap-3">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="p-1 hover:text-[#D4AF37] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="p-1 hover:text-[#D4AF37] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
                <button className="gold-button w-full py-4 uppercase tracking-widest text-sm">
                  Finalizar Pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load verification status
  useEffect(() => {
    const verified = localStorage.getItem('man_king_verified');
    if (verified === 'true') setIsVerified(true);
  }, []);

  const handleVerify = () => {
    localStorage.setItem('man_king_verified', 'true');
    setIsVerified(true);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  if (!isVerified) {
    return <AgeVerification onVerify={handleVerify} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
      />

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/kush-hero/1920/1080?blur=2" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#D4AF37] text-sm uppercase tracking-[0.4em] font-medium mb-4 block">
              The Gold Standard of Cannabis
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none">
              REINE NO SEU <br />
              <span className="gold-gradient">PRÓPRIO REINO</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            Descubra a coleção mais exclusiva de strains premium e acessórios de luxo. 
            Curadoria impecável para o conhecedor moderno.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button className="gold-button group">
              EXPLORAR COLEÇÃO
              <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto" />
        </div>
      </header>

      {/* Features */}
      <section className="py-24 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 glass-card flex items-center justify-center text-[#D4AF37]">
              <Leaf size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold">Qualidade Orgânica</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Cultivado com os mais altos padrões, sem pesticidas ou aditivos químicos.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 glass-card flex items-center justify-center text-[#D4AF37]">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold">Entrega Discreta</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Embalagens premium e anônimas para garantir sua total privacidade.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 glass-card flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold">Segurança Garantida</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Pagamentos criptografados e suporte dedicado 24/7 para sua tranquilidade.
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif font-bold">Nossas Strains</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Coleção Signature 2026</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Indica', 'Sativa', 'Hybrid'].map((filter) => (
              <button 
                key={filter}
                className="px-6 py-2 rounded-full border border-white/10 text-sm font-medium hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all whitespace-nowrap"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="glass-card group overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {product.type}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => addToCart(product)}
                    className="gold-button scale-90 group-hover:scale-100 transition-transform"
                  >
                    ADICIONAR AO CARRINHO
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif font-bold group-hover:text-[#D4AF37] transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-xl font-bold text-[#D4AF37]">${product.price}</span>
                </div>
                <div className="flex gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  <div className="flex items-center gap-1">
                    <span className="text-white">THC:</span> {product.thc}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white">CBD:</span> {product.cbd}
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.effects.map(effect => (
                    <span key={effect} className="text-[9px] border border-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Newsletter */}
      <section className="py-24 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Junte-se à Elite</h2>
          <p className="text-gray-400">
            Assine nossa newsletter para receber convites para eventos exclusivos, 
            lançamentos limitados e ofertas especiais.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <button className="gold-button whitespace-nowrap">
              INSCREVER-SE
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold gold-gradient">MAN KING</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Definindo o luxo na cultura canábica desde 2026. 
              Qualidade sem compromissos para quem exige o melhor.
            </p>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-[#D4AF37] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest">Shop</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Indica</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sativa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hybrid</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Acessórios</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest">Suporte</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Envio & Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest">Contato</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>contato@manking.com</li>
              <li>+55 (11) 99999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 text-center text-gray-600 text-xs">
          <p>© 2026 MAN KING. Todos os direitos reservados. Aprecie com moderação.</p>
        </div>
      </footer>
    </div>
  );
}
