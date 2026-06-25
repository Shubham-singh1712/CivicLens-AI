import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  placeholder?: string;
}

export default function SearchBar({ query, setQuery, placeholder = "Search incidents by title, description, or location..." }: SearchBarProps) {
  return (
    <div id="dashboard-search-bar" className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <Search className="w-4.5 h-4.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-950/80 border border-gray-850 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-gray-900 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
