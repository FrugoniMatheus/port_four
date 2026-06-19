import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-registrar-treino',
  templateUrl: './registrar-treino.page.html',
  styleUrls: ['./registrar-treino.page.scss'],
  standalone: false,
})
export class RegistrarTreinoPage implements OnInit {

  esportes = ['Futebol', 'Futsal', 'Corrida', 'Musculação', 'Natação', 'Ciclismo', 'Basquete', 'Vôlei', 'Outros'];

  form = new FormGroup({
    esporte: new FormControl('', [Validators.required]),
    duracaoMin: new FormControl<number | null>(30, [Validators.required, Validators.min(1), Validators.max(1440)]),
    data: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
    esforco: new FormControl(3),
    notas: new FormControl('', [Validators.maxLength(500)]),
  });

  isLoading = false;
  notasLen = 0;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  get esporte() { return this.form.get('esporte'); }
  get duracaoMin() { return this.form.get('duracaoMin'); }

  onNotasChange(event: any) {
    this.notasLen = (event.target.value ?? '').length;
  }

  onEsforcoChange(event: any) {
    this.form.get('esforco')?.setValue(event.detail.value);
  }

  async salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const uid = this.authService.uidAtual;
    if (!uid) return;

    this.isLoading = true;
    const { esporte, duracaoMin, data, esforco, notas } = this.form.value;

    try {
      await this.firestoreService.registrarTreino(uid, {
        esporte: esporte!,
        duracaoMin: Number(duracaoMin),
        data: data!,
        esforco: Number(esforco),
        notas: notas ?? '',
      });
      const toast = await this.toastCtrl.create({ message: 'Treino registrado!', duration: 2500, color: 'success', position: 'bottom' });
      await toast.present();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch {
      const toast = await this.toastCtrl.create({ message: 'Erro ao salvar. Tente novamente.', duration: 3000, color: 'danger', position: 'bottom' });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  cancelar() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
