import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CreateAccount } from '../models';
import { FoodService } from '../services/FoodService';

@Component({
  selector: 'app-create.user',
  templateUrl: './create.user.component.html',
  styleUrls: ['./create.user.component.css']
})
export class CreateUserComponent implements OnInit {

  form!: FormGroup
  date!: Date | null
  todayDate = new Date()
  private timeout: any
  idAvailable: string = ''

  @ViewChild('login')
  login!: ElementRef;

  constructor(private fb: FormBuilder, private foodSvc: FoodService, private datePipe: DatePipe, 
    private dateAdapter: DateAdapter<Date>, private router: Router) { }

  ngOnInit(): void {
    this.form = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>(''),
      user_name: this.fb.control<string>(''),
      vegetarian: this.fb.control<boolean>(false),
      startDate: this.fb.control<Date>(new Date),
      endDate: this.fb.control<Date>(new Date)
    })
  }

  createAccount() {
    console.log(">>> Create account button pressed")
    console.log(this.form.value)
    let data: CreateAccount = this.form.value as CreateAccount
    data.startDate = this.datePipe.transform(data.startDate, "yyyy-MM-dd")
    data.endDate = this.datePipe.transform(data.endDate, "yyyy-MM-dd")
    console.log(data)

    this.foodSvc.createNewUser(data)
      .then(result => {
        console.log(result)
        this.router.navigate(['login'])
      })
      .catch(error => {
        console.log(error)
      })
  }

  addDate($event: MatDatepickerInputEvent<Date>) {
    this.date = $event.value
  }

  changeDate($event: MatDatepickerInputEvent<Date>) {
    this.date = $event.value
  }

  checkIdAvailability() {
    console.log(this.form.value.username)
    this.foodSvc.checkLoginIdAvailable(this.form.value.username)
      .then(result => {
        console.log(result)
        this.idAvailable = 'Email is available'
      })
      .catch(error => {
        console.log(error)
        this.idAvailable = 'Email is taken'
      })
  }

  returnToLogin() {
    this.router.navigate(['login'])
  }
 
  loginIdCheck($event: string) {

    let delayTime = 2000
    
    this.timeout = setTimeout(() => {
      this.foodSvc.checkLoginIdAvailable($event)
      .then(result => {
        console.log(result)
      })
      .catch(error => {
        console.log(error)
      })
    }, delayTime)
  }
}
