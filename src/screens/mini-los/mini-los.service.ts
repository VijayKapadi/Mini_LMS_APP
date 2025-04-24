import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MiniLosService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getLoanList(username:any): Observable<any> {
    console.log('Environment Host:', environment.host);
    return this.http
      .get<any>(environment.host + 'api/Loan/GetLoans/'  + username)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  InsertLoanDetails(data: any): Observable<any> {
    console.log('Environment Host:', environment.host);
    return this.http
      .post<any>(environment.host + 'api/Loan/ApplyForLoan', data)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  UpdateLoanDetails(data: any): Observable<any> {
    console.log('Environment Host:', environment.host);
    return this.http
      .post<any>(environment.host + 'api/Loan/UpdateBorrowerLoans', data)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  LoanDetailsAprroveRejected(data: any): Observable<any> {
    console.log('Environment Host:', environment.host);
    return this.http
      .post<any>(environment.host + 'api/Loan/AprroveRejectLoans', data)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  repaymentSchedule(data: any): Observable<any> {
    console.log('Environment Host:', environment.host);
    return this.http
      .post<any>(environment.host + 'api/Loan/RepaymentSchedule', data)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  calculateEmi(principal: number, tenureMonths: number, annualInterestRate: number): number {
    const monthlyRate = annualInterestRate / 12 / 100;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return parseFloat(emi.toFixed(2));
  }
  
  getTotalPayment(emi: number, months: number): number {
    return parseFloat((emi * months).toFixed(2));
  }

  getTotalInterest(totalPayment: number, principal: number): number {
    return parseFloat((totalPayment - principal).toFixed(2));
  }
    
}
