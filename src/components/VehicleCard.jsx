import React from 'react';
import { ShoppingBag, Edit3, Trash2, PlusCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function VehicleCard({
  vehicle,
  user,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
}) {
  const isOutOfStock = vehicle.quantity === 0;

  // Visual vehicle category gradients
  const categoryColors = {
    Sedan: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
    SUV: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    Truck: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    Coupe: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
    Convertible: 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/30',
  };

  const defaultCategoryColor = 'from-slate-500/20 to-slate-700/20 text-slate-300 border-slate-500/30';

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r ${
              categoryColors[vehicle.category] || defaultCategoryColor
            }`}
          >
            {vehicle.category}
          </span>

          {isOutOfStock ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" /> {vehicle.quantity} In Stock
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-xs text-slate-400 mt-1">Vehicle ID: #{vehicle.id}</p>

        {/* Price Tag */}
        <div className="my-6">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            Price
          </span>
          <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            ${vehicle.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {/* Purchase Button */}
        <button
          onClick={() => onPurchase(vehicle)}
          disabled={isOutOfStock || !user}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isOutOfStock
              ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : !user
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-pointer'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {isOutOfStock
              ? 'Out of Stock'
              : !user
              ? 'Log in to Purchase'
              : 'Purchase Vehicle'}
          </span>
        </button>

        {/* Admin Controls */}
        {user?.role === 'admin' && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/50">
            <button
              onClick={() => onEdit(vehicle)}
              title="Update Vehicle Details"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold bg-slate-800/80 text-cyan-300 hover:bg-cyan-950 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>

            <button
              onClick={() => onRestock(vehicle)}
              title="Restock Vehicle Quantity"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold bg-slate-800/80 text-amber-300 hover:bg-amber-950 hover:text-amber-200 border border-slate-700 hover:border-amber-500/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Restock
            </button>

            <button
              onClick={() => onDelete(vehicle.id)}
              title="Delete Vehicle (Admin)"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold bg-slate-800/80 text-rose-400 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
