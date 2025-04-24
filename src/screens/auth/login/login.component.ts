import { Component,OnInit,} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  ErrorMessage: string | null = null;
  isSmallScreen!: boolean;
  isPublic = false;
  submitted = false;
  innerHeight: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    console.log('Onsubmit');
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.submitted = false;
      return;
    }
    var payLoadObj = {
      Username: this.loginForm.controls['username'].value,
      Password:  this.loginForm.controls['password'].value
    }
    this.authenticationService.login(payLoadObj).subscribe({
      next: (resp) => {       
        // if (data.hasOwnProperty('results')) {
          if (!resp.userName || resp.userName.length === 0) {
          this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid username or password',
        });
        }
       else {
        console.log('Login Successfull');  
        this.authService.saveToken(resp.token);
        localStorage.setItem('userName', JSON.stringify(resp.userName));
        localStorage.setItem('role', JSON.stringify(resp.role));
        this.router.navigate(['home/MiniLos']);
        this.loginForm.reset();
        
      }
      },
      error: (error) => {
        this.ErrorMessage = error.error;
        console.log(error);      
        this.messageService.add({
          severity: 'error',
          summary: 'Login Error',
          detail: error?.error?.message || 'Invalid credentials',
        });

      },
    });
  }
}
