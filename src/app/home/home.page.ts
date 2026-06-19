import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { UserProfile, Meta } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {

  perfil: UserProfile | undefined;
  totalTreinos = 0;
  metaAtiva: Meta | null = null;
  isLoading = true;

  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    const uid = this.authService.uidAtual;
    if (!uid) return;

    this.subs.push(
      this.firestoreService.getPerfil(uid).subscribe({
        next: perfil => { this.perfil = perfil; this.isLoading = false; },
        error: () => { this.isLoading = false; }
      })
    );

    this.subs.push(
      this.firestoreService.getTotalTreinos(uid).subscribe(total => {
        this.totalTreinos = total;
      })
    );

    this.subs.push(
      this.firestoreService.getMetaAtiva(uid).subscribe({
        next: meta => { this.metaAtiva = meta; },
        error: err => { console.error('[Home] Erro ao buscar meta ativa:', err); }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
