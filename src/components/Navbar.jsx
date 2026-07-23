import React from 'react';
import { Car, User, LogOut, PlusCircle, Shield, KeyRound } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, onOpenAddVehicle }) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Car className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Nexus Auto
            </h1>
            <p className="text-xs text-cyan-400 font-medium">Vehicle Inventory Systems</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAddVehicle}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              )}

              <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 glass-card rounded-2xl border border-slate-700/50">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-200">{user.username}</div>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold">
                    {user.role === 'admin' ? (
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-cyan-400">User</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Logout"
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
