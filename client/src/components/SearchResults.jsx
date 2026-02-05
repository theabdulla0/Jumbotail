import React from "react";
import { Clock, Package, AlertCircle } from "lucide-react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const SearchResults = ({ results, meta, isLoading, error }) => {
  // Loading State
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty State
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            {meta?.pagination?.totalResults || results.length} products found
          </h2>
          {meta?.parsedIntent && (
            <div className="flex flex-wrap gap-2 mt-1">
              {meta.parsedIntent.isBudgetQuery && (
                <Badge variant="secondary">💰 Budget Search</Badge>
              )}
              {meta.parsedIntent.isPremiumQuery && (
                <Badge variant="secondary">✨ Premium Search</Badge>
              )}
              {meta.parsedIntent.priceRange && (
                <Badge variant="outline">
                  ₹{meta.parsedIntent.priceRange.min?.toLocaleString()} - ₹
                  {meta.parsedIntent.priceRange.max?.toLocaleString()}
                </Badge>
              )}
              {meta.parsedIntent.detectedFilters?.brand && (
                <Badge variant="outline">
                  Brand: {meta.parsedIntent.detectedFilters.brand}
                </Badge>
              )}
            </div>
          )}
        </div>

        {meta?.responseTime && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{meta.responseTime}</span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      {/* Pagination Info */}
      {meta?.pagination && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing page {meta.pagination.currentPage} of{" "}
          {meta.pagination.totalPages}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
