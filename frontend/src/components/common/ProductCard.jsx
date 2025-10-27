import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Waves } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

export function ProductCard({ product, onNavigate }) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onNavigate("product-detail", product.id)}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <ImageWithFallback
          src={product.image || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock_kg === 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white">Habis</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="text-foreground mb-1">{product.name}</h3>

          {/* Pond Name & Location */}
          {product.pond_name && (
            <div
              className="flex items-center gap-1 text-muted-foreground mb-1"
              style={{ fontSize: "0.875rem" }}
            >
              <Waves className="w-3 h-3" />
              <span>{product.pond_name}</span>
            </div>
          )}
          {product.pond_location && (
            <div
              className="flex items-center gap-1 text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              <MapPin className="w-3 h-3" />
              <span>{product.pond_location}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p
              className="text-primary"
              style={{ fontSize: "1.25rem", fontWeight: 600 }}
            >
              Rp {product.price.toLocaleString("id-ID")}
            </p>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              per kg
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Stok
            </p>
            <p className="text-foreground">
              {(product.stock_kg || product.stock || 0).toLocaleString("id-ID")}{" "}
              kg
            </p>
          </div>
        </div>
        <Button
          className="w-full mt-4 bg-primary hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("product-detail", product.id);
          }}
        >
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
}
