import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false,
})
export class CadastroPage implements OnInit {

  form = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  isLoading = false;
  erroCadastro = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {}

  get nome() { return this.form.get('nome'); }
  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }

  cadastrar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.erroCadastro = '';
    const { nome, email, senha } = this.form.value;

    this.authService.cadastrar(email!, senha!)
      .then(credential => {
        const uid = credential.user.uid;
        return this.firestoreService.criarPerfil(uid, {
          uid,
          nome: nome!,
          email: email!,
          esporteFavorito: '',
        });
      })
      .then(() => this.router.navigateByUrl('/home', { replaceUrl: true }))
      .catch((err: any) => {
        console.error('[Cadastro] Erro Firebase:', err.code, err.message);
        if (err.code === 'auth/email-already-in-use') {
          this.erroCadastro = 'Este email já está em uso.';
        } else if (err.code === 'auth/weak-password') {
          this.erroCadastro = 'Senha deve ter pelo menos 6 caracteres.';
        } else if (err.code === 'auth/operation-not-allowed') {
          this.erroCadastro = 'Login com email/senha não está habilitado no Firebase.';
        } else if (err.code === 'auth/network-request-failed') {
          this.erroCadastro = 'Sem conexão com a internet.';
        } else {
          this.erroCadastro = `Erro: ${err.code ?? err.message}`;
        }
      })
      .finally(() => { this.isLoading = false; });
  }
}
