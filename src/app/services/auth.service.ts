import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  login(email: string, senha: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  cadastrar(email: string, senha: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, senha);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  resetarSenha(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  get usuarioAtual$(): Observable<User | null> {
    return authState(this.auth);
  }

  get uidAtual(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
