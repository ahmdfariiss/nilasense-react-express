import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  Package,
  Truck,
  CreditCard,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🐟</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                NilaSense
              </span>
            </div>
            <p className="text-white/70 mb-4">
              Platform manajemen akuakultur modern untuk budidaya ikan nila yang
              lebih produktif
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Produk & Layanan */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produk & Layanan
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('products')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Produk Ikan Nila</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('products')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Marketplace</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Bantuan Pelanggan */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Bantuan Pelanggan
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('pusat-bantuan')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Pusat Bantuan</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('cara-berbelanja')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Cara Berbelanja</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onNavigate && onNavigate('pengiriman-pengembalian')
                  }
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Pengiriman & Pengembalian</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('faq')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>FAQ</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('order-history')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Status Pesanan</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Informasi & Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Informasi & Kontak
            </h4>
            <ul className="space-y-3 text-white/70">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('tentang-kami')}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Tentang Kami</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li className="pt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/50" />
                  <a
                    href="mailto:afarisalaziz201@gmail.com"
                    className="hover:text-white transition-colors text-sm"
                  >
                    afarisalaziz201@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/50" />
                  <a
                    href="tel:+6283871441288"
                    className="hover:text-white transition-colors text-sm"
                  >
                    +62 83871441288
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-white/50 mt-0.5" />
                  <span className="text-sm">Bogor, Indonesia</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/70 text-sm">
              <p>&copy; 2025 NilaSense. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <button
                onClick={() => onNavigate && onNavigate('privasi')}
                className="text-white/70 hover:text-white transition-colors"
              >
                Privasi
              </button>
              <button
                onClick={() => onNavigate && onNavigate('syarat-ketentuan')}
                className="text-white/70 hover:text-white transition-colors"
              >
                Syarat & Ketentuan
              </button>
              <button
                onClick={() =>
                  onNavigate && onNavigate('kebijakan-pengembalian')
                }
                className="text-white/70 hover:text-white transition-colors"
              >
                Kebijakan Pengembalian
              </button>
              <button
                onClick={() => onNavigate && onNavigate('disclaimer')}
                className="text-white/70 hover:text-white transition-colors"
              >
                Disclaimer
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/70 text-sm mb-3">Metode Pembayaran:</p>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Kartu Kredit
              </div>
              <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">
                Transfer Bank
              </div>
              <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">
                E-Wallet
              </div>
              <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium flex items-center gap-1">
                <Truck className="w-4 h-4" />
                COD
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
