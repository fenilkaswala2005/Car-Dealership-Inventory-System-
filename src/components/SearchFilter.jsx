import React from 'react';
import { Search, Filter, RotateCcw, DollarSign, Tag } from 'lucide-react';

export default function SearchFilter({ filters, setFilters, categories, onReset }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 mb-8 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold text-sm">
        <Filter className="w-4 h-4 text-cyan-400" />
        <span>Filter & Search Vehicles</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Make Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            name="make"
            value={filters.make}
            onChange={handleChange}
            placeholder="Search by Make (e.g. Toyota)"
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Model Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleChange}
            placeholder="Search by Model (e.g. Camry)"
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Tag className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none bg-slate-900"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="relative">
          <DollarSign className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="number"
            name="min_price"
            value={filters.min_price}
            onChange={handleChange}
            placeholder="Min Price ($)"
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Max Price & Reset */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <DollarSign className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleChange}
              placeholder="Max Price ($)"
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2.5 glass-card rounded-xl text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all shrink-0"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
