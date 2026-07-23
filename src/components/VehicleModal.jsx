import React, { useState, useEffect } from 'react';
import { X, Car, Tag, DollarSign, Package } from 'lucide-react';
import { vehicleService } from '../services/api';

export default function VehicleModal({ isOpen, onClose, vehicleToEdit, onSuccess, showToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        make: vehicleToEdit.make || '',
        model: vehicleToEdit.model || '',
        category: vehicleToEdit.category || 'Sedan',
        price: vehicleToEdit.price || '',
        quantity: vehicleToEdit.quantity || '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        category: 'Sedan',
        price: '',
        quantity: '',
      });
    }
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        make: formData.make,
        model: formData.model,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      if (vehicleToEdit) {
        await vehicleService.update(vehicleToEdit.id, payload);
        showToast('Vehicle updated successfully!', 'success');
      } else {
        await vehicleService.create(payload);
        showToast('New vehicle added successfully!', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to save vehicle details.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">
          {vehicleToEdit ? 'Edit Vehicle Details' : 'Add New Vehicle'}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {vehicleToEdit ? 'Update inventory information below' : 'Add a vehicle to the live inventory database'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Make
              </label>
              <div className="relative">
                <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  name="make"
                  required
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="Toyota"
                  className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Model
              </label>
              <div className="relative">
                <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Camry"
                  className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none bg-slate-900"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Price ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="25000.00"
                  className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Initial Stock Quantity
              </label>
              <div className="relative">
                <Package className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="number"
                  min="0"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : vehicleToEdit ? 'Update Vehicle' : 'Add to Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
}
