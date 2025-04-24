import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  fullLink: string | undefined;
  routelink: any;

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      console.log("\n guard condition - if suceess");
      return true
    } else {
      this.fullLink = window.location.href;
      this.routelink = this.fullLink.substring(this.fullLink.indexOf('/home') + 6)           
      this.router.navigate(['/login'])
      return false
    }
  }

}
