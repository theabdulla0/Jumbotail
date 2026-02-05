import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "All",
  "Smartphones",
  "Laptops",
  "Tablets",
  "Earphones",
  "Smartwatches",
  "Accessories",
];

const BRANDS = [
  "All",
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Realme",
  "Oppo",
  "Vivo",
  "Google",
  "boAt",
  "Sony",
];

const PRICE_RANGES = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹10,000", min: "", max: "10000" },
  { label: "₹10,000 - ₹20,000", min: "10000", max: "20000" },
  { label: "₹20,000 - ₹50,000", min: "20000", max: "50000" },
  { label: "₹50,000 - ₹1,00,000", min: "50000", max: "100000" },
  { label: "Above ₹1,00,000", min: "100000", max: "" },
];

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const handleCategoryChange = (value) => {
    onFilterChange({ category: value === "All" ? "" : value });
  };

  const handleBrandChange = (value) => {
    onFilterChange({ brand: value === "All" ? "" : value });
  };

  const handlePriceRangeChange = (value) => {
    const range = PRICE_RANGES.find((r) => r.label === value);
    if (range) {
      onFilterChange({ minPrice: range.min, maxPrice: range.max });
    }
  };

  const hasActiveFilters =
    filters.category || filters.brand || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select
            value={filters.category || "All"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Brand</label>
          <Select
            value={filters.brand || "All"}
            onValueChange={handleBrandChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Price Range</label>
          <Select
            value={
              PRICE_RANGES.find(
                (r) => r.min === filters.minPrice && r.max === filters.maxPrice,
              )?.label || "All Prices"
            }
            onValueChange={handlePriceRangeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.label} value={range.label}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Price Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Custom Price</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              className="w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
