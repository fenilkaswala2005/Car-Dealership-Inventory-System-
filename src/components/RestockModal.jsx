import React, { useState } from 'react';
import { X, PlusCircle, Package } from 'lucide-react';
import { inventoryService } from '../services/api';

export default function RestockModal({ isOpen, onClose, vehicle, onSuccess, showToast }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await inventoryService.restock(vehicle.id, parseInt(quantity, 10));
      showToast(`Successfully added ${quantity} unit(s) to ${vehicle.make} ${vehicle.model}!`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to restock vehicle.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Restock Vehicle</h2>
            <p className="text-xs text-slate-400">ID: #{vehicle.id}</p>
          </div>
        </div>

        <div className="p-4 glass-card rounded-2xl border border-slate-800 mb-6">
          <div className="text-base font-bold text-white">{vehicle.make} {vehicle.model}</div>
          <div className="text-xs text-slate-400 mt-1">Current Stock: <span className="text-cyan-400 font-bold">{vehicle.quantity}</span> units</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Quantity to Add
            </label>
            <div className="relative">
              <Package className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Restocking...' : `Restock (+${quantity} units)`}
          </button>
        </form>
      </div>
    </div>
  );
}
