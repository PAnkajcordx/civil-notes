import React from 'react';
import { X, Trash2, Download, ShoppingBag, ArrowRight } from 'lucide-react';
import { CourseworkToolkit, PYQResource } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: (CourseworkToolkit | PYQResource)[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onDownloadAll: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onDownloadAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Coursework Resource Cart ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Your resource cart is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select coursework toolkits, PYQ bundles, or unit packs to download all materials in one go.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">Selected Toolkits</span>
                <button
                  onClick={onClearCart}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {'subtitle' in item ? item.subtitle : item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Bundles:</span>
              <span className="font-bold text-slate-900">{items.length} Packages</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Access Status:</span>
              <span className="font-bold text-emerald-700">Free Open Student Resource</span>
            </div>

            <button
              onClick={onDownloadAll}
              className="w-full py-2.5 px-4 bg-[#185a36] hover:bg-[#13492c] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Selected Toolkits (ZIP/Pack)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
