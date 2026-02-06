
import React from 'react';
import { Store } from '../types';
import { ChevronRight, Store as StoreIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const getStatusStyle = (status: Store['status']) => {
    switch (status) {
      case 'Concluído': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Irregular': return 'bg-red-100 text-red-700 border-red-200';
      case 'Em Andamento': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Store['status']) => {
    switch (status) {
      case 'Concluído': return <CheckCircle className="w-4 h-4" />;
      case 'Irregular': return <AlertTriangle className="w-4 h-4" />;
      case 'Em Andamento': return <Clock className="w-4 h-4" />;
      default: return <StoreIcon className="w-4 h-4" />;
    }
  };

  return (
    <div 
      onClick={() => onClick(store)}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-red-50 transition-colors">
            <StoreIcon className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{store.name}</h3>
            <p className="text-xs text-slate-500">{store.sector} • Piso {store.floor}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 border ${getStatusStyle(store.status)}`}>
          {getStatusIcon(store.status)}
          {store.status}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-[11px] text-slate-400 italic">
          {store.lastInspection ? `Última: ${new Date(store.lastInspection).toLocaleDateString('pt-BR')}` : 'Sem vistorias recentes'}
        </p>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default StoreCard;
