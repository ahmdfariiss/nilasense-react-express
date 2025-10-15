import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ProductCard } from '../fragments/ProductCard';

const mockProducts = [
  {
    id: 1,
    name: 'Ikan Nila Segar Premium',
    farmer: 'Tambak Jaya Abadi',
    price: 35000,
    stock: 150,
    category: 'Ikan Konsumsi',
    image: 'https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Sangat Baik',
  },
  {
    id: 2,
    name: 'Bibit Nila Gift Unggul',
    farmer: 'Hatchery Maju Makmur',
    price: 500,
    stock: 5000,
    category: 'Bibit Ikan',
    image: 'https://images.unsplash.com/photo-1573629964953-c4410121abf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZpc2glMjBtYXJrZXR8ZW58MXx8fHwxNzYwNDQ4NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Baik',
  },
  {
    id: 3,
    name: 'Nila Merah Siap Panen',
    farmer: 'Kolam Bersih Sejahtera',
    price: 38000,
    stock: 200,
    category: 'Ikan Konsumsi',
    image: 'https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Sangat Baik',
  },
  {
    id: 4,
    name: 'Nila Hitam Organik',
    farmer: 'Tambak Organik Lestari',
    price: 42000,
    stock: 80,
    category: 'Ikan Konsumsi',
    image: 'https://images.unsplash.com/photo-1573629964953-c4410121abf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZpc2glMjBtYXJrZXR8ZW58MXx8fHwxNzYwNDQ4NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Sangat Baik',
  },
  {
    id: 5,
    name: 'Bibit Nila Gesit',
    farmer: 'Pembenihan Berkah',
    price: 450,
    stock: 8000,
    category: 'Bibit Ikan',
    image: 'https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Baik',
  },
  {
    id: 6,
    name: 'Nila Fillet Premium',
    farmer: 'Processing Center Nusantara',
    price: 55000,
    stock: 50,
    category: 'Ikan Olahan',
    image: 'https://images.unsplash.com/photo-1573629964953-c4410121abf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZpc2glMjBtYXJrZXR8ZW58MXx8fHwxNzYwNDQ4NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Sangat Baik',
  },
];

export function ProductsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Pasar Ikan Nila</h1>
          <p className="text-muted-foreground">
            Temukan ikan nila berkualitas dengan transparansi data monitoring yang lengkap
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari produk atau petambak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Ikan Konsumsi">Ikan Konsumsi</SelectItem>
                <SelectItem value="Bibit Ikan">Bibit Ikan</SelectItem>
                <SelectItem value="Ikan Olahan">Ikan Olahan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">Produk tidak ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
