import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import SearchFilter from './components/SearchFilter';
import VehicleCard from './components/VehicleCard';
import VehicleModal from './components/VehicleModal';
import RestockModal from './components/RestockModal';
import Toast from './components/Toast';
import { vehicleService, inventoryService } from './services/api';
import { Car, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedRestockVehicle, setSelectedRestockVehicle] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      // Check if any filter is active
      const hasFilters = Object.values(filters).some((val) => val !== '');
      let data = [];
      if (hasFilters) {
        data = await vehicleService.search(filters);
      } else {
        data = await vehicleService.getAll();
      }
      setVehicles(data);
    } catch (err) {
      console.error(err);
      showToast('Could not connect to FastAPI backend API at http://127.0.0.1:8000/api.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

 useEffect(() => {
  if (user) {
    fetchVehicles();
  } else {
    setVehicles([]);
    setLoading(false);
  }
}, [user, fetchVehicles]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const handlePurchase = async (vehicle) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const res = await inventoryService.purchase(vehicle.id, 1);
      showToast(res.message, 'success');
      fetchVehicles();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Purchase failed.';
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) return;
    try {
      await vehicleService.delete(vehicleId);
      showToast('Vehicle deleted successfully', 'success');
      fetchVehicles();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to delete vehicle.';
      showToast(errorMsg, 'error');
    }
  };

  const handleOpenEdit = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleOpenAdd = () => {
    setVehicleToEdit(null);
    setIsVehicleModalOpen(true);
  };

  const handleOpenRestock = (vehicle) => {
    setSelectedRestockVehicle(vehicle);
    setIsRestockOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: '',
      min_price: '',
      max_price: '',
    });
  };

  const categories = Array.from(new Set(vehicles.map((v) => v.category).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAddVehicle={handleOpenAdd}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="relative glass-panel rounded-3xl p-8 mb-8 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              Real-time Inventory Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Premium Vehicle Catalog & Management
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Browse, filter, and purchase vehicles in real-time.
            </p>
          </div>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
            <Car className="w-96 h-96 text-cyan-400" />
          </div>
        </div>

        {/* Filter Controls */}
        <SearchFilter
          filters={filters}
          setFilters={setFilters}
          categories={categories.length > 0 ? categories : ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible']}
          onReset={handleResetFilters}
        />

        {/* Vehicles Grid Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Available Inventory</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-cyan-400 border border-slate-700">
              {vehicles.length} {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
            </span>
          </div>

          <button
            onClick={fetchVehicles}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Vehicles Grid / Loading / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-3xl p-6 h-64 animate-pulse border border-slate-800">
                <div className="h-6 bg-slate-800 rounded-full w-24 mb-4"></div>
                <div className="h-8 bg-slate-800 rounded-xl w-3/4 mb-4"></div>
                <div className="h-10 bg-slate-800 rounded-xl w-1/2 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Vehicles Found</h3>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search query or price range filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                user={user}
                onPurchase={handlePurchase}
                onEdit={handleOpenEdit}
                onRestock={handleOpenRestock}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Toast */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
            setUser(u);
            fetchVehicles();
        }}
        showToast={showToast}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicleToEdit={vehicleToEdit}
        onSuccess={fetchVehicles}
        showToast={showToast}
      />

      <RestockModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        vehicle={selectedRestockVehicle}
        onSuccess={fetchVehicles}
        showToast={showToast}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
