import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-nova-meta',
  templateUrl: './nova-meta.page.html',
  styleUrls: ['./nova-meta.page.scss'],
  standalone: false,
})
export class NovaMetaPage implements OnInit {

  tiposMeta = ['Distância km', 'Treinos por semana', 'Tempo de treino', 'Peso alvo', 'Outro'];
  prazoMin = this.getAmanha();
  tituloLen = 0;
  isLoading = false;

  form = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    tipo: new FormControl('', [Validators.required]),
    valorAlvo: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    prazo: new FormControl('', [Validators.required]),
    descricao: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  get titulo() { return this.form.get('titulo'); }
  get tipo() { return this.form.get('tipo'); }
  get valorAlvo() { return this.form.get('valorAlvo'); }
  get prazo() { return this.form.get('prazo'); }

  getAmanha(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().substring(0, 10);
  }

  prazoFuturo(): boolean {
    const val = this.form.get('prazo')?.value;
    return !val || val > new Date().toISOString().substring(0, 10);
  }

  onTituloChange(event: any) {
    this.tituloLen = (event.target.value ?? '').length;
  }

  async criar() {
    if (this.form.invalid || !this.prazoFuturo()) {
      this.form.markAllAsTouched();
      return;
    }
    const uid = this.authService.uidAtual;
    if (!uid) return;

    this.isLoading = true;
    const { titulo, tipo, valorAlvo, prazo, descricao } = this.form.value;

    try {
      await this.firestoreService.registrarMeta(uid, {
        titulo: titulo!,
        tipo: tipo!,
        valorAlvo: Number(valorAlvo),
        prazo: prazo!,
        descricao: descricao ?? '',
      });
      const toast = await this.toastCtrl.create({ message: 'Meta criada!', duration: 2500, color: 'success', position: 'bottom' });
      await toast.present();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch {
      const toast = await this.toastCtrl.create({ message: 'Erro ao criar meta. Tente novamente.', duration: 3000, color: 'danger', position: 'bottom' });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  cancelar() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
