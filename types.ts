
export type ComplianceStatus = 'CONFORME' | 'NÃO CONFORME' | 'NÃO APLICÁVEL';

export interface ChecklistItem {
  id: string;
  category: string;
  requirement: string;
  status: ComplianceStatus;
  observation?: string;
}

export interface PhotoRecord {
  id: string;
  url: string;
  description: string;
  timestamp: string;
}

export interface Store {
  id: string;
  name: string;
  sector: string;
  floor: string;
  lastInspection?: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Irregular';
}

export interface InspectionSession {
  id: string;
  storeId: string;
  inspectorName: string;
  date: string;
  checklist: ChecklistItem[];
  photos: PhotoRecord[];
  summary?: string;
  recommendations?: string;
}
