
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_STORES, INITIAL_CHECKLIST } from './constants';
import { Store, InspectionSession, PhotoRecord, ComplianceStatus } from './types';
import StoreCard from './components/StoreCard';
// Added missing UserCheck import
import { Shield, LayoutDashboard, Search, Plus, Camera, ArrowLeft, ClipboardList, Send, FileText, Loader2, CheckCircle2, UserCheck } from 'lucide-react';
import { generateTechnicalReport } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'inspect' | 'report'>('dashboard');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [session, setSession] = useState<InspectionSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const startInspection = useCallback((store: Store) => {
    setSelectedStore(store);
    setSession({
      id: Math.random().toString(36).substr(2, 9),
      storeId: store.id,
      inspectorName: "Tenente Marcos Silva",
      date: new Date().toISOString(),
      checklist: INITIAL_CHECKLIST.map(item => ({ ...item })),
      photos: []
    });
    setView('inspect');
  }, []);

  const handleStatusChange = (itemId: string, status: ComplianceStatus) => {
    if (!session) return;
    setSession({
      ...session,
      checklist: session.checklist.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    });
  };

  const handleObservationChange = (itemId: string, observation: string) => {
    if (!session) return;
    setSession({
      ...session,
      checklist: session.checklist.map(item => 
        item.id === itemId ? { ...item, observation } : item
      )
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!session || !e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: PhotoRecord = {
          id: Date.now().toString(),
          url: reader.result as string,
          description: '',
          timestamp: new Date().toISOString()
        };
        setSession({
          ...session,
          photos: [...session.photos, newPhoto]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizeInspection = async () => {
    if (!session || !selectedStore) return;
    setIsGenerating(true);
    try {
      const result = await generateTechnicalReport(session, selectedStore.name);
      setSession({
        ...session,
        summary: result.summary,
        recommendations: result.recommendations
      });
      setView('report');
    } catch (error) {
      alert("Erro ao finalizar relatório.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredStores = MOCK_STORES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="fire-gradient text-white p-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">FireGuard Pro</h1>
              <p className="text-[10px] opacity-80 uppercase font-semibold">Corpo de Bombeiros • Vistoria Técnica</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1 opacity-90"><UserCheck className="w-4 h-4" /> Ten. Marcos</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {view === 'dashboard' && (
          <div className="space-y-6 mt-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-slate-800">Painel de Lojas</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Buscar loja ou setor..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStores.map(store => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  onClick={startInspection} 
                />
              ))}
            </div>
          </div>
        )}

        {view === 'inspect' && session && selectedStore && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-widest">Vistoria Ativa</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedStore.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{selectedStore.sector} • Piso {selectedStore.floor}</p>

              <div className="space-y-8">
                {/* Checklist Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-slate-700">Checklist de Conformidade</h3>
                  </div>
                  <div className="space-y-4">
                    {session.checklist.map(item => (
                      <div key={item.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                            <p className="text-slate-700 font-medium mt-0.5">{item.requirement}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {(['CONFORME', 'NÃO CONFORME', 'NÃO APLICÁVEL'] as ComplianceStatus[]).map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(item.id, status)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                  item.status === status 
                                  ? status === 'CONFORME' ? 'bg-emerald-600 text-white border-emerald-600' 
                                    : status === 'NÃO CONFORME' ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-slate-600 text-white border-slate-600'
                                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {status.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          placeholder="Observações adicionais..."
                          className="w-full mt-3 p-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-none min-h-[60px]"
                          value={item.observation || ''}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos Section */}
                <div className="border-t pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-slate-700">Registro Fotográfico</h3>
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-slate-700 transition-colors">
                      <Plus className="w-4 h-4" /> Anexar Foto
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  
                  {session.photos.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                      <Camera className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm font-medium">Nenhuma foto registrada ainda</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {session.photos.map(photo => (
                        <div key={photo.id} className="relative aspect-square group">
                          <img src={photo.url} className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-100" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                            <span className="text-[10px] text-white font-bold">{new Date(photo.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={finalizeInspection}
              disabled={isGenerating}
              className="w-full fire-gradient text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando Laudo Técnico...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Finalizar Vistoria e Gerar Relatório
                </>
              )}
            </button>
          </div>
        )}

        {view === 'report' && session && selectedStore && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Relatório Concluído</h2>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Voltar ao Início
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield className="w-32 h-32" />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Laudo Técnico de Inspeção</h3>
                  <p className="text-sm text-slate-500">ID: {session.id.toUpperCase()} • {new Date(session.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estabelecimento</h4>
                    <p className="font-bold text-slate-800 text-lg">{selectedStore.name}</p>
                    <p className="text-sm text-slate-600">{selectedStore.sector} • Piso {selectedStore.floor}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Vistoriador Responsável</h4>
                    <p className="font-semibold text-slate-700">{session.inspectorName}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Resumo de Conformidade
                  </h4>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-600">Total de Itens</span>
                    <span className="text-slate-800">{session.checklist.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium mt-2">
                    <span className="text-emerald-600">Conformes</span>
                    <span className="text-emerald-700 font-bold">{session.checklist.filter(i => i.status === 'CONFORME').length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium mt-2">
                    <span className="text-red-600">Irregularidades</span>
                    <span className="text-red-700 font-bold">{session.checklist.filter(i => i.status === 'NÃO CONFORME').length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-red-600 pl-3">Parecer Técnico Automático (IA)</h4>
                  <p className="text-slate-600 leading-relaxed bg-red-50/30 p-4 rounded-xl text-sm italic">
                    {session.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-yellow-500 pl-3">Recomendações e Medidas Corretivas</h4>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {session.recommendations}
                  </div>
                </div>
              </div>

              {session.photos.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 border-l-4 border-slate-800 pl-3">Anexo Fotográfico</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {session.photos.map(p => (
                      <img key={p.id} src={p.url} className="h-24 w-full object-cover rounded-lg border" />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-center pt-8 border-t border-slate-100">
                 <div className="text-center">
                    <div className="w-48 border-b border-slate-400 mb-2"></div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{session.inspectorName}</p>
                    <p className="text-[9px] text-slate-400">Assinatura Digital via Sistema FireGuard</p>
                 </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                <FileText className="w-5 h-5" /> Baixar PDF
              </button>
              <button className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                <Send className="w-5 h-5" /> Enviar para Lojista
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 md:hidden z-50">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-red-600' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Buscar</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-bold">Relatórios</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
