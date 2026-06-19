import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { UserProfile, Meta } from '../models/models';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('metasSwiper') swiperRef!: ElementRef;

  perfil: UserProfile | undefined;
  totalTreinos = 0;
  metas: Meta[] = [];
  metasFiltradas: Meta[] = [];
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
      this.firestoreService.getMetasAtivas(uid).subscribe({
        next: metas => {
          this.metas = metas;
          this.aplicarFiltro();
        },
        error: err => console.error('[Home] Erro ao buscar metas:', err)
      })
    );
  }

  private aplicarFiltro() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const filtradas = [...this.metas];

    // Metas futuras primeiro (mais próximas de hoje), depois as vencidas
    filtradas.sort((a, b) => {
      const prazoA = new Date(a.prazo);
      const prazoB = new Date(b.prazo);
      const aPassada = prazoA < hoje;
      const bPassada = prazoB < hoje;
      if (aPassada && !bPassada) return 1;
      if (!aPassada && bPassada) return -1;
      return prazoA.getTime() - prazoB.getTime();
    });

    this.metasFiltradas = filtradas;

    setTimeout(() => {
      this.swiperRef?.nativeElement?.swiper?.slideTo(0, 0);
      this.swiperRef?.nativeElement?.swiper?.update();
    }, 50);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
