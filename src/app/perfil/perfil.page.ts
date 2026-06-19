import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { UserProfile } from '../models/models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit, OnDestroy {

  perfil: UserProfile | undefined;
  isLoading = true;
  isEditando = false;

  form = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    esporteFavorito: new FormControl(''),
  });

  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const uid = this.authService.uidAtual;
    if (!uid) return;

    this.sub = this.firestoreService.getPerfil(uid).subscribe({
      next: perfil => {
        this.perfil = perfil;
        this.isLoading = false;
        if (perfil) {
          this.form.patchValue({ nome: perfil.nome, esporteFavorito: perfil.esporteFavorito });
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get nome() { return this.form.get('nome'); }

  get emailAtual(): string {
    return this.authService.uidAtual ? (this.perfil?.email ?? '') : '';
  }

  iniciarEdicao() { this.isEditando = true; }

  cancelarEdicao() {
    this.isEditando = false;
    if (this.perfil) {
      this.form.patchValue({ nome: this.perfil.nome, esporteFavorito: this.perfil.esporteFavorito });
    }
  }

  async salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const uid = this.authService.uidAtual;
    if (!uid) return;
    const { nome, esporteFavorito } = this.form.value;
    try {
      await this.firestoreService.atualizarPerfil(uid, { nome: nome!, esporteFavorito: esporteFavorito ?? '' });
      const toast = await this.toastCtrl.create({ message: 'Perfil atualizado!', duration: 2500, color: 'success', position: 'bottom' });
      await toast.present();
      this.isEditando = false;
    } catch {
      const toast = await this.toastCtrl.create({ message: 'Erro ao salvar. Tente novamente.', duration: 3000, color: 'danger', position: 'bottom' });
      await toast.present();
    }
  }

  async sair() {
    const alert = await this.alertCtrl.create({
      header: 'Sair da conta',
      message: 'Deseja sair da conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }
}
