import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  docData,
  collection,
  collectionData,
  addDoc,
  query,
  where,
  limit,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile, Treino, Meta } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  criarPerfil(uid: string, dados: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return setDoc(ref, { ...dados, criadoEm: serverTimestamp() });
  }

  getPerfil(uid: string): Observable<UserProfile | undefined> {
    const ref = doc(this.firestore, 'users', uid);
    return docData(ref, { idField: 'uid' }) as Observable<UserProfile | undefined>;
  }

  atualizarPerfil(uid: string, dados: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return updateDoc(ref, { ...dados });
  }

  registrarTreino(uid: string, treino: Omit<Treino, 'id' | 'criadoEm'>): Promise<any> {
    const ref = collection(this.firestore, `treinos/${uid}/registros`);
    return addDoc(ref, { ...treino, criadoEm: serverTimestamp() });
  }

  getTotalTreinos(uid: string): Observable<number> {
    const ref = collection(this.firestore, `treinos/${uid}/registros`);
    return collectionData(ref).pipe(map(docs => docs.length));
  }

  registrarMeta(uid: string, meta: Omit<Meta, 'id' | 'criadaEm' | 'status'>): Promise<any> {
    const ref = collection(this.firestore, `metas/${uid}/lista`);
    return addDoc(ref, { ...meta, status: 'ativa', criadaEm: serverTimestamp() });
  }

  getMetaAtiva(uid: string): Observable<Meta | null> {
    const ref = collection(this.firestore, `metas/${uid}/lista`);
    const q = query(ref, where('status', '==', 'ativa'), limit(1));
    return collectionData(q, { idField: 'id' }).pipe(
      map(metas => metas.length > 0 ? (metas[0] as unknown as Meta) : null)
    );
  }
}
