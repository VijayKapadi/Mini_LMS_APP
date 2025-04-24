import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../screens/auth/login/login.component';
import { MiniLosComponent } from '../screens/mini-los/mini-los.component';
import { AuthGuard } from '../services/auth/auth.guard';

// import { AuthGuard } from '../services/auth/auth.guard';


export const AppRoutes = [
    {
      path: 'home',
      component: MiniLosComponent,
      // canActivate: [AuthGuard], // Only authenticated users can access
      children: [
        // { path: 'home', component: AppComponent },
        {
          path: 'MiniLos',
          component: MiniLosComponent,
        //  canActivate: [AuthGuard]
        },
      
      ],
    },
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent }
   
  ];
  