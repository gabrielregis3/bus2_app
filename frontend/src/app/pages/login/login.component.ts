import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(private router: Router) {}

  login() {
    this.errorMessage = '';
    this.isLoading = true;

    setTimeout(() => {
      const validUsername = 'admin';
      const validPassword = 'admin';

      if (this.credentials.username === validUsername && 
          this.credentials.password === validPassword) {
        this.router.navigate(['/mapa']);
      } else {
        this.errorMessage = 'Usuário ou senha incorretos';
      }
      
      this.isLoading = false;
    }, 1000);
  }
}