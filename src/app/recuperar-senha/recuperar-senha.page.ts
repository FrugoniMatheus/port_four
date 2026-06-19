import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
  standalone: false,
})
export class RecuperarSenhaPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  get email() { return this.form.get('email'); }

  async enviar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    const { email } = this.form.value;

    try {
      await this.authService.resetarSenha(email!);
      const toast = await this.toastCtrl.create({
        message: 'Email de recuperação enviado. Verifique sua caixa de entrada.',
        duration: 4000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
      this.form.reset();
    } catch (err: any) {
      const mensagem = err.code === 'auth/user-not-found'
        ? 'Nenhuma conta encontrada com este email.'
        : 'Erro ao enviar email. Tente novamente.';
      const toast = await this.toastCtrl.create({
        message: mensagem,
        duration: 4000,
        color: 'danger',
        position: 'bottom',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
