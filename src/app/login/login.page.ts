import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  isLoading = false;
  erroLogin = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }

  entrar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.erroLogin = '';
    const { email, senha } = this.form.value;
    this.authService.login(email!, senha!)
      .then(() => this.router.navigateByUrl('/home', { replaceUrl: true }))
      .catch(() => { this.erroLogin = 'Email ou senha incorretos.'; })
      .finally(() => { this.isLoading = false; });
  }
}
