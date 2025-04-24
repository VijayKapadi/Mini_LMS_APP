import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isLoggedInSignal, userRoleSignal } from './auth/auth.signals';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

 // private readonly tokenKey = 'access_token'; 

  
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = this.jwtDecode(token);
    // return decoded?.role || null;
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  jwtDecode(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Invalid JWT Token', e);
      return null;
    }
  }

  getIpAddress() {
    return localStorage.getItem('ipAddress');
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null; // Check if token is present
  }

  setDetails(data: JSON) {
    return localStorage.setItem('userData', JSON.stringify(data));
    // return localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    isLoggedInSignal.set(true);
    const role = this.getRole();
    userRoleSignal.set(role);
   }
   getToken(): string | null {
    return localStorage.getItem('authToken');
  }
 
  logout() {
    localStorage.removeItem('authToken');
    isLoggedInSignal.set(false);
    userRoleSignal.set(null);
  }
  
}
