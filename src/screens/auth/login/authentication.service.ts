import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, map, Observable, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService { 
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

    login(data: any): Observable<any> {     
      return this.http
        .post<any>(environment.host + 'api/Login/Login', data)
        .pipe(
          map((resp: any) => {
            return resp;
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
    }
}
