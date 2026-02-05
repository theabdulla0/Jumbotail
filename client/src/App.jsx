import React, { useState, useEffect } from "react";
import { Zap, Sparkles } from "lucide-react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import FilterSidebar from "./components/FilterSidebar";
import { searchProducts, getTrendingProducts } from "./services/api";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  // Load trending products on mount
  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      setIsLoading(true);
      const response = await getTrendingProducts(12);
      setResults(response.data || []);
      setMeta({ info: "Trending Products" });
    } catch (err) {
      console.error("Failed to load trending:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchProducts(query, {
        ...filters,
        page: 1,
        limit: 20,
      });

      setResults(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search products");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Re-search if we have an active query
    if (searchQuery) {
      handleSearchWithFilters(searchQuery, updatedFilters);
    }
  };

  const handleSearchWithFilters = async (query, currentFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchProducts(query, {
        ...currentFilters,
        page: 1,
        limit: 20,
      });

      setResults(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(clearedFilters);

    if (searchQuery) {
      handleSearchWithFilters(searchQuery, clearedFilters);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">ElectroSearch</h1>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Smart search for electronics • Understands Hinglish • Handles typos
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            {!hasSearched && !isLoading && (
              <div className="text-center py-4 mb-4">
                <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                  🔥 Trending Products
                </h2>
              </div>
            )}

            <SearchResults
              results={results}
              meta={meta}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            🔍 Try searching: "sasta iphone", "samsung 50k", "ifone 16 red",
            "laptop under 60k"
          </p>
          <p className="mt-2">Built with ❤️ for electronics enthusiasts</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
