import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../elements/ImageWithFallback';

export function ProductCard({ product, onNavigate }) {
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Sangat Baik':
        return 'bg-[#10b981] text-white';
      case 'Baik':
        return 'bg-[#0891b2] text-white';
      default:
        return 'bg-[#f59e0b] text-white';
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onNavigate('product-detail', product.id)}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className={getQualityColor(product.waterQuality)}>
            {product.waterQuality}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2">{product.category}</Badge>
          <h3 className="text-foreground mb-1">{product.name}</h3>
          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
            {product.farmer}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-primary" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              Rp {product.price.toLocaleString('id-ID')}
            </p>
            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
              {product.category === 'Bibit Ikan' ? 'per ekor' : 'per kg'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
              Stok
            </p>
            <p className="text-foreground">{product.stock.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <Button
          className="w-full mt-4 bg-primary hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('product-detail', product.id);
          }}
        >
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
}
