import React from "react";
import { Star, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatNumber } from "@/lib/utils";

const ProductCard = ({ product }) => {
  const {
    title,
    brand,
    price,
    rating,
    reviewCount,
    salesCount,
    stock,
    specs,
    category,
    relevanceScore,
    isPromoted,
  } = product;

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 10;

  return (
    <Card
      className={`group relative overflow-hidden transition-all hover:shadow-lg ${isOutOfStock ? "opacity-60" : ""}`}
    >
      {/* Promoted Badge */}
      {isPromoted && (
        <Badge className="absolute top-2 left-2 z-10" variant="warning">
          Sponsored
        </Badge>
      )}

      {/* Relevance Score (for debugging) */}
      {relevanceScore && (
        <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {(relevanceScore * 100).toFixed(0)}% match
        </div>
      )}

      {/* Product Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <div className="text-4xl font-bold text-muted-foreground/30">
          {brand?.charAt(0) || "P"}
        </div>

        {/* Category Badge */}
        <Badge variant="secondary" className="absolute bottom-2 left-2">
          {category}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Brand */}
        <p className="text-sm text-muted-foreground mb-1">{brand}</p>

        {/* Title */}
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Specs */}
        {specs && (
          <div className="flex flex-wrap gap-1 mb-3">
            {specs.storage && (
              <Badge variant="outline" className="text-xs">
                {specs.storage}
              </Badge>
            )}
            {specs.ram && (
              <Badge variant="outline" className="text-xs">
                {specs.ram}
              </Badge>
            )}
            {specs.color && (
              <Badge variant="outline" className="text-xs">
                {specs.color}
              </Badge>
            )}
          </div>
        )}

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded text-sm">
            <span>{rating?.toFixed(1)}</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-sm text-muted-foreground">
            ({formatNumber(reviewCount)} reviews)
          </span>
        </div>

        {/* Sales & Stock */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{formatNumber(salesCount)} sold</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            {isOutOfStock ? (
              <span className="text-destructive">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-yellow-600">Only {stock} left</span>
            ) : (
              <span className="text-green-600">In Stock</span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary">
              {formatPrice(price)}
            </p>
          </div>

          <Button size="sm" disabled={isOutOfStock} className="gap-1">
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Notify" : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
