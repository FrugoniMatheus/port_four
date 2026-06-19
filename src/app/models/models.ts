import { Timestamp } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  esporteFavorito: string;
  criadoEm: Timestamp;
}

export interface Treino {
  id?: string;
  esporte: string;
  duracaoMin: number;
  data: string;
  esforco: number;
  notas: string;
  criadoEm: Timestamp;
}

export interface Meta {
  id?: string;
  titulo: string;
  tipo: string;
  valorAlvo: number;
  prazo: string;
  descricao: string;
  status: 'ativa' | 'concluida';
  criadaEm: Timestamp;
}
