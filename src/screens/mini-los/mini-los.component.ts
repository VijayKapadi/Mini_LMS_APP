import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { MiniLosService } from './mini-los.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-mini-los',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    AccordionModule,
    TableModule,
    DialogModule,
  ],
  templateUrl: './mini-los.component.html',
  styleUrl: './mini-los.component.scss',
})
export class MiniLosComponent implements OnInit {
  index: any = 0;
  index1: any = 0;
  Pagination: any = 0;
  AddEditModeTabActive = true;
  isLoading: any = false;
  form!: FormGroup;
  innerWidth: any;
  innerHeight: any;
  productss: any = [];
  loanList: any = [];
  RepaymentScheduleList: any = [];
  userName: null | undefined;
  role: any;
  isShowPopup: boolean = false;
  emi!: number;
  iD: any = '';
  createdDate: any = '';
  btnUpdate = 'SAVE';
  isAppReject: boolean = false;
  status: any;
  loanAmount: any;
  loanTermMonths: any;
  loanPurpose: any;
  isRepaymentSchedule: boolean = false;

  // totalPayment!: number;
  // totalInterest!: number;

  // loanAmount = 12000;
  // tenure = 12;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private miniLosService: MiniLosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.setInnerWidthHeightParameters();
    this.userName = JSON.parse(localStorage.getItem('userName') ?? '');
    this.role = JSON.parse(localStorage.getItem('role') ?? '');
    this.getLoanList();
    this.CreateForm();

    const principal = 12000;
    const annualRate = 12;
    const months = 12;

    const flatEmi = this.calculateFlatEMI(principal, annualRate, months);
    console.log('Flat EMI:', flatEmi);

    this.emi = this.miniLosService.calculateEmi(principal, months, annualRate);
    console.log('emi New : : ' + this.emi);
  }

  calculateFlatEMI(
    principal: number,
    annualRate: number,
    months: number
  ): number {
    const interest = (principal * annualRate * (months / 12)) / 100;
    const total = principal + interest;
    const emi = total / months;
    return parseFloat(emi.toFixed(2));
  }

  CreateForm() {
    this.form = this.fb.group({
      loanAmount: ['', Validators.required],
      loanTermMonths: ['', Validators.required],
      loanPurpose: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }

  setInnerWidthHeightParameters() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * 0.7;
    this.innerHeight = this.innerHeight + 'px';
  }
  onTabOpen(e: any) {
    this.index = e;
    this.AddEditModeTabActive = e.index == 0 ? true : false;
  }

  getLoanList() {
    try {
      this.isLoading = true;

      this.miniLosService.getLoanList(this.userName).subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (!resp || resp.length === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Data not available',
            });
            return;
          } else {
            try {
              this.loanList = resp;
            } catch (error) {
              console.error('Error processing data:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please try again later',
              });
            }
          }
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in loading data',
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in loading data',
      });
    }
  }

  view(event: any) {
    console.log('On View Click' + event);
    this.isShowPopup = true;
    this.iD = event.id
    this.createdDate = event.createdAt
    this.btnUpdate = 'EDIT';
    this.form.patchValue({
      id: event.id,
      loanAmount: event.loanAmount,
      loanTermMonths: event.loanTermMonths,
      loanPurpose: event.loanPurpose,
      status: event.status,
      createdAt: event.createdAt,
      username: event.username,
    });

  }
  onAddClick(event: any) {
    console.log('On Add Click' + event);
    this.form.reset();
    this.isShowPopup = true;
    this.btnUpdate = 'SAVE';
  }
  addClick() {}
  omit_decimal_char(event: any) {
    let k;
    const inputValue = event.target.value; // Get the current value of the input field
    // eslint-disable-next-line prefer-const
    k = event.charCode; // Get the charCode of the key pressed

    // Allow digits (0-9), backspace (8), space (32), and a single decimal point (.)
    if (
      (k >= 48 && k <= 57) ||
      k == 8 ||
      k == 32 ||
      (k == 46 && inputValue.indexOf('.') === -1)
    ) {
      return true; // Allow the key
    } else {
      return false; // Prevent the key press
    }
  }

  restrictDecimalInputCustomer(event: any, controlName: string): void {
    let inputValue = event.target.value;
    // Regex to allow numbers with at most 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    // If the input value matches the regex, allow it
    if (!regex.test(inputValue)) {
      inputValue = inputValue.slice(0, -1);
    }
    // Set the new value to the input field
    this.form.get(controlName)?.setValue(inputValue);
  }
  omit_numeric_chars(event: any) {
    let k;
    // eslint-disable-next-line prefer-const
    k = event.charCode;
    return (k > 47 && k < 58) || k == 43;
  }
  onCancelClick() {
    this.form.reset();
    this.isShowPopup = false;
  }
  reset() {
    this.getLoanList();
    this.isShowPopup = false;
    this.form.reset();
    this.btnUpdate = 'SAVE';
  }
  onSaveClick(event: any, status: string) {
    try {

      if (this.form.controls['loanAmount'].value == null || this.form.controls['loanAmount'].value == '' || this.form.controls['loanTermMonths'].value == null || this.form.controls['loanTermMonths'].value == '' || this.form.controls['loanPurpose'].value == null || this.form.controls['loanPurpose'].value == ''  ){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill details',
        });
        return;
      }

      this.isLoading = true;
      const payLoadObj = {
        id: 0,
        loanAmount: this.form.controls['loanAmount'].value,
        loanTermMonths: this.form.controls['loanTermMonths'].value,
        loanPurpose: this.form.controls['loanPurpose'].value,
        status: status,
        createdAt: new Date(),
        username: this.userName,
      };

      this.miniLosService.InsertLoanDetails(payLoadObj).subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (resp.message) {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: resp.message,
            });
          }
          this.reset();
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in loading data',
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in loading data',
      });
    }
  }

  onUpdateClick(event: any, status : string){
    try {
      if (this.form.controls['loanAmount'].value == null || this.form.controls['loanAmount'].value == '' || this.form.controls['loanTermMonths'].value == null || this.form.controls['loanTermMonths'].value == '' || this.form.controls['loanPurpose'].value == null || this.form.controls['loanPurpose'].value == '' ){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill details',
        });
        return;
      }
      this.isLoading = true;
      const payLoadObj = {
        id: this.iD,
        loanAmount: this.form.controls['loanAmount'].value,
        loanTermMonths: this.form.controls['loanTermMonths'].value,
        loanPurpose: this.form.controls['loanPurpose'].value,
        status: status,
        createdAt: new Date(),
        username: this.userName,
      };

      this.miniLosService.UpdateLoanDetails(payLoadObj).subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (resp.message) {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'Loan application Updated Successfully'
            });
          }
          this.reset();
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in loading data',
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in loading data',
      });
    }
  }
  patchValue(event: any, status: string)
  {
    this.iD = event.id;
    this.loanAmount = event.loanAmount;
    this.loanTermMonths = event.loanTermMonths;
    this.loanPurpose = event.loanPurpose;
    this.status = status;
  }
  onSubmit(event: any, status: string){
    if (status === 'Approved') {      
      this.isAppReject = !this.isAppReject;      
      this.patchValue(event, status);
      return;
    }
    else if (status === 'Rejected') {      
      this.isAppReject = !this.isAppReject;
      this.patchValue(event, status);
      return;
    }
   
    
      try {
      this.isLoading = true;
      const payLoadObj = {
        id: this.iD,
        loanAmount: this.loanAmount,
        loanTermMonths: this.loanTermMonths,
        loanPurpose: this.loanPurpose,
        status: this.status,
        createdAt: new Date(),
        username: this.userName,
      };

      this.miniLosService.LoanDetailsAprroveRejected(payLoadObj).subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (resp.message) {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: resp.message
            });
          }
          this.reset();
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in loading data',
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in loading data',
      });
    }  
  }
  confirmAppReject()
  {
    this.isAppReject = false;
    this.onSubmit('','');
  }

  repaymentSchedule(data: any)
  {
    try {
      this.isLoading = true;
      this.index = 0
      this.index1 = 0
      const payLoadObj = {
        Id: data.id,
        Principal: data.loanAmount,
        Tenure: data.loanTermMonths,
        Interest: 12,
               
      };

      this.miniLosService.repaymentSchedule(payLoadObj).subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (resp.length > 0) {
            this.isRepaymentSchedule= true;
            this.RepaymentScheduleList = resp;
          }
         
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in loading data',
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in loading data',
      });
    }  
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
