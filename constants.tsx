
import React from 'react';
import { ShieldCheck, Flame, Bell, Map, Lightbulb, UserCheck } from 'lucide-react';
import { Store } from './types';

export const INITIAL_CHECKLIST = [
  { id: '1', category: 'Extintores', requirement: 'Extintores dentro da validade e pressurizados', status: 'CONFORME' },
  { id: '2', category: 'Extintores', requirement: 'Sinalização de piso e parede adequada', status: 'CONFORME' },
  { id: '3', category: 'Extintores', requirement: 'Acesso desobstruído', status: 'CONFORME' },
  { id: '4', category: 'Sinalização', requirement: 'Placas de saída fotoluminescentes instaladas', status: 'CONFORME' },
  { id: '5', category: 'Iluminação', requirement: 'Blocos autônomos de emergência operantes', status: 'CONFORME' },
  { id: '6', category: 'Hidrantes', requirement: 'Mangueiras e esguichos em perfeitas condições', status: 'CONFORME' },
  { id: '7', category: 'Alarmes', requirement: 'Acionadores manuais e sirenes operando', status: 'CONFORME' },
  { id: '8', category: 'Gás/Elétrica', requirement: 'Central de GLP sinalizada e isolada', status: 'CONFORME' },
  { id: '9', category: 'Saídas', requirement: 'Portas corta-fogo com fechamento automático', status: 'CONFORME' },
] as const;

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Extintores': <Flame className="w-5 h-5 text-red-600" />,
  'Sinalização': <Map className="w-5 h-5 text-blue-600" />,
  'Iluminação': <Lightbulb className="w-5 h-5 text-yellow-600" />,
  'Hidrantes': <ShieldCheck className="w-5 h-5 text-red-700" />,
  'Alarmes': <Bell className="w-5 h-5 text-orange-600" />,
  'Gás/Elétrica': <UserCheck className="w-5 h-5 text-purple-600" />,
  'Saídas': <Map className="w-5 h-5 text-emerald-600" />,
};

// Properly type MOCK_STORES as Store[] to ensure status field matches the union type expected by the Store interface
export const MOCK_STORES: Store[] = [
  { id: 's1', name: 'Zara Home', sector: 'Moda', floor: 'L1', status: 'Pendente' },
  { id: 's2', name: 'Nespresso Boutique', sector: 'Alimentação', floor: 'L2', status: 'Em Andamento' },
  { id: 's3', name: 'Centauro', sector: 'Esportes', floor: 'L1', status: 'Concluído', lastInspection: '2023-12-01' },
  { id: 's4', name: 'Praça de Alimentação', sector: 'Serviços', floor: 'L3', status: 'Irregular' },
  { id: 's5', name: 'Cinepolis VIP', sector: 'Lazer', floor: 'L3', status: 'Pendente' },
];
